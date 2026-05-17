import type { Metadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';
import DynamicPageRenderer from '@/components/cms/DynamicPageRenderer';
import { getActiveRedirectByFromPath, getPublishedCmsPageByPath } from '@/lib/cms';
import { featureFlags } from '@/lib/feature-flags';
import { normalizeCmsPath } from '@/lib/url-management';
import { siteConfig } from '@/lib/site';

type DynamicPathPageProps = {
  params: Promise<{ slug?: string[] }>;
};

function slugSegmentsToPath(slug?: string[]) {
  if (!slug || slug.length === 0) return '/';
  return `/${slug.join('/')}`;
}

export async function generateMetadata({ params }: DynamicPathPageProps): Promise<Metadata> {
  if (!featureFlags.cmsRouting) return {};
  const { slug } = await params;
  const path = normalizeCmsPath(slugSegmentsToPath(slug));
  const page = await getPublishedCmsPageByPath(path);

  if (!page) return {};

  return {
    title: page.seo?.title || `${page.title} | ${siteConfig.name}`,
    description: page.seo?.description || page.contentText?.slice(0, 160) || siteConfig.defaultDescription,
  };
}

export default async function DynamicPathPage({ params }: DynamicPathPageProps) {
  if (!featureFlags.cmsRouting) {
    notFound();
  }

  const { slug } = await params;
  const path = normalizeCmsPath(slugSegmentsToPath(slug));

  if (featureFlags.cmsRedirects) {
    const redirectRule = await getActiveRedirectByFromPath(path);
    if (redirectRule?.toPath) {
      if (redirectRule.type === 'permanent') {
        permanentRedirect(redirectRule.toPath);
      }
      redirect(redirectRule.toPath);
    }
  }

  const page = await getPublishedCmsPageByPath(path);
  if (!page) {
    notFound();
  }

  return <DynamicPageRenderer page={page} />;
}

