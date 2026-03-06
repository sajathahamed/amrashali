"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { JournalFormData } from "@/types/journal";

interface JournalFormProps {
  initialData?: JournalFormData;
  onSubmit: (data: JournalFormData) => Promise<{ error?: string }>;
  isEdit?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function JournalForm({
  initialData,
  onSubmit,
  isEdit = false,
}: JournalFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");

  const [formData, setFormData] = useState<JournalFormData>(
    initialData || {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      thumbnail: "",
      hero_image: "",
      images: [],
      category: "",
      tags: [],
      location: "",
      reading_time: 5,
      published: false,
    }
  );

  const updateField = <K extends keyof JournalFormData>(
    field: K,
    value: JournalFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    updateField("title", value);
    if (!isEdit) {
      updateField("slug", slugify(value));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      updateField("tags", [...formData.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    updateField(
      "tags",
      formData.tags.filter((t) => t !== tagToRemove)
    );
  };

  const addImage = () => {
    const img = imageInput.trim();
    if (img && !formData.images.includes(img)) {
      updateField("images", [...formData.images, img]);
    }
    setImageInput("");
  };

  const removeImage = (imgToRemove: string) => {
    updateField(
      "images",
      formData.images.filter((i) => i !== imgToRemove)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.slug.trim()) {
      setError("Slug is required");
      setLoading(false);
      return;
    }

    const result = await onSubmit(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/journals");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Journal title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
              placeholder="journal-slug-here"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              placeholder="Short summary of the journal entry..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
              Content
            </label>
            <p className="text-xs text-text mb-2">
              Use ## for headings and ### for sub-headings. Separate paragraphs
              with blank lines.
            </p>
            <textarea
              value={formData.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y font-mono text-sm"
              placeholder="Write your journal content here..."
            />
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Publish Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Publish</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => updateField("published", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-text-light dark:text-text-dark">
                {formData.published ? "Published" : "Draft"}
              </span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Category</h3>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="e.g., Community Development"
            />
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Tags</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-background dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-text"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-400 hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Location</h3>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="e.g., Colombo, Sri Lanka"
            />
          </div>

          {/* Reading Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">
              Reading Time (min)
            </h3>
            <input
              type="number"
              min="1"
              value={formData.reading_time}
              onChange={(e) =>
                updateField("reading_time", parseInt(e.target.value) || 5)
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Hero Image */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Hero Image</h3>
            <input
              type="text"
              value={formData.hero_image}
              onChange={(e) => {
                updateField("hero_image", e.target.value);
                updateField("thumbnail", e.target.value);
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              placeholder="/ab-journal/folder/image.jpeg"
            />
          </div>

          {/* Gallery Images */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-primary mb-4">Gallery Images</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                placeholder="/ab-journal/folder/image.jpeg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background dark:bg-gray-700 px-3 py-2 rounded-lg"
                >
                  <span className="text-xs text-text truncate flex-1">
                    {img}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    className="text-red-400 hover:text-red-600 text-xs flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          {isEdit ? "Update Journal" : "Create Journal"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/journals")}
          className="px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-text hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
