import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import ArticleGallery from "@/components/ArticleGallery";
import type { Journal } from "@/types/journal";

export const revalidate = 60;

async function getJournalBySlug(slug: string): Promise<Journal | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Journal;
}

async function getRecentJournals(currentSlug: string): Promise<Journal[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journals")
    .select("id, title, slug, hero_image, created_at, reading_time, category")
    .eq("published", true)
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error || !data) {
    return [];
  }

  return data as Journal[];
}

export default async function JournalDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const journal = await getJournalBySlug(params.slug);

  if (!journal) {
    notFound();
  }

  const recentJournals = await getRecentJournals(params.slug);

  // Parse content for sections
  const contentSections = (journal.content || "").split(/\n\n/);
  const journalImages = journal.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Header */}
          <header className="mb-8">
            {journal.category && (
              <div className="mb-4">
                <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                  {journal.category}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6">
              {journal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-text mb-6">
              <span>
                {formatDate(journal.created_at)} · {journal.reading_time} min
                read
              </span>
              {journal.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {journal.location}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {(journal.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="bg-background px-3 py-1 rounded-full text-sm text-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Hero Image */}
          {journal.hero_image && (
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
              <Image
                src={journal.hero_image}
                alt={journal.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            {contentSections.map((section, index) => {
              if (section.startsWith("## ")) {
                const text = section.replace("## ", "");
                return (
                  <h2
                    key={index}
                    className="text-3xl font-serif text-primary mt-12 mb-6"
                  >
                    {text}
                  </h2>
                );
              }
              if (section.startsWith("### ")) {
                const text = section.replace("### ", "");
                return (
                  <h3
                    key={index}
                    className="text-2xl font-serif text-primary mt-8 mb-4"
                  >
                    {text}
                  </h3>
                );
              }
              return (
                <p
                  key={index}
                  className="text-lg leading-relaxed mb-6 text-text-light"
                >
                  {section}
                </p>
              );
            })}
          </div>

          {/* Image Gallery */}
          {journalImages.length > 1 && (
            <ArticleGallery
              images={journalImages.slice(1)}
              articleTitle={journal.title}
            />
          )}

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <ShareButtons
              title={journal.title}
              url={`/ab-journal/${journal.slug}`}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            {/* Recent Journals Sidebar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-serif font-bold text-primary mb-6">
                Recent Journals
              </h3>
              {recentJournals.length === 0 ? (
                <p className="text-text text-sm">No other journals yet.</p>
              ) : (
                <div className="space-y-6">
                  {recentJournals.map((recent) => (
                    <a
                      key={recent.id}
                      href={`/ab-journal/${recent.slug}`}
                      className="flex gap-4 group"
                    >
                      {recent.hero_image && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recent.hero_image}
                            alt={recent.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors line-clamp-2">
                          {recent.title}
                        </h4>
                        <p className="text-xs text-text mt-1">
                          {formatDate(recent.created_at)}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </article>
    </div>
  );
}
