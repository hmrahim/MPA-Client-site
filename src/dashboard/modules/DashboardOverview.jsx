import { useState } from 'react'
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Award,
  BookOpen,
  Send,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function DashboardOverview({ setActiveTab, onOpenAddStudent }) {
  const {
    students,
    teachers,
    feeTransactions,
    weeklyRoutine,
    attendanceStore,
    setCurrentReceipt,
    schoolInfo
  } = useDashboard()

  const totalStudents = 1250
  const totalTeachers = teachers.length

  // Calculate today's overall attendance rate from all stored records
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = Object.entries(attendanceStore)
    .filter(([key]) => key.startsWith(today))
    .flatMap(([, val]) => Object.values(val.records || {}))
  const presentCount = todayRecords.filter((st) => st === 'present').length
  const totalMarked = todayRecords.length || 1
  const attendanceRate = todayRecords.length > 0
    ? Math.round((presentCount / totalMarked) * 100)
    : 96

  // Fee calculation
  const totalCollected = feeTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0)

  // Current day routine
  const todayPeriods = weeklyRoutine['Sunday'] || []

  return (
    <div className="space-y-6">
      {/* ── Welcome Hero Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111118] via-[#16161f] to-[#1e1e2e] border border-[#1e1e2e] p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-[#6c63ff]/15 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-56 h-56 rounded-full bg-[#a78bfa]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#a78bfa] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 moom-pulse-dot" />
              <span>Smart Academy ERP System · Academic Session {schoolInfo.currentSession}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, Principal {schoolInfo.principalName.split(' ')[1] || 'Sir'}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Real-time monitoring of campus operations, student attendance, digital marksheets, fee collection desks, and institutional communications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAddStudent(true)}
              className="moom-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className="moom-btn-ghost px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Take Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Cards (moom24 style) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="moom-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-[#a78bfa] border border-violet-500/20 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">1,250</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs text-slate-400">
            <span>10 Active Sections</span>
            <button onClick={() => setActiveTab('students')} className="text-[#a78bfa] hover:underline font-semibold">
              Directory &rarr;
            </button>
          </div>
        </div>

        {/* Faculty & Staff */}
        <div className="moom-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Faculty & Staff</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalTeachers} Members</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {totalTeachers - 1} Present
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs text-slate-400">
            <span>Science, Business, Arts</span>
            <button onClick={() => setActiveTab('teachers')} className="text-sky-400 hover:underline font-semibold">
              View Staff &rarr;
            </button>
          </div>
        </div>

        {/* Daily Attendance Rate */}
        <div className="moom-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">{attendanceRate}%</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs text-slate-400">
            <span>Absent: 3.5% · Leave: 1.1%</span>
            <button onClick={() => setActiveTab('attendance')} className="text-emerald-400 hover:underline font-semibold">
              Live Register &rarr;
            </button>
          </div>
        </div>

        {/* Monthly Collection */}
        <div className="moom-card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Fees Inflow</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">৳345,000</span>
            <span className="inline-flex items-center text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              88% Target
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs text-slate-400">
            <span>Today: ৳{totalCollected.toLocaleString()}</span>
            <button onClick={() => setActiveTab('fees')} className="text-amber-400 hover:underline font-semibold">
              Billing POS &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* ── Quick Action Dock (moom24 style tiles) ── */}
      <div className="moom-card p-5">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff]" />
          <span>Quick Operations Dock</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'attendance', label: 'Take Attendance', sub: 'Smart Register', icon: CalendarCheck2, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
            { id: 'fees', label: 'Fee Collection', sub: 'Instant Receipt', icon: DollarSign, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
            { id: 'exams', label: 'Marks & Results', sub: 'Transcripts', icon: Award, color: 'text-[#a78bfa] bg-[#6c63ff]/10 border-[#6c63ff]/20' },
            { id: 'routine', label: 'Timetable', sub: 'Period Schedule', icon: Clock, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
            { id: 'notices', label: 'Broadcast SMS', sub: 'Parent Notifications', icon: Send, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
            { id: 'library', label: 'Library Catalog', sub: 'Book Circulation', icon: BookOpen, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' }
          ].map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#16161f] border border-[#1e1e2e] hover:border-[#6c63ff]/40 hover:bg-[#1c1c28] transition group text-center"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 border ${item.color} group-hover:scale-110 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">{item.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{item.sub}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Main Analytics & Live Routine Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance SVG Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 moom-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Weekly Attendance Trends</h3>
                <p className="text-xs text-slate-400">Comparative attendance performance (Sunday to Thursday)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-[#6c63ff]" /> Students (96%)
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-emerald-400" /> Teachers (98%)
                </span>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="h-52 w-full pt-4">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#1e1e2e" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#1e1e2e" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#1e1e2e" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#1e1e2e" strokeWidth="1" />

                {/* Shaded Area for Students */}
                <polygon
                  points="20,140 20,40 120,30 220,50 320,35 420,25 480,30 480,140"
                  fill="rgba(108, 99, 255, 0.12)"
                />

                {/* Polyline for Students */}
                <polyline
                  fill="none"
                  stroke="#6c63ff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,40 120,30 220,50 320,35 420,25 480,30"
                />

                {/* Circle Points */}
                {[
                  { cx: 20, cy: 40 },
                  { cx: 120, cy: 30 },
                  { cx: 220, cy: 50 },
                  { cx: 320, cy: 35 },
                  { cx: 420, cy: 25 },
                  { cx: 480, cy: 30 }
                ].map((pt, i) => (
                  <circle key={i} cx={pt.cx} cy={pt.cy} r="4.5" fill="#111118" stroke="#a78bfa" strokeWidth="3" />
                ))}

                {/* Polyline for Teachers */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                  points="20,25 120,20 220,30 320,20 420,15 480,20"
                />
              </svg>
            </div>

            {/* Days Labels */}
            <div className="flex justify-between text-xs font-mono text-slate-400 px-2 pt-2 border-t border-[#1e1e2e]">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Today</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-[#1e1e2e] text-center">
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Average Attendance</span>
              <span className="text-base font-bold font-mono text-white">95.8%</span>
            </div>
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Late Arrivals</span>
              <span className="text-base font-bold font-mono text-amber-400">1.2%</span>
            </div>
            <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-3">
              <span className="text-[11px] text-slate-400 block">Leaves Approved</span>
              <span className="text-base font-bold font-mono text-emerald-400">8 Students</span>
            </div>
          </div>
        </div>

        {/* Live Today's Periods Feed */}
        <div className="moom-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white text-base">Live Periods Today</h3>
                <p className="text-xs text-slate-400">Class 10 Science Schedule</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold moom-pulse-dot">
                Active
              </span>
            </div>

            <div className="space-y-2.5">
              {todayPeriods.slice(0, 4).map((slot, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                    idx === 1
                      ? 'bg-[#6c63ff]/15 border-[#6c63ff]/40 shadow-[0_0_15px_rgba(108,99,255,0.15)]'
                      : 'bg-[#16161f] border-[#1e1e2e]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#111118] border border-[#1e1e2e] text-[#a78bfa] font-mono font-bold flex items-center justify-center shrink-0">
                      P{slot.period}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{slot.subject}</h4>
                      <p className="text-slate-400 text-[11px]">{slot.teacher} · {slot.room}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">{slot.time}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('routine')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-[#16161f] hover:bg-[#1c1c28] text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-[#1e1e2e]"
          >
            <span>Full Weekly Routine Grid</span>
            <ChevronRight className="w-4 h-4 text-[#a78bfa]" />
          </button>
        </div>
      </div>

      {/* ── Recent Transactions Table & School Alerts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fee Collections */}
        <div className="moom-table-container">
          <div className="p-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Recent Fee Collections</h3>
              <p className="text-xs text-slate-400">Latest cashier vouchers issued</p>
            </div>
            <button onClick={() => setActiveTab('fees')} className="text-xs font-bold text-[#a78bfa] hover:underline">
              All Records &rarr;
            </button>
          </div>

          <div className="divide-y divide-[#1e1e2e]">
            {feeTransactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-white/[0.02] transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
                    ৳
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">{tx.studentName}</h4>
                    <p className="text-[11px] text-slate-400">
                      {tx.class} (Roll {tx.roll}) · {tx.feeType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-white">৳{tx.amount}</span>
                    <span className="block text-[10px] text-emerald-400 font-semibold">{tx.paymentMethod}</span>
                  </div>
                  <button
                    onClick={() => setCurrentReceipt(tx)}
                    title="Print Receipt"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Bulletins & Alerts */}
        <div className="moom-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Institutional Notices</h3>
              <p className="text-xs text-slate-400">Official bulletins & broadcast</p>
            </div>
            <button onClick={() => setActiveTab('notices')} className="text-xs font-bold text-[#a78bfa] hover:underline">
              Post Notice &rarr;
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Half-Yearly Exam Schedule Finalized
                </span>
                <span className="text-[10px] font-mono text-slate-400">Oct 02, 2026</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Admit cards will be distributed from next Sunday. Please verify fee clearance in the accounting system.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Parent-Teacher Conference Scheduled
                </span>
                <span className="text-[10px] font-mono text-slate-400">Oct 10, 2026</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Academic review conference for Class 9 and 10 examinees will take place in the main auditorium.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
