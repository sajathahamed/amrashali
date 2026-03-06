import { getCVData } from "@/lib/data";
import AboutClient from "./AboutClient";

export const revalidate = 60;

export default async function AboutPage() {
  const cvData = await getCVData();
  return <AboutClient cvData={cvData} />;
}
