"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    // Content fade and slide up
    gsap.fromTo(
      content,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );

    // Enhanced button hover animations
    const button1 = button1Ref.current;
    const button2 = button2Ref.current;

    // Button 1 hover
    button1.addEventListener("mouseenter", () => {
      gsap.to(button1, {
        scale: 1.05,
        boxShadow: "0 20px 50px rgba(59, 130, 246, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button1.addEventListener("mouseleave", () => {
      gsap.to(button1, {
        scale: 1,
        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Button 2 hover
    button2.addEventListener("mouseenter", () => {
      gsap.to(button2, {
        scale: 1.05,
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    button2.addEventListener("mouseleave", () => {
      gsap.to(button2, {
        scale: 1,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-24"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-full w-full">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Ready to Transform Your Business?
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-blue-100 md:text-2xl">
          Join thousands of successful sellers who have built thriving
          businesses on our platform. Start selling today with zero upfront
          costs and scale at your own pace.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            ref={button1Ref}
            href="/store-setup/become-seller"
            className="group relative overflow-hidden rounded-xl bg-white px-10 py-5 text-lg font-bold text-blue-600 shadow-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Selling Now
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </a>

          <a
            ref={button2Ref}
            href="/products"
            className="group rounded-xl border-2 border-white bg-transparent px-10 py-5 text-lg font-bold text-white"
          >
            <span className="flex items-center gap-2">
              Browse as Buyer
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </a>
        </div>

        {/* Benefits list */}
        <div className="mt-16 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              No Setup Fees
            </h3>
            <p className="text-sm text-blue-100">
              Create your store for free. Only pay a small commission when you
              make sales.
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              Go Live in Minutes
            </h3>
            <p className="text-sm text-blue-100">
              Simple onboarding process. Upload products and start selling the
              same day.
            </p>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">
              24/7 Support
            </h3>
            <p className="text-sm text-blue-100">
              Dedicated seller support team ready to help you grow and succeed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
