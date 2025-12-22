'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = gridRef.current.querySelectorAll('.category-card');

    // Title animation
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

    // Cards stagger animation
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Hover animations using GSAP
    cards.forEach((card) => {
      const icon = card.querySelector('.category-icon');

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(icon, {
          scale: 1.1,
          rotation: 5,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const categories = [
    {
      name: 'Electronics',
      icon: '💻',
      count: '125K+ Products',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Fashion',
      icon: '👔',
      count: '230K+ Products',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Home & Living',
      icon: '🏠',
      count: '180K+ Products',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      name: 'Beauty',
      icon: '💄',
      count: '95K+ Products',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Sports & Fitness',
      icon: '⚽',
      count: '140K+ Products',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Books & Media',
      icon: '📚',
      count: '210K+ Products',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Toys & Games',
      icon: '🎮',
      count: '88K+ Products',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      name: 'Automotive',
      icon: '🚗',
      count: '75K+ Products',
      gradient: 'from-slate-600 to-slate-700',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From electronics to fashion, discover millions of products across
            diverse categories from trusted sellers worldwide.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md cursor-pointer transition-all duration-300"
            >
              <div
                className={`category-icon w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center text-3xl mb-4 shadow-lg`}
              >
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-slate-500">{category.count}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Browse All Categories
            <svg
              className="w-5 h-5"
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
          </a>
        </div>
      </div>
    </section>
  );
}
