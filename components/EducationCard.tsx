"use client";

import { motion } from "framer-motion";
import type { Education } from "@/lib/data";

interface EducationCardProps {
  education: Education;
  index: number;
}

export default function EducationCard({
  education,
  index,
}: EducationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="card p-6 sm:p-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 sm:w-7 sm:h-7 text-accent"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l0 7-9-5 0-7 9 5z" />
            <path d="M12 14l9 5-9 5-9-5 9-5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-2">
            {education.degree}
          </h3>
          <p className="text-accent font-medium text-sm sm:text-base mb-2">
            {education.institution}
          </p>
          <p className="text-text text-sm sm:text-base mb-3">{education.period}</p>
          <p className="text-text-light text-base sm:text-lg leading-relaxed">
            {education.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

