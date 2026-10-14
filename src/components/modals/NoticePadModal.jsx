import { useState } from 'react'
import { Printer, Download, X, FileText, CheckCircle2, ShieldCheck, ExternalLink, Calendar, Hash, Building2 } from 'lucide-react'

export default function NoticePadModal({ notice, padConfig, lang = 'bn', onClose }) {
  if (!notice) return null

  const isBn = lang === 'bn'
  const pad = padConfig || {}

  const handlePrint = () => {
    window.print()
  }

  // Display fields prioritizing selected language, falling back gracefully
  const schoolTitle = isBn ? (pad.schoolNameBn || pad.schoolName || 'মিরাশানী পলিটেকনিক একাডেমি') : (pad.schoolName || 'Mirashani Polytechnic Academy')
  const subTitle = isBn ? (pad.subHeaderBn || pad.subHeader || 'একটি আদর্শ ও ঐতিহ্যবাহী বিদ্যাপীঠ') : (pad.subHeader || 'An Exemplary Institution of Excellence & Character')
  const address = isBn ? (pad.addressBn || pad.address || 'মিরাশানী, মাধবপুর, হবিগঞ্জ, বাংলাদেশ') : (pad.address || 'Mirashani, Madhavpur, Habiganj, Bangladesh')
  const phone = pad.phone || '+880 1712-345678'
  const email = pad.email || 'info@mirashaniacademy.edu.bd'
  const website = pad.website || 'www.mirashaniacademy.edu.bd'
  const eiin = pad.eiin || '129485'
  const estd = pad.estd || '1998'
  const schoolCode = pad.schoolCode || '4521'
  const logoText = pad.logoText || 'MPA'
  const logoUrl = pad.logoUrl || ''
  const watermarkText = pad.watermarkText || (isBn ? 'মিরাশানী একাডেমি' : 'MIRASHANI ACADEMY')

  const signatoryTitle = isBn ? (pad.signatoryTitleBn || pad.signatoryTitle || 'প্রধান শিক্ষক') : (pad.signatoryTitle || 'Headmaster / Principal')
  const signatoryName = isBn ? (pad.signatoryNameBn || pad.signatoryName || 'মোঃ রফিকুল ইসলাম') : (pad.signatoryName || 'Md. Rafiqul Islam')

  const noticeTitle = isBn ? (notice.titleBn || notice.title) : (notice.title || notice.titleBn)
  const noticeText = isBn ? (notice.textBn || notice.text) : (notice.text || notice.textBn)
  const noticeCategory = isBn ? (notice.catBn || notice.cat) : (notice.cat || notice.catBn)
  const noticeAuthor = isBn ? (notice.authorBn || notice.author) : (notice.author || notice.authorBn)
  const noticeDate = isBn ? (notice.dateBn || notice.date) : (notice.date || notice.dateBn)
  const memoNo = notice.memoNo || `MPA/NOTICE/${new Date().getFullYear()}/${notice.id || '001'}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 bg-slate-900 border border-slate-700/80 flex flex-col max-h-[92vh]"
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-800/95 border-b border-slate-700 print:hidden shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate">
                {isBn ? 'অফিসিয়াল নোটিশ প্যাড ও প্রিন্ট ভিউ' : 'Official Notice Letterhead & Print View'}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {isBn ? 'ব্রাউজার থেকে সরাসরি সেভ/ডাউনলোড করুন (Ctrl + P / Save as PDF)' : 'Directly Print or Save as PDF via browser dialog'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isBn ? 'প্রিন্ট / PDF ডাউনলোড' : 'Print / Download PDF'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Scroll Container */}
        <div className="overflow-y-auto p-3 sm:p-6 bg-slate-950/40 flex justify-center">
          {/* A4 Letterhead Canvas */}
          <div 
            id="printable-notice-pad"
            className="w-full max-w-[800px] bg-white text-slate-800 shadow-2xl p-6 sm:p-12 relative overflow-hidden rounded-xl border-4 sm:border-8 border-indigo-950/20 print:border-none print:shadow-none print:m-0 print:p-8 print:w-full print:max-w-none"
            style={{ minHeight: '1050px', background: '#ffffff', color: '#1e293b' }}
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.035] transform -rotate-25">
              <span className="font-extrabold text-5xl sm:text-7xl uppercase text-slate-900 tracking-widest text-center px-4 leading-tight">
                {watermarkText}
              </span>
            </div>

            {/* Inner Border Frame for Official Look */}
            <div className="relative z-10 border-2 border-indigo-900/30 p-6 sm:p-8 rounded-lg min-h-[960px] flex flex-col justify-between">
              <div>
                {/* 1. Official School Letterhead Header */}
                <div className="border-b-2 border-indigo-950 pb-5 text-center relative">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
                    {/* School Monogram / Logo */}
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt={schoolTitle} 
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-indigo-900 shadow-sm" 
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-950 text-amber-400 flex flex-col items-center justify-center font-black text-2xl border-2 border-amber-400 shadow-md">
                        <span>{logoText}</span>
                        <span className="text-[9px] font-semibold text-white tracking-widest uppercase">ESTD {estd}</span>
                      </div>
                    )}

                    {/* School Identity */}
                    <div className="text-center sm:text-left">
                      <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 tracking-tight font-serif leading-tight">
                        {schoolTitle}
                      </h1>
                      <p className="text-xs sm:text-sm font-semibold text-indigo-800/90 mt-0.5">
                        {subTitle}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {address}
                      </p>
                    </div>
                  </div>

                  {/* Institutional Metadata strip */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200">
                    <span>{isBn ? 'ইআইআইএন (EIIN):' : 'EIIN:'} <strong className="text-indigo-950">{eiin}</strong></span>
                    <span>•</span>
                    <span>{isBn ? 'স্থাপিত:' : 'Estd:'} <strong className="text-indigo-950">{estd}</strong></span>
                    <span>•</span>
                    <span>{isBn ? 'স্কুল কোড:' : 'School Code:'} <strong className="text-indigo-950">{schoolCode}</strong></span>
                    <span>•</span>
                    <span>{isBn ? 'ফোন:' : 'Phone:'} <strong className="text-indigo-950">{phone}</strong></span>
                    <span>•</span>
                    <span>{isBn ? 'ইমেইল:' : 'Email:'} <strong className="text-indigo-950">{email}</strong></span>
                  </div>
                </div>

                {/* 2. Official Notice Title Banner */}
                <div className="mt-6 text-center">
                  <div className="inline-block px-8 py-1.5 bg-indigo-950 text-amber-300 font-extrabold text-sm sm:text-base rounded-md uppercase tracking-wider shadow-sm border border-amber-400/40">
                    {isBn ? 'অফিসিয়াল বিজ্ঞপ্তি / নোটিশ' : 'OFFICIAL CIRCULAR / NOTICE'}
                  </div>
                </div>

                {/* 3. Reference Memo No & Date Strip */}
                <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 mt-5 px-1 pb-3 border-b border-dashed border-slate-300 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-950 font-bold">{isBn ? 'স্মারক নং / Memo No:' : 'Memo No:'}</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-300 text-indigo-950 font-bold text-xs">
                      {memoNo}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-950 font-bold">{isBn ? 'প্রকাশের তারিখ:' : 'Date:'}</span>
                    <span className="font-semibold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 text-xs">
                      {noticeDate}
                    </span>
                  </div>
                </div>

                {/* 4. Category Tag & Urgency Badge */}
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-md">
                    <span>{isBn ? 'বিভাগ:' : 'Category:'}</span>
                    <strong className="text-indigo-950">{noticeCategory}</strong>
                  </span>
                  {notice.pinned && (
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-md">
                      <span>★</span>
                      <span>{isBn ? 'জরুরি বিজ্ঞপ্তি' : 'Urgent Notice'}</span>
                    </span>
                  )}
                </div>

                {/* 5. Notice Subject & Main Body */}
                <div className="mt-6 space-y-4">
                  <h2 className="text-lg sm:text-xl font-black text-indigo-950 font-serif leading-snug border-l-4 border-indigo-900 pl-3">
                    {noticeTitle}
                  </h2>

                  <div className="text-sm sm:text-base text-slate-800 leading-relaxed text-justify space-y-3 whitespace-pre-line pt-2">
                    <p>{noticeText}</p>
                  </div>

                  {/* General Instructions Box */}
                  <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <p className="font-bold text-indigo-950 mb-1">
                      {isBn ? 'বিশেষ নির্দেশনাবলী:' : 'Special Instructions:'}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>
                        {isBn 
                          ? 'উক্ত নোটিশের সকল নিয়মাবলী ও তারিখ যথাযথভাবে অনুসরণ করার জন্য সংশ্লিষ্ট সকলকে অনুরোধ করা হচ্ছে।'
                          : 'All concerned students and guardians are requested to strictly adhere to the guidelines and schedule.'}
                      </li>
                      <li>
                        {isBn
                          ? 'যেকোনো জিজ্ঞাসায় বিদ্যালয় চলাকালীন প্রধান কার্যালয়ে সরাসরি বা উল্লেখিত নম্বরে যোগাযোগ করুন।'
                          : 'For any query or assistance, please contact the administrative desk during office hours.'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 6. Signature & Seal Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-end justify-between px-2 sm:px-6">
                  {/* Left: Official Seal */}
                  <div className="flex flex-col items-center">
                    {pad.sealUrl ? (
                      <img src={pad.sealUrl} alt="Official Seal" className="w-20 h-20 object-contain mb-1" />
                    ) : (
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold p-1 text-center mb-1">
                        <span>OFFICIAL</span>
                        <span>SEAL</span>
                        <span className="text-[8px] text-slate-400">MPA</span>
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {isBn ? 'প্রাতিষ্ঠানিক সিল' : 'Official Seal'}
                    </span>
                  </div>

                  {/* Right: Author / Signatory */}
                  <div className="flex flex-col items-center text-center">
                    {pad.signatureUrl ? (
                      <img src={pad.signatureUrl} alt="Signature" className="h-12 object-contain mb-1" />
                    ) : (
                      <div className="h-10 font-serif italic text-indigo-900 font-bold text-lg flex items-end">
                        {signatoryName}
                      </div>
                    )}
                    <div className="w-44 border-t-2 border-slate-800 pt-1">
                      <p className="text-xs sm:text-sm font-bold text-indigo-950">{signatoryName}</p>
                      <p className="text-[11px] text-slate-600 font-medium">{signatoryTitle}</p>
                      <p className="text-[10px] text-slate-500">{schoolTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Verification Note */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 gap-1">
                  <span>{isBn ? 'এই নোটিশটি একটি অনুমোদিত প্রাতিষ্ঠানিক ডিজিটাল কপি।' : 'This circular is an authorized official institutional digital copy.'}</span>
                  <span className="font-mono">{website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            html, body {
              background: #ffffff !important;
              color: #1e293b !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #printable-notice-pad, #printable-notice-pad * {
              visibility: visible !important;
            }
            #printable-notice-pad {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 24px !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
              background: #ffffff !important;
              color: #1e293b !important;
              display: block !important;
            }
            @page {
              size: A4 portrait;
              margin: 12mm 10mm 12mm 10mm;
            }
          }
        ` }} />
      </div>
    </div>
  )
}
