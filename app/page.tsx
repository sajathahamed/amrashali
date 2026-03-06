import { getFeaturedArticles, getFeaturedProjects } from "@/lib/data";
import Hero from "@/components/Hero";
import HeroMobile from "@/components/HeroMobile";
import FeaturedArticles from "@/components/FeaturedArticles";
import FeaturedProjects from "@/components/FeaturedProjects";

export const revalidate = 60;

export default async function Home() {
  const [featuredArticles, featuredProjects] = await Promise.all([
    getFeaturedArticles(),
    getFeaturedProjects(),
  ]);

  return (
    <div>
      {/* Mobile-first hero (visible on mobile/tablet) */}
      <div className="md:hidden">
        <HeroMobile />
      </div>
      {/* Desktop hero (visible on desktop) */}
      <div className="hidden md:block">
        <Hero />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <FeaturedArticles articles={featuredArticles} />
        <FeaturedProjects projects={featuredProjects} />
      </div>
    </div>
  );
}

