import { createServerSupabaseClient } from "@/lib/supabaseClient";
import type { Journal } from "@/types/journal";
import JournalListClient from "./JournalListClient";

export const revalidate = 60; // Revalidate every 60 seconds

async function getPublishedJournals(): Promise<Journal[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("journals")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching journals:", error);
    return [];
  }

  return (data as Journal[]) || [];
}

function getCategories(journals: Journal[]): string[] {
  const categories = new Set<string>();
  journals.forEach((j) => {
    if (j.category) categories.add(j.category);
  });
  return Array.from(categories).sort();
}

function getTags(journals: Journal[]): string[] {
  const tags = new Set<string>();
  journals.forEach((j) => {
    if (j.tags) j.tags.forEach((t) => tags.add(t));
  });
  return Array.from(tags).sort();
}

export default async function ABJournalPage() {
  const journals = await getPublishedJournals();
  const categories = getCategories(journals);
  const tags = getTags(journals);

  return (
    <JournalListClient
      journals={journals}
      categories={categories}
      tags={tags}
    />
  );
}
