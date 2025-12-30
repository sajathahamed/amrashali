import journalData from "@/data/journal.json";
import projectsData from "@/data/projects.json";
import servicesData from "@/data/services.json";

export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  heroImage: string;
  images?: string[];
  location?: string;
  readingTime: number;
  content: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  heroImage: string;
  featured: boolean;
  content: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export function getAllArticles(): Article[] {
  return journalData as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return (journalData as Article[]).find((article) => article.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return (journalData as Article[])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
}

export function getAllProjects(): Project[] {
  return projectsData as Project[];
}

export function getProjectBySlug(slug: string): Project | undefined {
  return (projectsData as Project[]).find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return (projectsData as Project[]).filter((project) => project.featured);
}

export function getAllServices(): Service[] {
  return servicesData as Service[];
}

export function getCategories(): string[] {
  const categories = new Set<string>();
  (journalData as Article[]).forEach((article) => {
    categories.add(article.category);
  });
  return Array.from(categories).sort();
}

export function getTags(): string[] {
  const tags = new Set<string>();
  (journalData as Article[]).forEach((article) => {
    article.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

