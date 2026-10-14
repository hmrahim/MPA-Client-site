import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Calculator,
  IdCard,
  Calendar,
  Printer,
  RotateCcw,
  CheckCircle,
  GraduationCap,
  Award,
  Zap,
} from 'lucide-react'
import { classes } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function StudentPortalPage() {
  const { lang, num } = useLanguage()
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  const [activeTool, setActiveTool] = useState('gpa')

  /* ────────── GPA Calculator State ────────── */
  const initialSubjects = lang === 'bn' ? [
    { name: 'বাংলা (১ম ও ২য় পত্র)', gradePoint: 5.0 },
    { name: 'ইংরেজি (১ম ও ২য় পত্র)', gradePoint: 5.0 },
    { name: 'সাধারণ গণিত', gradePoint: 5.0 },
    { name: 'পদার্থবিজ্ঞান / সাধারণ বিজ্ঞান', gradePoint: 5.0 },
    { name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', gradePoint: 5.0 },
    { name: 'বাংলাদেশ ও বিশ্বপরিচয়', gradePoint: 5.0 },
    { name: 'ইসলাম ও নৈতিক শিক্ষা / ধর্ম', gradePoint: 5.0 },
  ] : [
    { name: 'Bangla (1st & 2nd Paper)', gradePoint: 5.0 },
    { name: 'English (1st & 2nd Paper)', gradePoint: 5.0 },
    { name: 'General Mathematics', gradePoint: 5.0 },
    { name: 'General Science / Physics', gradePoint: 5.0 },
    { name: 'ICT (Digital Literacy)', gradePoint: 5.0 },
    { name: 'Bangladesh & Global Studies', gradePoint: 5.0 },
    { name: 'Religion & Moral Education', gradePoint: 5.0 },
  ]

  const [subjects, setSubjects] = useState(initialSubjects)

  const handleGradeChange = (index, val) => {
    const next = [...subjects]
    next[index].gradePoint = parseFloat(val)
    setSubjects(next)
  }

  const totalPoints = subjects.reduce((sum, s) => sum + s.gradePoint, 0)
  const hasFailedSubject = subjects.some((s) => s.gradePoint === 0)
  const calculatedGpa = hasFailedSubject
    ? (lang === 'bn' ? '০.০০ (ফেল)' : '0.00 (Fail)')
    : (totalPoints / subjects.length).toFixed(2)

  /* ────────── Digital ID Card Generator State ────────── */
  const [idCardData, setIdCardData] = useState({
    name: lang === 'bn' ? 'আয়েশা সিদ্দিকা' : 'Ayesha Siddika',
    className: 'Ten',
    roll: '01',
    bloodGroup: 'O+',
    session: '2026-2027',
    contact: '+880 1711-XXXXXX',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  })

  /* ────────── Daily Routine Picker State ────────── */
  const [selectedRoutineClass, setSelectedRoutineClass] = useState('Ten')
  const [selectedDay, setSelectedDay] = useState('Sunday')

  const scheduleDays = lang === 'bn' ? [
    { id: 'Sunday', label: 'রবিবার' },
    { id: 'Monday', label: 'সোমবার' },
    { id: 'Tuesday', label: 'মঙ্গলবার' },
    { id: 'Wednesday', label: 'বুধবার' },
    { id: 'Thursday', label: 'বৃহস্পতিবার' },
  ] : [
    { id: 'Sunday', label: 'Sun' },
    { id: 'Monday', label: 'Mon' },
    { id: 'Tuesday', label: 'Tue' },
    { id: 'Wednesday', label: 'Wed' },
    { id: 'Thursday', label: 'Thu' },
  ]

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* My Portal CTA */}
        <Link
          to="/student-dashboard"
          className="print:hidden mb-6 flex items-center justify-between gap-4 rounded-2xl bg-board text-chalk p-4 sm:p-5 shadow-lg hover:shadow-xl transition group"
        >
          <span className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gold text-ink flex items-center justify-center"><GraduationCap className="w-5 h-5" /></span>
            <span>
              <span className="block font-display font-extrabold text-base">Open My Student Dashboard</span>
              <span className="block text-xs text-chalk/70">Exam results, tuition fees, pending dues, class routine and attendance</span>
            </span>
          </span>
          <span className="text-gold font-bold text-sm group-hover:translate-x-1 transition">Sign in →</span>
        </Link>

        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-10 shadow-xl relative overflow-hidden print:hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" style={{ animationDuration: '6s' }} />
              <span>{lang === 'bn' ? 'শিক্ষার্থী কর্নার ও ডিজিটাল টুলস' : 'Student Fun & Productivity Zone'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'ইন্টারেক্টিভ স্টুডেন্ট পোর্টাল' : 'Interactive Student Portal'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'শিক্ষার্থীদের জন্য বিশেষ ইন্টারেক্টিভ সুবিধা: সম্ভাব্য পরীক্ষার জিপিএ হিসাব করুন, নিজের ডিজিটাল স্টুডেন্ট আইডি কার্ড তৈরি ও প্রিন্ট করুন এবং ক্লাসের রুটিন দেখুন।'
                : 'Play with interactive tools built specifically for students: calculate your projected examination GPA, generate and print your digital Student ID card, and check your daily class routine!'}
            </p>
          </div>
        </div>

        {/* Tool Switcher Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-ink/10 shadow-sm mb-8 sm:mb-10 max-w-2xl print:hidden">
          <button
            onClick={() => setActiveTool('gpa')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTool === 'gpa' ? 'bg-board text-gold shadow-md' : 'text-ink/70 hover:bg-ink/5'
            }`}
          >
            <Calculator className="w-4 h-4 text-gold" />
            <span>{lang === 'bn' ? 'জিপিএ ক্যালকুলেটর' : 'GPA Calculator'}</span>
          </button>

          <button
            onClick={() => setActiveTool('idcard')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTool === 'idcard' ? 'bg-board text-gold shadow-md' : 'text-ink/70 hover:bg-ink/5'
            }`}
          >
            <IdCard className="w-4 h-4 text-mint" />
            <span>{lang === 'bn' ? 'ডিজিটাল আইডি কার্ড' : 'Digital ID Card'}</span>
          </button>

          <button
            onClick={() => setActiveTool('routine')}
            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTool === 'routine' ? 'bg-board text-gold shadow-md' : 'text-ink/70 hover:bg-ink/5'
            }`}
          >
            <Calendar className="w-4 h-4 text-brick" />
            <span>{lang === 'bn' ? 'দৈনিক ক্লাস রুটিন' : 'Daily Routine'}</span>
          </button>
        </div>

        {/* TOOL 1: GPA CALCULATOR */}
        {activeTool === 'gpa' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Subject Grade Selectors */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-board">
                    {lang === 'bn' ? 'টার্গেট জিপিএ হিসাব করুন' : 'Calculate Your Target GPA'}
                  </h3>
                  <p className="text-xs text-ink/60">
                    {lang === 'bn' ? 'প্রতিটি বিষয়ের সম্ভাব্য লেটার গ্রেড নির্বাচন করুন' : 'Select expected letter grades for each course'}
                  </p>
                </div>
                <button
                  onClick={() => setSubjects(initialSubjects)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-iris hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'গোল্ডেন এ+ রিসেট' : 'Reset to Golden'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {subjects.map((sub, idx) => (
                  <div
                    key={sub.name}
                    className="p-3.5 rounded-2xl bg-paper border border-ink/10 flex items-center justify-between gap-4"
                  >
                    <span className="font-display font-bold text-sm text-board">{sub.name}</span>

                    <select
                      value={sub.gradePoint}
                      onChange={(e) => handleGradeChange(idx, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-ink/20 text-xs font-bold bg-white text-board outline-none focus:ring-2 focus:ring-iris/30 cursor-pointer"
                    >
                      <option value="5.0">A+ ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ৫.০' : 'Grade Point: 5.0'})</option>
                      <option value="4.0">A ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ৪.০' : 'Grade Point: 4.0'})</option>
                      <option value="3.5">A- ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ৩.৫' : 'Grade Point: 3.5'})</option>
                      <option value="3.0">B ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ৩.০' : 'Grade Point: 3.0'})</option>
                      <option value="2.0">C ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ২.০' : 'Grade Point: 2.0'})</option>
                      <option value="1.0">D ({lang === 'bn' ? 'গ্রেড পয়েন্ট: ১.০' : 'Grade Point: 1.0'})</option>
                      <option value="0.0">F ({lang === 'bn' ? 'ফেল: ০.০' : 'Fail: 0.0'})</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Result Scorecard */}
            <div className="lg:col-span-5 bg-gradient-to-b from-board to-boardlt text-chalk rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold border border-gold/40">
                <Award className="w-4 h-4" />
                <span>{lang === 'bn' ? 'গণনাকৃত সম্ভাব্য ফলাফল' : 'Calculated Projected Score'}</span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-chalk/70 font-semibold">
                  {lang === 'bn' ? 'সামগ্রিক জিপিএ (GPA)' : 'Cumulative GPA'}
                </p>
                <div className="font-display font-black text-6xl text-gold mt-2 tracking-tight">
                  {num(calculatedGpa)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs leading-relaxed">
                {parseFloat(calculatedGpa) >= 5.0 ? (
                  <p className="font-bold text-mint text-sm">
                    {lang === 'bn'
                      ? '🏆 অসাধারণ! আপনি গোল্ডেন এ+ মেধা পুরস্কার ও ১০০% বেতন মওকুফের যোগ্য!'
                      : '🏆 Brilliant! You are eligible for the Golden A+ Merit Award and 100% scholarship!'}
                  </p>
                ) : parseFloat(calculatedGpa) >= 4.0 ? (
                  <p className="font-bold text-gold text-sm">
                    {lang === 'bn'
                      ? '⭐ চমৎকার পারফরম্যান্স! আপনি প্রথম বিভাগ এ গ্রেড নিশ্চিত করেছেন!'
                      : '⭐ Excellent performance! You have secured First Division A Grade!'}
                  </p>
                ) : (
                  <p className="text-chalk/80">
                    {lang === 'bn'
                      ? 'গণিত, বিজ্ঞান ব্যবহারিক ও ভাষা সাহিত্য নিয়মিত অনুশীলনের মাধ্যমে ফলাফল আরও বৃদ্ধি করুন!'
                      : 'Keep practicing exercises in mathematics, science experiments and language literature to boost your scores!'}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-chalk/60 space-y-1">
                <p>{lang === 'bn' ? 'শিক্ষা বোর্ড নিয়ম: মোট গ্রেড পয়েন্টকে ৭টি মূল বিষয় দ্বারা ভাগ' : 'Standard Board Formula: Total GP divided by 7 core subjects'}</p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: DIGITAL ID CARD GENERATOR */}
        {activeTool === 'idcard' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn">
            {/* Form Inputs */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-lg print:hidden">
              <h3 className="font-display font-bold text-xl text-board mb-1">
                {lang === 'bn' ? 'স্টুডেন্ট আইডি কার্ড কাস্টমাইজ করুন' : 'Customize Your Student ID Card'}
              </h3>
              <p className="text-xs text-ink/60 mb-6">
                {lang === 'bn' ? 'নিচের বক্সে তথ্য পরিবর্তন করে সরাসরি কার্ডের লাইভ রূপ দেখুন' : 'Type your details below to see the card update live'}
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-ink/80 mb-1">
                    {lang === 'bn' ? 'শিক্ষার্থীর পূর্ণ নাম' : 'Student Full Name'}
                  </label>
                  <input
                    value={idCardData.name}
                    onChange={(e) => setIdCardData({ ...idCardData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'শ্রেণি' : 'Class'}
                    </label>
                    <select
                      value={idCardData.className}
                      onChange={(e) => setIdCardData({ ...idCardData, className: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30 cursor-pointer"
                    >
                      {classKeys.map((c, idx) => (
                        <option key={c} value={c}>
                          {classLabels[idx]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'রোল নম্বর' : 'Roll Number'}
                    </label>
                    <input
                      value={idCardData.roll}
                      onChange={(e) => setIdCardData({ ...idCardData, roll: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group'}
                    </label>
                    <select
                      value={idCardData.bloodGroup}
                      onChange={(e) => setIdCardData({ ...idCardData, bloodGroup: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30 cursor-pointer"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'জরুরি ফোন নম্বর' : 'Emergency Phone'}
                    </label>
                    <input
                      value={idCardData.contact}
                      onChange={(e) => setIdCardData({ ...idCardData, contact: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-ink/10 flex justify-between items-center">
                <span className="text-xs text-ink/50">
                  {lang === 'bn' ? 'স্ট্যান্ডার্ড আইডি ব্যাজ মাপ (CR-80)' : 'Print ready dimensions (CR-80 badge standard)'}
                </span>
                <button
                  onClick={() => window.print()}
                  className="btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-board text-chalk text-xs font-bold hover:bg-boardlt shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-gold" />
                  <span>{lang === 'bn' ? 'আইডি কার্ড প্রিন্ট করুন' : 'Print ID Card'}</span>
                </button>
              </div>
            </div>

            {/* Live Interactive ID Card (Badge preview) */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-[340px] rounded-3xl bg-gradient-to-b from-[#14103a] via-[#1a1640] to-[#0a071f] text-chalk p-4 sm:p-6 shadow-2xl border-2 border-gold/40 relative overflow-hidden">
                {/* Lanyard punch hole */}
                <div className="w-12 h-3 mx-auto bg-black/50 rounded-full border border-white/20 mb-4" />

                {/* Top header */}
                <div className="text-center pb-3 border-b border-white/15">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <GraduationCap className="w-6 h-6 text-gold" />
                    <span className="font-display font-black text-sm tracking-wide text-white">
                      {lang === 'bn' ? 'মিরাশানী একাডেমি' : 'MIRASHANI ACADEMY'}
                    </span>
                  </div>
                  <p className="text-[9px] uppercase tracking-widest text-mint font-bold">
                    {lang === 'bn' ? 'শিক্ষার্থী পরিচয়পত্র' : 'Official Student Identity Card'}
                  </p>
                </div>

                {/* Photo & Hologram */}
                <div className="my-5 flex flex-col items-center relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-gold/60 shadow-xl">
                    <img
                      src={idCardData.photoUrl}
                      alt={idCardData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Holographic Security badge */}
                  <span className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gold text-ink shadow-md">
                    ★ {lang === 'bn' ? 'যাচাইকৃত শিক্ষার্থী' : 'VERIFIED STUDENT'} ★
                  </span>
                </div>

                {/* Student Info */}
                <div className="text-center space-y-1 mt-4">
                  <h4 className="font-display font-extrabold text-lg text-white">{idCardData.name}</h4>
                  <p className="text-xs text-gold font-bold">
                    {classLabels[classKeys.indexOf(idCardData.className)] || idCardData.className} &middot; {lang === 'bn' ? `রোল: ${num(idCardData.roll)}` : `Roll: ${idCardData.roll}`}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] text-chalk/75">
                  <div>
                    <span className="text-chalk/40 block">{lang === 'bn' ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                    <strong className="text-brick text-xs font-black">{idCardData.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="text-chalk/40 block">{lang === 'bn' ? 'শিক্ষাবর্ষ:' : 'Academic Session:'}</span>
                    <strong className="text-white">{num(idCardData.session)}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-chalk/40 block">{lang === 'bn' ? 'জরুরি হেল্পলাইন:' : 'Emergency Helpline:'}</span>
                    <strong className="text-mint">{num(idCardData.contact)}</strong>
                  </div>
                </div>

                {/* Bottom Barcode / QR Simulation */}
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[8px] text-chalk/50 font-mono">
                  <span>EIIN: 108420</span>
                  <span className="tracking-widest">||||| | |||| ||| ||||</span>
                  <span>MPA-ID</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: DAILY ROUTINE PICKER */}
        {activeTool === 'routine' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-ink/10 shadow-lg animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-board">
                  {lang === 'bn' ? 'দৈনিক ক্লাসের রুটিন' : 'Daily Class Timetable'}
                </h3>
                <p className="text-xs sm:text-sm text-ink/60">
                  {lang === 'bn' ? 'শ্রেণি ও বার নির্বাচন করে পিরিয়ডের সময়সূচি দেখুন' : 'Check period schedule for any class and day'}
                </p>
              </div>

              {/* Class & Day filters */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <select
                  value={selectedRoutineClass}
                  onChange={(e) => setSelectedRoutineClass(e.target.value)}
                  className="px-3 sm:px-4 py-2 rounded-xl border border-ink/20 text-xs font-bold text-board outline-none cursor-pointer"
                >
                  {classKeys.map((c, idx) => (
                    <option key={c} value={c}>
                      {classLabels[idx]}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 no-scrollbar">
                  {scheduleDays.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDay(d.id)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedDay === d.id
                          ? 'bg-board text-gold shadow-sm'
                          : 'bg-paper text-ink/60 hover:bg-ink/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Timetable Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-iris">
                  {lang === 'bn' ? 'পিরিয়ড ০১ · সকাল ৯:০০' : 'Period 01 · 9:00 AM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'বাংলা ১ম পত্র' : 'Bangla 1st Paper'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষিকা: শামসুন নাহার' : 'Teacher: Shamsun Nahar'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-iris">
                  {lang === 'bn' ? 'পিরিয়ড ০২ · সকাল ৯:৪৫' : 'Period 02 · 9:45 AM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'সাধারণ গণিত' : 'General Mathematics'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষক: জাহাঙ্গীর কবির' : 'Teacher: Jahangir Kabir'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-iris">
                  {lang === 'bn' ? 'পিরিয়ড ০৩ · সকাল ১০:৩০' : 'Period 03 · 10:30 AM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'পদার্থবিজ্ঞান / সাধারণ বিজ্ঞান' : 'General Science / Physics'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষিকা: ডা. নুসরাত জাহান' : 'Teacher: Dr. Nusrat Jahan'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-iris">
                  {lang === 'bn' ? 'পিরিয়ড ০৪ · সকাল ১১:১৫' : 'Period 04 · 11:15 AM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'ইংরেজি যোগাযোগমূলক ব্যাকরণ' : 'English Communicative'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষিকা: ফাহমিদা ইয়াসমিন' : 'Teacher: Fahmida Yasmin'}
                </p>
              </div>

              <div className="col-span-full p-3 rounded-2xl bg-gold/15 text-board text-center font-bold text-xs">
                {lang === 'bn' ? 'দুপুর ১২:০০ - ১২:৪৫ · মধ্যাহ্ন বিরতি, টিফিন ও জোহরের নামাজ' : '12:00 PM - 12:45 PM · Mid-Day Tiffin & Prayer Break'}
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-mint">
                  {lang === 'bn' ? 'পিরিয়ড ০৫ · দুপুর ১২:৪৫' : 'Period 05 · 12:45 PM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'বিজ্ঞান ল্যাবরেটরি ব্যবহারিক' : 'Science Practical Lab'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষিকা: ডা. নুসরাত জাহান' : 'Teacher: Dr. Nusrat Jahan'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-ink/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-mint">
                  {lang === 'bn' ? 'পিরিয়ড ০৬ · দুপুর ১:৪৫' : 'Period 06 · 1:45 PM'}
                </span>
                <h4 className="font-display font-bold text-base text-board mt-1">
                  {lang === 'bn' ? 'কম্পিউটার টাইপিং ও আইসিটি ল্যাব' : 'Computer Coding & ICT'}
                </h4>
                <p className="text-xs text-ink/60 mt-0.5">
                  {lang === 'bn' ? 'শিক্ষক: তানভীর হাসান' : 'Teacher: Tanvir Hasan'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
