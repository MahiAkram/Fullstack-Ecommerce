import { motion } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "../stores/useCartStore";

function CreateCoupon() {
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: 0,
    expirationDate: null,
  });

  const { createCoupon } = useCartStore();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createCoupon(newCoupon);
      setNewCoupon({
        code: "",
        discountPercentage: 0,
        expirationDate: null,
      });
      console.log(newCoupon);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Coupon
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-300"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={newCoupon.code}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, code: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="discountPercentage"
            className="block text-sm font-medium text-gray-300"
          >
            Discount
          </label>
          <input
            type="number"
            min={0}
            max={100}
            id="discountPercentage"
            name="discountPercentage"
            value={newCoupon.discountPercentage}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, discountPercentage: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
            required
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="expirationDate"
            className="block text-sm font-medium text-gray-300"
          >
            Expiration date
          </label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={newCoupon.expirationDate}
            onChange={(e) =>
              setNewCoupon({ ...newCoupon, expirationDate: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          Create Coupon
        </button>
      </form>
    </motion.div>
  );
}

export default CreateCoupon;
