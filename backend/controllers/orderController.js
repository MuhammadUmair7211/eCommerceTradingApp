const Order = require("../models/Order");
const User = require("../models/User");
const Injection = require("../models/Injection");

// create orders
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      title,
      image,
      quantity,
      totalAmount,
      commission,
      productId,
      action,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.currentCycleOrders === 0) {
      return res.status(403).json({
        success: false,
        message: "No active orders",
      });
    }
    // latest pending injection only
    const injection = await Injection.findOne({
      user: userId,
      status: "pending",
    }).sort({ createdAt: -1 });

    // INJECTION CHECK
    const nextOrder = user.completedCycleOrders + 1;

    let orderDifferenceAmount = 0;
    let requiresInjection = false;
    let isInjectionOrder = false;

    if (injection && Number(nextOrder) === Number(injection.injectionOrder)) {
      orderDifferenceAmount = injection.injectionCost;
      requiresInjection = true;
      isInjectionOrder = true;
    }
    let status = "undone";

    if (isInjectionOrder) {
      status = "undone";
    } else {
      // Normal orders
      status = action === "confirm" ? "completed" : "undone";
    }

    // CREATE ORDER
    const order = await Order.create({
      userId,
      title,
      image,
      quantity,
      productId,
      totalAmount,
      commission,
      status,
      differenceAmount: orderDifferenceAmount,
      requiresInjection,
      fixedCommission: isInjectionOrder ? injection.fixedCommission : 0,
      commissionRate: isInjectionOrder ? injection.commissionRate : 0,
    });

    // update user stats
    if (status === "completed") {
      user.completedOrders += 1;
      const safeCommission = Number(commission || 0);
      user.commission = Number(user.commission || 0) + safeCommission;
      user.balance = Number(user.balance || 0) + safeCommission;
    } else {
      user.undone += 1;
    }

    user.currentCycleOrders--;
    user.completedCycleOrders++;

    await user.save();

    return res.status(201).json({
      success: true,
      order,
      user,
    });
  } catch (error) {
    console.log("🔥 ERROR IN CREATE ORDER:", error);
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

    if (user?.balance <= 0) {
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
    const injection = await Injection.findOne({
      user: user._id,
      status: "pending",
    }).sort({ createdAt: -1 });

    if (injection) {
      const lastOrder = await Order.findOne({
        userId: user._id,
      }).sort({ createdAt: -1 });

      if (injection && user.completedCycleOrders === injection.injectionOrder) {
        return res.json({
          user,
          success: true,
          canStart: false,
          reason: "INJECTION_REQUIRED",
          message: `Your account balance is not enough. There is a gap of $${injection.injectionCost}`,
          injection,
          lastOrder,
        });
      }
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
      user: order.userId,
      status: "pending",
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

        user.balance += commissionToAdd;
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

    const ordersToAdd = Number(currentOrders);

    if (isNaN(ordersToAdd) || ordersToAdd <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order count",
      });
    }

    user.currentCycleOrders = ordersToAdd;
    user.completedCycleOrders = 0;
    user.totalOrders = Number(user.totalOrders || 0) + ordersToAdd;
    // Lock the deposit amount for this cycle
    user.cycleDepositAmount = user.depositAmount;
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
