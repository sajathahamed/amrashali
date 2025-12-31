"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/lib/data";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-base sm:text-lg font-medium text-primary">
              {skill.name}
            </span>
            <span className="text-sm sm:text-base text-text">{skill.level}%</span>
          </div>
          <div className="w-full bg-background dark:bg-gray-700 rounded-full h-2.5 sm:h-3">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
