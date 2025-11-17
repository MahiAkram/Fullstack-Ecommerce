import Coupon from "../models/coupon.model.js";

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json({ coupons });
  } catch (error) {
    console.log("Error in getAllCoupons controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;

    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expirationDate,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.log("Error in createCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(req.params.id);
  } catch (error) {}
};

export const activateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.isActive = !coupon.isActive;
      const updateCoupon = await coupon.save();
      res.json(updateCoupon);
    } else {
      res.status(400).json({ message: "Coupon not found" });
    }
  } catch (error) {
    console.log("Error in activateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      isActive: true,
    });

    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
