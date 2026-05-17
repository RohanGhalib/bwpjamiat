"use server";

import { revalidateTag } from "next/cache";
import { createArticle, updateArticle, deleteArticle } from "@/lib/db";
import { Article } from "@/lib/types";

export async function createArticleAction(data: Omit<Article, 'id'>) {
  const id = await createArticle(data);
  if (id) {
    revalidateTag("articles");
  }
  return id;
}

export async function updateArticleAction(id: string, data: Partial<Article>) {
  const success = await updateArticle(id, data);
  if (success) {
    revalidateTag("articles");
  }
  return success;
}

export async function deleteArticleAction(id: string) {
  const success = await deleteArticle(id);
  if (success) {
    revalidateTag("articles");
  }
  return success;
}
