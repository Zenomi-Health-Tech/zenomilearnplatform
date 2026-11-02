import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stories, storyBySlug } from "@/data/scenarios";
import StoryView from "./StoryView";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.video!.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = storyBySlug((await params).slug);
  return { title: s ? `${s.video!.title} | ZenomiLearn` : "ZenomiLearn" };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const s = storyBySlug((await params).slug);
  if (!s) notFound();
  return <StoryView n={s.n} />;
}
