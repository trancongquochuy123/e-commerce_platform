'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MarketplaceFlow() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const flowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const flowItems = flowRef.current.querySelectorAll('.flow-item');
    const lines = [line1Ref.current, line2Ref.current];

    // Title animation on scroll
    gsap.fromTo(
      title,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Flow items stagger animation
    gsap.fromTo(
      flowItems,
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: flowRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animate connecting lines
    lines.forEach((line, index) => {
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.6,
            delay: 0.8 + index * 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: flowRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16"
        >
          How Our Marketplace Works
        </h2>

        <div
          ref={flowRef}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative"
        >
          {/* Seller */}
          <div className="flow-item flex flex-col items-center text-center max-w-xs">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Sellers List Products
            </h3>
            <p className="text-slate-600">
              Multiple vendors create storefronts, upload products, and set
              competitive prices on our platform.
            </p>
          </div>

          {/* Connecting line 1 */}
          <div className="hidden md:block relative w-24 h-0.5">
            <div
              ref={line1Ref}
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 origin-left"
              style={{ transformOrigin: 'left center' }}
            />
            <div className="absolute -top-1 right-0 w-3 h-3 bg-indigo-600 rounded-full" />
          </div>

          {/* Platform */}
          <div className="flow-item flex flex-col items-center text-center max-w-xs">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Platform Facilitates
            </h3>
            <p className="text-slate-600">
              We handle secure payments, escrow services, dispute resolution,
              and provide analytics for growth.
            </p>
          </div>

          {/* Connecting line 2 */}
          <div className="hidden md:block relative w-24 h-0.5">
            <div
              ref={line2Ref}
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 origin-left"
              style={{ transformOrigin: 'left center' }}
            />
            <div className="absolute -top-1 right-0 w-3 h-3 bg-pink-600 rounded-full" />
          </div>

          {/* Buyer */}
          <div className="flow-item flex flex-col items-center text-center max-w-xs">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Buyers Discover & Purchase
            </h3>
            <p className="text-slate-600">
              Customers browse thousands of products, compare options, read
              reviews, and shop with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
