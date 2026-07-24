"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { Loader2, Users, Send, Check, Trash2, Globe, ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  whatsapp: string;
  email: string;
  dob?: string;
  address?: string;
  college?: string;
  degree?: string;
  motivation?: string;
  passId?: string;
  status?: string;
  registeredAt?: string;
}

export default function AdminQuranClubPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [vpsUrl, setVpsUrl] = useState("");
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [activeTab, setActiveTab] = useState<"members" | "broadcast" | "settings">("members");

  // Load VPS URL from localStorage on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem("quran_club_vps_url");
    if (savedUrl) {
      setVpsUrl(savedUrl);
    }
  }, []);

  // Fetch registered members from Firestore
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "quran_club_registrations"), orderBy("registeredAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched: Member[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as Member);
      });
      setMembers(fetched);
    } catch (err) {
      console.error("Error fetching members:", err);
      toast.error("Failed to load registrations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Save VPS Url
  const handleSaveVpsUrl = (url: string) => {
    setVpsUrl(url);
    localStorage.setItem("quran_club_vps_url", url.trim());
    toast.success("VPS Endpoint URL saved locally.");
  };

  // Delete Member
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;
    try {
      await deleteDoc(doc(db, "quran_club_registrations", memberId));
      setMembers(members.filter((m) => m.id !== memberId));
      toast.success("Registration deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
  };

  // Approve and Trigger Welcome Card (via VPS WhatsApp)
  const handleApproveMember = async (member: Member) => {
    try {
      let passId = member.passId;
      if (!passId) {
        const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
        passId = `QC-26-${randomSuffix}`;
      }

      // Update Firestore Status
      const memberRef = doc(db, "quran_club_registrations", member.id);
      await updateDoc(memberRef, {
        status: "Approved",
        passId
      });

      toast.success(`${member.firstName} approved successfully!`);

      // Attempt VPS WhatsApp Welcome dispatch
      if (vpsUrl) {
        toast.loading("Sending membership card via WhatsApp VPS...", { id: "vps-send" });
        try {
          const res = await fetch(`${vpsUrl}/api/send-welcome-card`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: member.whatsapp,
              name: `${member.firstName} ${member.lastName}`,
              passId,
              degree: member.degree,
              college: member.college
            }),
          });
          if (res.ok) {
            toast.success("Membership card dispatched successfully!", { id: "vps-send" });
          } else {
            throw new Error();
          }
        } catch {
          toast.error("Approved locally, but VPS WhatsApp server was unreachable.", { id: "vps-send" });
        }
      }

      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve member.");
    }
  };

  // Broadcast Message to all members
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) {
      toast.error("Please type a message to broadcast.");
      return;
    }
    if (!vpsUrl) {
      toast.error("Please configure your WhatsApp VPS URL in settings first.");
      return;
    }

    setBroadcasting(true);
    toast.loading("Initiating WhatsApp broadcast...", { id: "broadcast" });

    try {
      const activeMembers = members.filter(m => m.whatsapp);
      let successCount = 0;

      for (const member of activeMembers) {
        try {
          const res = await fetch(`${vpsUrl}/api/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: member.whatsapp,
              message: broadcastMsg.replace("{name}", member.firstName)
            })
          });
          if (res.ok) successCount++;
        } catch (err) {
          console.error(`Failed to send to ${member.whatsapp}`, err);
        }
      }

      toast.success(`Broadcast finished! Sent to ${successCount}/${activeMembers.length} members.`, { id: "broadcast" });
      setBroadcastMsg("");
    } catch (err) {
      console.error(err);
      toast.error("Broadcast failed.", { id: "broadcast" });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-32 pb-20 font-sans text-slate-800">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Title */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="text-[10px] font-black text-[#A81829] tracking-[0.25em] uppercase block mb-1">
              Jamiat Quran Club
            </span>
            <h1 className="text-4xl font-black text-[#123962] tracking-tight">
              Quran Club Command Center
            </h1>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === "members" ? "bg-white text-[#123962] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("broadcast")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === "broadcast" ? "bg-white text-[#123962] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Broadcast
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition ${
                activeTab === "settings" ? "bg-white text-[#123962] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              VPS Config
            </button>
          </div>
        </div>

        {/* Tab 1: Members List */}
        {activeTab === "members" && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-8 h-8 text-[#A81829] animate-spin" />
                <span className="text-sm font-semibold text-slate-500">Loading registrations...</span>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold">No registered members found</p>
                <p className="text-xs mt-1">Registrations from the join form will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">WhatsApp / Email</th>
                      <th className="py-4 px-6">Major & College</th>
                      <th className="py-4 px-6">Date</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{member.firstName} {member.lastName}</div>
                          {member.passId && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-red-50 border border-red-100 text-[10px] font-mono font-bold text-red-600">
                              {member.passId}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800">{member.whatsapp}</div>
                          <div className="text-xs text-slate-400">{member.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-800">{member.degree}</div>
                          <div className="text-xs text-slate-400">{member.college}</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {member.registeredAt ? new Date(member.registeredAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            member.status === "Approved" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {member.status === "Approved" ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                          {member.status !== "Approved" && (
                            <button
                              onClick={() => handleApproveMember(member)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex-inline items-center gap-1 cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 transition cursor-pointer"
                            title="Delete Registration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Broadcast Terminal */}
        {activeTab === "broadcast" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl">
            <h3 className="text-xl font-bold text-[#123962] mb-2">WhatsApp Broadcaster</h3>
            <p className="text-slate-500 text-sm mb-6">
              Send weekly announcements or session tickets directly to all registered members via your VPS.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Broadcast Message
                </label>
                <textarea
                  rows={6}
                  required
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="e.g. Assalamu Alaikum {name}! Join us this Friday for Tafseer Circle..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition resize-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tip: Use <span className="font-mono text-red-500">{`{name}`}</span> to insert the member's first name dynamically.
                </span>
              </div>

              <button
                type="submit"
                disabled={broadcasting}
                className="px-6 py-3.5 rounded-xl bg-[#A81829] hover:bg-[#8B1425] text-white font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {broadcasting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    Broadcasting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    Dispatch Broadcast
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: VPS Configuration */}
        {activeTab === "settings" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl">
            <h3 className="text-xl font-bold text-[#123962] mb-2 flex items-center gap-1.5">
              <Globe className="w-5 h-5 text-slate-400" /> WhatsApp VPS Link
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Enter your self-hosted headless WhatsApp server URL (e.g. <code>http://your-vps-ip:8080</code>). This settings is stored securely in your browser's localStorage.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  VPS Server Endpoint
                </label>
                <input
                  type="url"
                  value={vpsUrl}
                  onChange={(e) => handleSaveVpsUrl(e.target.value)}
                  placeholder="http://123.45.67.89:8080"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm outline-none focus:border-[#A81829] focus:bg-white transition"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider block">Endpoints Required on VPS:</span>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-500">
                  <li>POST /api/send-welcome-card (Sends name, Pass ID, and card image)</li>
                  <li>POST /api/send-message (Sends broadcast text messages)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
