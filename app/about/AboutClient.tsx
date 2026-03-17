"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const ScrollReveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};

export default function AboutClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1FNKwbNNqQ/?mibextid=wwXIfr",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/ab_journal",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/ab-journal",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-accent text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wider uppercase"
              >
                About
              </motion.p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-primary leading-[1.1] sm:leading-[0.95] tracking-tight">
                About AB Journal
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-text-light leading-relaxed font-light"
              >
                AB Journal is a community-driven publication dedicated to
                amplifying marginalized voices, documenting human rights issues,
                and supporting advocacy through investigative reporting.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] rounded-2xl overflow-hidden shadow-2xl group bg-white/50 order-1 lg:order-2"
            >
              <Image
                src="/ab-journal/abjournal.png"
                alt="AB Journal"
                fill
                className="object-contain p-4 sm:p-6 md:p-8 transition-transform duration-700 group-hover:scale-110"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Content - Journal only */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24 lg:space-y-32">
        {/* Our Story */}
        <ScrollReveal>
          <section className="space-y-8">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-accent flex-1" />
              <span className="text-accent text-sm font-medium tracking-wider uppercase">
                Our Story
              </span>
              <div className="h-px bg-accent flex-1" />
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-text-light font-light mb-6 sm:mb-8">
                AB Journal brings together community reporters, researchers, and
                storytellers to publish investigative journalism, multimedia
                features, and first-person narratives that promote transparency
                and accountability.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-text-light mb-6 sm:mb-8">
                Our editorial approach prioritizes safety, consent, and rigor.
                We work with local partners to document lived experiences and
                produce reporting that supports advocacy efforts.
              </p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-text-light">
                Through community engagement and careful reporting, the journal
                seeks to elevate marginalized voices and catalyze change.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Visit Journal */}
        <ScrollReveal delay={0.1}>
          <section className="space-y-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/ab-journal"
                className="btn-primary text-lg px-10 py-4 inline-block"
              >
                Visit Journal
              </Link>
            </motion.div>
          </section>
        </ScrollReveal>

        {/* Connect Section */}
        <ScrollReveal delay={0.2}>
          <section id="connect" className="space-y-12">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px bg-accent flex-1" />
              <span className="text-accent text-sm font-medium tracking-wider uppercase">
                Connect
              </span>
              <div className="h-px bg-accent flex-1" />
            </div>
            <div className="text-center space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                Let&apos;s Connect
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-text-light leading-relaxed font-light max-w-2xl mx-auto px-4">
                Follow the journal, connect with our contributors on social media, and join the
                conversation about community development, human rights, and social change.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 px-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-background hover:bg-primary hover:text-white transition-all duration-300 group w-full sm:w-auto min-w-[120px]"
                  >
                    <div className="text-primary group-hover:text-white transition-colors">
                      {social.icon}
                    </div>
                    <span className="font-medium text-sm">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
