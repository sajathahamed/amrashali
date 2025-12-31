import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getAllArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import RecentArticles from "@/components/RecentArticles";
import ArticleGallery from "@/components/ArticleGallery";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Parse content for sections
  const contentSections = article.content.split(/\n\n/);
  const journalImages = article.images || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-text mb-6">
              <span>
                {formatDate(article.date)} · {article.readingTime} min read
              </span>
              {article.location && (
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
                    {article.location}
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
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
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {contentSections.map((section, index) => {
              // Regular content
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
              articleTitle={article.title}
            />
          )}

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <ShareButtons
              title={article.title}
              url={`/articles/${article.slug}`}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <RecentArticles currentSlug={article.slug} />
          </div>
        </aside>
      </article>
    </div>
  );
}
