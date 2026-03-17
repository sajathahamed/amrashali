"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { OwnerProfile } from "@/types/journal";
import type { CVContact } from "@/types/journal";

const ContactIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-accent">
    {children}
  </span>
);

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

export default function OwnerClient({
  ownerProfile,
  contact,
}: {
  ownerProfile: OwnerProfile;
  contact?: CVContact | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const c = contact ?? { id: "", phone: "", email: "", address: "" };
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image – heavily blurred & low opacity for readability */}
        {ownerProfile.backgroundImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={ownerProfile.backgroundImageUrl}
              alt=""
              fill
              className="object-cover blur-2xl scale-110 opacity-30"
              priority
              sizes="100vw"
              aria-hidden
            />
            {/* Dark overlay to ensure text contrast */}
            <div
              className="absolute inset-0 bg-primary/40"
              aria-hidden
            />
          </div>
        )}

        {/* Subtle parallax gradient – keeps color scheme */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none"
          aria-hidden
        />

        {/* Content container – no overlap, clean grid */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-12 lg:gap-16 xl:gap-20 lg:items-center">
            {/* Profile image – left, reduced size, rounded, soft shadow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="shrink-0 w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px]"
            >
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/20 bg-white/95 dark:bg-gray-900/95">
                <Image
                  src={ownerProfile.imageUrl}
                  alt={ownerProfile.imageAlt || ownerProfile.name}
                  fill
                  className="object-contain object-top"
                  priority
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 300px"
                />
              </div>
            </motion.div>

            {/* Text content – right, in glassmorphism card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="w-full min-w-0 flex-1"
            >
              <div className="rounded-2xl border border-white/20 bg-white/10 dark:bg-black/20 px-6 py-8 sm:px-8 sm:py-10 shadow-2xl backdrop-blur-md">
                {/* Typography hierarchy – light text for contrast on dark hero */}
                <p
                  className="text-accent text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-3 opacity-90"
                  style={{ letterSpacing: "0.2em" }}
                >
                  About the Author
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-2">
                  {ownerProfile.name}
                </h1>
                <p className="text-lg sm:text-xl text-white/90 font-medium">
                  {ownerProfile.role}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Profile details – contact + full bio */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <ScrollReveal>
          <section className="card overflow-hidden rounded-2xl shadow-xl border border-primary/10 dark:border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Contact info – left column */}
              <div className="md:col-span-4 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-primary/10 dark:border-white/10 bg-primary/5 dark:bg-white/5">
                <h3 className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-6 opacity-90">
                  Contact
                </h3>
                <div className="space-y-4">
                  {contact.phone && (
                    <div className="flex items-start gap-4">
                      <ContactIcon>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </ContactIcon>
                      <a href={`tel:${contact.phone}`} className="text-text-light dark:text-text-dark hover:text-accent transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-start gap-4">
                      <ContactIcon>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </ContactIcon>
                      <a href={`mailto:${contact.email}`} className="text-text-light dark:text-text-dark hover:text-accent transition-colors break-all">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.address && (
                    <div className="flex items-start gap-4">
                      <ContactIcon>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </ContactIcon>
                      <span className="text-text-light dark:text-text-dark">
                        {contact.address}
                      </span>
                    </div>
                  )}
                  {!contact.phone && !contact.email && !contact.address && (
                    <p className="text-text opacity-80 text-sm">Add contact info in cv_contact table.</p>
                  )}
                </div>
              </div>
              {/* Profile description – right column */}
              <div className="md:col-span-8 p-6 sm:p-8 lg:p-10">
                <h3 className="text-primary dark:text-white text-xs font-semibold tracking-[0.2em] uppercase mb-4 opacity-90">
                  Profile
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-text-light dark:text-text-dark leading-relaxed font-light">
                  {ownerProfile.bio}
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Card image – Be Your Best Version */}
        <ScrollReveal delay={0.05}>
          <section className="flex justify-center">
            <div className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[3/2] rounded-2xl overflow-hidden shadow-xl ring-1 ring-primary/10 dark:ring-white/10">
              <Image
                src="/ab-journal/background%20image.jpeg"
                alt="Be Your Best Version - AB Journal"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section className="text-center">
            <Link
              href="/about"
              className="text-primary dark:text-accent hover:text-accent dark:hover:text-accent-light font-medium underline underline-offset-4 transition-colors"
            >
              ← Back to About the Journal
            </Link>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
