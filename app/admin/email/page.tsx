"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  ChevronLeft, 
  Info, 
  User, 
  AtSign, 
  Type, 
  Eye, 
  Code, 
  Mail,
  Plus,
  X,
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  Heading1,
  Heading2,
  Image as ImageIcon,
  MousePointer2,
  Layout,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmailSenderPage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Sender Details
  const [fromName, setFromName] = useState('BWP Jamiat');
  const [fromEmail, setFromEmail] = useState('info@bwpjamiat.org');
  
  // Recipient Details
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [html, setHtml] = useState('');
  
  // UI State
  const [isSending, setIsSending] = useState(false);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSenderConfig, setShowSenderConfig] = useState(false);

  const insertTag = (tag: string, closingTag?: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const selectedText = text.substring(start, end);
    
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    let newContent = '';
    if (closingTag) {
      newContent = `${tag}${selectedText}${closingTag}`;
    } else {
      newContent = tag;
    }
    
    setHtml(before + newContent + after);
    
    // Reset focus and selection
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + tag.length, start + tag.length + selectedText.length);
      }
    }, 0);
  };

  const insertBlock = (type: 'button' | 'card' | 'divider' | 'header' | 'footer') => {
    let blockHtml = '';
    switch (type) {
      case 'header':
        blockHtml = `<div style="background-color: #123962; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
  <h1 style="color: #ffffff; margin: 0; font-family: sans-serif; font-size: 24px;">Welcome to BWP Jamiat</h1>
</div>\n`;
        break;
      case 'button':
        blockHtml = `<div style="text-align: center; margin: 30px 0;">
  <a href="#" style="background-color: #1C7F93; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: sans-serif; display: inline-block;">Click Here</a>
</div>\n`;
        break;
      case 'card':
        blockHtml = `<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 20px 0;">
  <h3 style="margin-top: 0; color: #123962; font-family: sans-serif;">Important Announcement</h3>
  <p style="color: #64748b; font-family: sans-serif; line-height: 1.6;">Your message content goes here. You can add more details about your event or update.</p>
</div>\n`;
        break;
      case 'divider':
        blockHtml = `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />\n`;
        break;
      case 'footer':
        blockHtml = `<div style="text-align: center; padding: 30px 20px; color: #94a3b8; font-family: sans-serif; font-size: 12px;">
  <p>© 2026 BWP Jamiat. All rights reserved.</p>
  <p>Bahawalpur, Pakistan</p>
  <div style="margin-top: 10px;">
    <a href="#" style="color: #1C7F93; text-decoration: none;">Unsubscribe</a>
  </div>
</div>\n`;
        break;
    }
    setHtml(html + blockHtml);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} block added!`);
  };

  const handleSend = async () => {
    if (!to || !subject || !html) {
      toast.error('Please fill in To, Subject, and Body');
      return;
    }

    setIsSending(true);
    const toastId = toast.loading('Sending email...');

    try {
      const response = await fetch('/api/admin/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          to, 
          cc, 
          bcc, 
          subject, 
          html,
          fromName,
          fromEmail
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Email sent successfully!', { id: toastId });
      } else {
        toast.error(result.error || 'Failed to send email', { id: toastId });
      }
    } catch (error) {
      console.error('Send error:', error);
      toast.error('An error occurred while sending', { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] pt-24 pb-20 font-sans selection:bg-[#1C7F93] selection:text-white">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin"
              className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1C7F93] hover:border-[#1C7F93]/30 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h2 className="text-[10px] font-black text-[#1C7F93] tracking-[0.2em] uppercase mb-1">Communications</h2>
              <h1 className="text-3xl font-black text-[#123962] tracking-tight">Email Command Center</h1>
            </div>
          </div>
          <button 
            onClick={() => setShowSenderConfig(!showSenderConfig)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${showSenderConfig ? 'bg-[#1C7F93] text-white border-[#1C7F93]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#1C7F93]/30'}`}
          >
            <User size={14} />
            Identity: {fromName}
          </button>
        </div>

        {/* Sender Config (Accordion Style) */}
        {showSenderConfig && (
          <div className="mb-8 bg-white rounded-3xl border border-[#1C7F93]/20 p-6 shadow-xl shadow-[#1C7F93]/5 animate-in slide-in-from-top-4 duration-500">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-[#1C7F93] uppercase tracking-widest mb-2 block">Sender Display Name</label>
                <input 
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="BWP Jamiat"
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#1C7F93] uppercase tracking-widest mb-2 block">Sender Email Address</label>
                <input 
                  type="text"
                  value={fromEmail}
                  onChange={(e) => setFromEmail(e.target.value)}
                  placeholder="info@bwpjamiat.org"
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 px-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                />
                <p className="text-[9px] text-slate-400 mt-2 font-medium">MUST be a verified domain in Resend dashboard.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div className="space-y-8">
            {/* Main Form Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="p-8 lg:p-10">
                <div className="space-y-6">
                  {/* Recipient Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">To</label>
                      <div className="relative group">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1C7F93]" size={16} />
                        <input 
                          type="text"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                          placeholder="recipient@mail.com"
                          className="w-full bg-slate-50 border-0 rounded-2xl py-3.5 pl-10 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-end gap-3 pb-1">
                      {!showCc && <button onClick={() => setShowCc(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase transition-colors">Add CC</button>}
                      {!showBcc && <button onClick={() => setShowBcc(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase transition-colors">Add BCC</button>}
                    </div>
                  </div>

                  {(showCc || showBcc) && (
                    <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                      {showCc && (
                        <div className="relative">
                           <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CC</label>
                            <button onClick={() => { setShowCc(false); setCc(''); }} className="text-slate-300 hover:text-red-500"><X size={12} /></button>
                          </div>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1C7F93]" size={16} />
                            <input 
                              type="text"
                              value={cc}
                              onChange={(e) => setCc(e.target.value)}
                              className="w-full bg-slate-50 border-0 rounded-2xl py-3.5 pl-10 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                            />
                          </div>
                        </div>
                      )}
                      {showBcc && (
                        <div className="relative">
                           <div className="flex justify-between items-center mb-2 ml-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">BCC</label>
                            <button onClick={() => { setShowBcc(false); setBcc(''); }} className="text-slate-300 hover:text-red-500"><X size={12} /></button>
                          </div>
                          <div className="relative group">
                            <Eye className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1C7F93]" size={16} />
                            <input 
                              type="text"
                              value={bcc}
                              onChange={(e) => setBcc(e.target.value)}
                              className="w-full bg-slate-50 border-0 rounded-2xl py-3.5 pl-10 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">Subject</label>
                    <div className="relative group">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1C7F93]" size={16} />
                      <input 
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Weekly Newsletter..."
                        className="w-full bg-slate-50 border-0 rounded-2xl py-3.5 pl-10 pr-4 text-slate-700 font-medium focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* HTML Composer Area */}
                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      {/* Toolbar */}
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        <button onClick={() => insertTag('<b>', '</b>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="Bold"><Bold size={16} /></button>
                        <button onClick={() => insertTag('<i>', '</i>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="Italic"><Italic size={16} /></button>
                        <button onClick={() => insertTag('<a href="#">', '</a>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="Link"><LinkIcon size={16} /></button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button onClick={() => insertTag('<h1>', '</h1>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="H1"><Heading1 size={16} /></button>
                        <button onClick={() => insertTag('<h2>', '</h2>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="H2"><Heading2 size={16} /></button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="List"><List size={16} /></button>
                        <button onClick={() => insertTag('<img src="https://via.placeholder.com/600x300" style="width:100%; border-radius:12px;" />')} className="p-2 hover:bg-white hover:text-[#1C7F93] rounded-lg transition-all" title="Image"><ImageIcon size={16} /></button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPreviewMode(!previewMode)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${previewMode ? 'bg-[#1C7F93] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                          {previewMode ? <Code size={14} /> : <Eye size={14} />}
                          {previewMode ? 'Edit Mode' : 'Live Preview'}
                        </button>
                      </div>
                    </div>

                    <div className="relative min-h-[500px]">
                      {previewMode ? (
                        <div 
                          className="w-full min-h-[500px] bg-slate-50 rounded-[2rem] p-10 prose prose-slate max-w-none border border-slate-100 overflow-auto shadow-inner"
                          dangerouslySetInnerHTML={{ __html: html || '<div class="flex items-center justify-center h-full text-slate-300 italic"><p>Your masterpiece will appear here...</p></div>' }}
                        />
                      ) : (
                        <textarea 
                          ref={textareaRef}
                          value={html}
                          onChange={(e) => setHtml(e.target.value)}
                          placeholder="Type your content or use the builder on the right..."
                          className="w-full min-h-[500px] bg-slate-50 border-0 rounded-[2rem] p-8 text-slate-700 font-mono text-sm placeholder:text-slate-300 focus:ring-2 focus:ring-[#1C7F93]/20 transition-all outline-none resize-none shadow-inner"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50/50 px-10 py-8 border-t border-slate-100 flex items-center justify-between backdrop-blur-sm">
                <div className="hidden md:flex items-center gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                    <Sparkles size={14} className="text-[#1C7F93]" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider">Verified Delivery System Active</p>
                </div>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="bg-[#123962] hover:bg-[#1C7F93] disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-5 rounded-[1.5rem] font-black tracking-tight flex items-center gap-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-[#123962]/20"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                  {isSending ? 'Transmitting...' : 'Dispatch Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Builder Blocks */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-xl shadow-slate-200/20">
              <div className="flex items-center gap-2 mb-6">
                <Layout size={18} className="text-[#1C7F93]" />
                <h3 className="text-xs font-black text-[#123962] uppercase tracking-wider">Email Builder</h3>
              </div>
              
              <div className="space-y-3">
                <button 
                  onClick={() => insertBlock('header')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#1C7F93]/5 text-slate-600 hover:text-[#1C7F93] border border-transparent hover:border-[#1C7F93]/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm"><Heading1 size={14} /></div>
                  <span className="text-[11px] font-bold">Hero Header</span>
                </button>
                <button 
                  onClick={() => insertBlock('card')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#1C7F93]/5 text-slate-600 hover:text-[#1C7F93] border border-transparent hover:border-[#1C7F93]/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm"><MessageSquare size={14} /></div>
                  <span className="text-[11px] font-bold">Message Card</span>
                </button>
                <button 
                  onClick={() => insertBlock('button')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#1C7F93]/5 text-slate-600 hover:text-[#1C7F93] border border-transparent hover:border-[#1C7F93]/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm"><MousePointer2 size={14} /></div>
                  <span className="text-[11px] font-bold">Call to Action</span>
                </button>
                <button 
                  onClick={() => insertBlock('divider')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#1C7F93]/5 text-slate-600 hover:text-[#1C7F93] border border-transparent hover:border-[#1C7F93]/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm"><div className="w-4 h-0.5 bg-slate-400" /></div>
                  <span className="text-[11px] font-bold">Section Divider</span>
                </button>
                <button 
                  onClick={() => insertBlock('footer')}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#1C7F93]/5 text-slate-600 hover:text-[#1C7F93] border border-transparent hover:border-[#1C7F93]/20 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm"><Info size={14} /></div>
                  <span className="text-[11px] font-bold">Smart Footer</span>
                </button>
              </div>
            </div>

            <div className="bg-[#123962] rounded-[2rem] p-6 text-white shadow-xl shadow-[#123962]/10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Pro Tip</h4>
              <p className="text-[11px] font-medium leading-relaxed opacity-90">
                You can combine these blocks with your own custom HTML for maximum flexibility. Use the toolbar to style individual text selections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
