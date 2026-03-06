"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Journal } from "@/types/journal";
import JournalCard from "@/components/JournalCard";
import FilterBar from "@/components/FilterBar";

const JOURNALS_PER_PAGE = 9;

interface JournalListClientProps {
  journals: Journal[];
  categories: string[];
  tags: string[];
}

export default function JournalListClient({
  journals,
  categories,
  tags,
}: JournalListClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const filteredJournals = useMemo(() => {
    return journals.filter((journal) => {
      const matchesSearch =
        searchQuery === "" ||
        journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (journal.excerpt || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (journal.tags || []).some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "" || journal.category === selectedCategory;

      const matchesTag =
        selectedTag === "" || (journal.tags || []).includes(selectedTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [journals, searchQuery, selectedCategory, selectedTag]);

  const totalPages = Math.ceil(filteredJournals.length / JOURNALS_PER_PAGE);
  const paginatedJournals = filteredJournals.slice(
    (currentPage - 1) * JOURNALS_PER_PAGE,
    currentPage * JOURNALS_PER_PAGE
  );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  if (journals.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">
          AB Journal
        </h1>
        <p className="text-xl text-text">
          No journal entries available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-accent text-sm sm:text-base md:text-lg lg:text-xl font-medium tracking-wider uppercase"
            >
              Journal
            </motion.p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-primary leading-[1.1] sm:leading-[0.95] tracking-tight">
              Field Notes
              <br />
              <span className="text-accent">& Reflections</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-text-light leading-relaxed font-light max-w-2xl mx-auto px-4"
            >
              Reflections on community development, social work practice, and
              creating sustainable change through grassroots engagement.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Journal Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => {
            setSelectedCategory(cat);
            handleFilterChange();
          }}
          selectedTag={selectedTag}
          setSelectedTag={(tag) => {
            setSelectedTag(tag);
            handleFilterChange();
          }}
          categories={categories}
          tags={tags}
        />

        {filteredJournals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-text mb-4">No journals found.</p>
            <p className="text-lg text-text-light">
              Try adjusting your search or filters.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
              {paginatedJournals.map((journal, index) => (
                <JournalCard
                  key={journal.id}
                  journal={journal}
                  index={index}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-4"
              >
                <motion.button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  className="px-6 py-3 rounded-md border-2 border-primary text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-all duration-300 font-medium"
                >
                  Previous
                </motion.button>
                <span className="text-text px-6 text-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  whileHover={{
                    scale: currentPage === totalPages ? 1 : 1.05,
                  }}
                  whileTap={{
                    scale: currentPage === totalPages ? 1 : 0.95,
                  }}
                  className="px-6 py-3 rounded-md border-2 border-primary text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-white transition-all duration-300 font-medium"
                >
                  Next
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
