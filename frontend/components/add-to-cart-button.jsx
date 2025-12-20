"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { ShoppingCart, ShoppingCartIcon } from "lucide-react";

export default function AddToCartButton({ productId, stock }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= stock) {
      setQuantity(value);
      setError(null);
    }
  };

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
      setError(null);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setError(null);
    }
  };

  const handleAddToCart = async () => {
    const isLoggedIn = document.cookie.split("; ").some((row) => row.startsWith("tokenUser="));
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (quantity < 1 || quantity > stock) {
      setError(`Please select a valid quantity (1-${stock})`);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/cart/add/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product to cart");
      }

      setSuccess(true);
      setQuantity(1);

      // Show success message
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      // Optional: Redirect to cart after a delay
      // setTimeout(() => {
      //   router.push("/cart");
      // }, 2000);
    } catch (err) {
      setError(err.message);
      console.error("Add to cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Quantity Selector */}
      <div className="mt-8">
        <label
          htmlFor="quantity"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || loading}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            −
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            max={stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 rounded-md border border-gray-300 px-3 py-2 text-center"
            disabled={loading}
          />
          <button
            type="button"
            onClick={incrementQuantity}
            disabled={quantity >= stock || loading}
            className="rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            +
          </button>
          <span className="ml-2 text-sm text-gray-500">{stock} available</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">
            ✓ Product added to cart successfully!
          </p>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={stock === 0 || loading}
          className="flex flex-1 items-center justify-center rounded-md bg-[#ff5000] px-8 py-3 text-base font-medium text-white transition hover:cursor-pointer hover:bg-[#e64700] focus:ring-2 focus:ring-[#ff5000] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding...
            </span>
          ) : stock > 0 ? (
            <div className="flex gap-3">
              <ShoppingCart />
              Add to Cart
            </div>
          ) : (
            "Out of Stock"
          )}
        </button>
        <button
          type="button"
          className="flex items-center justify-center rounded-md border-2 border-gray-300 px-6 py-3 text-base font-medium text-gray-700 transition hover:border-[#ff5000] hover:text-[#ff5000] focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
        >
          ♥
        </button>
      </div>
    </>
  );
}
