"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import type { Project } from "@/lib/data";
import ProjectCard from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: Project[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section ref={sectionRef} className="mb-16 sm:mb-24 lg:mb-32 xl:mb-40">
      <motion.div
        style={{ opacity, y }}
        className="mb-8 sm:mb-12 lg:mb-16 xl:mb-20"
      >
        <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="h-px bg-accent flex-1" />
          <span className="text-accent text-xs sm:text-sm font-medium tracking-wider uppercase px-2">
            Portfolio
          </span>
          <div className="h-px bg-accent flex-1" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-serif font-bold text-primary mb-4 sm:mb-6 leading-[1.1] sm:leading-[0.95] tracking-tight">
          Featured Projects
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-text-light max-w-3xl leading-relaxed font-light">
          Long-form investigations and multimedia storytelling projects that
          drive change.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/projects"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            View All Projects
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
