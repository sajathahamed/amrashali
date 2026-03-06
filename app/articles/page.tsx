import { getAllArticles, getCategories, getTags } from "@/lib/data";
import ArticlesClient from "./ArticlesClient";

export const revalidate = 60;

export default async function ArticlesPage() {
  const [articles, categories, tags] = await Promise.all([
    getAllArticles(),
    getCategories(),
    getTags(),
  ]);

  return (
    <ArticlesClient
      articles={articles}
      categories={categories}
      tags={tags}
    />
  );
}
