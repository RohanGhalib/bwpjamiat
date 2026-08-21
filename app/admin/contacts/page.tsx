"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Users,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Download,
  Send,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  X,
  ExternalLink,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  SortAsc,
  CheckSquare,
  Square,
  SlidersHorizontal,
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { CentralContact, ContactSource, ContactStatus } from "@/lib/types";

export default function AdminContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<CentralContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "institution_asc">("newest");

  // Selection
  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());

  // Modals
  const [inspectContact, setInspectContact] = useState<CentralContact | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for Adding Manual Contact
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    institution: "",
    source: "manual" as ContactSource,
    sourceEventTitle: "",
    status: "active" as ContactStatus,
    tagsString: "manual",
    customFieldKey: "",
    customFieldValue: "",
  });
  const [newCustomFields, setNewCustomFields] = useState<Record<string, string>>({});

  // Fetch Contacts from Admin API
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (res.ok && data.contacts) {
        setContacts(data.contacts);
      } else {
        toast.error(data.error || "Failed to load contacts.");
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      toast.error("Network error while loading contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        if (!ignore) {
          if (res.ok && data.contacts) {
            setContacts(data.contacts);
          } else {
            toast.error(data.error || "Failed to load contacts.");
          }
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        if (!ignore) toast.error("Network error while loading contacts.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // One-Click Historical Data Sync
  const handleSyncHistorical = async () => {
    if (!confirm("This will scan all previous Volunteer, Quran Club, and Summer School registrations and import any un-synced leads into this Central Contacts table. Continue?")) {
      return;
    }

    setSyncing(true);
    const toastId = toast.loading("Syncing all historical records into Contacts CRM...");

    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync_historical" }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          `Sync successful! ${data.stats.synced} total contacts synced (Volunteers: ${data.stats.sources.volunteers}, Quran Club: ${data.stats.sources.quranClub}, Summer School: ${data.stats.sources.summerSchool})`,
          { id: toastId, duration: 6000 }
        );
        fetchContacts();
      } else {
        toast.error(data.error || "Sync failed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to run sync.", { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  // Delete Contact
  const handleDeleteContact = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from Contacts?`)) return;

    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        if (inspectContact?.id === id) setInspectContact(null);
        setSelectedContactIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success(`Deleted ${name}`);
      } else {
        toast.error("Failed to delete contact.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting contact.");
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedContactIds.size === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedContactIds.size} selected contact(s)?`)) return;

    const toastId = toast.loading(`Deleting ${selectedContactIds.size} contacts...`);
    try {
      let count = 0;
      for (const id of Array.from(selectedContactIds)) {
        const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
        if (res.ok) count++;
      }
      setContacts((prev) => prev.filter((c) => !selectedContactIds.has(c.id)));
      setSelectedContactIds(new Set());
      toast.success(`Successfully deleted ${count} contacts.`, { id: toastId });
    } catch {
      toast.error("Error during bulk deletion.", { id: toastId });
    }
  };

  // Create Manual Contact
  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) {
      toast.error("Name and Phone number are required.");
      return;
    }

    const toastId = toast.loading("Saving contact...");
    try {
      const tags = newContact.tagsString
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newContact.name,
          phone: newContact.phone,
          email: newContact.email,
          city: newContact.city,
          institution: newContact.institution,
          source: newContact.source,
          sourceEventTitle: newContact.sourceEventTitle,
          status: newContact.status,
          tags,
          customFields: newCustomFields,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Contact saved successfully!", { id: toastId });
        setShowAddModal(false);
        setNewContact({
          name: "",
          phone: "",
          email: "",
          city: "",
          institution: "",
          source: "manual",
          sourceEventTitle: "",
          status: "active",
          tagsString: "manual",
          customFieldKey: "",
          customFieldValue: "",
        });
        setNewCustomFields({});
        fetchContacts();
      } else {
        toast.error(data.error || "Failed to create contact.", { id: toastId });
      }
    } catch {
      toast.error("Error creating contact.", { id: toastId });
    }
  };

  // Add Dynamic Field to New Contact Form
  const handleAddCustomField = () => {
    if (!newContact.customFieldKey.trim() || !newContact.customFieldValue.trim()) {
      toast.error("Please provide both a field name and value.");
      return;
    }
    setNewCustomFields((prev) => ({
      ...prev,
      [newContact.customFieldKey.trim()]: newContact.customFieldValue.trim(),
    }));
    setNewContact((prev) => ({ ...prev, customFieldKey: "", customFieldValue: "" }));
  };

  // Extract all unique tags across all contacts
  const allUniqueTags = useMemo(() => {
    const tagsSet = new Set<string>();
    contacts.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet).sort();
  }, [contacts]);

  // Filtered & Sorted Contacts
  const filteredContacts = useMemo(() => {
    let result = [...contacts];

    // Source Filter
    if (selectedSource !== "all") {
      result = result.filter((c) => c.source === selectedSource);
    }

    // Tag Filter
    if (selectedTag !== "all") {
      result = result.filter((c) => c.tags?.includes(selectedTag));
    }

    // Status Filter
    if (selectedStatus !== "all") {
      result = result.filter((c) => c.status === selectedStatus);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(q);
        const emailMatch = c.email?.toLowerCase().includes(q);
        const phoneMatch = c.phone?.toLowerCase().includes(q);
        const cityMatch = c.city?.toLowerCase().includes(q);
        const instMatch = c.institution?.toLowerCase().includes(q);
        const tagMatch = c.tags?.some((t) => t.toLowerCase().includes(q));
        const eventMatch = c.sourceEventTitle?.toLowerCase().includes(q);

        const customMatch = c.customFields
          ? Object.entries(c.customFields).some(([k, v]) =>
              k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
            )
          : false;

        return nameMatch || emailMatch || phoneMatch || cityMatch || instMatch || tagMatch || eventMatch || customMatch;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "newest" || sortBy === "oldest") {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return sortBy === "newest" ? timeB - timeA : timeA - timeB;
      }
      if (sortBy === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "institution_asc") {
        return (a.institution || "").localeCompare(b.institution || "");
      }
      return 0;
    });

    return result;
  }, [contacts, selectedSource, selectedTag, selectedStatus, searchQuery, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = contacts.length;
    const withEmail = contacts.filter((c) => c.email && c.email.includes("@")).length;
    const quranClub = contacts.filter((c) => c.source === "quran_club").length;
    const volunteers = contacts.filter((c) => c.source === "volunteer").length;
    const summerSchool = contacts.filter((c) => c.source === "summer_school").length;
    return { total, withEmail, quranClub, volunteers, summerSchool };
  }, [contacts]);

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle Select All
  const handleToggleSelectAll = () => {
    if (selectedContactIds.size === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContactIds(new Set());
    } else {
      setSelectedContactIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredContacts.length === 0) {
      toast.error("No contacts available to export.");
      return;
    }

    const exportList =
      selectedContactIds.size > 0
        ? filteredContacts.filter((c) => selectedContactIds.has(c.id))
        : filteredContacts;

    // Collect all dynamic custom field keys across export list
    const customKeysSet = new Set<string>();
    exportList.forEach((c) => {
      if (c.customFields) {
        Object.keys(c.customFields).forEach((k) => customKeysSet.add(k));
      }
    });
    const customKeys = Array.from(customKeysSet);

    const headers = [
      "ID",
      "Full Name",
      "Phone Number",
      "Email",
      "City / Area",
      "Institute",
      "Source",
      "Event Title",
      "Status",
      "Tags",
      "Created At",
      ...customKeys.map((k) => `Custom: ${k}`),
    ];

    const rows = exportList.map((c) => [
      `"${c.id}"`,
      `"${(c.name || "").replace(/"/g, '""')}"`,
      `"${c.phone || ""}"`,
      `"${c.email || ""}"`,
      `"${(c.city || "").replace(/"/g, '""')}"`,
      `"${(c.institution || "").replace(/"/g, '""')}"`,
      `"${c.source || ""}"`,
      `"${(c.sourceEventTitle || "").replace(/"/g, '""')}"`,
      `"${c.status || ""}"`,
      `"${(c.tags || []).join(", ")}"`,
      `"${c.createdAt || ""}"`,
      ...customKeys.map((k) => {
        const val = c.customFields?.[k];
        return `"${(val !== undefined && val !== null ? String(val) : "").replace(/"/g, '""')}"`;
      }),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bwpjamiat_contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${exportList.length} contacts to CSV!`);
  };

  // Transfer Selected to Email Command Center
  const handleBroadcastSelected = () => {
    const targetContacts =
      selectedContactIds.size > 0
        ? contacts.filter((c) => selectedContactIds.has(c.id))
        : filteredContacts;

    const emails = targetContacts
      .map((c) => c.email?.trim())
      .filter((email): email is string => Boolean(email && email.includes("@")));

    if (emails.length === 0) {
      toast.error("None of the selected contacts have a valid email address.");
      return;
    }

    // Join emails with comma and navigate to email center
    const emailString = encodeURIComponent(emails.join(", "));
    router.push(`/admin/email?bcc=${emailString}`);
  };

  // Helper to format custom field keys nicely (e.g. whyJoin -> Why Join)
  const formatKeyName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  const getSourceBadgeStyle = (source: ContactSource) => {
    switch (source) {
      case "quran_club":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "volunteer":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "summer_school":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "event":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "contact_form":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-28 pb-20 font-sans text-slate-800 selection:bg-[#1C7F93] selection:text-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#1C7F93] hover:text-[#123962] uppercase tracking-widest transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-[#123962] tracking-tight">
                Central Contacts CRM
              </h1>
              <span className="text-xs font-black bg-[#1C7F93]/10 text-[#1C7F93] px-3.5 py-1.5 rounded-full border border-[#1C7F93]/20">
                {contacts.length} Leads
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Universal directory of all Quran Club leads, volunteers, summer school signups, and event attendees.
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncHistorical}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:border-[#1C7F93] hover:text-[#1C7F93] text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer disabled:opacity-50"
              title="Scan and import all past registrations from Quran Club, Volunteers, and Summer School"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-[#1C7F93]" : ""}`} />
              {syncing ? "Syncing..." : "Sync Past Registrations"}
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#123962] hover:bg-[#1C7F93] text-white text-xs font-black uppercase tracking-wider transition shadow-md shadow-[#123962]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-[#1C7F93]" /> Total Leads
            </div>
            <div className="text-2xl font-black text-[#123962]">{stats.total}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4 text-emerald-600" /> Verified Emails
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.withEmail}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-rose-600" /> Quran Club
            </div>
            <div className="text-2xl font-black text-rose-600">{stats.quranClub}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Tag className="w-4 h-4 text-cyan-600" /> Volunteers
            </div>
            <div className="text-2xl font-black text-cyan-600">{stats.volunteers}</div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-purple-600" /> Summer Camp
            </div>
            <div className="text-2xl font-black text-purple-600">{stats.summerSchool}</div>
          </div>
        </div>

        {/* Search, Filter & Bulk Actions Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(18,57,98,0.03)] border border-slate-100 mb-8 space-y-5">
          {/* Top Row: Search & Dropdowns */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across name, phone, email, university, city, custom answers..."
                className="w-full bg-[#FAFCFF] border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93] transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Tag Filter */}
              <div className="flex items-center gap-1.5 bg-[#FAFCFF] border border-slate-200 rounded-2xl px-3 py-2">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Tags ({allUniqueTags.length})</option>
                  {allUniqueTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-[#FAFCFF] border border-slate-200 rounded-2xl px-3 py-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="approved">Approved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-1.5 bg-[#FAFCFF] border border-slate-200 rounded-2xl px-3 py-2">
                <SortAsc className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name_asc" | "institution_asc")}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name (A to Z)</option>
                  <option value="institution_asc">Institution (A to Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row: Source Filter Pills & Bulk Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            {/* Category / Source Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: "all", label: "All Sources" },
                { id: "quran_club", label: "Quran Club" },
                { id: "volunteer", label: "Volunteers" },
                { id: "summer_school", label: "Summer Camp" },
                { id: "event", label: "Event Attendees" },
                { id: "contact_form", label: "Contact Form" },
                { id: "manual", label: "Manual" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSource(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedSource === item.id
                      ? "bg-[#123962] text-white shadow-sm"
                      : "bg-[#FAFCFF] text-slate-600 hover:bg-slate-100 border border-slate-200/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition cursor-pointer"
                title="Download spreadsheet of selected or filtered contacts"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV {selectedContactIds.size > 0 ? `(${selectedContactIds.size})` : ""}
              </button>

              <button
                onClick={handleBroadcastSelected}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C7F93] hover:bg-[#156677] text-white text-xs font-black uppercase tracking-wider transition shadow-sm cursor-pointer"
                title="Transfer email list directly into the Email Broadcaster"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast Email {selectedContactIds.size > 0 ? `(${selectedContactIds.size})` : ""}
              </button>

              {selectedContactIds.size > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black uppercase tracking-wider transition cursor-pointer"
                  title="Delete selected contacts"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete ({selectedContactIds.size})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Contacts Table Card */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-[#1C7F93] animate-spin mb-3" />
            <p className="text-slate-500 font-bold text-sm">Loading Contacts CRM...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 flex flex-col items-center">
            <Users className="w-12 h-12 text-slate-300 mb-4 opacity-70" />
            <h3 className="text-xl font-bold text-[#123962] mb-1">No Contacts Found</h3>
            <p className="text-slate-400 text-sm max-w-md">
              {searchQuery || selectedSource !== "all" || selectedTag !== "all"
                ? "No contacts match your active search or filter parameters. Try clearing filters."
                : "No contacts in the database yet. Click 'Sync Past Registrations' to backfill previous signups."}
            </p>
            {(searchQuery || selectedSource !== "all" || selectedTag !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSource("all");
                  setSelectedTag("all");
                  setSelectedStatus("all");
                }}
                className="mt-4 px-4 py-2 bg-[#1C7F93]/10 text-[#1C7F93] font-bold text-xs rounded-full hover:bg-[#1C7F93]/20 transition"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(18,57,98,0.03)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-[#FAFCFF] border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="py-4 px-5 w-12 text-center">
                      <button
                        onClick={handleToggleSelectAll}
                        className="text-slate-400 hover:text-[#1C7F93] transition cursor-pointer"
                      >
                        {selectedContactIds.size === filteredContacts.length && filteredContacts.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-[#1C7F93]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-4 px-6">Lead & Contact</th>
                    <th className="py-4 px-6">Source & Event</th>
                    <th className="py-4 px-6">Institution & City</th>
                    <th className="py-4 px-6">Tags</th>
                    <th className="py-4 px-6">Created</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredContacts.map((contact) => {
                    const isSelected = selectedContactIds.has(contact.id);
                    const cleanPhoneDigits = contact.phone ? contact.phone.replace(/\D/g, "") : "";

                    return (
                      <tr
                        key={contact.id}
                        className={`hover:bg-slate-50/80 transition group ${
                          isSelected ? "bg-[#1C7F93]/5" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 px-5 text-center align-top">
                          <button
                            onClick={() => handleToggleSelect(contact.id)}
                            className="text-slate-400 hover:text-[#1C7F93] transition cursor-pointer mt-1"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#1C7F93]" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Name & Contact */}
                        <td className="py-4 px-6 align-top">
                          <div className="font-extrabold text-[#123962] text-base mb-1 flex items-center gap-2">
                            {contact.name}
                            {contact.status === "approved" && (
                              <span title="Approved">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 text-xs">
                            {contact.phone && (
                              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                <Phone className="w-3 h-3 text-green-600 shrink-0" />
                                <span>{contact.phone}</span>
                                {cleanPhoneDigits && (
                                  <a
                                    href={`https://wa.me/${cleanPhoneDigits}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-700 p-0.5"
                                    title="Open WhatsApp Chat"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="hover:underline hover:text-[#1C7F93] truncate max-w-[220px]"
                                >
                                  {contact.email}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Source & Event Title */}
                        <td className="py-4 px-6 align-top">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${getSourceBadgeStyle(
                              contact.source
                            )}`}
                          >
                            {contact.source.replace("_", " ")}
                          </span>
                          {contact.sourceEventTitle && (
                            <div className="text-xs font-bold text-[#123962] mt-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#1C7F93]" />
                              {contact.sourceEventTitle}
                            </div>
                          )}
                        </td>

                        {/* Institution & City */}
                        <td className="py-4 px-6 align-top">
                          {contact.institution ? (
                            <div className="font-bold text-[#123962] text-xs flex items-center gap-1.5 mb-1">
                              <Building2 className="w-3 h-3 text-[#1C7F93] shrink-0" />
                              <span className="truncate max-w-[180px]">{contact.institution}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No institute</span>
                          )}
                          {contact.city && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{contact.city}</span>
                            </div>
                          )}
                        </td>

                        {/* Tags */}
                        <td className="py-4 px-6 align-top">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {contact.tags && contact.tags.length > 0 ? (
                              contact.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200"
                                >
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">No tags</span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-6 align-top text-xs text-slate-500">
                          <div className="font-bold text-slate-700">
                            {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {contact.createdAt
                              ? new Date(contact.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                              : ""}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectContact(contact)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1C7F93]/10 hover:bg-[#1C7F93] text-[#1C7F93] hover:text-white text-xs font-bold transition cursor-pointer"
                              title="View full profile and dynamic custom questions"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id, contact.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="bg-[#FAFCFF] px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <div>
                Showing <strong className="text-slate-700">{filteredContacts.length}</strong> of{" "}
                <strong className="text-slate-700">{contacts.length}</strong> total leads
              </div>
              {selectedContactIds.size > 0 && (
                <div className="text-[#1C7F93] font-bold">
                  {selectedContactIds.size} contact(s) selected
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Detail Inspector Modal */}
      {inspectContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 md:p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setInspectContact(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getSourceBadgeStyle(
                    inspectContact.source
                  )}`}
                >
                  {inspectContact.source.replace("_", " ")}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">
                  Status: {inspectContact.status}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#123962]">{inspectContact.name}</h2>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Registered:{" "}
                {inspectContact.createdAt ? new Date(inspectContact.createdAt).toLocaleString() : "N/A"}
              </div>
            </div>

            {/* Core Identity Grid */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Core Contact Info
                </h4>
                <div className="grid sm:grid-cols-2 gap-4 bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Phone / WhatsApp</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-extrabold text-[#123962]">{inspectContact.phone || "N/A"}</span>
                      {inspectContact.phone && (
                        <a
                          href={`https://wa.me/${inspectContact.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline text-xs font-bold inline-flex items-center gap-0.5"
                        >
                          Chat <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Email Address</span>
                    <span className="font-extrabold text-[#123962] mt-0.5 block">
                      {inspectContact.email || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">City / Area</span>
                    <span className="font-bold text-slate-700 mt-0.5 block">
                      {inspectContact.city || "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Institution / University</span>
                    <span className="font-bold text-[#123962] mt-0.5 block">
                      {inspectContact.institution || "N/A"}
                    </span>
                  </div>

                  {inspectContact.sourceEventTitle && (
                    <div className="sm:col-span-2">
                      <span className="text-xs text-slate-400 block font-medium">Associated Event</span>
                      <span className="font-extrabold text-[#1C7F93] mt-0.5 block">
                        {inspectContact.sourceEventTitle}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {inspectContact.tags && inspectContact.tags.length > 0 ? (
                    inspectContact.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-bold bg-[#1C7F93]/10 text-[#1C7F93] px-3 py-1 rounded-full border border-[#1C7F93]/20"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tags assigned.</span>
                  )}
                </div>
              </div>

              {/* Dynamic Custom Fields Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#1C7F93]" /> Dynamic Form Submissions ({Object.keys(inspectContact.customFields || {}).length})
                </h4>

                {inspectContact.customFields && Object.keys(inspectContact.customFields).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(inspectContact.customFields).map(([key, val]) => {
                      const isLongText = String(val).length > 60;
                      return (
                        <div
                          key={key}
                          className="bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-sm"
                        >
                          <span className="text-[10px] font-black text-[#1C7F93] uppercase tracking-widest block mb-1">
                            {formatKeyName(key)}
                          </span>
                          <p className={`text-slate-800 font-medium ${isLongText ? "leading-relaxed whitespace-pre-wrap" : "font-bold"}`}>
                            {val === true ? "Yes" : val === false ? "No" : String(val || "N/A")}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#FAFCFF] p-4 rounded-2xl border border-slate-100 text-xs text-slate-400 italic text-center">
                    No custom fields for this contact.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <button
                onClick={() => handleDeleteContact(inspectContact.id, inspectContact.name)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-full transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Contact
              </button>

              <div className="flex items-center gap-2">
                {inspectContact.email && (
                  <Link
                    href={`/admin/email?to=${encodeURIComponent(inspectContact.email)}`}
                    className="px-4 py-2 bg-[#1C7F93] hover:bg-[#156677] text-white font-bold text-xs rounded-full transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" /> Dispatch Email
                  </Link>
                )}
                <button
                  onClick={() => setInspectContact(null)}
                  className="px-6 py-2 bg-[#123962] text-white hover:bg-[#1C7F93] font-bold text-xs rounded-full transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 md:p-8 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-slate-100">
              <span className="text-[10px] font-black text-[#1C7F93] uppercase tracking-widest">
                New Record
              </span>
              <h2 className="text-2xl font-black text-[#123962] mt-1">Add Lead / Contact</h2>
            </div>

            <form onSubmit={handleAddContactSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Muhammad Ali"
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="0300 1234567"
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="ali@example.com"
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Area</label>
                  <input
                    type="text"
                    value={newContact.city}
                    onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                    placeholder="Bahawalpur"
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Institution / College</label>
                  <input
                    type="text"
                    value={newContact.institution}
                    onChange={(e) => setNewContact({ ...newContact, institution: e.target.value })}
                    placeholder="IUB, SE College, etc."
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Source Category</label>
                  <select
                    value={newContact.source}
                    onChange={(e) => setNewContact({ ...newContact, source: e.target.value as ContactSource })}
                    className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                  >
                    <option value="manual">Manual Entry</option>
                    <option value="quran_club">Quran Club</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="summer_school">Summer Camp</option>
                    <option value="event">Event Signups</option>
                    <option value="contact_form">Contact Form</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newContact.tagsString}
                  onChange={(e) => setNewContact({ ...newContact, tagsString: e.target.value })}
                  placeholder="e.g. quran-club, volunteer, 2026, approved"
                  className="w-full bg-[#FAFCFF] border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C7F93]/20 focus:border-[#1C7F93]"
                />
              </div>

              {/* Add Custom Key-Values */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Add Dynamic Custom Questions (Optional)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. degree)"
                    value={newContact.customFieldKey}
                    onChange={(e) => setNewContact({ ...newContact, customFieldKey: e.target.value })}
                    className="flex-1 bg-[#FAFCFF] border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. BSCS)"
                    value={newContact.customFieldValue}
                    onChange={(e) => setNewContact({ ...newContact, customFieldValue: e.target.value })}
                    className="flex-1 bg-[#FAFCFF] border border-slate-200 rounded-xl px-3 py-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomField}
                    className="px-3 py-2 bg-slate-100 hover:bg-[#1C7F93] hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {Object.keys(newCustomFields).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(newCustomFields).map(([k, v]) => (
                      <span
                        key={k}
                        className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200"
                      >
                        <strong>{k}:</strong> {v}
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...newCustomFields };
                            delete next[k];
                            setNewCustomFields(next);
                          }}
                          className="text-slate-400 hover:text-red-500 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#123962] hover:bg-[#1C7F93] text-white text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
