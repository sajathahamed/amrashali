"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface AuthorCardProps {
  author: {
    name: string;
    role: string;
  };
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
            alt={author.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-primary">{author.name}</h3>
          <p className="text-sm text-text">{author.role}</p>
        </div>
      </div>
      <p className="text-sm text-text leading-relaxed">
        Award-winning investigative journalist with over 15 years of experience
        covering politics, technology, and social justice. Winner of the
        Pulitzer Prize and Peabody Award.
      </p>
      <div className="mt-4 flex gap-3">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:text-accent transition-colors"
          aria-label="Twitter"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text hover:text-accent transition-colors"
          aria-label="LinkedIn"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </a>
        <a
          href="mailto:contact@example.com"
          className="text-text hover:text-accent transition-colors"
          aria-label="Email"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
}

