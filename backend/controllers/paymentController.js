const Payment = require("../models/Payment");
const User = require("../models/User");
const Injection = require("../models/Injection");
const mongoose = require("mongoose");
const Order = require("../models/Order");

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

// for user recharge
const createPayment = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;

    if (!amount || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Amount and wallet address are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Screenshot is required",
      });
    }
    const user = await User.findById(req.user.id);

    const adminId = user.adminId;
    const pendingInjection = await Injection.findOne({
      user: user._id,
      status: "pending",
    }).sort({ injectionOrder: 1 });

    const payment = await Payment.create({
      user: req.user.id,
      transactionId: `TXN-${Date.now()}`,
      amount,
      adminId: adminId,
      walletAddress,
      injectionId: pendingInjection?._id || null,
      screenshot: req.file.path.replace(/\\/g, "/"),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  for user history
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all admin payments
const getAllAdminPayments = async (req, res) => {
  try {
    const adminId = req.user.id;

    const users = await User.find({ adminId }).select("_id");

    const userIds = users.map((u) => u._id);

    const payments = await Payment.find({
      user: { $in: userIds },
    })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// for  leader dashboard
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "-password")
      .populate("adminId", "-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update payment status by leader
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Prevent double approval
    if (payment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Payment already approved",
      });
    }

    // Update payment status first
    payment.status = status;
    await payment.save();

    let updatedUser = null;
    let injection = null;

    if (status === "approved") {
      const creditedAmount = Number(payment.amount);

      const updatedUser = await User.findById(payment.user);

      updatedUser.depositAmount += creditedAmount;
      updatedUser.cycleDepositAmount = creditedAmount;

      // Pay remaining commission from previous cycle
      if (updatedUser.commissionArray.length > 0) {
        const remainingCommissionTotal = updatedUser.commissionArray.reduce(
          (sum, item) => sum + item,
          0,
        );

        updatedUser.commission += remainingCommissionTotal;
        updatedUser.commissionArray = [];
      }

      // Generate commission for the new cycle
      const totalCommission = Number(
        (updatedUser.cycleDepositAmount * 0.12).toFixed(4),
      );

      updatedUser.commissionTarget = totalCommission;
      updatedUser.commissionArray = generateCommissionArray(
        totalCommission,
        updatedUser.currentCycleOrders,
      );

      await updatedUser.save();

      // Referral Commission (1%)
      if (updatedUser.referredBy) {
        // Find the referrer using invitation code
        const referrer = await User.findOne({
          myInvitationCode: updatedUser.referredBy,
        });

        if (referrer) {
          const referralCommission = creditedAmount * 0.01;

          await User.findByIdAndUpdate(referrer._id, {
            $inc: {
              commission: referralCommission,
            },
          });

          console.log(
            `${referrer.username} received ${referralCommission} referral commission`,
          );
        }
      }

      if (payment.injectionId) {
        injection = await Injection.findOne({
          _id: payment.injectionId,
          status: "pending",
        });
      }

      // 3. Apply injection logic
      if (injection) {
        // FIXED: amount -> creditedAmount
        const paymentAmount = creditedAmount;

        // Get latest order
        const lastOrder = await Order.findOne({
          userId: payment.user,
        }).sort({ createdAt: -1 });

        if (lastOrder) {
          // FIXED: don't overwrite payment variable
          const paidAmount = paymentAmount;
          const remainingDifference =
            Number(lastOrder.differenceAmount || 0) - paidAmount;

          if (remainingDifference <= 0) {
            const excess = Math.abs(remainingDifference);

            const updatedInjection = await Injection.findByIdAndUpdate(
              injection._id,
              {
                status: "completed",
                completedAt: new Date(),
              },
              {
                returnDocument: "after",
              },
            );

            // Refund extra amount
            if (excess > 0) {
              await User.findByIdAndUpdate(payment.user, {
                $inc: {
                  balance: excess,
                },
              });
            }
          } else {
            // Partial payment
            lastOrder.differenceAmount = remainingDifference;
            console.log("⚠️ Order partially updated");
          }

          await lastOrder.save();
        }
      }
    }

    return res.json({
      success: true,
      message: "Status updated successfully",
      payment,
      user: updatedUser,
      injection,
    });
  } catch (error) {
    console.log("🔥 ERROR CAUGHT:");
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getAllAdminPayments,
  getAllPayments,
  updatePaymentStatus,
};
