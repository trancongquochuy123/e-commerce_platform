"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import OrderSummary from "@/components/order-summary";
import { API_URL } from "@/lib/constants";
import { loadStripe } from "@stripe/stripe-js";

export default function CheckoutForm() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);
  const [error, setError] = useState(null);
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
  });

  // Fetch user info on component mount and initialize Stripe
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
            shippingPhone: user.phone || "0987654321",
            shippingAddress: user.address || "Hoa Khanh",
            shippingCity: user.city || "Da Nang",
            shippingState: user.state || "Lien Chieu",
            shippingZip: user.zip || "5000",
            shippingCountry: user.country || "VietNam",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initialize Stripe with Stripe Elements
    const initializeStripe = async () => {
      try {
        const stripePublishKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!stripePublishKey) {
          throw new Error(
            "Stripe publishable key not found in environment variables",
          );
        }

        const stripeInstance = await loadStripe(stripePublishKey);
        if (stripeInstance) {
          setStripe(stripeInstance);

          // Create Elements instance
          const elementsInstance = stripeInstance.elements();
          setElements(elementsInstance);

          // Create Card element
          const cardEl = elementsInstance.create("card", {
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          });
          setCardElement(cardEl);
          setStripeReady(true);
        }
      } catch (err) {
        console.error("Failed to initialize Stripe:", err);
        setError("Payment system initialization failed. Please try again.");
      }
    };

    fetchUserInfo();
    initializeStripe();
  }, []);

  // Mount card element to DOM when it's created and payment method is card
  useEffect(() => {
    if (
      cardElement &&
      elements &&
      paymentMethod === "card" &&
      typeof window !== "undefined"
    ) {
      const cardElementContainer = document.getElementById("card-element");
      if (cardElementContainer && cardElementContainer.children.length === 0) {
        cardElement.mount("#card-element");
      }
    }

    return () => {
      // Unmount card element on cleanup
      if (cardElement && paymentMethod !== "card") {
        cardElement.unmount();
      }
    };
  }, [cardElement, elements, paymentMethod]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.shippingFullName ||
        !formData.shippingPhone ||
        !formData.shippingAddress
      ) {
        setError("Please fill in all required shipping information.");
        setSubmitting(false);
        return;
      }

      // Prepare checkout payload with user info
      const checkoutPayload = {
        userInfo: {
          fullName: formData.shippingFullName,
          email: formData.shippingEmail,
          phone: formData.shippingPhone,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
        },
        paymentMethod: paymentMethod === "card" ? "stripe" : "cod",
      };

      // Step 1: Create order on backend
      const orderResponse = await fetch(`${API_URL}/checkout/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(checkoutPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const orderData = await orderResponse.json();
      const orderId = orderData.data?.orderId;

      if (!orderId) {
        throw new Error("No order ID received from server");
      }

      // Handle COD vs Stripe payment
      if (paymentMethod === "cod") {
        // COD: Direct redirect to success page
        router.push(`/checkout/success/${orderId}`);
      } else {
        // Stripe: Confirm payment with clientSecret from backend
        if (!stripe || !elements || !cardElement) {
          throw new Error("Payment system not ready. Please refresh the page.");
        }

        const clientSecret = orderData.data?.clientSecret;
        if (!clientSecret) {
          throw new Error("No payment intent received from server");
        }

        // Confirm payment using Stripe Elements
        const { paymentIntent, error: stripeError } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: formData.shippingFullName,
                email: formData.shippingEmail,
                address: {
                  line1: formData.shippingAddress,
                  city: formData.shippingCity,
                  state: formData.shippingState,
                  postal_code: formData.shippingZip,
                  country: "US",
                },
              },
            },
          });

        if (stripeError) {
          throw new Error(stripeError.message || "Payment failed");
        }

        if (
          paymentIntent.status === "succeeded" ||
          paymentIntent.status === "processing"
        ) {
          // Payment succeeded or processing - confirm on backend
          const confirmResponse = await fetch(
            `${API_URL}/checkout/confirm-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ orderId }),
            },
          );

          if (!confirmResponse.ok) {
            const errorData = await confirmResponse.json();
            throw new Error(
              errorData.message || "Failed to confirm payment on server",
            );
          }

          // Success - redirect
          router.push(`/checkout/success/${orderId}`);
        } else {
          throw new Error(
            `Payment failed with status: ${paymentIntent.status}`,
          );
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.message || "An error occurred during checkout. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
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
                    {"Credit / Debit Card (Stripe)"}
                  </Label>
                </div>
              </RadioGroup>

              {/* Stripe Card Element */}
              {paymentMethod === "card" && stripeReady && cardElement && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
                    <p className="mb-3 font-medium text-blue-800">
                      {"Enter your card details"}
                    </p>
                    <div
                      id="card-element"
                      className="rounded border border-blue-200 bg-white px-3 py-2"
                      style={{
                        padding: "12px",
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                      }}
                    />
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    <p className="mb-2 font-medium">{"🧪 Test Mode"}</p>
                    <p>{"Use test card: 4242 4242 4242 4242"}</p>
                    <p>{"Expiry: Any future date | CVC: Any 3 digits"}</p>
                  </div>
                </div>
              )}

              {/* Loading state for Stripe */}
              {paymentMethod === "card" && !stripeReady && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-medium">
                    {"Initializing payment system..."}
                  </p>
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

              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <p className="mb-1 font-medium">{"⚠️ Error"}</p>
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {/* Right column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary onCheckout={handleSubmit} isSubmitting={submitting} />
        </div>
      </div>
    </div>
  );
}
