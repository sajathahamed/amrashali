"use client";

import { motion } from "framer-motion";
import type { CommunityWork } from "@/lib/data";

interface CommunityWorkCardProps {
  work: CommunityWork;
  index: number;
}

export default function CommunityWorkCard({
  work,
  index,
}: CommunityWorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="card p-6 sm:p-8"
    >
      <div className="space-y-4">
        <div>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-3"
          >
            {work.title}
          </motion.span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary mb-2">
            {work.organization}
          </h3>
          <p className="text-sm sm:text-base text-text mb-4">{work.period}</p>
        </div>
        <p className="text-base sm:text-lg text-text-light leading-relaxed">
          {work.description}
        </p>
      </div>
    </motion.div>
  );
}
