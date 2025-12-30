"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  categories: string[];
  tags: string[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  categories,
  tags,
}: FilterBarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "" || selectedTag !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedTag("");
  };

  return (
    <div className="mb-12 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsTagOpen(false);
            }}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between gap-2 min-w-[180px]"
          >
            <span className="text-text">
              {selectedCategory || "All Categories"}
            </span>
            <svg
              className={`w-5 h-5 text-text transition-transform ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {isCategoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-background transition-colors ${
                    selectedCategory === "" ? "bg-background font-medium" : ""
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-background transition-colors ${
                      selectedCategory === category
                        ? "bg-background font-medium"
                        : ""
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tag Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsTagOpen(!isTagOpen);
              setIsCategoryOpen(false);
            }}
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-md bg-white hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between gap-2 min-w-[180px]"
          >
            <span className="text-text">{selectedTag || "All Tags"}</span>
            <svg
              className={`w-5 h-5 text-text transition-transform ${
                isTagOpen ? "rotate-180" : ""
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <AnimatePresence>
            {isTagOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
              >
                <button
                  onClick={() => {
                    setSelectedTag("");
                    setIsTagOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-background transition-colors ${
                    selectedTag === "" ? "bg-background font-medium" : ""
                  }`}
                >
                  All Tags
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      setIsTagOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-background transition-colors ${
                      selectedTag === tag ? "bg-background font-medium" : ""
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap items-center gap-2"
        >
          {selectedCategory && (
            <span className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="hover:text-gray-200"
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1 rounded-full text-sm">
              {selectedTag}
              <button
                onClick={() => setSelectedTag("")}
                className="hover:text-gray-200"
                aria-label="Remove tag filter"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-text hover:text-primary underline"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </div>
  );
}

