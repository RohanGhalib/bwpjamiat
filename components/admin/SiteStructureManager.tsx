"use client";

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';
import type { CmsPageRecord, NavLinkRecord, RedirectRecord } from '@/lib/cms-types';
import { normalizeCmsPath } from '@/lib/url-management';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type EndpointStatus = {
  available: boolean;
  reason?: string;
  normalizedPath: string;
  warnings?: string[];
} | null;

const emptyPageForm = {
  id: '',
  title: '',
  slug: '',
  type: 'custom' as CmsPageRecord['type'],
  status: 'draft' as CmsPageRecord['status'],
  isVisible: true,
  isPrintedRisk: true,
  contentText: '',
};

const emptyNavForm = {
  id: '',
  label: '',
  href: '',
  order: 0,
  visible: true,
  target: '_self' as NavLinkRecord['target'],
  location: 'header' as NavLinkRecord['location'],
};

const emptyRedirectForm = {
  id: '',
  fromPath: '',
  toPath: '',
  active: true,
  type: 'permanent' as RedirectRecord['type'],
  printedRiskWarning: true,
};

export default function SiteStructureManager() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<CmsPageRecord[]>([]);
  const [navLinks, setNavLinks] = useState<NavLinkRecord[]>([]);
  const [redirects, setRedirects] = useState<RedirectRecord[]>([]);

  const [pageForm, setPageForm] = useState(emptyPageForm);
  const [navForm, setNavForm] = useState(emptyNavForm);
  const [redirectForm, setRedirectForm] = useState(emptyRedirectForm);
  const [endpointStatus, setEndpointStatus] = useState<EndpointStatus>(null);
  const [createRedirectOnSlugChange, setCreateRedirectOnSlugChange] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const pagesQuery = query(collection(db, 'pages'), orderBy('updatedAt', 'desc'));
    const navQuery = query(collection(db, 'nav_links'), orderBy('order', 'asc'));
    const redirectsQuery = query(collection(db, 'redirects'), orderBy('updatedAt', 'desc'));

    const unsubPages = onSnapshot(pagesQuery, (snapshot) => {
      const data = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as CmsPageRecord));
      setPages(data.filter((item) => !item.deletedAt));
      setLoading(false);
    });
    const unsubNav = onSnapshot(navQuery, (snapshot) => {
      const data = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as NavLinkRecord));
      setNavLinks(data.filter((item) => !item.deletedAt));
    });
    const unsubRedirects = onSnapshot(redirectsQuery, (snapshot) => {
      const data = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() } as RedirectRecord));
      setRedirects(data.filter((item) => !item.deletedAt));
    });

    return () => {
      unsubPages();
      unsubNav();
      unsubRedirects();
    };
  }, []);

  const orderedPages = useMemo(
    () => [...pages].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')),
    [pages]
  );

  async function checkEndpoint(path: string, options?: { excludePageId?: string; excludeRedirectId?: string }) {
    if (!path.trim()) {
      setEndpointStatus(null);
      return null;
    }
    const response = await fetch('/api/admin/url/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        excludePageId: options?.excludePageId,
        excludeRedirectId: options?.excludeRedirectId,
      }),
    });
    const result = (await response.json()) as EndpointStatus;
    setEndpointStatus(result);
    return result;
  }

  async function savePage() {
    setBusy(true);
    const now = new Date().toISOString();
    try {
      const endpoint = await checkEndpoint(pageForm.slug, { excludePageId: pageForm.id || undefined });
      if (!endpoint?.available) {
        toast.error(endpoint?.reason || 'Please choose another endpoint.');
        return;
      }

      const payload: Omit<CmsPageRecord, 'id'> = {
        title: pageForm.title.trim(),
        slug: pageForm.slug.trim(),
        slugNormalized: endpoint.normalizedPath,
        type: pageForm.type,
        status: pageForm.status,
        isVisible: pageForm.isVisible,
        isPrintedRisk: pageForm.isPrintedRisk,
        contentText: pageForm.contentText,
        warning: pageForm.isPrintedRisk ? 'Printed/shared links may break if this URL changes.' : '',
        updatedAt: now,
        updatedBy: 'admin',
        createdAt: now,
      };

      if (pageForm.id) {
        const existing = pages.find((item) => item.id === pageForm.id);
        await updateDoc(doc(db, 'pages', pageForm.id), payload);

        if (
          createRedirectOnSlugChange
          && existing
          && existing.slugNormalized
          && existing.slugNormalized !== endpoint.normalizedPath
        ) {
          await addDoc(collection(db, 'redirects'), {
            fromPath: existing.slug,
            fromPathNormalized: existing.slugNormalized,
            toPath: endpoint.normalizedPath,
            type: 'permanent',
            active: true,
            warning: 'Auto-created due to CMS page slug change.',
            printedRiskWarning: true,
            createdAt: now,
            updatedAt: now,
            updatedBy: 'admin',
          });
          toast('Redirect added to preserve old printed/shared URL.');
        }
      } else {
        await addDoc(collection(db, 'pages'), payload);
      }

      toast.success('Page saved.');
      setPageForm(emptyPageForm);
      setEndpointStatus(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save page.');
    } finally {
      setBusy(false);
    }
  }

  async function archivePage(page: CmsPageRecord) {
    const shouldRedirect = confirm('This link may be printed somewhere and break. Create a redirect before archive?');
    const now = new Date().toISOString();
    setBusy(true);
    try {
      await updateDoc(doc(db, 'pages', page.id), {
        status: 'archived',
        isVisible: false,
        deletedAt: now,
        updatedAt: now,
        updatedBy: 'admin',
      });

      if (shouldRedirect) {
        const target = prompt('Redirect to path (example: /events):', '/events');
        if (target) {
          await addDoc(collection(db, 'redirects'), {
            fromPath: page.slug,
            fromPathNormalized: page.slugNormalized || normalizeCmsPath(page.slug),
            toPath: normalizeCmsPath(target),
            type: 'permanent',
            active: true,
            printedRiskWarning: true,
            warning: 'Created during archive flow to avoid broken printed/shared links.',
            createdAt: now,
            updatedAt: now,
            updatedBy: 'admin',
          });
        }
      }
      toast.success('Page archived.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to archive page.');
    } finally {
      setBusy(false);
    }
  }

  async function saveNavLink() {
    if (!navForm.label.trim() || !navForm.href.trim()) {
      toast.error('Label and href are required.');
      return;
    }
    const now = new Date().toISOString();
    setBusy(true);
    try {
      const payload: Omit<NavLinkRecord, 'id'> = {
        label: navForm.label.trim(),
        href: navForm.href.trim(),
        hrefNormalized: normalizeCmsPath(navForm.href),
        order: Number(navForm.order || 0),
        visible: navForm.visible,
        target: navForm.target,
        location: navForm.location,
        updatedAt: now,
        updatedBy: 'admin',
        createdAt: now,
      };

      if (navForm.id) {
        await updateDoc(doc(db, 'nav_links', navForm.id), payload);
      } else {
        await addDoc(collection(db, 'nav_links'), payload);
      }
      toast.success('Navigation link saved.');
      setNavForm(emptyNavForm);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save nav link.');
    } finally {
      setBusy(false);
    }
  }

  async function removeNavLink(link: NavLinkRecord) {
    const now = new Date().toISOString();
    setBusy(true);
    try {
      await updateDoc(doc(db, 'nav_links', link.id), {
        visible: false,
        deletedAt: now,
        updatedAt: now,
        updatedBy: 'admin',
      });
      toast.success('Nav link removed.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove nav link.');
    } finally {
      setBusy(false);
    }
  }

  async function saveRedirect() {
    if (!redirectForm.fromPath.trim() || !redirectForm.toPath.trim()) {
      toast.error('From and To paths are required.');
      return;
    }

    setBusy(true);
    const now = new Date().toISOString();
    try {
      const endpoint = await checkEndpoint(redirectForm.fromPath, { excludeRedirectId: redirectForm.id || undefined });
      if (!endpoint?.available) {
        toast.error(endpoint?.reason || 'Redirect source endpoint unavailable.');
        return;
      }

      const payload: Omit<RedirectRecord, 'id'> = {
        fromPath: redirectForm.fromPath.trim(),
        fromPathNormalized: endpoint.normalizedPath,
        toPath: normalizeCmsPath(redirectForm.toPath.trim()),
        type: redirectForm.type,
        active: redirectForm.active,
        printedRiskWarning: redirectForm.printedRiskWarning,
        warning: redirectForm.printedRiskWarning ? 'Changing old links can break printed/shared material.' : '',
        createdAt: now,
        updatedAt: now,
        updatedBy: 'admin',
      };

      if (redirectForm.id) {
        await updateDoc(doc(db, 'redirects', redirectForm.id), payload);
      } else {
        await addDoc(collection(db, 'redirects'), payload);
      }
      toast.success('Redirect saved.');
      setRedirectForm(emptyRedirectForm);
      setEndpointStatus(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save redirect.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <LoadingSpinner className="py-20" label="Loading CMS data..." />;
  }

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#123962] mb-3">CMS Pages</h3>
        <p className="text-sm text-slate-500 mb-5">Create endpoints, control visibility, and keep dedicated pages scalable.</p>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <input className="px-4 py-3 rounded-xl bg-slate-50" placeholder="Page title" value={pageForm.title} onChange={(e) => setPageForm((prev) => ({ ...prev, title: e.target.value }))} />
          <div className="flex gap-2">
            <input className="flex-1 px-4 py-3 rounded-xl bg-slate-50" placeholder="/new-page-url" value={pageForm.slug} onChange={(e) => setPageForm((prev) => ({ ...prev, slug: e.target.value }))} />
            <button className="px-4 py-3 rounded-xl bg-slate-100 text-xs font-bold" onClick={() => checkEndpoint(pageForm.slug, { excludePageId: pageForm.id || undefined })}>Check URL</button>
          </div>
          <select className="px-4 py-3 rounded-xl bg-slate-50" value={pageForm.type} onChange={(e) => setPageForm((prev) => ({ ...prev, type: e.target.value as CmsPageRecord['type'] }))}>
            <option value="custom">Custom</option>
            <option value="event_dedicated">Event Dedicated</option>
          </select>
          <select className="px-4 py-3 rounded-xl bg-slate-50" value={pageForm.status} onChange={(e) => setPageForm((prev) => ({ ...prev, status: e.target.value as CmsPageRecord['status'] }))}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <textarea className="w-full px-4 py-3 rounded-xl bg-slate-50 min-h-[90px] mb-3" placeholder="Page content text" value={pageForm.contentText} onChange={(e) => setPageForm((prev) => ({ ...prev, contentText: e.target.value }))} />
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={pageForm.isVisible} onChange={(e) => setPageForm((prev) => ({ ...prev, isVisible: e.target.checked }))} /> Visible</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={pageForm.isPrintedRisk} onChange={(e) => setPageForm((prev) => ({ ...prev, isPrintedRisk: e.target.checked }))} /> Printed-link risk warning</label>
          <label className="inline-flex items-center gap-2"><input type="checkbox" checked={createRedirectOnSlugChange} onChange={(e) => setCreateRedirectOnSlugChange(e.target.checked)} /> Auto redirect on slug change</label>
        </div>
        {endpointStatus ? (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${endpointStatus.available ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {endpointStatus.available ? `Available: ${endpointStatus.normalizedPath}` : endpointStatus.reason}
          </div>
        ) : null}
        <div className="flex gap-3">
          <button disabled={busy} onClick={savePage} className="px-6 py-3 rounded-xl bg-[#123962] text-white font-bold disabled:opacity-50">{pageForm.id ? 'Update Page' : 'Create Page'}</button>
          <button onClick={() => { setPageForm(emptyPageForm); setEndpointStatus(null); }} className="px-6 py-3 rounded-xl bg-slate-100 font-semibold">Reset</button>
        </div>

        <div className="mt-6 space-y-2">
          {orderedPages.map((page) => (
            <div key={page.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3">
              <div>
                <div className="font-bold text-[#123962]">{page.title} <span className="text-xs text-slate-500">({page.slugNormalized})</span></div>
                <div className="text-xs text-slate-500">status: {page.status} • {page.type}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPageForm({ id: page.id, title: page.title || '', slug: page.slug || '', type: page.type || 'custom', status: page.status || 'draft', isVisible: page.isVisible !== false, isPrintedRisk: page.isPrintedRisk !== false, contentText: page.contentText || '' })} className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-semibold">Edit</button>
                <button onClick={() => archivePage(page)} className="px-3 py-2 rounded-lg bg-amber-100 text-amber-700 text-sm font-semibold">Archive</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#123962] mb-3">Navbar / Link Management</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          <input className="px-4 py-3 rounded-xl bg-slate-50" placeholder="Label" value={navForm.label} onChange={(e) => setNavForm((prev) => ({ ...prev, label: e.target.value }))} />
          <input className="px-4 py-3 rounded-xl bg-slate-50" placeholder="/target-path" value={navForm.href} onChange={(e) => setNavForm((prev) => ({ ...prev, href: e.target.value }))} />
          <input className="px-4 py-3 rounded-xl bg-slate-50" type="number" placeholder="Order" value={navForm.order} onChange={(e) => setNavForm((prev) => ({ ...prev, order: Number(e.target.value || 0) }))} />
          <select className="px-4 py-3 rounded-xl bg-slate-50" value={navForm.location} onChange={(e) => setNavForm((prev) => ({ ...prev, location: e.target.value as NavLinkRecord['location'] }))}>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
            <option value="links_page">Links Page</option>
          </select>
          <select className="px-4 py-3 rounded-xl bg-slate-50" value={navForm.target} onChange={(e) => setNavForm((prev) => ({ ...prev, target: e.target.value as NavLinkRecord['target'] }))}>
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-3 rounded-xl bg-slate-50"><input type="checkbox" checked={navForm.visible} onChange={(e) => setNavForm((prev) => ({ ...prev, visible: e.target.checked }))} /> Visible</label>
        </div>
        <div className="flex gap-3 mb-4">
          <button disabled={busy} onClick={saveNavLink} className="px-6 py-3 rounded-xl bg-[#123962] text-white font-bold disabled:opacity-50">{navForm.id ? 'Update Link' : 'Add Link'}</button>
          <button onClick={() => setNavForm(emptyNavForm)} className="px-6 py-3 rounded-xl bg-slate-100 font-semibold">Reset</button>
        </div>
        <div className="space-y-2">
          {navLinks.map((link) => (
            <div key={link.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3">
              <div>
                <div className="font-bold text-[#123962]">{link.label} <span className="text-xs text-slate-500">{link.href}</span></div>
                <div className="text-xs text-slate-500">order: {link.order} • {link.location} • {link.visible ? 'visible' : 'hidden'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setNavForm({ id: link.id, label: link.label, href: link.href, order: link.order || 0, visible: link.visible !== false, target: link.target || '_self', location: link.location || 'header' })} className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-semibold">Edit</button>
                <button onClick={() => removeNavLink(link)} className="px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-semibold">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-[#123962] mb-3">Redirect Manager</h3>
        <p className="text-sm text-slate-500 mb-5">Add redirects when URLs are changed to avoid broken printed/shared links.</p>
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <input className="px-4 py-3 rounded-xl bg-slate-50" placeholder="/old-endpoint" value={redirectForm.fromPath} onChange={(e) => setRedirectForm((prev) => ({ ...prev, fromPath: e.target.value }))} />
          <input className="px-4 py-3 rounded-xl bg-slate-50" placeholder="/new-endpoint" value={redirectForm.toPath} onChange={(e) => setRedirectForm((prev) => ({ ...prev, toPath: e.target.value }))} />
          <select className="px-4 py-3 rounded-xl bg-slate-50" value={redirectForm.type} onChange={(e) => setRedirectForm((prev) => ({ ...prev, type: e.target.value as RedirectRecord['type'] }))}>
            <option value="permanent">Permanent (308)</option>
            <option value="temporary">Temporary (307)</option>
          </select>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={redirectForm.active} onChange={(e) => setRedirectForm((prev) => ({ ...prev, active: e.target.checked }))} /> Active</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" checked={redirectForm.printedRiskWarning} onChange={(e) => setRedirectForm((prev) => ({ ...prev, printedRiskWarning: e.target.checked }))} /> Printed-link warning</label>
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <button disabled={busy} onClick={saveRedirect} className="px-6 py-3 rounded-xl bg-[#123962] text-white font-bold disabled:opacity-50">{redirectForm.id ? 'Update Redirect' : 'Add Redirect'}</button>
          <button onClick={() => setRedirectForm(emptyRedirectForm)} className="px-6 py-3 rounded-xl bg-slate-100 font-semibold">Reset</button>
        </div>
        <div className="space-y-2">
          {redirects.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3">
              <div>
                <div className="font-bold text-[#123962]">{item.fromPathNormalized} → {item.toPath}</div>
                <div className="text-xs text-slate-500">{item.type} • {item.active ? 'active' : 'disabled'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setRedirectForm({ id: item.id, fromPath: item.fromPath, toPath: item.toPath, active: item.active !== false, type: item.type || 'permanent', printedRiskWarning: item.printedRiskWarning !== false })} className="px-3 py-2 rounded-lg bg-slate-100 text-sm font-semibold">Edit</button>
                <button onClick={async () => updateDoc(doc(db, 'redirects', item.id), { active: !item.active, updatedAt: new Date().toISOString(), updatedBy: 'admin' })} className="px-3 py-2 rounded-lg bg-amber-100 text-amber-700 text-sm font-semibold">{item.active ? 'Disable' : 'Enable'}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

