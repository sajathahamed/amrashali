"use client";

import { motion } from "framer-motion";
import type { Experience } from "@/lib/data";

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

export default function ExperienceCard({
  experience,
  index,
}: ExperienceCardProps) {
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
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary mb-2">
            {experience.title}
          </h3>
          <p className="text-base sm:text-lg text-accent font-medium mb-1">
            {experience.organization}
          </p>
          <p className="text-sm sm:text-base text-text">{experience.period}</p>
        </div>
        <ul className="space-y-2 mt-4">
          {experience.responsibilities.map((responsibility, idx) => (
            <li
              key={idx}
              className="text-base sm:text-lg text-text-light leading-relaxed flex items-start gap-2"
            >
              <span className="text-accent mt-2">•</span>
              <span>{responsibility}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
