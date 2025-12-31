import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug, getAllProjects } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import ProjectGallery from "@/components/ProjectGallery";

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const contentSections = project.content.split(/\n\n/);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <article>
        {/* Header */}
        <header className="mb-12">
          <div className="mb-4">
            <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-medium">
              {project.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-text mb-6">
            <span>{formatDate(project.date)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
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
        <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden mb-12">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Excerpt */}
        <div className="prose max-w-none mb-12">
          <p className="text-xl leading-relaxed text-text-light italic border-l-4 border-accent pl-6">
            {project.excerpt}
          </p>
        </div>

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
        {project.images && project.images.length > 1 && (
          <ProjectGallery
            images={project.images.slice(1)}
            projectTitle={project.title}
          />
        )}

        {/* Share Buttons */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <ShareButtons
            title={project.title}
            url={`/projects/${project.slug}`}
          />
        </div>
      </article>
    </div>
  );
}

