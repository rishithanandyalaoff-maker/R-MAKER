import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LESSON_COMPONENTS } from "@/content/lessons";
import { LESSONS } from "@/lib/lessons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = LESSONS.find((item) => item.slug === slug);
  return { title: lesson?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: Props) {
  const { slug } = await params;
  const Lesson = LESSON_COMPONENTS[slug];
  if (!Lesson) notFound();
  return <Lesson />;
}
