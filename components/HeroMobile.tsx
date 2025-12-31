"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Word-by-word animation component (faster than letter-by-letter on mobile)
const AnimatedText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: delay + wordIndex * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block mr-1.5"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// Decorative SVG accent - editorial line
const DecorativeAccent = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.svg
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      transition={{
        duration: 1.2,
        delay: 0.8,
        ease: "easeOut",
      }}
      className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 text-accent/20"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: shouldReduceMotion ? "none" : "block" }}
    >
      <motion.path
        d="M10 50 Q50 10, 90 50 T170 50"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="50" cy="50" r="2" fill="currentColor" opacity="0.4" />
    </motion.svg>
  );
};

export default function HeroMobile() {
  const shouldReduceMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Gentle breathing animation for profile image
  const breathingAnimation = shouldReduceMotion
    ? {}
    : {
        scale: [1, 1.02, 1],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-background">
      {/* Soft card container - mobile-first design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md mx-auto"
      >
        {/* Card with paper-style design */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl p-6 sm:p-8 md:p-10 overflow-hidden">
          {/* Decorative accent */}
          <DecorativeAccent />

          {/* Profile Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <motion.div
              animate={breathingAnimation}
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44"
            >
              {/* Circular border with subtle glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 via-accent/10 to-transparent p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800" />
              </div>
              {/* Profile Image */}
              <div className="absolute inset-[2px] rounded-full overflow-hidden bg-background">
                <Image
                  src="/amrash pic/profile-removebg-preview.png"
                  alt="Amras Ali"
                  fill
                  className="object-contain p-2"
                  priority
                  sizes="(max-width: 768px) 160px, 176px"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
            {/* Name with word-by-word animation */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary leading-tight"
            >
              <AnimatedText text="Amras Ali" delay={0.5} />
            </motion.h1>

            {/* Role line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg text-text font-medium"
            >
              <span>Journalist</span>
              <span className="text-accent">•</span>
              <span>Social Worker</span>
            </motion.div>

            {/* Mission statement */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="text-base sm:text-lg md:text-xl text-text-light leading-relaxed max-w-sm mx-auto font-light px-2"
            >
              Dedicated to empowering communities and creating positive social
              change through grassroots engagement.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mt-8 sm:mt-10 md:mt-12 space-y-3 sm:space-y-4"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/articles"
                className="block w-full bg-primary text-white px-6 py-3.5 sm:py-4 rounded-lg font-medium text-base sm:text-lg text-center hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary-dark"
              >
                View My Work
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            >
              <Link
                href="/about"
                className="block w-full border-2 border-primary text-primary px-6 py-3.5 sm:py-4 rounded-lg font-medium text-base sm:text-lg text-center hover:bg-primary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-primary active:text-white"
              >
                Contact / Social
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Subtle background decoration - only visible on larger mobile screens */}
        <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl blur-3xl" />
      </motion.div>

      {/* Scroll indicator - subtle on mobile */}
      {isMounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 6, 0],
                  }
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-5 h-8 border-2 border-text/30 rounded-full flex items-start justify-center p-1"
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, 10, 0],
                    }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 h-2 bg-accent rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}





