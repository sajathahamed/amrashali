"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import type { Journal } from "@/types/journal";

interface JournalCardProps {
  journal: Journal;
  index?: number;
}

export default function JournalCard({ journal, index = 0 }: JournalCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="card overflow-hidden h-full flex flex-col group cursor-pointer"
    >
      <Link href={`/ab-journal/${journal.slug}`} className="block h-full">
        <div className="relative h-64 md:h-72 w-full overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={journal.hero_image || journal.thumbnail || "/placeholder.jpg"}
              alt={journal.title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {journal.category && (
            <div className="absolute top-6 left-6">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                {journal.category}
              </motion.span>
            </div>
          )}
        </div>
        <div className="p-8 flex-1 flex flex-col bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3 text-sm text-text mb-4">
            <span className="font-medium">
              {formatDate(journal.created_at)}
            </span>
            <span className="text-text/40">•</span>
            <span>{journal.reading_time} min read</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4 line-clamp-2 group-hover:text-accent transition-colors">
            {journal.title}
          </h3>
          <p className="text-text-light mb-6 line-clamp-3 flex-1 text-lg leading-relaxed">
            {journal.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {(journal.tags || []).slice(0, 3).map((tag) => (
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
            Read more
            <span className="inline-block">→</span>
          </motion.span>
        </div>
      </Link>
    </motion.article>
  );
}
