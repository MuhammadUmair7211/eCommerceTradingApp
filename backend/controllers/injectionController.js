const Injection = require("../models/Injection");
const User = require("../models/User");
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

// create injection
const createInjection = async (req, res) => {
  try {
    const {
      userId,
      injectionCost,
      injectionOrder,
      commissionRate,
      fixedCommission,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const adminId = req.user.id;
    const injection = await Injection.create({
      user: userId,
      injectionOrder,
      createdBy: adminId,
      injectionCost,
      commissionRate,
      fixedCommission,
      status: "pending",
    });

    // Count all pending injections
    const pendingInjectionCount = await Injection.countDocuments({
      user: user._id,
      status: "pending",
    });

    // Remaining normal orders
    const normalOrders = Math.max(
      0,
      user.currentCycleOrders - pendingInjectionCount,
    );

    // Regenerate commission array
    user.commissionTarget = Number((user.cycleDepositAmount * 0.12).toFixed(2));
    user.commissionArray = generateCommissionArray(
      user.commissionTarget,
      normalOrders,
    );

    await user.save();

    res.status(201).json({
      success: true,
      message: "injection created successfully",
      injection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user injection
const getUserInjectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const injections = await Injection.find({
      user: id,
    })
      .sort({ injectionOrder: 1 })
      .populate("user")
      .populate("createdBy");

    return res.status(200).json({
      success: true,
      injections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update injection status by admin

const updateInjectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const injection = await Injection.findById(id);

    if (!injection) {
      return res.status(404).json({
        success: false,
        message: "Injection not found",
      });
    }

    injection.status = "completed";
    injection.completedAt = new Date();
    await injection.save();

    return res.json({
      success: true,
      message: "Injection completed",
      injection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// reject injection by admin
const rejectInjectionByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const injection = await Injection.findById(id);

    if (!injection) {
      return res.status(404).json({
        success: false,
        message: "Injection not found",
      });
    }

    injection.status = "rejected";
    injection.rejectedAt = new Date(); // ✅ correct field
    await injection.save();

    return res.json({
      success: true,
      message: "Injection rejected",
      injection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete injection by admin
const deleteInjection = async (req, res) => {
  try {
    const { id } = req.params;

    const injection = await Injection.findByIdAndDelete(id);

    if (!injection) {
      return res.status(404).json({
        success: false,
        message: "Injection not found",
      });
    }

    res.json({
      success: true,
      message: "Injection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createInjection,
  getUserInjectionById,
  updateInjectionStatus,
  deleteInjection,
  rejectInjectionByAdmin,
};
