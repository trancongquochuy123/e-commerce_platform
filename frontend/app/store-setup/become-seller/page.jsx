"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function BecomeSellerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(null); // null | 'logged-out' | 'already-seller' | 'can-register'
  const [userInfo, setUserInfo] = useState(null);
  const [shopName, setShopName] = useState("");
  const [visaNumber, setVisaNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check user authentication and seller status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/user/info`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.data?.user;

        if (user) {
          setUserInfo(user);
          if (user.isSeller) {
            setAuthState("already-seller");
          } else {
            setAuthState("can-register");
          }
        } else {
          setAuthState("logged-out");
        }
      } else {
        // Not authenticated
        setAuthState("logged-out");
      }
    } catch (err) {
      console.error("Error checking auth status:", err);
      setAuthState("logged-out");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!isValidVisaNumber(visaNumber)) {
      setError("Visa card number must contain exactly 16 digits.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/become-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ visaNumber, shopName }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.data.onboardingUrl;
        // setSuccess(true);
        // // Optionally redirect after a delay
        // setTimeout(() => {
        //   router.push("/products");
        // }, 2000);
      } else {
        setError(data.error.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error becoming seller:", err);
      setError("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  function formatVisaNumber(value) {
    // Chỉ giữ số
    const digits = value.replace(/\D/g, "");

    // Giới hạn 16 số
    const limited = digits.slice(0, 16);

    // Chia thành nhóm 4 số
    const parts = limited.match(/.{1,4}/g);

    return parts ? parts.join(" ") : "";
  }

  function isValidVisaNumber(value) {
    return (
      value.replace(/\s/g, "").length === 16 ||
      value.replace(/\s/g, "").length === 12
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-20">
      <div className="mx-auto max-w-2xl">
        {/* Logo/Brand */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/50 px-4 py-2">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              BaoTao
            </span>
            <span className="text-xl">🌍</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            Become a Seller
          </h1>
          <p className="text-lg text-slate-600">
            Start your journey as a seller on our marketplace
          </p>
        </div>

        <Card className="p-8 shadow-xl">
          {/* Logged Out State */}
          {authState === "logged-out" && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                Authentication Required
              </h2>
              <p className="mb-8 text-slate-600">
                Please log in or create an account to become a seller.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Log In
                </Button>
                <Button
                  onClick={() => router.push("/signup")}
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          {/* Already Seller State */}
          {authState === "already-seller" && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-semibold text-slate-900">
                You&apos;re Already a Seller!
              </h2>
              <p className="mb-2 text-slate-600">
                Shop Name:{" "}
                <span className="font-semibold text-slate-900">
                  {userInfo?.shopName}
                </span>
              </p>
              <p className="mb-8 text-sm text-slate-500">
                You registered as a seller on{" "}
                {userInfo?.sellerActivatedAt
                  ? new Date(userInfo.sellerActivatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <Button
                onClick={() => router.push("/products")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Browse Marketplace
              </Button>
            </div>
          )}

          {/* Can Register State */}
          {authState === "can-register" && !success && (
            <div>
              <div className="mb-8 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <svg
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                  Register Your Shop
                </h2>
                <p className="text-slate-600">
                  Welcome, {userInfo?.fullName}! Complete your seller
                  registration below.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label
                    htmlFor="shopName"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter your shop name"
                    required
                    className="w-full"
                    disabled={submitting}
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    This will be displayed to customers on the marketplace.
                  </p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="visaNumber"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Visa Card Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="visaNumber"
                    value={visaNumber}
                    onChange={(e) =>
                      setVisaNumber(formatVisaNumber(e.target.value))
                    }
                    placeholder="4242 4242 4242 4242"
                    required
                    disabled={submitting}
                    className="w-full"
                  />
                  <p className="mt-2 text-sm text-slate-500">
                    Test card only. No real payment will be made.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    !shopName.trim() ||
                    !isValidVisaNumber(visaNumber)
                  }
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    "Become a Seller"
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>
                    By registering as a seller, you agree to our seller terms
                    and conditions. You can start listing products immediately
                    after registration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success State */}
          {success && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mb-4 text-2xl font-semibold text-green-600">
                Congratulations! 🎉
              </h2>
              <p className="mb-2 text-slate-600">
                You&apos;ve successfully registered as a seller!
              </p>
              <p className="mb-8 text-sm text-slate-500">
                Shop Name:{" "}
                <span className="font-semibold text-slate-900">{shopName}</span>
              </p>
              <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  Redirecting you to the marketplace...
                </p>
              </div>
              <Button
                onClick={() => router.push("/products")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Go to Marketplace Now
              </Button>
            </div>
          )}
        </Card>

        {/* Back to Store Setup Link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/store-setup")}
            className="mx-auto flex items-center gap-2 text-slate-600 transition-colors duration-300 hover:text-blue-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Store Setup
          </button>
        </div>
      </div>
    </div>
  );
}
