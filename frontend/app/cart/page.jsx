"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { API_URL } from "@/lib/constants";
import Logo from "@/components/logo";

export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/cart`, { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load cart");
      setItems(data?.data?.items || []);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const toggleSelect = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const selectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i._id));
    }
  };

  const handleRemove = async (productId) => {
    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/cart/delete/${productId}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to remove item");
        await fetchCart();
      } catch (e) {
        setError(e.message);
      }
    });
  };

  const handleClear = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/cart/clear`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to clear cart");
        await fetchCart();
      } catch (e) {
        setError(e.message);
      }
    });
  };

  const handleQuantityChange = async (productId, quantity) => {
    startTransition(async () => {
      try {
        const res = await fetch(`${API_URL}/cart/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId, quantity }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Failed to update quantity");
        await fetchCart();
      } catch (e) {
        setError(e.message);
      }
    });
  };

  const selectedItems = useMemo(
    () => items.filter((item) => selectedIds.includes(item._id)),
    [items, selectedIds],
  );

  const selectedSummary = useMemo(() => {
    const totals = selectedItems.reduce(
      (acc, item) => {
        const quantity = Number(item?.quantity ?? 0);
        const unitPrice = Number(item?.priceNew ?? item?.price ?? 0);
        const lineTotal = Number(item?.itemTotal ?? unitPrice * quantity);

        acc.totalItems += quantity;
        acc.subtotal += lineTotal;
        return acc;
      },
      { totalItems: 0, subtotal: 0 },
    );

    return {
      ...totals,
      total: totals.subtotal,
    };
  }, [selectedItems]);

  const orderTotalText = useMemo(() => {
    const total = selectedSummary?.total ?? 0;
    return `$${Number(total).toFixed(2)}`;
  }, [selectedSummary]);

  return (
    <>
      <div className="sticky top-0 z-50 bg-white py-3 md:py-4 lg:py-5">
        <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8 xl:max-w-[1600px]">
          <Logo />
        </div>
      </div>
      <div className="mx-auto max-w-4xl space-y-6 p-6 lg:max-w-7xl">
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-gray-600">
            Your cart is empty.
          </div>
        ) : (
          <div className="flex gap-52">
            {/* Left Column - Cart Items */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === items.length && items.length > 0
                    }
                    onChange={selectAll}
                  />
                  Select all
                </label>
                <span className="text-sm text-gray-500">
                  Selected: {selectedIds.length}
                </span>
              </div>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between border-b pb-6"
                >
                  <div className="flex space-x-4">
                    <div className="flex items-start pt-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                        className="mt-1"
                      />
                    </div>
                    <img
                      src={item.thumbnail || "https://placehold.co/600x400"}
                      alt={item.title}
                      className="h-28 w-24 rounded-lg object-cover"
                    />

                    <div className="space-y-1">
                      <h2 className="font-medium">{item.title}</h2>
                      <p className="text-sm text-gray-500">
                        ${Number(item.priceNew ?? item.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <button
                        className="text-sm text-[#ff5000] hover:underline"
                        onClick={() => handleRemove(item._id)}
                        disabled={isPending}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, Number(e.target.value))
                      }
                      className="w-20 rounded border px-2 py-1 text-sm"
                    />
                    <p className="font-medium">
                      $
                      {Number(
                        item.itemTotal ??
                          (item.priceNew ?? item.price) * item.quantity,
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Summary */}
            <div className="w-80">
              <div className="sticky top-6 space-y-4">
                <div className="space-y-4 rounded-xl bg-gray-50 p-6">
                  {/* Selected Items Images */}
                  {selectedItems.length > 0 ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                          <div key={item._id} className="relative">
                            <img
                              src={
                                item.thumbnail || "https://placehold.co/600x400"
                              }
                              alt={item.title}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <button
                              onClick={() => toggleSelect(item._id)}
                              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                              aria-label="Unselect item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Select items to proceed checkout
                      </h3>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 text-lg font-semibold">
                    <span>Order total</span>
                    <span>{orderTotalText}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const selectedItemsData = selectedItems.map((item) => ({
                      _id: item._id,
                      title: item.title,
                      price: item.priceNew ?? item.price,
                      quantity: item.quantity,
                      itemTotal:
                        item.itemTotal ??
                        (item.priceNew ?? item.price) * item.quantity,
                      thumbnail: item.thumbnail,
                    }));
                    sessionStorage.setItem(
                      "selectedCheckoutItems",
                      JSON.stringify(selectedItemsData),
                    );
                    router.push("/checkout");
                  }}
                  disabled={selectedIds.length === 0 || isPending}
                  className="w-full rounded-lg bg-[#ff5000] px-6 py-3 font-medium text-white hover:cursor-pointer disabled:opacity-60"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="text-center text-sm text-gray-600">
          {items.length === 0 ? "" : "or "}
          <Link className="text-[#ff5000] hover:underline" href="/">
            Continue Shopping →
          </Link>
        </p>
      </div>
    </>
  );
}
