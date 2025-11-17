import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  coupons: [],
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.message || "Couldn't get cart item");
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart", { data: { productId: null } });
      set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    } catch (error) {
      toast.error(error.message);
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    await axios.delete("/cart", { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },

  createCoupon: async (couponData) => {
    try {
      const res = await axios.post("/coupons/create-coupon", couponData);

      set((prevState) => ({
        coupons: [...prevState.coupons, res.data],
      }));
      toast.success("Coupon created successfully");
    } catch (error) {
      toast.error(error.message);
    }
  },

  getAllCoupons: async () => {
    try {
      const response = await axios.get("/coupons/get-all-coupons");
      set({ coupons: response.data.coupons });
    } catch (error) {
      set({ error: "Failed to fetch coupons" });
      toast.error(error.message);
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  toggleActiveCoupon: async (couponId) => {
    try {
      const response = await axios.patch(`/coupons/active-coupon/${couponId}`);
      set((preveCoupons) => ({
        coupons: preveCoupons.coupons.map((coupon) =>
          coupon._id === couponId
            ? { ...coupon, isActive: response.data.isActive }
            : coupon
        ),
      }));
      if (response.data.isActive) {
        toast.success("Coupon activated successfully");
      } else {
        toast.success("Coupon deactivated successfully");
      }
    } catch (error) {
      set({ error: "Failed to activate coupon" });
      toast.error(error.message || "Failed to feature product");
    }
  },

  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/coupons/validate", { code });
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.message);
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  deleteCoupon: async (couponId) => {
    try {
      await axios.delete(`/coupons/delete-coupon/${couponId}`);
      set((prevCoupons) => ({
        coupons: prevCoupons.coupons.filter(
          (coupon) => coupon._id !== couponId
        ),
      }));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      set({ error: "Failed to delete coupon" });
      toast.error(error.message || "Failed to delete coupon");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ total, subtotal });
  },
}));
