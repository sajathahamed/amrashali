"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Journal, Project } from "@/types/journal";

type ContentType = "journals" | "projects";

export default function AdminContentPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType>("journals");

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const storedUser = localStorage.getItem("admin_user");
      if (!storedUser) {
        router.push("/admin/login");
        return;
      }

      await fetchContent();
      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]);

  const fetchContent = async () => {
    const [journalsRes, projectsRes] = await Promise.all([
      supabase.from("journals").select("*").order("created_at", { ascending: false }),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
    ]);

    if (!journalsRes.error && journalsRes.data) {
      setJournals(journalsRes.data as Journal[]);
    }
    if (!projectsRes.error && projectsRes.data) {
      setProjects(projectsRes.data as Project[]);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean, type: ContentType) => {
    const table = type === "journals" ? "journals" : "projects";
    const { error } = await supabase
      .from(table)
      .update({ published: !currentStatus })
      .eq("id", id);

    if (!error) {
      if (type === "journals") {
        setJournals((prev) =>
          prev.map((j) => (j.id === id ? { ...j, published: !currentStatus } : j))
        );
      } else {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: !currentStatus } : p))
        );
      }
    }
  };

  const deleteItem = async (id: string, type: ContentType) => {
    if (!confirm(`Are you sure you want to delete this ${type === "journals" ? "journal" : "project"}?`)) return;

    setDeleting(id);
    const table = type === "journals" ? "journals" : "projects";
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (!error) {
      if (type === "journals") {
        setJournals((prev) => prev.filter((j) => j.id !== id));
      } else {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    }
    setDeleting(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const currentItems = activeTab === "journals" ? journals : projects;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-2xl font-serif font-bold text-primary">
              ABJ Admin
            </Link>
            <span className="text-text">/ Content</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("journals")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "journals"
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 text-text hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Journals ({journals.length})
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "projects"
                  ? "bg-primary text-white"
                  : "bg-white dark:bg-gray-800 text-text hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Projects ({projects.length})
            </button>
          </div>
          <Link
            href="/admin/journals/new"
            className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-dark transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New
          </Link>
        </div>

        {/* Content Table */}
        {currentItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
            <p className="text-xl text-text mb-4">
              No {activeTab} yet
            </p>
            <Link href="/admin/journals/new" className="text-accent hover:text-accent-dark font-medium">
              Create your first {activeTab === "journals" ? "journal" : "project"} →
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-light dark:text-text-dark">Title</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-light dark:text-text-dark hidden md:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-text-light dark:text-text-dark hidden lg:table-cell">Date</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-text-light dark:text-text-dark">Status</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-text-light dark:text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-primary text-sm line-clamp-1">{item.title}</p>
                          <p className="text-xs text-text mt-1 line-clamp-1">
                            /{activeTab === "journals" ? "ab-journal" : "projects"}/{item.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-text">{item.category || "—"}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-sm text-text">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePublished(item.id, item.published, activeTab)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            item.published
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200"
                          }`}
                        >
                          {item.published ? "Published" : "Draft"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${activeTab === "journals" ? "ab-journal" : "projects"}/${item.slug}`}
                            target="_blank"
                            className="p-2 text-text hover:text-primary transition-colors"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <Link
                            href={`/admin/journals/${item.id}/edit?type=${activeTab}`}
                            className="p-2 text-text hover:text-accent transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => deleteItem(item.id, activeTab)}
                            disabled={deleting === item.id}
                            className="p-2 text-text hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === item.id ? (
                              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
