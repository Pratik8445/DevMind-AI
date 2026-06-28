import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  basic: {
    amount:  500,   // INR in paise = ₹5  (use 50000 for ₹500 in production)
    credits: 100,
    name:    "Basic Plan — 100 Credits",
  },
  pro: {
    amount:  1900,  // ₹19 in paise
    credits: 400,
    name:    "Pro Plan — 400 Credits",
  },
  enterprise: {
    amount:  4900,  // ₹49 in paise
    credits: 1000,
    name:    "Enterprise Plan — 1000 Credits",
  },
};

// POST /api/payment/create-order
// Creates a Razorpay order and returns order_id to the frontend
router.post("/create-order", protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const selected = PLANS[plan];

    if (!selected) {
      return res.status(400).json({ error: "Invalid plan selected." });
    }

    const order = await razorpay.orders.create({
      amount:   selected.amount,
      currency: "INR",
      receipt:  `receipt_${plan}_${Date.now()}`,
      notes: {
        plan,
        credits: String(selected.credits),
        productName: selected.name,
      },
    });

    res.json({
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      plan,
      credits:   selected.credits,
      keyId:     process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Razorpay order error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payment/verify
// Called after payment — verifies signature and credits user in DB
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, credits } = req.body;

    const body     = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature." });
    }

    // Add credits and update plan in DB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { credits: Number(credits) },
        $set: { plan },
      },
      { new: true }
    );

    console.log(`✅ Payment verified: ${req.user.email} bought ${plan} plan (+${credits} credits)`);

    res.json({ success: true, credits: updatedUser.credits, plan });

  } catch (err) {
    console.error("Verify error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
