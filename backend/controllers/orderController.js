const Order = require("../models/Order");
const User = require("../models/User");
const Injection = require("../models/Injection");

const generateCommissionArray = (totalCommission, totalOrders) => {
  if (totalOrders <= 0 || totalCommission <= 0) return [];

  const weights = Array.from(
    { length: totalOrders },
    () => Math.random() + 0.1,
  );

  const weightSum = weights.reduce((a, b) => a + b, 0);

  let commissions = weights.map((weight) =>
    Number(((weight / weightSum) * totalCommission).toFixed(4)),
  );

  const currentTotal = commissions.reduce((a, b) => a + b, 0);

  const difference = Number((totalCommission - currentTotal).toFixed(4));

  commissions[commissions.length - 1] += difference;

  return commissions;
};

// create orders
const createOrder = async (req, res) => {
  try {
    const { userId, title, image, quantity, totalAmount, productId, action } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.currentCycleOrders <= 0) {
      return res.status(403).json({
        success: false,
        message: "No active orders",
      });
    }

    // ============================
    // 1. LOCK IF PENDING INJECTION
    // ============================

    const pendingInjectionOrder = await Order.findOne({
      userId,
      requiresInjection: true,
      status: "undone",
    });

    if (pendingInjectionOrder) {
      return res.status(403).json({
        success: false,
        message: `Your account balance is not enough, there is a gap of $${pendingInjectionOrder.differenceAmount}`,
        order: pendingInjectionOrder,
      });
    }

    // ============================
    // 2. CHECK NEXT INJECTION
    // ============================

    const nextOrder = user.completedCycleOrders + 1;

    const injection = await Injection.findOne({
      user: userId,
      status: "pending",
      injectionOrder: nextOrder,
    });

    const isInjectionOrder = !!injection;

    let status;
    let commission = 0;
    let differenceAmount = 0;
    let fixedCommission = 0;
    let commissionRate = null;
    let injectionId = null;

    if (isInjectionOrder) {
      status = "undone";

      differenceAmount = injection.injectionCost;
      fixedCommission = injection.fixedCommission;
      commissionRate = injection.commissionRate;
      injectionId = injection._id;

      user.undone++;
    } else {
      status = action === "confirm" ? "completed" : "undone";

      if (status === "completed") {
        commission = Number(user.commissionArray.shift() || 0);

        user.completedOrders++;

        user.commission += commission;
      } else {
        user.undone++;
      }
    }

    // ============================
    // 3. CREATE ORDER
    // ============================

    const order = await Order.create({
      userId,
      title,
      image,
      quantity,
      productId,
      totalAmount,
      commission,
      status,
      requiresInjection: isInjectionOrder,
      differenceAmount,
      fixedCommission,
      commissionRate,
      injectionId,
    });

    // ============================
    // 4. UPDATE USER CYCLE
    // ============================

    user.currentCycleOrders--;
    user.completedCycleOrders++;

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// check start order start order button
const checkStartOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user?.depositAmount <= 0) {
      return res.json({
        success: true,
        canStart: false,
        reason: "LOW_BALANCE",
        message: "Your account balance is insufficient.",
      });
    }

    // No orders left
    if (user.currentCycleOrders <= 0) {
      return res.json({
        success: true,
        canStart: false,
        reason: "NO_ORDERS",
        message: "You currently have no orders to continue.",
      });
    }

    // Pending injection
    const pendingInjectionOrder = await Order.findOne({
      userId: user._id,
      status: "undone",
      requiresInjection: true,
    }).sort({ createdAt: -1 });

    if (pendingInjectionOrder) {
      return res.json({
        success: true,
        canStart: false,
        reason: "INJECTION_REQUIRED",
        message: `Your account balance is not enough. There is a gap of $${pendingInjectionOrder.differenceAmount}`,
        lastOrder: pendingInjectionOrder,
      });
    }

    return res.json({
      success: true,
      canStart: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get user orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// updateOrderStatus / confirm order by user after payment injection cost
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if this user still has a pending injection
    const pendingInjection = await Injection.findOne({
      status: "pending",
      _id: order.injectionId,
    });

    // Don't allow confirmation if this order still requires an injection
    if (pendingInjection) {
      return res.status(400).json({
        success: false,
        message: `You have a pending difference amount of $${order.differenceAmount}.`,
      });
    }
    // Injection has been completed, unlock this order
    if (order.requiresInjection) {
      order.requiresInjection = false;
    }

    if (order.status === status) {
      return res.json({
        success: true,
        message: "Order already updated.",
      });
    }

    order.status = status;

    if (status === "completed") {
      order.completedAt = new Date();

      const user = await User.findById(order.userId);

      if (user) {
        const commissionToAdd = order.fixedCommission || 0;
        user.commission += commissionToAdd;
        user.completedOrders += 1;
        user.undone = Math.max(0, user.undone - 1);
        await user.save();
      }
    }

    await order.save();

    return res.json({
      success: true,
      message: "Order confirmed successfully.",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete order
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// add orders by admin
const addOrderByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentOrders } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.commissionArray = [];
    const ordersToAdd = Number(currentOrders);

    if (isNaN(ordersToAdd) || ordersToAdd <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order count",
      });
    }
    // Find all pending injections
    const pendingInjections = await Injection.find({
      user: user._id,
      status: "pending",
    }).sort({ injectionOrder: 1 });

    const pendingInjectionCount = pendingInjections.length;
    const normalOrders = ordersToAdd - pendingInjectionCount;

    if (normalOrders < 0) {
      return res.status(400).json({
        success: false,
        message: "Pending injections cannot exceed total orders.",
      });
    }

    user.currentCycleOrders = ordersToAdd;
    user.completedCycleOrders = 0;
    user.totalOrders += ordersToAdd;
    console.log({
      depositAmount: user.depositAmount,
      cycleDepositAmount: user.cycleDepositAmount,
      ordersToAdd,
      normalOrders,
    });

    // Commission for THIS cycle only
    user.commissionTarget = Number((user.cycleDepositAmount * 0.12).toFixed(2));

    // Generate a fresh commission schedule
    user.commissionArray = generateCommissionArray(
      user.commissionTarget,
      normalOrders,
    );
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Orders assigned successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// clear order by admin
const clearOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.totalOrders = 0;
    user.completedOrders = 0;
    user.currentCycleOrders = 0;
    user.completedCycleOrders = 0;
    user.commissionArray = [];
    user.undone = 0;

    await user.save();
    await Injection.deleteMany({ user: id });

    return res.status(200).json({
      success: true,
      message: "Orders and injections cleared successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// get last order by user
const getLastOrderByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const lastOrder = await Order.findOne({ userId: userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      lastOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  deleteOrder,
  addOrderByAdmin,
  clearOrders,
  getLastOrderByUser,
  checkStartOrder,
};
