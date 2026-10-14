import { useState, useMemo } from 'react'
import {
  X,
  Printer,
  PhoneCall,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  CreditCard,
  GraduationCap,
  User,
  TrendingUp,
  FileText,
  DollarSign,
  CalendarCheck2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  MapPin,
  HeartHandshake
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { buildExamResults } from '../lib/studentData'
import ExamResultsPanel from '../components/ExamResultsPanel'

/* ─── Helpers ──────────────────────────────────────────────── */
const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const statusColors = {
  present: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    light: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    label: 'Present',
    short: 'P'
  },
  absent: {
    bg: 'bg-rose-500',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    light: 'bg-rose-500/10',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    label: 'Absent',
    short: 'A'
  },
  late: {
    bg: 'bg-amber-500',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    light: 'bg-amber-500/10',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    label: 'Late',
    short: 'L'
  },
  leave: {
    bg: 'bg-sky-500',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    light: 'bg-sky-500/10',
    badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    label: 'Leave',
    short: 'E'
  }
}

function formatDateEn(dateStr) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

export default function Student360ProfileModal({ student, onClose, initialTab = 'overview' }) {
  const {
    attendanceStore,
    feeTransactions,
    examResults,
    students,
    schoolInfo,
    setCurrentReceipt,
    setCurrentReportCard,
    setCurrentStudentForId
  } = useDashboard()

  const [activeTab, setActiveTab] = useState(initialTab) // 'overview' | 'attendance' | 'fees' | 'results' | 'personal'
  const [selectedMonth, setSelectedMonth] = useState('2026-10')

  if (!student) return null

  /* ══════════════════════════════════════════════════════════════
     1. ATTENDANCE DATA (All Months & Selected Month)
  ══════════════════════════════════════════════════════════════ */
  // Get all attendance records across all dates for this student
  const allAttendanceRecords = useMemo(() => {
    const records = []
    Object.entries(attendanceStore).forEach(([key, val]) => {
      const [date, classId, section] = key.split('__')
      const status = val.records?.[student.id]
      if (status) {
        records.push({ date, classId, section, status })
      }
    })
    return records.sort((a, b) => a.date.localeCompare(b.date))
  }, [attendanceStore, student.id])

  // Selected Month Attendance
  const monthData = useMemo(() => {
    return allAttendanceRecords.filter((d) => d.date.startsWith(selectedMonth))
  }, [allAttendanceRecords, selectedMonth])

  const monthStats = useMemo(() => {
    const totalDays = monthData.length
    const present = monthData.filter((d) => d.status === 'present').length
    const absent = monthData.filter((d) => d.status === 'absent').length
    const late = monthData.filter((d) => d.status === 'late').length
    const leave = monthData.filter((d) => d.status === 'leave').length
    const rate = totalDays > 0 ? Math.round((present / totalDays) * 100) : 100
    return { totalDays, present, absent, late, leave, rate }
  }, [monthData])

  const absentDates = useMemo(() => monthData.filter((d) => d.status === 'absent'), [monthData])
  const lateDates = useMemo(() => monthData.filter((d) => d.status === 'late'), [monthData])
  const leaveDates = useMemo(() => monthData.filter((d) => d.status === 'leave'), [monthData])

  // Overall Attendance Rate across all logged months
  const overallAttendanceRate = useMemo(() => {
    if (allAttendanceRecords.length === 0) return student.attendanceRate || 95
    const present = allAttendanceRecords.filter((d) => d.status === 'present').length
    return Math.round((present / allAttendanceRecords.length) * 100)
  }, [allAttendanceRecords, student.attendanceRate])

  // Monthly Attendance History (Sep, Oct, etc.)
  const monthlyTrends = useMemo(() => {
    const months = ['2026-09', '2026-10']
    return months.map((m) => {
      const inMonth = allAttendanceRecords.filter((d) => d.date.startsWith(m))
      const p = inMonth.filter((d) => d.status === 'present').length
      const a = inMonth.filter((d) => d.status === 'absent').length
      const total = inMonth.length
      const rate = total > 0 ? Math.round((p / total) * 100) : 95
      const [year, mo] = m.split('-')
      const label = `${MONTH_NAMES_EN[parseInt(mo, 10) - 1]} ${year}`
      return { month: m, label, total, p, a, rate }
    })
  }, [allAttendanceRecords])

  /* ══════════════════════════════════════════════════════════════
     2. FEES & PAYMENTS DATA (Paid vs Due Months)
  ══════════════════════════════════════════════════════════════ */
  // Transactions associated with this student
  const studentTransactions = useMemo(() => {
    return feeTransactions.filter(
      (tx) => tx.studentId === student.id || (tx.roll === student.roll && tx.class?.includes(student.className))
    )
  }, [feeTransactions, student])

  // Monthly Fee Breakdown for 2026 (Jan to Oct)
  const monthlyFeeLedger = useMemo(() => {
    const feePerMonth = 1200
    const currentDue = student.feeDue || 0
    const months = [
      { name: 'January 2026', fee: feePerMonth },
      { name: 'February 2026', fee: feePerMonth },
      { name: 'March 2026', fee: feePerMonth },
      { name: 'April 2026', fee: feePerMonth },
      { name: 'May 2026', fee: feePerMonth },
      { name: 'June 2026', fee: feePerMonth },
      { name: 'July 2026', fee: feePerMonth },
      { name: 'August 2026', fee: feePerMonth },
      { name: 'September 2026', fee: feePerMonth },
      { name: 'October 2026', fee: feePerMonth }
    ]

    // Determine status based on feeDue
    return months.map((m, idx) => {
      // If student has feeDue, the latest month(s) are Due
      const isLatest = idx === months.length - 1
      const isSecondLatest = idx === months.length - 2
      let status = 'Paid'
      let amountDue = 0

      if (currentDue > 1500) {
        if (isLatest || isSecondLatest) {
          status = 'Due'
          amountDue = isLatest ? feePerMonth : currentDue - feePerMonth
        }
      } else if (currentDue > 0) {
        if (isLatest) {
          status = 'Due'
          amountDue = currentDue
        }
      }

      return {
        ...m,
        status,
        amountDue,
        paidDate: status === 'Paid' ? `2026-0${idx + 1}-08` : null
      }
    })
  }, [student.feeDue])

  const totalFeesBilled = monthlyFeeLedger.reduce((sum, m) => sum + m.fee, 0)
  const totalFeesDue = student.feeDue || 0
  const totalFeesPaid = Math.max(0, totalFeesBilled - totalFeesDue)

  /* ══════════════════════════════════════════════════════════════
     3. EXAM RESULTS & MARKSHEET DATA
  ══════════════════════════════════════════════════════════════ */
  const studentResult = useMemo(
    () => {
      const all = buildExamResults(student, students, examResults)
      return (
        all.find((x) => x.exam.name === 'Half-Yearly Examination 2026' && x.published)?.result ||
        all.filter((x) => x.published).map((x) => x.result).pop()
      )
    },
    [student, students, examResults]
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#111118] border border-[#1e1e2e] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* ── TOP HERO PROFILE BANNER ── */}
        <div className="relative bg-gradient-to-r from-[#1c1438] via-[#161622] to-[#121b2f] p-5 sm:p-6 border-b border-[#1e1e2e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Student Avatar & Identity */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#6c63ff] shadow-[0_0_25px_rgba(108,99,255,0.4)]"
                />
                <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500 text-white shadow">
                  Active
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{student.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/40">
                    Roll #{student.roll}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  <span className="font-bold text-white">{student.className}</span> · Section: <span className="font-bold text-white">{student.section}</span> · ID: <span className="font-mono text-[#a78bfa] font-bold">{student.id}</span>
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Guardian: <strong className="text-white font-mono">{student.guardianPhone}</strong></span>
                  <a
                    href={`tel:${student.guardianPhone}`}
                    className="px-2 py-0.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    Call
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions & Close */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => window.print()}
                className="p-2.5 bg-[#16161f] hover:bg-[#20202e] text-slate-300 hover:text-white border border-[#1e1e2e] rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
                title="Print"
              >
                <Printer className="w-4 h-4 text-[#a78bfa]" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2.5 bg-[#16161f] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-[#1e1e2e] rounded-xl transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation Bar */}
          <div className="flex bg-[#0f0f17]/90 p-1.5 rounded-2xl border border-white/5 gap-1.5 overflow-x-auto mt-5">
            {[
              { id: 'overview',   label: 'Overview',       icon: Sparkles },
              { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
              { id: 'fees',       label: 'Fees & Ledger',   icon: CreditCard },
              { id: 'results',    label: 'Exam Results',  icon: GraduationCap },
              { id: 'personal',   label: 'Personal Bio',     icon: User }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 min-w-max flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── SCROLLABLE MODAL BODY ── */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">

          {/* ══════════════════════════════════════════════════════════
             SUB-TAB 1: 360° OVERVIEW
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fade-in">
              {/* 4 Core KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="moom-card p-4 border-[#6c63ff]/30 bg-gradient-to-br from-[#6c63ff]/10 to-transparent">
                  <span className="text-[10px] font-bold uppercase text-[#a78bfa] block mb-1">Academic GPA</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-white">{student.gpa || '5.00'}</span>
                    <span className="text-xs font-bold text-emerald-400">(A+)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Merit Rank: #{studentResult.meritPosition}</span>
                </div>

                <div className="moom-card p-4 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Overall Attendance Rate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-emerald-400">{overallAttendanceRate}%</span>
                    <span className="text-[10px] font-bold text-white bg-emerald-500/20 px-1.5 py-0.5 rounded">Regular</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Based on {allAttendanceRecords.length} school days</span>
                </div>

                <div className="moom-card p-4 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">Due Fees Status</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-mono text-amber-400">
                      ৳{totalFeesDue.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {totalFeesDue > 0 ? '⚠️ Current month fee pending' : '✓ All fees cleared'}
                  </span>
                </div>

                <div className="moom-card p-4 border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-transparent">
                  <span className="text-[10px] font-bold uppercase text-sky-400 block mb-1">Blood Group & Health</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black font-mono text-sky-400">{student.bloodGroup || 'A+'}</span>
                    <span className="text-[10px] font-bold text-slate-300">Positive</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Gender: {student.gender || 'Male'}</span>
                </div>
              </div>

              {/* Status Alert Banners */}
              {totalFeesDue > 0 ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      This student has an outstanding fee of <strong>৳{totalFeesDue}</strong> for <strong>October 2026</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('fees')}
                    className="px-3 py-1 bg-amber-500 text-black font-bold rounded-xl text-[11px] shrink-0 hover:bg-amber-400 transition"
                  >View Fee Statement</button>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>All school tuition fees and dues have been fully cleared for this student.</span>
                </div>
              )}

              {/* Quick Two-Column Cards: Recent Attendance & Exam Result */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Attendance Summary Box */}
                <div className="moom-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-2.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <CalendarCheck2 className="w-4 h-4 text-[#a78bfa]" />
                      Attendance Tracker (Current)
                    </h4>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="text-[11px] text-[#a78bfa] hover:underline inline-flex items-center gap-0.5"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">October 2026 Attendance:</span>
                    <span className="font-bold text-emerald-400 font-mono">{monthStats.rate}%</span>
                  </div>
                  <div className="h-2 bg-[#1c1c28] rounded-full overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: `${monthStats.rate}%` }} />
                    <div className="bg-rose-500 h-full" style={{ width: `${100 - monthStats.rate}%` }} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                    <div className="bg-[#16161f] p-2 rounded-xl">
                      <span className="text-[10px] text-emerald-400 block font-bold">Present</span>
                      <span className="font-black text-white font-mono">{monthStats.present} Days</span>
                    </div>
                    <div className="bg-[#16161f] p-2 rounded-xl">
                      <span className="text-[10px] text-rose-400 block font-bold">Absent</span>
                      <span className="font-black text-white font-mono">{monthStats.absent} Days</span>
                    </div>
                    <div className="bg-[#16161f] p-2 rounded-xl">
                      <span className="text-[10px] text-amber-400 block font-bold">Late</span>
                      <span className="font-black text-white font-mono">{monthStats.late} Days</span>
                    </div>
                  </div>
                </div>

                {/* Exam Result Box */}
                <div className="moom-card p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-2.5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#a78bfa]" />
                      Latest Exam Results
                    </h4>
                    <button
                      onClick={() => setActiveTab('results')}
                      className="text-[11px] text-[#a78bfa] hover:underline inline-flex items-center gap-0.5"
                    >
                      Marksheet <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{studentResult.exam}</span>
                    <span className="font-mono font-bold text-white">{studentResult.totalMarks} / {studentResult.fullTotal} Marks</span>
                  </div>

                  <div className="p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e] text-xs space-y-1">
                    <p className="text-slate-300 italic">"{studentResult.remarks}"</p>
                    <span className="text-[10px] text-slate-500 block">— Class Teacher</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             SUB-TAB 2: ATTENDANCE HISTORY
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'attendance' && (
            <div className="space-y-5 animate-fade-in">
              {/* Month Selector Bar */}
              <div className="moom-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#a78bfa]" />
                  <span className="text-xs font-bold text-white">Select Attendance Month:</span>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="moom-input font-mono text-xs py-1 px-3 ml-1"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Overall Attendance Rate: <strong className="text-emerald-400 font-mono">{overallAttendanceRate}%</strong>
                </div>
              </div>

              {/* Monthly Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="moom-card p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total School Days</span>
                  <span className="text-xl font-black font-mono text-white">{monthStats.totalDays}</span>
                </div>
                <div className="moom-card p-3 text-center border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Present Days</span>
                  <span className="text-xl font-black font-mono text-emerald-400">{monthStats.present}</span>
                </div>
                <div className="moom-card p-3 text-center border-rose-500/20 bg-rose-500/5">
                  <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">Absent Days</span>
                  <span className="text-xl font-black font-mono text-rose-400">{monthStats.absent}</span>
                </div>
                <div className="moom-card p-3 text-center border-amber-500/20 bg-amber-500/5">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block mb-1">Late Days</span>
                  <span className="text-xl font-black font-mono text-amber-400">{monthStats.late}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 moom-card p-3 text-center border-[#6c63ff]/30 bg-[#6c63ff]/10">
                  <span className="text-[10px] font-bold uppercase text-[#a78bfa] block mb-1">Attendance Rate</span>
                  <span className="text-xl font-black font-mono text-white">{monthStats.rate}%</span>
                </div>
              </div>

              {/* 🚨 ABSENT DATES LIST */}
              <div className="moom-card p-4 border-rose-500/30 bg-rose-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Absent Dates ({absentDates.length} days):
                  </h4>
                  <span className="text-[11px] text-slate-400">Dates missed during selected month</span>
                </div>

                {absentDates.length === 0 ? (
                  <div className="p-3 bg-[#16161f] rounded-xl text-center text-xs text-emerald-400 font-semibold border border-emerald-500/20">
                    🎉 Great! The student had perfect attendance with zero absences in the selected month.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {absentDates.map((item) => (
                      <div
                        key={item.date}
                        className="flex items-center justify-between p-2.5 bg-[#16161f] rounded-xl border border-rose-500/20"
                      >
                        <div>
                          <span className="font-mono font-bold text-rose-400 text-xs block">{item.date}</span>
                          <span className="text-[11px] text-slate-400">{formatDateEn(item.date)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">Absent</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LATE & LEAVE LISTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="moom-card p-3.5 space-y-2 border-amber-500/20">
                  <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Late Arrival Dates ({lateDates.length} days)
                  </h5>
                  {lateDates.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No late arrival records.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {lateDates.map((d) => (
                        <div key={d.date} className="flex justify-between items-center text-xs p-1.5 bg-[#16161f] rounded-lg">
                          <span className="font-mono text-slate-300">{d.date}</span>
                          <span className="text-[10px] text-amber-400 font-bold">Late</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="moom-card p-3.5 space-y-2 border-sky-500/20">
                  <h5 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approved Leave Dates ({leaveDates.length} days)
                  </h5>
                  {leaveDates.length === 0 ? (
                    <p className="text-[11px] text-slate-500">No approved leave records.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {leaveDates.map((d) => (
                        <div key={d.date} className="flex justify-between items-center text-xs p-1.5 bg-[#16161f] rounded-lg">
                          <span className="font-mono text-slate-300">{d.date}</span>
                          <span className="text-[10px] text-sky-400 font-bold">Leave</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Day-by-Day Grid */}
              <div className="moom-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-[#a78bfa]" />
                  Day-by-Day Attendance Register ({monthData.length} School Days):
                </h4>
                {monthData.length === 0 ? (
                  <p className="text-center text-slate-500 text-xs py-3">No records found.</p>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
                    {monthData.map((d) => {
                      const dayNum = parseInt(d.date.split('-')[2], 10)
                      const col = statusColors[d.status] || statusColors.present
                      return (
                        <div
                          key={d.date}
                          className={`p-2 rounded-xl text-center border transition ${
                            d.status === 'absent'
                              ? 'border-rose-500/40 bg-rose-500/10'
                              : d.status === 'late'
                              ? 'border-amber-500/40 bg-amber-500/10'
                              : d.status === 'leave'
                              ? 'border-sky-500/40 bg-sky-500/10'
                              : 'border-emerald-500/30 bg-emerald-500/10'
                          }`}
                          title={`${d.date}: ${col.label}`}
                        >
                          <span className="text-[10px] font-bold text-slate-400 block">Day {dayNum}</span>
                          <span className={`inline-block font-black text-xs font-mono mt-0.5 ${col.text}`}>
                            {col.short}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* All Months Overview */}
              <div className="moom-card p-4 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
                  Monthly Attendance Comparison:
                </h4>
                <div className="space-y-2.5">
                  {monthlyTrends.map((m) => (
                    <div key={m.month} className="p-3 bg-[#16161f] rounded-xl border border-[#1e1e2e] flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-white block">{m.label}</span>
                        <span className="text-[11px] text-slate-400">
                          Total Days: {m.total} · Present: <strong className="text-emerald-400 font-mono">{m.p}</strong> · Absent: <strong className="text-rose-400 font-mono">{m.a}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 sm:w-32 h-2 bg-[#1c1c28] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${m.rate}%` }} />
                        </div>
                        <span className="font-black font-mono text-emerald-400 text-xs w-10 text-right">{m.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             SUB-TAB 3: FEES & PAYMENTS LEDGER
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'fees' && (
            <div className="space-y-5 animate-fade-in">
              {/* Fee Financial Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="moom-card p-4 border-[#6c63ff]/20 bg-[#6c63ff]/5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Billed Tuition (Yearly)</span>
                  <span className="text-2xl font-black font-mono text-white">৳{totalFeesBilled.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">10 Months Total Tuition Fees</span>
                </div>

                <div className="moom-card p-4 border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Total Paid Fees</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">৳{totalFeesPaid.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Bank & Online Payments</span>
                </div>

                <div className={`moom-card p-4 ${totalFeesDue > 0 ? 'border-rose-500/30 bg-rose-500/10' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
                  <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">Current Outstanding Due</span>
                  <span className={`text-2xl font-black font-mono ${totalFeesDue > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    ৳{totalFeesDue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {totalFeesDue > 0 ? 'Outstanding Due Pending' : 'All Dues Cleared'}
                  </span>
                </div>
              </div>

              {/* Monthly Fee Status Table: Paid vs Due Months */}
              <div className="moom-card overflow-hidden">
                <div className="p-3.5 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#a78bfa]" />
                    Monthly Fee Ledger (Paid vs Pending Months):
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">Session 2026</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="moom-table">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Fee Head</th>
                        <th className="text-right">Amount</th>
                        <th className="text-center">Status</th>
                        <th className="text-right">Payment Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyFeeLedger.map((m) => (
                        <tr key={m.name} className={m.status === 'Due' ? 'bg-rose-500/5' : ''}>
                          <td className="font-bold text-white text-xs">{m.name}</td>
                          <td className="text-xs text-slate-400">Monthly Tuition & ICT Fee</td>
                          <td className="text-right font-mono font-bold text-white text-xs">৳{m.fee}</td>
                          <td className="text-center">
                            {m.status === 'Paid' ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                ✓ Paid
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                ⚠️ Due (৳{m.amountDue})
                              </span>
                            )}
                          </td>
                          <td className="text-right font-mono text-xs text-slate-400">
                            {m.paidDate || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Transactions History Table */}
              <div className="moom-card overflow-hidden">
                <div className="p-3.5 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Payment Receipts & Transaction History:
                  </h4>
                  <span className="text-[11px] text-slate-400">{studentTransactions.length} transactions completed</span>
                </div>

                {studentTransactions.length === 0 ? (
                  <p className="text-center text-slate-500 text-xs py-5">
                    No transaction vouchers found for this student.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="moom-table">
                      <thead>
                        <tr>
                          <th>Voucher No</th>
                          <th>Fee Head</th>
                          <th>Month</th>
                          <th>Method</th>
                          <th className="text-right">Amount</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentTransactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="font-mono font-bold text-[#a78bfa] text-xs">{tx.voucherNo}</td>
                            <td className="text-xs font-semibold text-white">{tx.feeType}</td>
                            <td className="text-xs text-slate-400">{tx.month}</td>
                            <td className="text-xs text-slate-300">{tx.paymentMethod}</td>
                            <td className="text-right font-mono font-bold text-emerald-400 text-xs">৳{tx.amount}</td>
                            <td className="text-right">
                              <button
                                onClick={() => setCurrentReceipt(tx)}
                                className="px-2.5 py-1 bg-[#16161f] hover:bg-[#222233] text-slate-200 border border-[#1e1e2e] rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition"
                              >
                                <Printer className="w-3 h-3 text-[#a78bfa]" />Receipt</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
             SUB-TAB 4: EXAM RESULTS & MARKSHEET
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'results' && <ExamResultsPanel student={student} />}

          {/* ══════════════════════════════════════════════════════════
             SUB-TAB 5: PERSONAL BIO
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-fade-in text-xs">
              <div className="moom-card p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#1e1e2e] pb-3">
                  <User className="w-4 h-4 text-[#a78bfa]" />
                  Complete Student Bio & Profile
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Full Name:</span>
                    <strong className="text-white">{student.name}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Class & Section:</span>
                    <strong className="text-white">{student.className} ({student.section})</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Roll Number:</span>
                    <strong className="font-mono text-[#a78bfa]">#{student.roll}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Student ID:</span>
                    <strong className="font-mono text-[#a78bfa]">{student.id}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Father's Name:</span>
                    <strong className="text-white">{student.fatherName || '—'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Mother's Name:</span>
                    <strong className="text-white">{student.motherName || '—'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Guardian Phone:</span>
                    <strong className="font-mono text-white">{student.guardianPhone || '—'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Blood Group:</span>
                    <strong className="text-rose-400 font-bold">{student.bloodGroup || 'A+'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Date of Birth:</span>
                    <strong className="font-mono text-slate-300">{student.dob || '—'}</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                    <span className="text-slate-400">Admission Date:</span>
                    <strong className="font-mono text-slate-300">{student.admissionDate || '2026-01-10'}</strong>
                  </div>
                </div>

                <div className="p-3 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
                  <span className="text-slate-400 block mb-1">Present Address:</span>
                  <span className="text-white">{student.address || 'Mirashani, Madhabpur, Habiganj'}</span>
                </div>
              </div>

              {/* ID Card Action */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setCurrentStudentForId(student)}
                  className="px-4 py-2 bg-[#6c63ff]/15 hover:bg-[#6c63ff] text-[#a78bfa] hover:text-white border border-[#6c63ff]/30 rounded-xl font-bold transition inline-flex items-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  Print Student ID Card
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="p-4 bg-[#16161f] border-t border-[#1e1e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span>Institution EIIN: {schoolInfo?.eiin || '108420'}</span>
            <span>·</span>
            <span>{schoolInfo?.name || 'Mirashani Academy'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-[#1c1c28] hover:bg-[#252538] text-white border border-[#1e1e2e] rounded-xl font-bold transition inline-flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Full Report
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#6c63ff] hover:bg-[#5b52e0] text-white rounded-xl font-bold transition"
            >Close</button>
          </div>
        </div>

      </div>
    </div>
  )
}
