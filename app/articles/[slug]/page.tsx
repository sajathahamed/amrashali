import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getAllArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import RecentArticles from "@/components/RecentArticles";
import ArticleGallery from "@/components/ArticleGallery";

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const [article, allArticles] = await Promise.all([
    getArticleBySlug(params.slug),
    getAllArticles(),
  ]);

  if (!article) {
    notFound();
  }

  // Parse content for sections
  const contentSections = (article.content || "").split(/\n\n/);

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
                {formatDate(article.date)} · {article.reading_time} min read
              </span>
              {article.author_name && (
                <>
                  <span>•</span>
                  <span>{article.author_name}</span>
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
          {article.hero_image && (
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-12">
              <Image
                src={article.hero_image}
                alt={article.title}
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
            <RecentArticles currentSlug={article.slug} articles={allArticles} />
          </div>
        </aside>
      </article>
    </div>
  );
}
