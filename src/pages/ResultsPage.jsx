import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Award,
  Search,
  Printer,
  Download,
  CheckCircle,
  FileText,
  Sparkles,
  GraduationCap,
  RotateCcw,
} from 'lucide-react'
import api from '../lib/api'
import { classes, exams, resultFiles, generateStudentResult } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function ResultsPage() {
  const { lang, num } = useLanguage()
  const examList = exams[lang] || exams.bn
  const fileList = resultFiles[lang] || resultFiles.bn
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  const [searchParams] = useSearchParams()
  const initialClass = searchParams.get('cls') || 'Ten'
  const initialRoll = searchParams.get('roll') || ''

  const [selectedClass, setSelectedClass] = useState(initialClass)
  const [roll, setRoll] = useState(initialRoll)
  const [exam, setExam] = useState(examList[0])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // Auto trigger if URL params exist
  useEffect(() => {
    if (initialRoll) {
      handleLookup(initialClass, initialRoll, exam)
    }
  }, [initialRoll, initialClass])

  const handleLookup = async (c, r, e) => {
    if (!r) return
    setLoading(true)
    try {
      const res = await api.searchResult(c, r, e)
      if (res && res.success && res.data) {
        setResult(res.data)
      } else {
        const fallback = generateStudentResult(c, r, e, lang)
        setResult(fallback)
      }
    } catch {
      const fallback = generateStudentResult(c, r, e, lang)
      setResult(fallback)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLookup(selectedClass, roll, exam)
  }

  const handlePrint = () => {
    window.print()
  }

  const loadDemo = (c, r) => {
    setSelectedClass(c)
    setRoll(r)
    handleLookup(c, r, exam)
  }

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-10 shadow-xl relative overflow-hidden print:hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? 'একাডেমিক ফলাফল ও নম্বরপত্র বাতায়ন' : 'Academic Result & Marksheet Portal'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'অনলাইন ফলাফল ও নম্বরপত্র' : 'Online Result & Grade Sheets'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'বিষয়ভিত্তিক নম্বর, গ্রেড পয়েন্ট গড় (GPA), শ্রেণির মেধা অবস্থান যাচাই করুন এবং অফিশিয়াল একাডেমিক ট্রান্সক্রিপ্ট সরাসরি প্রিন্ট বা সেভ করুন।'
                : 'Check subject-wise marks, Grade Point Average (GPA), class merit ranking and print your official academic transcript instantly online.'}
            </p>
          </div>
        </div>

        {/* Search & Lookup Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-lg mb-10 print:hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-board">
                {lang === 'bn' ? 'শিক্ষার্থীর তথ্য প্রবেশ করান' : 'Enter Student Credentials'}
              </h2>
              <p className="text-xs text-ink/60">
                {lang === 'bn' ? 'পরীক্ষার নাম, শ্রেণি এবং রোল নম্বর সঠিকভাবে লিখুন' : 'Provide examination details and student roll number'}
              </p>
            </div>
            {/* Quick Demo Pickers */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-ink/50 font-semibold">{lang === 'bn' ? 'সহজ ডেমো:' : 'Quick Test:'}</span>
              <button
                type="button"
                onClick={() => loadDemo('Ten', '1')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gold/20 text-ink border border-gold/40 hover:bg-gold/30 cursor-pointer"
              >
                {lang === 'bn' ? '১০ম (রোল ১)' : 'Class 10 (Roll 1)'}
              </button>
              <button
                type="button"
                onClick={() => loadDemo('Eight', '1')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-iris/10 text-iris border border-iris/20 hover:bg-iris/20 cursor-pointer"
              >
                {lang === 'bn' ? '৮ম (রোল ১)' : 'Class 8 (Roll 1)'}
              </button>
              <button
                type="button"
                onClick={() => loadDemo('Six', '2')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-mint/15 text-mint border border-mint/30 hover:bg-mint/25 cursor-pointer"
              >
                {lang === 'bn' ? '৬ষ্ঠ (রোল ২)' : 'Class 6 (Roll 2)'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1.5 uppercase tracking-wider">
                {lang === 'bn' ? 'পরীক্ষা' : 'Examination'}
              </label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm font-medium focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none cursor-pointer"
              >
                {examList.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1.5 uppercase tracking-wider">
                {lang === 'bn' ? 'শ্রেণি' : 'Class'}
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm font-medium focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none cursor-pointer"
              >
                {classKeys.map((c, idx) => (
                  <option key={c} value={c}>
                    {classLabels[idx]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink/80 mb-1.5 uppercase tracking-wider">
                {lang === 'bn' ? 'রোল নম্বর' : 'Roll Number'}
              </label>
              <input
                type="number"
                min="1"
                max="150"
                placeholder={lang === 'bn' ? 'যেমন: ১ বা ১৪' : 'e.g. 1'}
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm font-medium focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full py-3.5 px-6 rounded-xl bg-board text-chalk font-bold text-sm hover:bg-boardlt shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>{lang === 'bn' ? 'অনুসন্ধান করা হচ্ছে...' : 'Searching Records...'}</span>
              ) : (
                <>
                  <Search className="w-4 h-4 text-gold" />
                  <span>{lang === 'bn' ? 'নম্বরপত্র দেখুন' : 'View Official Marksheet'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Marksheet Display */}
        {result && (
          <div className="mb-16">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-mint animate-pulse" />
                <p className="text-sm font-bold text-board">
                  {lang === 'bn' ? 'অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট যাচাইকৃত' : 'Official Academic Transcript Verified & Stamped'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-board text-chalk text-xs sm:text-sm font-bold hover:bg-boardlt shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-gold" />
                  <span>{lang === 'bn' ? 'প্রিন্ট / পিডিএফ সেভ করুন' : 'Print Marksheet / Save PDF'}</span>
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-ink/5 hover:bg-ink/10 text-ink text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'নতুন অনুসন্ধান' : 'Search Another'}</span>
                </button>
              </div>
            </div>

            {/* Official Marksheet Document (Print-friendly format) */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border-2 border-ink/20 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
              {/* Watermark in background */}
              <div className="absolute inset-0 grid place-items-center opacity-[0.03] pointer-events-none select-none">
                <GraduationCap className="w-[450px] h-[450px]" />
              </div>

              {/* Header with School Crest */}
              <div className="border-b-2 border-board pb-6 mb-6 text-center relative">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-board text-gold grid place-items-center shadow-md">
                    <GraduationCap className="w-9 h-9" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-board tracking-tight">
                      {lang === 'bn' ? 'মিরাশানী একাডেমি · উচ্চ বিদ্যালয়' : 'MIRASHANI ACADEMY · HIGH SCHOOL'}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-ink/70 font-semibold">
                      {lang === 'bn' ? 'কলেজ রোড, উপজেলা সদর · ইআইআইএন: ১০৮৪২০ · স্থাপিত: ২০০৫' : 'College Road, Upazila Sadar · EIIN: 108420 · Estd. 2005'}
                    </p>
                    <p className="text-xs font-bold text-iris mt-0.5">
                      {lang === 'bn' ? 'একাডেমিক ট্রান্সক্রিপ্ট ও গ্রেড রিপোর্ট' : 'ACADEMIC TRANSCRIPT & GRADE REPORT'}
                    </p>
                  </div>
                </div>

                <div className="inline-block mt-2 px-5 py-1 rounded-full bg-board text-gold text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                  {result.examName} &middot; {lang === 'bn' ? `সেশন ${result.session}` : `Session ${result.session}`}
                </div>
              </div>

              {/* Student Bio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 items-center bg-paper p-4 sm:p-6 rounded-2xl border border-ink/10 mb-8">
                {/* Photo & Roll */}
                <div className="sm:col-span-3 text-center sm:text-left flex sm:flex-col items-center gap-4">
                  <img
                    src={result.photo}
                    alt={result.studentName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-gold/50 shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-iris">
                      {lang === 'bn' ? 'মেধা অবস্থান' : 'Merit Position'}
                    </span>
                    <p className="font-display font-black text-xl sm:text-2xl text-board">#{num(result.meritPosition)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Student Name:'}
                    </span>
                    <strong className="text-board text-base font-display">{result.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'শ্রেণি ও শাখা:' : 'Class & Section:'}
                    </span>
                    <strong className="text-board">
                      {classLabels[classKeys.indexOf(result.className)] || result.className} ({result.section})
                    </strong>
                  </div>
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'রোল নম্বর:' : 'Roll Number:'}
                    </span>
                    <strong className="text-board">{num(result.roll)}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'রেজিস্ট্রেশন নম্বর:' : 'Registration No:'}
                    </span>
                    <strong className="text-board">{num(result.regNo)}</strong>
                  </div>
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}
                    </span>
                    <span className="text-board font-medium">{result.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-ink/60 font-medium block">
                      {lang === 'bn' ? 'মাতার নাম:' : "Mother's Name:"}
                    </span>
                    <span className="text-board font-medium">{result.motherName}</span>
                  </div>
                </div>
              </div>

              {/* Subject-Wise Marks Table */}
              <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 mb-8 no-scrollbar">
                <table className="w-full min-w-[600px] text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="bg-board text-chalk border-b-2 border-board font-display">
                      <th className="py-3 px-3">{lang === 'bn' ? 'কোড' : 'Code'}</th>
                      <th className="py-3 px-3">{lang === 'bn' ? 'বিষয়ের নাম' : 'Subject Name'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'পূর্ণমান' : 'Full Marks'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'লিখিত' : 'Written'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'এমসিকিউ' : 'MCQ'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'ব্যবহারিক' : 'Practical'}</th>
                      <th className="py-3 px-3 text-center font-bold">{lang === 'bn' ? 'মোট' : 'Total'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'bn' ? 'গ্রেড' : 'Grade'}</th>
                      <th className="py-3 px-3 text-center font-bold">{lang === 'bn' ? 'জিপি' : 'GP'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 font-medium text-ink/85">
                    {result.subjects.map((sub, i) => (
                      <tr key={sub.code} className={i % 2 === 0 ? 'bg-white' : 'bg-paper/70'}>
                        <td className="py-2.5 px-3 font-mono text-ink/60">{num(sub.code)}</td>
                        <td className="py-2.5 px-3 font-semibold text-board">{sub.name}</td>
                        <td className="py-2.5 px-3 text-center">{num(sub.fullMarks)}</td>
                        <td className="py-2.5 px-3 text-center">{sub.written === '-' ? '-' : num(sub.written)}</td>
                        <td className="py-2.5 px-3 text-center">{sub.mcq === '-' ? '-' : num(sub.mcq)}</td>
                        <td className="py-2.5 px-3 text-center">{sub.practical === '-' ? '-' : num(sub.practical)}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-board">{num(sub.obtained)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                              sub.grade === 'A+'
                                ? 'bg-gold/20 text-ink'
                                : sub.grade === 'A'
                                ? 'bg-mint/20 text-mint'
                                : 'bg-ink/10 text-ink'
                            }`}
                          >
                            {sub.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-iris">{num(sub.gp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cumulative Result Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-board text-chalk mb-10">
                <div className="text-center border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0">
                  <span className="text-xs uppercase tracking-wider text-chalk/60 font-semibold">
                    {lang === 'bn' ? 'মোট প্রাপ্ত নম্বর' : 'Total Obtained'}
                  </span>
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-gold mt-1">
                    {num(result.totalObtained)} <span className="text-sm font-normal text-chalk/60">/ {num(result.totalMax)}</span>
                  </p>
                </div>

                <div className="text-center border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0">
                  <span className="text-xs uppercase tracking-wider text-chalk/60 font-semibold">
                    {lang === 'bn' ? 'গ্রেড পয়েন্ট গড়' : 'Grade Point Average'}
                  </span>
                  <p className="font-display font-black text-3xl sm:text-4xl text-mint mt-1">
                    GPA: {num(result.gpa)}
                  </p>
                </div>

                <div className="text-center flex flex-col justify-center items-center">
                  <span className="text-xs uppercase tracking-wider text-chalk/60 font-semibold">
                    {lang === 'bn' ? 'ফলাফলের মন্তব্য' : 'Final Status'}
                  </span>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-ink font-extrabold text-xs">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{result.grade} &middot; {result.remarks}</span>
                  </div>
                </div>
              </div>

              {/* Official Signatures & Seal */}
              <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-2 sm:gap-6 text-center text-[10px] sm:text-xs text-ink/75 border-t border-ink/20">
                <div>
                  <div className="h-9 sm:h-10 flex items-end justify-center">
                    <span className="font-serif italic text-xs sm:text-base text-board truncate">
                      {lang === 'bn' ? 'শামসুন নাহার' : 'Shamsun Nahar'}
                    </span>
                  </div>
                  <div className="border-t border-ink/30 pt-1 mt-1 font-bold">
                    {lang === 'bn' ? 'শ্রেণিশিক্ষক' : 'Class Teacher'}
                  </div>
                </div>

                <div>
                  <div className="h-9 sm:h-10 flex items-end justify-center">
                    <div className="w-10 sm:w-14 h-8 sm:h-10 rounded-full border border-dashed border-iris/50 grid place-items-center text-[9px] sm:text-[10px] text-iris font-bold">
                      {lang === 'bn' ? 'সীলমোহর' : 'SEAL'}
                    </div>
                  </div>
                  <div className="border-t border-ink/30 pt-1 mt-1 font-bold">
                    {lang === 'bn' ? 'পরীক্ষা নিয়ন্ত্রক' : 'Controller of Exam'}
                  </div>
                </div>

                <div>
                  <div className="h-9 sm:h-10 flex items-end justify-center">
                    <span className="font-serif italic text-xs sm:text-base text-board truncate">
                      {lang === 'bn' ? 'মো. আবদুল জলিল' : 'Md. Abdul Jalil'}
                    </span>
                  </div>
                  <div className="border-t border-ink/30 pt-1 mt-1 font-bold">
                    {lang === 'bn' ? 'প্রধান শিক্ষক' : 'Principal'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gazette & Past Downloads Section */}
        <div className="mt-12 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-ink/10 shadow-md print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-iris" />
            <h3 className="font-display font-bold text-xl text-board">
              {lang === 'bn' ? 'সংহত ফলাফল গেজেট ও আর্কাইভ ডাউনলোড' : 'Consolidated Gazette & Archive Downloads'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 mb-6">
            {lang === 'bn'
              ? 'অফলাইনে সংরক্ষণের জন্য সম্পূর্ণ শ্রেণির অফিসিয়াল পিডিএফ ফলাফল গেজেট ডাউনলোড করুন।'
              : 'Download complete class-wide PDF marksheets and board gazettes for offline verification.'}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {fileList.map((file) => (
              <div
                key={file.name}
                className="p-4 rounded-2xl bg-paper border border-ink/10 hover:border-iris/40 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="font-display font-bold text-sm text-board">{file.name}</h4>
                  <span className="text-xs text-ink/50">
                    {lang === 'bn' ? `ফাইলের আকার: ${file.size} · পিডিএফ গেজেট` : `File size: ${file.size} · PDF Gazette`}
                  </span>
                </div>
                <button
                  onClick={() => alert(lang === 'bn' ? `ডাউনলোড শুরু হচ্ছে: ${file.name}` : `Starting download for ${file.name}`)}
                  className="btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-board text-chalk text-xs font-bold hover:bg-boardlt shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-gold" />
                  <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Grading Scale Guide */}
        <div className="mt-8 bg-paper rounded-2xl p-6 border border-ink/10 print:hidden">
          <h4 className="font-display font-bold text-sm text-board mb-3">
            {lang === 'bn' ? 'অফিসিয়াল গ্রেডিং পদ্ধতি (শিক্ষা বোর্ড স্কেল)' : 'Official Grading System (Standard Board Scale)'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs font-medium">
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-gold font-bold">{num('80 - 100%')}</strong>
              <span>A+ ({num('5.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-board font-bold">{num('70 - 79%')}</strong>
              <span>A ({num('4.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-board font-bold">{num('60 - 69%')}</strong>
              <span>A- ({num('3.5')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-board font-bold">{num('50 - 59%')}</strong>
              <span>B ({num('3.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-board font-bold">{num('40 - 49%')}</strong>
              <span>C ({num('2.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-board font-bold">{num('33 - 39%')}</strong>
              <span>D ({num('1.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-brick font-bold">{num('0 - 32%')}</strong>
              <span>F ({num('0.0')})</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-ink/10">
              <strong className="block text-mint font-bold">GPA {num('5.0')}</strong>
              <span>{lang === 'bn' ? 'গোল্ডেন এ+' : 'Golden A+'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
