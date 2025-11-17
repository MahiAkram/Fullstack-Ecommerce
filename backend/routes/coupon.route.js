import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  activateCoupon,
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.get("/get-all-coupons", protectRoute, adminRoute, getAllCoupons);
router.patch("/active-coupon/:id", protectRoute, adminRoute, activateCoupon);
router.delete("/delete-coupon/:id", protectRoute, adminRoute, deleteCoupon);
router.post("/create-coupon", protectRoute, adminRoute, createCoupon);
router.post("/validate", protectRoute, validateCoupon);

export default router;
