"use client";

import { motion } from "framer-motion";
import type { Education } from "@/lib/data";

interface EducationTimelineProps {
  education: Education[];
}

export default function EducationTimeline({ education }: EducationTimelineProps) {
  return (
    <div className="space-y-8">
      {education.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="relative pl-8 border-l-2 border-accent/30"
        >
          <div className="absolute -left-[9px] top-0 w-4 h-4 bg-accent rounded-full" />
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary">
              {item.degree}
            </h3>
            <p className="text-base sm:text-lg text-accent font-medium">
              {item.institution}
            </p>
            <p className="text-sm sm:text-base text-text mb-2">{item.period}</p>
            <p className="text-base sm:text-lg text-text-light leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}




