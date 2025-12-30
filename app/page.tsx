import { getFeaturedArticles, getFeaturedProjects } from "@/lib/data";
import Hero from "@/components/Hero";
import FeaturedArticles from "@/components/FeaturedArticles";
import FeaturedProjects from "@/components/FeaturedProjects";

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const featuredProjects = getFeaturedProjects();

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <FeaturedArticles articles={featuredArticles} />
        <FeaturedProjects projects={featuredProjects} />
      </div>
    </div>
  );
}

