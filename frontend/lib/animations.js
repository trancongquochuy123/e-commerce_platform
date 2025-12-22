import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable GSAP animation utilities for marketplace landing page
 */

/**
 * Fade up animation
 * Elements fade in and slide up from below
 */
export const fadeUp = (element, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: "power3.out",
    },
  );
};

/**
 * Stagger reveal animation
 * Multiple elements appear one after another
 */
export const staggerReveal = (
  elements,
  triggerElement,
  startTrigger = "top 80%",
) => {
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: triggerElement,
        start: startTrigger,
        toggleActions: "play none none none",
      },
    },
  );
};

/**
 * Scale entrance animation
 * Element scales up with fade
 */
export const scaleIn = (element, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay,
      ease: "power3.out",
    },
  );
};

/**
 * Slide from left
 */
export const slideFromLeft = (element, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -80,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      delay,
      ease: "power3.out",
    },
  );
};

/**
 * Slide from right
 */
export const slideFromRight = (element, delay = 0) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      x: 80,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      delay,
      ease: "power3.out",
    },
  );
};

/**
 * Animated counter
 * Counts from 0 to target value
 */
export const animateCounter = (element, targetValue, triggerElement) => {
  const counter = { value: 0 };

  return gsap.to(counter, {
    value: targetValue,
    duration: 2,
    ease: "power1.out",
    onUpdate: () => {
      if (element) {
        element.textContent = Math.floor(counter.value).toLocaleString();
      }
    },
    scrollTrigger: {
      trigger: triggerElement,
      start: "top 75%",
      toggleActions: "play none none none",
    },
  });
};

/**
 * Hover lift animation
 * Applies on mouseenter/mouseleave
 */
export const hoverLift = (element) => {
  element.addEventListener("mouseenter", () => {
    gsap.to(element, {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
  });

  element.addEventListener("mouseleave", () => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      duration: 0.3,
      ease: "power2.out",
    });
  });
};

/**
 * Draw line animation
 * Animates SVG line stroke
 */
export const drawLine = (lineElement, delay = 0) => {
  return gsap.fromTo(
    lineElement,
    {
      strokeDashoffset: lineElement.getTotalLength(),
      strokeDasharray: lineElement.getTotalLength(),
    },
    {
      strokeDashoffset: 0,
      duration: 1.5,
      delay,
      ease: "power2.inOut",
    },
  );
};

/**
 * Parallax effect
 * Creates depth by moving elements at different speeds
 */
export const parallax = (element, speed = 0.5) => {
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
};

/**
 * Reveal on scroll with custom animation
 */
export const revealOnScroll = (element, animation = {}) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
      ...animation.from,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      ...animation.to,
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
        ...animation.scrollTrigger,
      },
    },
  );
};

/**
 * Floating animation
 * Continuous gentle up/down motion
 */
export const floating = (element, duration = 3, yOffset = 15) => {
  return gsap.to(element, {
    y: yOffset,
    duration: duration,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });
};

export { gsap, ScrollTrigger };
