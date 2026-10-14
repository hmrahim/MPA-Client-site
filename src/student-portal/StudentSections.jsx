import { useMemo, useState, useEffect } from 'react'
import {
  CalendarCheck2, CheckCircle2, AlertTriangle, Wallet, Receipt, Clock, MapPin, User as UserIcon,
  BookOpen, Megaphone, GraduationCap, Award, IdCard, Phone, Home, Droplet, Calendar, TrendingUp,
  CreditCard, Info, Pin
} from 'lucide-react'
import { useDashboard } from '../dashboard/context/DashboardContext'
import { useSiteSection } from '../lib/siteStore'
import api from '../lib/api'
import { buildFeeLedger, buildExamResults, gradeColor, MONTHLY_TUITION } from '../dashboard/lib/studentData'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const todayName = () => new Date().toLocaleDateString('en-US', { weekday: 'long' })
const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

export const STATUS_STYLE = {
  present: { label: 'Present', dot: 'bg-emerald-500', chip: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  absent: { label: 'Absent', dot: 'bg-rose-500', chip: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  late: { label: 'Late', dot: 'bg-amber-500', chip: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  leave: { label: 'Leave', dot: 'bg-sky-500', chip: 'bg-sky-500/15 text-sky-400 border-sky-500/30' }
}

function Section({ icon: Icon, title, right, children, className = '' }) {
  return (
    <div className={`moom-card overflow-hidden ${className}`}>
      <div className="px-4 py-3 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between gap-2">
        <h3 className="text-xs font-bold text-white flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-[#a78bfa]" />}
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  )
}

function Stat({ icon: Icon, label, value, sub, tone = 'violet' }) {
  const tones = {
    violet: 'text-[#a78bfa] bg-[#6c63ff]/10 border-[#6c63ff]/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }
  return (
    <div className="moom-card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-xl font-black font-mono text-white leading-tight">{value}</p>
        {sub && <p className="text-[10px] text-slate-500 truncate">{sub}</p>}
      </div>
    </div>
  )
}

/* ── shared data hooks ── */
function useAttendance(student) {
  const { attendanceStore } = useDashboard()
  return useMemo(() => {
    const rows = []
    Object.entries(attendanceStore).forEach(([key, val]) => {
      const [date] = key.split('__')
      const status = val.records?.[student.id]
      if (status) rows.push({ date, status })
    })
    return rows.sort((a, b) => a.date.localeCompare(b.date))
  }, [attendanceStore, student.id])
}

function useRoutineDay() {
  const t = todayName()
  return DAYS.includes(t) ? t : 'Sunday'
}

/* ═════════════════════════ OVERVIEW ═════════════════════════ */
export function OverviewSection({ student, goTo }) {
  const { weeklyRoutine, feeTransactions, students, examResults } = useDashboard()
  const [notices] = useSiteSection('notices')
  const records = useAttendance(student)
  const ledger = buildFeeLedger(student)
  const results = buildExamResults(student, students, examResults)
  const published = results.filter((r) => r.published).map((r) => r.result)
  const latest = published.find((r) => r.exam === 'Half-Yearly Examination 2026') || published[published.length - 1]
  const rate = records.length ? Math.round((records.filter((r) => r.status === 'present').length / records.length) * 100) : student.attendanceRate || 95
  const day = useRoutineDay()
  const slots = weeklyRoutine[day] || []
  const recentTx = feeTransactions.filter((t) => t.studentId === student.id).slice(0, 3)
  const noticeList = (notices?.en || []).slice(0, 3)

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="moom-card p-5 sm:p-6 bg-gradient-to-r from-[#1a1540] via-[#141228] to-[#111118] border-[#6c63ff]/25">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#6c63ff] shadow-[0_0_20px_rgba(108,99,255,0.4)]" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#a78bfa]">Welcome back 👋</p>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">{student.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {student.className} · {student.section} · Roll {student.roll} · ID <span className="font-mono">{student.id}</span>
            </p>
          </div>
          {ledger.pending > 0 && (
            <button onClick={() => goTo('fees')} className="moom-btn-rose px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 self-start sm:self-auto">
              <AlertTriangle className="w-4 h-4" /> ৳{ledger.pending.toLocaleString()} fee pending
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat icon={CalendarCheck2} label="Attendance" value={`${rate}%`} sub={`${records.length} school days logged`} tone="emerald" />
        <Stat icon={GraduationCap} label="Latest GPA" value={latest?.gpa ?? '—'} sub={latest ? latest.exam.replace(' Examination 2026', '') : 'No result yet'} tone="violet" />
        <Stat icon={TrendingUp} label="Class Rank" value={latest ? `#${latest.meritPosition}` : '—'} sub={latest ? `of ${latest.classSize} students` : ''} tone="amber" />
        <Stat icon={Wallet} label="Pending Fees" value={`৳${ledger.pending.toLocaleString()}`} sub={ledger.pending ? 'Please clear soon' : 'All cleared'} tone={ledger.pending ? 'rose' : 'sky'} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <Section icon={Clock} title={`${day}'s Classes`} className="lg:col-span-3" right={<button onClick={() => goTo('routine')} className="text-[11px] font-bold text-[#a78bfa] hover:underline">Full routine</button>}>
          <div className="divide-y divide-[#1e1e2e]">
            {slots.map((s) => (
              <div key={s.period} className="px-4 py-2.5 flex items-center gap-3 text-xs">
                <span className="w-7 h-7 rounded-lg bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-[#a78bfa] font-black font-mono flex items-center justify-center shrink-0">{s.period}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white truncate">{s.subject}</p>
                  <p className="text-[10px] text-slate-500 truncate">{s.teacher} · {s.room}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">{s.time}</span>
              </div>
            ))}
            {!slots.length && <p className="p-6 text-center text-xs text-slate-500">No classes scheduled.</p>}
          </div>
        </Section>

        <div className="lg:col-span-2 space-y-5">
          <Section icon={Megaphone} title="Latest Notices" right={<button onClick={() => goTo('notices')} className="text-[11px] font-bold text-[#a78bfa] hover:underline">All</button>}>
            <div className="divide-y divide-[#1e1e2e]">
              {noticeList.map((n) => (
                <div key={n.id} className="px-4 py-2.5">
                  <p className="text-xs font-bold text-white line-clamp-2">{n.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{n.date} · {n.catEn || n.cat}</p>
                </div>
              ))}
              {!noticeList.length && <p className="p-5 text-center text-xs text-slate-500">No notices.</p>}
            </div>
          </Section>

          <Section icon={Receipt} title="Recent Payments">
            <div className="divide-y divide-[#1e1e2e]">
              {recentTx.map((t) => (
                <div key={t.id} className="px-4 py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{t.month}</p>
                    <p className="text-[10px] text-slate-500">{t.date}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">৳{t.amount}</span>
                </div>
              ))}
              {!recentTx.length && <p className="p-5 text-center text-xs text-slate-500">No payments recorded yet.</p>}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ═════════════════════════ FEES ═════════════════════════ */
export function FeesSection({ student }) {
  const { feeTransactions, setCurrentReceipt, schoolInfo } = useDashboard()
  const ledger = buildFeeLedger(student)
  const txs = feeTransactions.filter((t) => t.studentId === student.id)
  const dueRows = ledger.rows.filter((r) => r.amountDue > 0)
  const paidPct = Math.round((ledger.paid / ledger.billed) * 100)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat icon={Wallet} label="Monthly Tuition" value={`৳${MONTHLY_TUITION.toLocaleString()}`} sub="Per month" tone="violet" />
        <Stat icon={Receipt} label="Total Billed (2026)" value={`৳${ledger.billed.toLocaleString()}`} sub="Jan – Oct" tone="sky" />
        <Stat icon={CheckCircle2} label="Paid" value={`৳${ledger.paid.toLocaleString()}`} sub={`${paidPct}% of billed`} tone="emerald" />
        <Stat icon={AlertTriangle} label="Pending" value={`৳${ledger.pending.toLocaleString()}`} sub={dueRows.length ? `${dueRows.length} month(s) unpaid` : 'All cleared'} tone={ledger.pending ? 'rose' : 'emerald'} />
      </div>

      {ledger.pending > 0 ? (
        <div className="moom-card p-4 border-rose-500/30 bg-rose-500/[0.04] flex flex-col sm:flex-row sm:items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-white text-sm">৳{ledger.pending.toLocaleString()} is pending</p>
            <p className="text-slate-400 mt-0.5 leading-relaxed">
              Please pay at the school accounts office{schoolInfo.phone ? ` or call ${schoolInfo.phone}` : ''}. Keep your money receipt — it will appear below after the payment is recorded.
            </p>
          </div>
        </div>
      ) : (
        <div className="moom-card p-4 border-emerald-500/30 bg-emerald-500/[0.04] flex items-center gap-3 text-xs">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <p className="font-bold text-white text-sm">You have no pending fees. Thank you!</p>
        </div>
      )}

      <Section icon={Calendar} title="Monthly Tuition Status — 2026">
        <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {ledger.rows.map((r) => (
            <div
              key={r.name}
              className={`p-3 rounded-xl border text-center ${
                r.status === 'Paid'
                  ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                  : r.status === 'Partial'
                  ? 'bg-amber-500/[0.07] border-amber-500/25'
                  : 'bg-rose-500/[0.07] border-rose-500/25'
              }`}
            >
              <p className="text-[11px] font-bold text-white">{r.short}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">৳{r.fee}</p>
              <span
                className={`inline-block mt-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  r.status === 'Paid' ? 'bg-emerald-500/15 text-emerald-400' : r.status === 'Partial' ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
                }`}
              >
                {r.status === 'Paid' ? 'PAID' : r.status === 'Partial' ? `DUE ৳${r.amountDue}` : 'UNPAID'}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Receipt} title="Payment History & Receipts">
        <div className="overflow-x-auto">
          <table className="moom-table">
            <thead>
              <tr>
                <th>Voucher</th>
                <th>For</th>
                <th>Method</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {txs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 text-xs">No payments recorded yet.</td>
                </tr>
              ) : (
                txs.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-xs text-[#a78bfa]">{t.voucherNo}</td>
                    <td className="text-xs"><span className="font-bold text-white block">{t.month}</span><span className="text-[10px] text-slate-500">{t.feeType}</span></td>
                    <td className="text-xs text-slate-300">{t.paymentMethod}</td>
                    <td className="text-xs text-slate-400 font-mono">{t.date}</td>
                    <td className="text-right font-mono font-bold text-emerald-400 text-xs">৳{t.amount}</td>
                    <td className="text-right">
                      <button onClick={() => setCurrentReceipt(t)} className="px-2.5 py-1 rounded-lg moom-btn-ghost text-[11px] font-bold">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  )
}

/* ═════════════════════════ ROUTINE ═════════════════════════ */
export function RoutineSection({ student }) {
  const { weeklyRoutine } = useDashboard()
  const today = todayName()
  const [day, setDay] = useState(useRoutineDay())
  const [view, setView] = useState('day')
  const [liveRoutine, setLiveRoutine] = useState(null)
  const periods = [1, 2, 3, 4, 5, 6, 7]

  useEffect(() => {
    api.getRoutine().then((res) => {
      if (res && res.success && res.data) {
        const d = res.data
        const schedule = d.schedule || d.weeklySchedule || d
        if (typeof schedule === 'object' && !Array.isArray(schedule)) {
          setLiveRoutine(schedule)
        }
      }
    }).catch(() => {})
  }, [])

  const activeRoutine = liveRoutine || weeklyRoutine

  return (
    <div className="space-y-5">
      <div className="moom-card p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-300 px-2">{student.className} · {student.section}</span>
        <div className="ml-auto inline-flex p-0.5 rounded-lg bg-[#16161f] border border-[#1e1e2e]">
          {[['day', 'Day view'], ['week', 'Weekly grid']].map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${view === id ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'day' ? (
        <>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                  day === d ? 'bg-[#6c63ff] text-white border-[#6c63ff] shadow-[0_0_14px_rgba(108,99,255,0.4)]' : 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                {d}{d === today && <span className="ml-1.5 text-[9px] opacity-80">TODAY</span>}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {(activeRoutine[day] || []).map((s) => (
              <div key={s.period} className="moom-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20 text-[11px] font-black font-mono">Period {s.period}</span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{s.time}</span>
                </div>
                <p className="text-sm font-black text-white">{s.subject}</p>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1"><UserIcon className="w-3 h-3" />{s.teacher}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{s.room}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="moom-table-container">
          <table className="moom-table" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th className="w-24">Period</th>
                {DAYS.map((d) => (
                  <th key={d} className={d === today ? 'text-[#a78bfa]' : ''}>{d.slice(0, 3)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p}>
                  <td>
                    <span className="font-black font-mono text-[#a78bfa] text-xs">P{p}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">{activeRoutine.Sunday?.find((x) => x.period === p)?.time}</span>
                  </td>
                  {DAYS.map((d) => {
                    const s = activeRoutine[d]?.find((x) => x.period === p)
                    return (
                      <td key={d} className={d === today ? 'bg-[#6c63ff]/[0.05]' : ''}>
                        {s ? (<><span className="text-xs font-bold text-white block">{s.subject}</span><span className="text-[10px] text-slate-500">{s.room}</span></>) : '—'}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ═════════════════════════ ATTENDANCE ═════════════════════════ */
export function AttendanceSection({ student }) {
  const records = useAttendance(student)
  const months = [...new Set(records.map((r) => r.date.slice(0, 7)))]
  const [month, setMonth] = useState(months[months.length - 1] || '2026-10')
  const inMonth = records.filter((r) => r.date.startsWith(month))
  const map = Object.fromEntries(inMonth.map((r) => [r.date, r.status]))
  const count = (s) => inMonth.filter((r) => r.status === s).length
  const rate = inMonth.length ? Math.round((count('present') / inMonth.length) * 100) : 0

  const [y, m] = month.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()
  const offset = new Date(y, m - 1, 1).getDay() // 0 = Sunday

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat icon={CalendarCheck2} label="Attendance Rate" value={`${rate}%`} sub={`${inMonth.length} school days`} tone="emerald" />
        <Stat icon={CheckCircle2} label="Present" value={count('present')} tone="emerald" />
        <Stat icon={AlertTriangle} label="Absent" value={count('absent')} tone="rose" />
        <Stat icon={Clock} label="Late / Leave" value={`${count('late')} / ${count('leave')}`} tone="amber" />
      </div>

      <Section
        icon={Calendar}
        title="Attendance Calendar"
        right={
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="moom-select !py-1 text-xs">
            {(months.length ? months : [month]).map((mm) => (
              <option key={mm} value={mm}>
                {new Date(mm + '-01T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        }
      >
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase text-slate-500 mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: offset }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = `${month}-${String(i + 1).padStart(2, '0')}`
              const st = map[date]
              const weekend = [5, 6].includes(new Date(y, m - 1, i + 1).getDay())
              return (
                <div
                  key={date}
                  title={st ? STATUS_STYLE[st].label : weekend ? 'Weekend' : 'No record'}
                  className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-[11px] font-bold ${
                    st ? STATUS_STYLE[st].chip : weekend ? 'bg-white/[0.02] border-white/5 text-slate-600' : 'bg-white/[0.03] border-white/5 text-slate-500'
                  }`}
                >
                  {i + 1}
                  {st && <span className="text-[8px] font-extrabold uppercase opacity-80">{st[0]}</span>}
                </div>
              )
            })}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-slate-400">
            {Object.entries(STATUS_STYLE).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5"><span className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />{v.label}</span>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ═════════════════════════ LIBRARY ═════════════════════════ */
export function LibrarySection({ student }) {
  const { borrowings } = useDashboard()
  const mine = borrowings.filter((b) => b.studentId === student.id)
  return (
    <Section icon={BookOpen} title="My Library Books">
      <div className="divide-y divide-[#1e1e2e]">
        {mine.map((b) => (
          <div key={b.id} className="px-4 py-3 flex items-center gap-3 text-xs">
            <BookOpen className="w-5 h-5 text-[#a78bfa] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white truncate">{b.bookTitle}</p>
              <p className="text-[10px] text-slate-500">Issued {fmtDate(b.issueDate)} · Due {fmtDate(b.dueDate)}</p>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${b.status === 'overdue' ? 'bg-rose-500/10 text-rose-400 border-rose-500/25' : b.status === 'returned' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-sky-500/10 text-sky-400 border-sky-500/25'}`}>
              {b.status}
            </span>
          </div>
        ))}
        {!mine.length && <p className="p-8 text-center text-xs text-slate-500">You have not borrowed any books.</p>}
      </div>
    </Section>
  )
}

/* ═════════════════════════ NOTICES ═════════════════════════ */
export function NoticesSection() {
  const [notices] = useSiteSection('notices')
  const [liveNotices, setLiveNotices] = useState([])

  useEffect(() => {
    api.getNotices().then((res) => {
      if (res && res.data) {
        const raw = res.data
        const items = (raw.items || raw.notices || raw.en || raw || []).filter(Boolean)
        if (Array.isArray(items) && items.length > 0) {
          setLiveNotices(items)
        }
      }
    }).catch(() => {})
  }, [])

  const list = liveNotices.length > 0
    ? liveNotices.map((n) => ({
        id: n._id || n.id,
        pinned: n.pinned,
        catEn: n.catEn || n.category || 'General',
        cat: n.cat || n.catBn || n.category || 'সাধারণ',
        date: n.date || (n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-GB') : ''),
        title: n.title || n.titleBn || '',
        text: n.text || n.desc || '',
      }))
    : (notices?.en || [])

  return (
    <div className="space-y-3">
      {list.map((n, idx) => (
        <div key={n.id || idx} className="moom-card p-4">
          <div className="flex items-center gap-2 mb-1.5">
            {n.pinned && <Pin className="w-3.5 h-3.5 text-amber-400" />}
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20">{n.catEn || n.cat}</span>
            <span className="text-[10px] text-slate-500 ml-auto">{n.date}</span>
          </div>
          <h4 className="text-sm font-bold text-white">{n.title}</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.text}</p>
        </div>
      ))}
      {!list.length && <p className="moom-card p-10 text-center text-xs text-slate-500">No notices published.</p>}
    </div>
  )
}

/* ═════════════════════════ PROFILE ═════════════════════════ */
export function ProfileSection({ student }) {
  const { setCurrentStudentForId } = useDashboard()
  const rows = [
    [UserIcon, 'Full Name', student.name],
    [IdCard, 'Student ID', student.id],
    [GraduationCap, 'Class / Section', `${student.className} · ${student.section}`],
    [Award, 'Roll Number', student.roll],
    [Calendar, 'Date of Birth', fmtDate(student.dob)],
    [Droplet, 'Blood Group', student.bloodGroup],
    [UserIcon, "Father's Name", student.fatherName],
    [UserIcon, "Mother's Name", student.motherName],
    [Phone, 'Guardian Phone', student.guardianPhone],
    [Home, 'Address', student.address],
    [Calendar, 'Admission Date', student.admissionDate ? fmtDate(student.admissionDate) : '—']
  ]
  return (
    <div className="space-y-5">
      <div className="moom-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <img src={student.avatar} alt={student.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-[#6c63ff]" />
        <div className="flex-1">
          <h2 className="text-xl font-black text-white">{student.name}</h2>
          <p className="text-xs text-slate-400">{student.className} · {student.section} · Roll {student.roll}</p>
        </div>
        <button onClick={() => setCurrentStudentForId(student)} className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> View Digital ID Card
        </button>
      </div>
      <Section icon={Info} title="Personal & Guardian Information">
        <dl className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-[#1e1e2e]">
          {rows.map(([Icon, label, value]) => (
            <div key={label} className="px-4 py-3 flex items-center gap-3 sm:border-b sm:border-[#1e1e2e]">
              <Icon className="w-4 h-4 text-[#a78bfa] shrink-0" />
              <div className="min-w-0">
                <dt className="text-[10px] uppercase font-bold text-slate-500">{label}</dt>
                <dd className="text-xs font-semibold text-white break-words">{value || '—'}</dd>
              </div>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
