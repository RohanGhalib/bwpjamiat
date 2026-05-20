export type CmsPageType = 'custom' | 'event_dedicated';
export type CmsPageStatus = 'draft' | 'published' | 'archived';
export type RedirectType = 'temporary' | 'permanent';
export type LinkTarget = '_self' | '_blank';
export type NavLinkLocation = 'header' | 'footer' | 'links_page';

export interface CmsSeo {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

export interface CmsPageRecord {
  id: string;
  title: string;
  slug: string;
  slugNormalized: string;
  type: CmsPageType;
  status: CmsPageStatus;
  isVisible: boolean;
  isPrintedRisk: boolean;
  eventRef?: string;
  contentHtml?: string;
  contentText?: string;
  warning?: string;
  seo?: CmsSeo;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface NavLinkRecord {
  id: string;
  label: string;
  href: string;
  hrefNormalized: string;
  order: number;
  visible: boolean;
  target: LinkTarget;
  location: NavLinkLocation;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface RedirectRecord {
  id: string;
  fromPath: string;
  fromPathNormalized: string;
  toPath: string;
  type: RedirectType;
  active: boolean;
  warning?: string;
  printedRiskWarning?: boolean;
  createdAt?: string;
  updatedAt?: string;
  updatedBy?: string;
  deletedAt?: string;
}

export interface SystemSettingsRecord {
  id: string;
  defaultNavLinks?: Array<{ label: string; href: string }>;
  reservedRoutes?: string[];
  printedLinkWarning?: string;
  updatedAt?: string;
}

