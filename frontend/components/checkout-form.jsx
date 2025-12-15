"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OrderSummary from "@/components/order-summary";
import { API_URL } from "@/lib/constants";

export default function CheckoutForm() {
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    // Shipping address
    shippingFullName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "",

    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/user/info`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const user = data.data?.user || {};
          setFormData((prev) => ({
            ...prev,
            shippingFullName: user.fullName || "",
            shippingEmail: user.email || "",
            shippingPhone: user.phone || "",
            shippingAddress: user.address || "",
            shippingCity: user.city || "",
            shippingState: user.state || "",
            shippingZip: user.zip || "",
            shippingCountry: user.country || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedItems = JSON.parse(
      sessionStorage.getItem("selectedCheckoutItems") || "[]",
    );
    console.log(
      "Checkout submitted:",
      formData,
      "Payment method:",
      paymentMethod,
      "Selected items:",
      selectedItems,
    );
    // Handle checkout logic
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 xl:pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          {"Checkout"}
        </h1>
        <p className="text-muted-foreground mt-2 text-pretty">
          {"Complete your order by providing your shipping and payment details"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column - Forms */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{"Shipping Address"}</CardTitle>
              <CardDescription>
                {"Where should we deliver your order?"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shippingFullName">{"Full Name"}</Label>
                <Input
                  id="shippingFullName"
                  name="shippingFullName"
                  placeholder="John"
                  value={formData.shippingFullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingEmail">{"Email"}</Label>
                <Input
                  id="shippingEmail"
                  name="shippingEmail"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={formData.shippingEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingPhone">{"Phone Number"}</Label>
                <Input
                  id="shippingPhone"
                  name="shippingPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.shippingPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">{"Street Address"}</Label>
                <Input
                  id="shippingAddress"
                  name="shippingAddress"
                  placeholder="123 Main Street"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">{"City"}</Label>
                  <Input
                    id="shippingCity"
                    name="shippingCity"
                    placeholder="New York"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingState">{"State"}</Label>
                  <Input
                    id="shippingState"
                    name="shippingState"
                    placeholder="NY"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingZip">{"ZIP Code"}</Label>
                  <Input
                    id="shippingZip"
                    name="shippingZip"
                    placeholder="10001"
                    value={formData.shippingZip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingCountry">{"Country"}</Label>
                <Input
                  id="shippingCountry"
                  name="shippingCountry"
                  placeholder="United States"
                  value={formData.shippingCountry}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{"Payment Method"}</CardTitle>
              <CardDescription>
                {"Choose your preferred payment method"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <div className="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label
                    htmlFor="cod"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {"Cash on Delivery (COD)"}
                  </Label>
                </div>
                <div className="border-border hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors">
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {"Credit / Debit Card"}
                  </Label>
                </div>
              </RadioGroup>

              {/* Card details - only shown when card payment is selected */}
              {paymentMethod === "card" && (
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">{"Card Number"}</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      required={paymentMethod === "card"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">{"Cardholder Name"}</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required={paymentMethod === "card"}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">{"Expiry Date"}</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">{"CVV"}</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        type="password"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        required={paymentMethod === "card"}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COD message - shown when COD is selected */}
              {paymentMethod === "cod" && (
                <div className="bg-muted text-muted-foreground rounded-lg p-4 text-sm">
                  {
                    "Pay with cash when your order is delivered to your doorstep. Please keep exact change ready."
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {/* Right column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary onCheckout={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
