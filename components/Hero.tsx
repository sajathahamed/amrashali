"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Letter-by-letter animation component
const AnimatedText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-1 sm:mr-2">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + wordIndex * 0.05 + charIndex * 0.02,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
};

// Scroll indicator component
const ScrollIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      className="absolute bottom-8 sm:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 z-20"
    >
      <span className="text-xs sm:text-sm text-text/70 font-medium tracking-wider uppercase">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-text/30 rounded-full flex items-start justify-center p-1.5 sm:p-2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1 h-2 sm:h-3 bg-accent rounded-full"
        />
      </motion.div>
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
      style={{ opacity: 1, visibility: 'visible' }} /* Chrome hydration fix */
    >
      {/* Background with gradient and noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20"
        initial={{ opacity: 1 }} /* Chrome: ensure visible on mount */
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-serif font-bold text-primary leading-[1.05] tracking-tight">
                <AnimatedText text="AB Journal" delay={0.4} />
              </h1>
              
              {/* Tagline on same line with separator - modern editorial style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4"
              >
                <span className="text-accent text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-semibold">
                  Community Journalism
                </span>
                <span className="text-accent text-xl sm:text-2xl md:text-3xl lg:text-4xl">•</span>
                <span className="text-primary text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-semibold">
                  Human Rights Reporting
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3 sm:space-y-4"
            >
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-light leading-relaxed max-w-2xl font-light">
                AB Journal amplifies marginalized voices and publishes investigative
                reporting, first-person accounts, and multimedia stories from communities.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-text leading-relaxed max-w-2xl">
                We collaborate with local reporters and community contributors to document
                human rights issues and support advocacy through rigorous journalism.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/ab-journal"
                  className="bg-primary text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 inline-block text-center text-base sm:text-lg lg:text-xl w-full sm:w-auto"
                >
                  Read My Journal
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/about"
                  className="px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 inline-block text-center text-base sm:text-lg lg:text-xl w-full sm:w-auto"
                >
                  My Story
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={!isMobile ? {
              x: mousePosition.x,
              y: mousePosition.y,
            } : {}}
            className="lg:col-span-5 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl group order-1 lg:order-2 bg-white/50 dark:bg-gray-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-10" />
            <Image
              src="/ab-journal/abjournal.png"
              alt="AB Journal"
              fill
              className="object-contain p-4 sm:p-6 md:p-8 transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-20 text-primary bg-white/95 dark:bg-gray-800/95 rounded-xl p-3 sm:p-4 shadow-lg"
              style={{ WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)" }}
            >
              <p className="text-sm sm:text-base font-semibold mb-0.5 sm:mb-1">Be Your Best Version Of Your Life</p>
              <p className="text-xs sm:text-sm opacity-70">Community Development & Advocacy</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
