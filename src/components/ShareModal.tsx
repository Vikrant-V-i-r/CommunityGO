import React, { useState } from "react";
import { motion } from "motion/react";
import { X, FileText, Download, Share2, Copy, Check, MessageCircle, Mail, Phone } from "lucide-react";
import { Issue } from "../lib/types";
import { CATEGORY_EMOJIS, AUTHORITY_CONTACTS } from "../lib/constants";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { format } from "date-fns";
import { getDB } from "../lib/local-db";

const DEPT_NAMES: Record<string, string> = {
  "BBMP": "Municipal Corp (BBMP)",
  "BTP": "Traffic Police",
  "BWSSB": "Water Board (BWSSB)",
  "BESCOM": "Electricity (BESCOM)",
  "FIRE": "Fire & Emergency",
  "POLICE": "City Police",
  "OTHER": "Other Authority",
};

export function ShareModal({ issue, onClose }: { issue: Issue; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  
  const authContact = AUTHORITY_CONTACTS.find(c => c.dept === issue.authorityDept) || AUTHORITY_CONTACTS[0];
  const deepLink = `${window.location.origin}/?issue=${issue.id}`;
  const deptName = DEPT_NAMES[issue.authorityDept] || "Authority";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const db = getDB();
      const reporter = db.users.find(u => u.id === issue.reporterId);
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("COMMUNITY GO: OFFICIAL REPORT", 14, 25);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      
      let yPos = 55;
      doc.text(`STATUS: ${issue.status}`, 14, yPos);
      doc.text(`SEVERITY: ${issue.severity}`, 100, yPos);
      
      yPos += 15;
      doc.text(`CATEGORY: ${issue.category.replace("_", " ")}`, 14, yPos);
      doc.text(`DEPT: ${deptName}`, 100, yPos);
      
      yPos += 20;
      doc.setFontSize(16);
      doc.text("TITLE:", 14, yPos);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(issue.title, 14, yPos + 8);
      
      yPos += 25;
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("DESCRIPTION:", 14, yPos);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const splitDesc = doc.splitTextToSize(issue.description, pageWidth - 28);
      doc.text(splitDesc, 14, yPos + 8);
      
      yPos += 15 + (splitDesc.length * 6);
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("LOCATION:", 14, yPos);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Coordinates: ${issue.lat.toFixed(6)}, ${issue.lng.toFixed(6)}`, 14, yPos + 8);
      doc.setTextColor(59, 130, 246);
      doc.textWithLink("View on Google Maps", 14, yPos + 16, { url: `https://maps.google.com/?q=${issue.lat},${issue.lng}` });
      
      yPos += 30;
      
      const qrDataUrl = await QRCode.toDataURL(deepLink, { margin: 1, width: 100 });
      doc.addImage(qrDataUrl, "PNG", pageWidth - 60, yPos - 15, 45, 45);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Scan to view live status on Community GO", pageWidth - 70, yPos + 35);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Reported on: ${format(issue.createdAt, "PPP p")}`, 14, 280);
      doc.text(`Reported by: ${reporter?.handle || "Citizen"}`, 14, 285);
      
      const dataUri = doc.output('datauristring');
      setPdfDataUrl(dataUri);
      setPdfReady(true);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfDataUrl) return;
    const a = document.createElement("a");
    a.href = pdfDataUrl;
    a.download = `CommunityGO_Report_${issue.id}.pdf`;
    a.click();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="w-full max-w-sm bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors">
            <X size={16} />
          </button>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
            <Share2 size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800">Share to Authorities</h2>
          <p className="text-xs text-slate-500 text-center mt-1 px-4">
            Send a polished report to the right department. Or share the live link.
          </p>
        </div>

        <div className="px-5 pb-6 space-y-4 overflow-y-auto max-h-[70vh]">
          
          {/* Issue Summary Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex gap-3 items-center shadow-sm">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
              <img src={issue.photoUrl} alt="Issue" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-800 truncate">{issue.title}</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {CATEGORY_EMOJIS[issue.category]} {issue.category.replace("_", " ")} · {issue.severity}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Routed to {deptName}</p>
            </div>
          </div>

          {/* PDF Generation */}
          <div className="space-y-2">
            {!pdfReady ? (
              <button
                onClick={generatePDF}
                disabled={generating}
                className="w-full py-3.5 bg-[#FF7A00] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors disabled:opacity-50 shadow-md shadow-orange-500/20"
              >
                <FileText size={18} />
                <span>{generating ? "GENERATING..." : "Generate PDF Report Card"}</span>
              </button>
            ) : (
              <button
                onClick={handleDownloadPDF}
                className="w-full py-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
            )}
          </div>

          {/* Link Copy */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2 pr-1 shadow-sm">
            <span className="text-xs text-slate-500 truncate flex-1 pl-2 font-medium select-all">{deepLink}</span>
            <button 
              onClick={handleCopyLink}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shrink-0 transition-colors shadow-sm"
            >
              {copied ? <Check size={16} className="text-[#00B873]" /> : <Copy size={16} />}
            </button>
          </div>

          {/* Direct Authority Contacts */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              ONE-TAP SEND TO {issue.authorityDept}
            </span>
            <div className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm">
              <h4 className="font-bold text-sm text-slate-800">{deptName} Control Room</h4>
              <p className="text-[10px] text-slate-500 mb-3">{authContact.phone} · {authContact.email}</p>
              
              <div className="grid grid-cols-3 gap-2">
                <a 
                  href={`https://wa.me/${authContact.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(`Reporting issue: ${deepLink}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <MessageCircle size={16} className="text-[#25D366]" />
                  <span className="text-[10px] font-bold text-[#25D366]">WhatsApp</span>
                </a>
                <a 
                  href={`mailto:${authContact.email}?subject=Community Report: ${issue.title}&body=View issue details here: ${deepLink}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Mail size={16} className="text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700">Email</span>
                </a>
                <a 
                  href={`tel:${authContact.phone}`}
                  className="flex flex-col items-center justify-center gap-1.5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Phone size={16} className="text-slate-700" />
                  <span className="text-[10px] font-bold text-slate-700">Call</span>
                </a>
              </div>
            </div>
            
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Check out this civic issue I reported: ${deepLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <MessageCircle size={14} />
              Share to WhatsApp (any contact)
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
