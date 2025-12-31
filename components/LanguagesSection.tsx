"use client";

import { motion } from "framer-motion";
import type { Language } from "@/lib/data";

interface LanguagesSectionProps {
  languages: Language[];
}

export default function LanguagesSection({
  languages,
}: LanguagesSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {languages.map((language, index) => (
        <motion.div
          key={language.name}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-base sm:text-lg font-medium text-primary">
              {language.name}
            </span>
            <span className="text-sm sm:text-base text-text">
              {language.proficiency}%
            </span>
          </div>
          <div className="w-full bg-background dark:bg-gray-700 rounded-full h-2.5 sm:h-3">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${language.proficiency}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

