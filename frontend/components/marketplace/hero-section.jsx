"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { fadeUp, scaleIn, floating } from "@/lib/animations";

export default function HeroSection() {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadlineRef = useRef(null);
  const ctaRef = useRef(null);
  const shape1Ref = useRef(null);
  const shape2Ref = useRef(null);
  const shape3Ref = useRef(null);

  useEffect(() => {
    // Hero entrance timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate logo
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.8, y: -20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8 },
    )
      // Animate headline with scale and fade
      .fromTo(
        headlineRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1 },
        "-=0.4",
      )
      // Animate subheadline
      .fromTo(
        subheadlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5",
      )
      // Animate CTA buttons
      .fromTo(
        ctaRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
        "-=0.4",
      );

    // Floating background shapes
    if (shape1Ref.current) floating(shape1Ref.current, 4, 20);
    if (shape2Ref.current) floating(shape2Ref.current, 5, -25);
    if (shape3Ref.current) floating(shape3Ref.current, 3.5, 15);

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50"
    >
      {/* Animated background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={shape1Ref}
          className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
        />
        <div
          ref={shape2Ref}
          className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
        />
        <div
          ref={shape3Ref}
          className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center">
        {/* BaoTao Logo Name */}
        <div
          ref={logoRef}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/50 px-4 py-2"
        >
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
            BaoTao
          </span>
          <span className="text-xl">🌍</span>
        </div>

        {/* Main headline */}
        <h1
          ref={headlineRef}
          className="mb-6 text-5xl leading-tight font-bold text-slate-900 md:text-6xl lg:text-7xl"
        >
          The Global Marketplace
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Connecting Sellers & Buyers
          </span>
        </h1>

        {/* Subheadline */}
        <p
          ref={subheadlineRef}
          className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl lg:text-2xl"
        >
          Build your storefront, reach millions of customers, and scale your
          business on a platform designed for multi-vendor success. Secure
          payments, global logistics, and trusted reviews—all in one place.
        </p>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href="/products"
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10">Explore Marketplace</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </a>

          <a
            href="/store-setup/become-seller"
            className="group rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-semibold text-slate-900 shadow-md transition-all duration-300 hover:scale-105 hover:border-blue-600 hover:text-blue-600 hover:shadow-lg"
          >
            Start Selling Today
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secure Payments</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Global Shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Verified Sellers</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="h-6 w-6 text-slate-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
