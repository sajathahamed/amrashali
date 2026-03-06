"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";

type ContentType = "journals" | "projects";

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail: string;
  hero_image: string;
  images: string[];
  category: string;
  tags: string[];
  location: string;
  reading_time: number;
  published: boolean;
  github_url: string;
  live_url: string;
  featured: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function EditContentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contentType, setContentType] = useState<ContentType>("journals");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState<FormData>({
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
    github_url: "",
    live_url: "",
    featured: false,
  });

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const storedUser = localStorage.getItem("admin_user");
      if (!storedUser) {
        router.push("/admin/login");
        return;
      }

      const type = (searchParams.get("type") as ContentType) || "journals";
      setContentType(type);

      const { data, error: dbError } = await supabase
        .from(type)
        .select("*")
        .eq("id", params.id)
        .single();

      if (dbError || !data) {
        router.push("/admin/journals");
        return;
      }

      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        content: data.content || "",
        excerpt: data.excerpt || "",
        thumbnail: data.thumbnail || "",
        hero_image: data.hero_image || "",
        images: data.images || [],
        category: data.category || "",
        tags: data.tags || [],
        location: data.location || "",
        reading_time: data.reading_time || 5,
        published: data.published || false,
        github_url: data.github_url || "",
        live_url: data.live_url || "",
        featured: data.featured || false,
      });

      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router, params.id, searchParams]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      updateField("tags", [...formData.tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    updateField("tags", formData.tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (!formData.title.trim()) {
      setError("Title is required");
      setSaving(false);
      return;
    }

    const updateData = contentType === "journals"
      ? {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          thumbnail: formData.thumbnail,
          hero_image: formData.hero_image,
          images: formData.images,
          category: formData.category,
          tags: formData.tags,
          location: formData.location,
          reading_time: formData.reading_time,
          published: formData.published,
        }
      : {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          thumbnail: formData.thumbnail,
          hero_image: formData.hero_image,
          images: formData.images,
          category: formData.category,
          tags: formData.tags,
          github_url: formData.github_url,
          live_url: formData.live_url,
          featured: formData.featured,
          reading_time: formData.reading_time,
          published: formData.published,
        };

    const { error: dbError } = await supabase
      .from(contentType)
      .update(updateData)
      .eq("id", params.id);

    if (dbError) {
      if (dbError.code === "23505") {
        setError("A item with this slug already exists.");
      } else {
        setError(dbError.message);
      }
      setSaving(false);
      return;
    }

    router.push("/admin/journals");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-2xl font-serif font-bold text-primary">
              ABJ Admin
            </Link>
            <span className="text-text">
              / <Link href="/admin/journals" className="hover:text-accent transition-colors">Content</Link> / Edit
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-serif font-bold text-primary mb-8">
          Edit {contentType === "journals" ? "Journal" : "Project"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Slug */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => updateField("excerpt", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-y font-mono text-sm"
                />
              </div>

              {/* Project-specific fields */}
              {contentType === "projects" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
                  <h3 className="font-semibold text-primary">Project Links</h3>
                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github_url}
                      onChange={(e) => updateField("github_url", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={formData.live_url}
                      onChange={(e) => updateField("live_url", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
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
                  <span className="text-text-light dark:text-text-dark">
                    {formData.published ? "Published" : "Draft"}
                  </span>
                </label>
                {contentType === "projects" && (
                  <label className="flex items-center gap-3 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => updateField("featured", e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-text-light dark:text-text-dark">Featured Project</span>
                  </label>
                )}
              </div>

              {/* Images */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-primary mb-4">Images</h3>
                <div className="space-y-6">
                  <ImageUpload
                    value={formData.thumbnail}
                    onChange={(url) => updateField("thumbnail", url)}
                    folder={contentType === "journals" ? "journals/thumbnails" : "projects/thumbnails"}
                    label="Thumbnail"
                  />
                  <ImageUpload
                    value={formData.hero_image}
                    onChange={(url) => updateField("hero_image", url)}
                    folder={contentType === "journals" ? "journals/hero" : "projects/hero"}
                    label="Hero Image"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-primary mb-4">Category</h3>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Add tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <MultiImageUpload
                  value={formData.images}
                  onChange={(urls) => updateField("images", urls)}
                  folder={contentType === "journals" ? "journals/gallery" : "projects/gallery"}
                  label="Gallery Images"
                  maxImages={10}
                />
              </div>

              {/* Journal Location */}
              {contentType === "journals" && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-primary mb-4">Location</h3>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
