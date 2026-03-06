import { getAllProjects } from "@/lib/data";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return <ProjectsClient projects={projects} />;
}
