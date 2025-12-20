'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateCounter } from '@/lib/animations';

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);

  // Refs for counter values
  const counter1Ref = useRef(null);
  const counter2Ref = useRef(null);
  const counter3Ref = useRef(null);
  const counter4Ref = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;

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

    // Stats cards animation
    const statCards = statsRef.current.querySelectorAll('.stat-card');
    gsap.fromTo(
      statCards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    // Animate counters
    animateCounter(counter1Ref.current, 2500000, statsRef.current);
    animateCounter(counter2Ref.current, 150000, statsRef.current);
    animateCounter(counter3Ref.current, 8500000, statsRef.current);
    animateCounter(counter4Ref.current, 195, statsRef.current);

    // Testimonial cards animation
    const testimonials = testimonialsRef.current.querySelectorAll('.testimonial-card');
    gsap.fromTo(
      testimonials,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Fashion Boutique Owner',
      image: '👩‍💼',
      text: 'Since joining this marketplace, my monthly revenue has tripled. The built-in analytics and payment system make everything seamless.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Electronics Retailer',
      image: '👨‍💻',
      text: 'The global reach is incredible. I went from selling locally to shipping to 40+ countries in just 6 months.',
    },
    {
      name: 'Priya Sharma',
      role: 'Handmade Crafts Seller',
      image: '👩‍🎨',
      text: 'As a small business owner, the low entry barrier and seller support made it easy to start. Now I have over 5,000 sales!',
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Built on Trust & Growth
        </h2>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          <div className="stat-card text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              <span ref={counter1Ref}>0</span>+
            </div>
            <p className="text-slate-300 text-lg">Active Users</p>
          </div>

          <div className="stat-card text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              <span ref={counter2Ref}>0</span>+
            </div>
            <p className="text-slate-300 text-lg">Verified Sellers</p>
          </div>

          <div className="stat-card text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              <span ref={counter3Ref}>0</span>+
            </div>
            <p className="text-slate-300 text-lg">Products Listed</p>
          </div>

          <div className="stat-card text-center">
            <div className="text-5xl md:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              <span ref={counter4Ref}>0</span>+
            </div>
            <p className="text-slate-300 text-lg">Countries Served</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-2">What Our Sellers Say</h3>
          <p className="text-slate-300 text-lg">
            Real stories from marketplace entrepreneurs
          </p>
        </div>

        <div
          ref={testimonialsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl mr-3">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-slate-300">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-slate-200 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
