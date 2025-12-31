"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

interface AboutProject {
  id: string;
  title: string;
  description: string;
  images: string[];
  heroImage: string;
}

interface AboutProjectCardProps {
  project: AboutProject;
  index: number;
}

export default function AboutProjectCard({
  project,
  index,
}: AboutProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      className="card overflow-hidden"
    >
      <div className="relative h-64 md:h-72 w-full overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      </div>
      <div className="p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-primary mb-3">
          {project.title}
        </h3>
        <p className="text-base sm:text-lg text-text-light leading-relaxed mb-4">
          {project.description}
        </p>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-accent font-semibold text-base inline-flex items-center gap-2 hover:gap-4 transition-all"
        >
          {isExpanded ? "Show Less" : "View Gallery"}
          <span className="inline-block">{isExpanded ? "↑" : "↓"}</span>
        </motion.button>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            {project.images.slice(1, 5).map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative h-32 sm:h-40 rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${project.title} - Image ${idx + 2}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}




