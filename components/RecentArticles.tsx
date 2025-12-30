"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getAllArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/data";

interface RecentArticlesProps {
  currentSlug: string;
}

export default function RecentArticles({ currentSlug }: RecentArticlesProps) {
  const allArticles = getAllArticles();
  const recentArticles = allArticles
    .filter((article) => article.slug !== currentSlug)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6"
    >
      <h3 className="text-xl font-serif font-bold text-primary mb-6">
        Recent Articles
      </h3>
      <ul className="space-y-4">
        {recentArticles.map((article, index) => (
          <motion.li
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/articles/${article.slug}`}
              className="block group"
            >
              <h4 className="font-semibold text-primary group-hover:text-accent transition-colors mb-1 line-clamp-2">
                {article.title}
              </h4>
              <p className="text-sm text-text">{formatDate(article.date)}</p>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

