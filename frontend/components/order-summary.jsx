"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function OrderSummary({ onCheckout, isSubmitting = false }) {
  const [items, setItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  // Load selected items from sessionStorage
  useEffect(() => {
    const selectedItems = JSON.parse(
      sessionStorage.getItem("selectedCheckoutItems") || "[]",
    );
    setItems(selectedItems);
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.itemTotal || item.price * item.quantity),
    0,
  );
  const shipping = 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(subtotal * 0.1);
      setAppliedCoupon(couponCode.toUpperCase());
    } else if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(subtotal * 0.2);
      setAppliedCoupon(couponCode.toUpperCase());
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-xl">{"Order Summary"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items with images */}
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item._id} className="flex gap-3">
                <div className="border-border bg-muted relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                  <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-600">
                    Item
                  </div>
                  <Image src={item.thumbnail} fill alt={item.title} />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-card-foreground text-sm leading-tight font-medium">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {"Qty: "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-card-foreground text-sm font-medium">
                    {"$"}
                    {Number(
                      item.itemTotal || item.price * item.quantity,
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
              No items selected
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="couponCode" className="text-sm font-medium">
            {"Coupon Code"}
          </Label>
          {appliedCoupon ? (
            <div className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-sm font-medium">{appliedCoupon}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="hover:text-destructive h-auto p-0 text-xs hover:bg-transparent"
              >
                {"Remove"}
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                id="couponCode"
                placeholder="Enter code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
              >
                {"Apply"}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Pricing breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{"Subtotal"}</span>
            <span className="text-card-foreground font-medium">
              {"$"}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{"Shipping"}</span>
            <span className="text-card-foreground font-medium">
              {"$"}
              {shipping.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{"Tax"}</span>
            <span className="text-card-foreground font-medium">
              {"$"}
              {tax.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="text-accent flex justify-between">
              <span>{"Discount"}</span>
              <span className="font-medium">
                {"-$"}
                {discount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-base font-semibold">
          <span>{"Total"}</span>
          <span>
            {"$"}
            {total.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
          size="lg"
          onClick={onCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Complete Purchase"}
        </Button>
      </CardFooter>
    </Card>
  );
}
