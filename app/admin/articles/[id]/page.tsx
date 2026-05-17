import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/db";
import EditArticleForm from "../components/EditArticleForm";

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return <EditArticleForm article={article} id={id} />;
}
