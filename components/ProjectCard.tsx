"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -12, scale: 1.02 }}
        className="card overflow-hidden h-full flex flex-col group cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
    >
      <Link href={`/projects/${project.slug}`} className="block h-full">
        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 xl:h-[420px] w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 transform-gpu transition-transform will-change-transform"
          >
            <Image
              src={project.hero_image || "/ab-journal/abjournal.png"}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-6 left-6">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
              {project.category}
            </motion.span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
            <div className="flex items-center gap-3 text-sm mb-4 opacity-90">
              <span>{formatDate(project.date)}</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-lg md:text-xl leading-relaxed opacity-90 line-clamp-2">
              {project.excerpt}
            </p>
          </div>
        </div>
        <div className="p-8 bg-white dark:bg-gray-800">
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-background dark:bg-gray-700 px-3 py-1.5 rounded-full text-text font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <motion.span
            className="text-accent font-semibold text-base inline-flex items-center gap-2 group-hover:gap-4 transition-all"
            whileHover={{ x: 4 }}
          >
            View project
            <span className="inline-block">→</span>
          </motion.span>
        </div>
      </Link>
    </motion.article>
  );
}
