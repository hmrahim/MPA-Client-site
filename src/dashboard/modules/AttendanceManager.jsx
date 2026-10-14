import { useState, useMemo } from 'react'
import {
  CalendarCheck2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Save,
  Search,
  Plus,
  Trash2,
  BarChart3,
  BookOpen,
  Settings2,
  Filter,
  AlertCircle,
  TrendingUp,
  Eye,
  RotateCcw,
  HelpCircle,
  Info,
  Sparkles,
  UserCheck,
  Calendar,
  ArrowRight,
  PhoneCall,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  ChevronRight,
  X
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import Student360ProfileModal from '../modals/Student360ProfileModal'

/* ─── Status Configuration ─────────────────────────────────── */
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

const TABS = [
  { id: 'take',     label: 'Take Attendance',            icon: CalendarCheck2, desc: 'Daily class attendance entry' },
  { id: 'records',  label: 'Attendance Records & History', icon: FileSpreadsheet, desc: 'Daily & class-wise reports' },
  { id: 'profiles', label: 'Student Attendance Profiles', icon: UserCheck,      desc: 'Student-wise monthly attendance & absence' },
  { id: 'manage',   label: 'Manage Classes & Sections',   icon: Settings2,      desc: 'Add/edit classes and sections' }
]

function Toast({ msg }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#16161f] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/40 flex items-center gap-3 animate-fade-in">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      <span className="font-semibold text-xs">{msg}</span>
    </div>
  )
}

function formatDateEnglish(dateStr) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

/* ══════════════════════════════════════════════════════════════
   TAB 1 – TAKE ATTENDANCE
══════════════════════════════════════════════════════════════ */
function TakeAttendanceTab({ showToast }) {
  const {
    students,
    attendanceClasses,
    getAttendanceForDate,
    markStudentAttendance,
    markAllStudentAttendance,
    sendSms,
    schoolInfo
  } = useDashboard()

  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [classId, setClassId] = useState(attendanceClasses[0]?.id || '')
  const [section, setSection] = useState(attendanceClasses[0]?.sections[0] || '')
  const [search, setSearch] = useState('')
  const [autoSms, setAutoSms] = useState(true)

  const currentClass = attendanceClasses.find((c) => c.id === classId) || attendanceClasses[0]
  const sections = currentClass?.sections || []

  const handleClassChange = (cid) => {
    setClassId(cid)
    const cls = attendanceClasses.find((c) => c.id === cid)
    setSection(cls?.sections[0] || '')
  }

  // Filter students strictly by class and section
  const classStudents = useMemo(() => {
    return students.filter((s) => {
      const className = currentClass?.name || ''
      const matchClass = s.className === className || s.classId === classId
      const matchSection = !section || s.section === section
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.roll.includes(q)
      return matchClass && matchSection && matchSearch
    })
  }, [students, classId, currentClass, section, search])

  const records = getAttendanceForDate(date, classId, section)

  const counts = useMemo(() => {
    const p = classStudents.filter((s) => (records[s.id] || 'present') === 'present').length
    const a = classStudents.filter((s) => records[s.id] === 'absent').length
    const l = classStudents.filter((s) => records[s.id] === 'late').length
    const e = classStudents.filter((s) => records[s.id] === 'leave').length
    const total = classStudents.length || 1
    return { p, a, l, e, total, rate: Math.round((p / total) * 100) }
  }, [classStudents, records])

  const handleMark = (studentId, status) => {
    markStudentAttendance(date, classId, section, studentId, status)
  }

  const handleMarkAll = (status) => {
    markAllStudentAttendance(date, classId, section, classStudents.map((s) => s.id), status)
    showToast(`All students marked as "${statusColors[status].label}".`)
  }

  const handleSave = () => {
    const absentStudents = classStudents.filter((s) => records[s.id] === 'absent')
    if (autoSms && absentStudents.length > 0) {
      sendSms({
        recipientGroup: `${currentClass?.name} (${section}) - ${absentStudents.length} Absent Guardians`,
        message: `Dear Guardian, your ward was marked absent on ${date} at ${schoolInfo.name}. Please contact school office.`,
        count: absentStudents.length
      })
    }
    showToast(`✓ Attendance for ${currentClass?.name} (${section}) — ${date} saved successfully!`)
  }

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="moom-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              1. Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full moom-input font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              2. Class
            </label>
            <select
              value={classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full moom-select font-semibold"
            >
              {attendanceClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              3. Section / Group
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full moom-select font-semibold"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              4. Search Student
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter roll or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full moom-input pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="moom-card p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Students</span>
            <span className="text-xl font-bold font-mono text-white">{classStudents.length}</span>
          </div>
          <Users className="w-5 h-5 text-slate-500" />
        </div>
        <div className="moom-card p-3.5 flex items-center justify-between border-emerald-500/20 bg-emerald-500/5">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-400 block">Present</span>
            <span className="text-xl font-black font-mono text-emerald-400">{counts.p}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="moom-card p-3.5 flex items-center justify-between border-rose-500/20 bg-rose-500/5">
          <div>
            <span className="text-[10px] font-bold uppercase text-rose-400 block">Absent</span>
            <span className="text-xl font-black font-mono text-rose-400">{counts.a}</span>
          </div>
          <XCircle className="w-5 h-5 text-rose-400" />
        </div>
        <div className="moom-card p-3.5 flex items-center justify-between border-amber-500/20 bg-amber-500/5">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-400 block">Late / Leave</span>
            <span className="text-xl font-black font-mono text-amber-400">{counts.l + counts.e}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div className="moom-card p-3.5 flex items-center justify-between border-[#6c63ff]/20 bg-[#6c63ff]/5">
          <div>
            <span className="text-[10px] font-bold uppercase text-[#a78bfa] block">Daily Rate</span>
            <span className="text-xl font-black font-mono text-white">{counts.rate}%</span>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-[#6c63ff] border-t-transparent animate-spin" />
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#16161f] p-4 rounded-xl border border-[#1e1e2e]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-400">Quick Actions:</span>
          <button
            onClick={() => handleMarkAll('present')}
            className="moom-btn-emerald px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark All Present (P)
          </button>
          <button
            onClick={() => handleMarkAll('absent')}
            className="moom-btn-rose px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Mark All Absent (A)
          </button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
            <input
              type="checkbox"
              checked={autoSms}
              onChange={(e) => setAutoSms(e.target.checked)}
              className="rounded border-[#1e1e2e] bg-[#16161f] accent-[#6c63ff] w-4 h-4"
            />
            <span>Auto-SMS Alert on Absence</span>
          </label>
          <button
            onClick={handleSave}
            className="moom-btn-primary px-5 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-[#6c63ff]/25"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="moom-table-container">
        <div className="p-3 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#a78bfa]" />
            <span className="text-xs font-bold text-white">
              {currentClass?.name} — Section: {section} Student List
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Date: {date}</span>
        </div>

        <table className="moom-table">
          <thead>
            <tr>
              <th className="w-16">Roll</th>
              <th>Student</th>
              <th>Guardian Phone</th>
              <th className="text-center">Select Attendance Status</th>
            </tr>
          </thead>
          <tbody>
            {classStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 font-semibold text-sm">No students found in this class.</p>
                  <p className="text-slate-500 text-xs mt-1">Check sections in Manage Classes or add students to this class.</p>
                </td>
              </tr>
            ) : (
              classStudents.map((st) => {
                const status = records[st.id] || 'present'
                const col = statusColors[status] || statusColors.present
                return (
                  <tr key={st.id} className={status === 'absent' ? 'bg-rose-500/5' : ''}>
                    <td className="font-mono font-bold text-[#a78bfa]">{st.roll}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#1e1e2e] shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block text-sm">{st.name}</span>
                          <span className="text-[11px] text-slate-400">ID: {st.id}</span>
                        </div>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${col.badge}`}>
                          {col.label}
                        </span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-400">{st.guardianPhone}</td>
                    <td className="text-center">
                      <div className="inline-flex items-center gap-1 bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e]">
                        {Object.entries(statusColors).map(([key, c]) => (
                          <button
                            key={key}
                            onClick={() => handleMark(st.id, key)}
                            className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                              status === key ? `${c.bg} text-white shadow-md` : `text-slate-400 hover:${c.text}`
                            }`}
                            title={c.label}
                          >
                            {c.short}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB 2 – ATTENDANCE RECORDS & HISTORY
══════════════════════════════════════════════════════════════ */
function CheckAttendanceTab({ onSelectStudent }) {
  const { students, attendanceClasses, attendanceStore } = useDashboard()

  const [viewMode, setViewMode] = useState('daily') // 'daily' | 'monthly'
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedMonth, setSelectedMonth] = useState('2026-10')
  const [classId, setClassId] = useState(attendanceClasses[0]?.id || '')
  const [section, setSection] = useState(attendanceClasses[0]?.sections[0] || '')

  const currentClass = attendanceClasses.find((c) => c.id === classId) || attendanceClasses[0]

  const handleClassChange = (cid) => {
    setClassId(cid)
    const cls = attendanceClasses.find((c) => c.id === cid)
    setSection(cls?.sections[0] || '')
  }

  const classStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = s.className === currentClass?.name || s.classId === classId
      const matchSection = !section || s.section === section
      return matchClass && matchSection
    })
  }, [students, classId, currentClass, section])

  // Daily View Data
  const dailyRecords = useMemo(() => {
    const key = `${selectedDate}__${classId}__${section}`
    return attendanceStore[key]?.records || {}
  }, [attendanceStore, selectedDate, classId, section])

  const dailyCounts = useMemo(() => {
    const p = classStudents.filter((s) => (dailyRecords[s.id] || 'present') === 'present').length
    const a = classStudents.filter((s) => dailyRecords[s.id] === 'absent').length
    const l = classStudents.filter((s) => dailyRecords[s.id] === 'late').length
    const e = classStudents.filter((s) => dailyRecords[s.id] === 'leave').length
    const total = classStudents.length || 1
    return { p, a, l, e, rate: Math.round((p / total) * 100) }
  }, [classStudents, dailyRecords])

  // Monthly View Data
  const monthDays = useMemo(() => {
    const days = []
    Object.keys(attendanceStore).forEach((key) => {
      const [d, cId, sec] = key.split('__')
      if (cId === classId && sec === section && d.startsWith(selectedMonth)) {
        if (!days.includes(d)) days.push(d)
      }
    })
    return days.sort()
  }, [attendanceStore, classId, section, selectedMonth])

  return (
    <div className="space-y-4">
      {/* View Switcher & Filter Bar */}
      <div className="moom-card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1e1e2e] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a78bfa]" />
            <span className="text-sm font-bold text-white">Search Attendance Records:</span>
          </div>

          {/* Sub-view switcher */}
          <div className="flex bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e]">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 ${
                viewMode === 'daily' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily Attendance List</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition inline-flex items-center gap-1.5 ${
                viewMode === 'monthly' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Monthly Class Sheet</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {viewMode === 'daily' ? (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full moom-input font-mono"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full moom-input font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Class</label>
            <select
              value={classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full moom-select"
            >
              {attendanceClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full moom-select"
            >
              {(currentClass?.sections || []).map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="moom-card p-3 border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400">Present</span>
                <span className="text-xl font-bold font-mono text-emerald-400 block">{dailyCounts.p} Students</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="moom-card p-3 border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-400">Absent</span>
                <span className="text-xl font-bold font-mono text-rose-400 block">{dailyCounts.a} Students</span>
              </div>
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="moom-card p-3 border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-400">Late / Leave</span>
                <span className="text-xl font-bold font-mono text-amber-400 block">{dailyCounts.l + dailyCounts.e} Students</span>
              </div>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="moom-card p-3 border-[#6c63ff]/20 bg-[#6c63ff]/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#a78bfa]">Attendance Rate</span>
                <span className="text-xl font-black font-mono text-white block">{dailyCounts.rate}%</span>
              </div>
              <TrendingUp className="w-5 h-5 text-[#a78bfa]" />
            </div>
          </div>

          {/* Daily Table */}
          <div className="moom-table-container">
            <div className="p-3 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                {currentClass?.name} ({section}) — {formatDateEnglish(selectedDate)}
              </span>
              <span className="text-xs text-slate-400 font-mono">Total Students: {classStudents.length}</span>
            </div>

            <table className="moom-table">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Student</th>
                  <th>Guardian Phone</th>
                  <th className="text-center">Daily Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((st) => {
                  const status = dailyRecords[st.id] || 'present'
                  const col = statusColors[status] || statusColors.present
                  return (
                    <tr key={st.id} className={status === 'absent' ? 'bg-rose-500/5' : ''}>
                      <td className="font-mono font-bold text-[#a78bfa]">{st.roll}</td>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar}
                            alt={st.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#1e1e2e]"
                          />
                          <span className="font-bold text-white text-sm">{st.name}</span>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-slate-400">{st.guardianPhone}</td>
                      <td className="text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${col.badge}`}>
                          {col.label}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => onSelectStudent(st)}
                          className="px-3 py-1 bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/30 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                        >
                          <span>Profile</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: MONTHLY VIEW */}
      {viewMode === 'monthly' && (
        <div className="space-y-4">
          {monthDays.length === 0 ? (
            <div className="moom-card p-10 text-center">
              <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 font-semibold text-sm">No attendance records found for this month.</p>
              <p className="text-slate-500 text-xs mt-1">Go to the Take Attendance tab to record attendance for this class.</p>
            </div>
          ) : (
            <div className="moom-card overflow-hidden">
              {/* Daily Bar Chart */}
              <div className="p-4 border-b border-[#1e1e2e]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
                    Daily Attendance Percentage Graph:
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">{monthDays.length} Days Included</span>
                </div>
                <div className="flex items-end gap-1.5 h-20 overflow-x-auto pb-1">
                  {monthDays.map((d) => {
                    const key = `${d}__${classId}__${section}`
                    const rec = attendanceStore[key]?.records || {}
                    const total = classStudents.length || 1
                    const p = classStudents.filter((s) => (rec[s.id] || 'present') === 'present').length
                    const pct = Math.round((p / total) * 100)
                    return (
                      <div
                        key={d}
                        className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
                        style={{ width: 24 }}
                        title={`${d}: ${pct}% Attendance`}
                      >
                        <span className="text-[8px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                          {pct}%
                        </span>
                        <div
                          className={`w-full rounded-t transition-all ${
                            pct >= 85 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ height: `${Math.max(4, pct * 0.65)}px` }}
                        />
                        <span className="text-[9px] text-slate-500 font-mono">{d.slice(8)}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Full Month Register Sheet */}
              <div className="overflow-x-auto">
                <table className="moom-table">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-[#111118] z-10 w-12">Roll</th>
                      <th className="sticky left-12 bg-[#111118] z-10 min-w-36">Student</th>
                      {monthDays.map((d) => (
                        <th key={d} className="text-center text-[10px] px-1" style={{ minWidth: 26 }}>
                          {parseInt(d.slice(8), 10)}
                        </th>
                      ))}
                      <th className="text-center">Present</th>
                      <th className="text-center">Absent</th>
                      <th className="text-center">Rate (%)</th>
                      <th className="text-right">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((st) => {
                      let p = 0, a = 0
                      const dayMap = {}
                      monthDays.forEach((d) => {
                        const key = `${d}__${classId}__${section}`
                        const status = attendanceStore[key]?.records?.[st.id] || 'present'
                        dayMap[d] = status
                        if (status === 'present') p++
                        else if (status === 'absent') a++
                      })
                      const total = monthDays.length || 1
                      const pct = Math.round((p / total) * 100)

                      return (
                        <tr key={st.id}>
                          <td className="font-mono font-bold text-[#a78bfa] sticky left-0 bg-[#111118]">{st.roll}</td>
                          <td className="sticky left-12 bg-[#111118]">
                            <span className="font-bold text-white text-xs block whitespace-nowrap">{st.name}</span>
                          </td>
                          {monthDays.map((d) => {
                            const status = dayMap[d]
                            const c = statusColors[status] || statusColors.present
                            return (
                              <td key={d} className="text-center px-0.5">
                                <span
                                  className={`inline-block w-5 h-5 rounded text-[9px] font-bold leading-5 text-white ${c.bg}`}
                                  title={`${d}: ${c.label}`}
                                >
                                  {c.short}
                                </span>
                              </td>
                            )
                          })}
                          <td className="text-center font-bold text-emerald-400 text-xs">{p}</td>
                          <td className="text-center font-bold text-rose-400 text-xs">{a}</td>
                          <td className="text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                pct >= 85
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : pct >= 70
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : 'bg-rose-500/15 text-rose-400'
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => onSelectStudent(st)}
                              className="px-2 py-1 bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 text-[#a78bfa] rounded text-[11px] font-semibold transition"
                            >View</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB 3 – STUDENT ATTENDANCE PROFILES
══════════════════════════════════════════════════════════════ */
function StudentAttendanceProfilesTab({ onSelectStudent }) {
  const { students, attendanceClasses, attendanceStore } = useDashboard()

  const [selectedMonth, setSelectedMonth] = useState('2026-10')
  const [classId, setClassId] = useState(attendanceClasses[0]?.id || '')
  const [section, setSection] = useState(attendanceClasses[0]?.sections[0] || '')
  const [search, setSearch] = useState('')

  const currentClass = attendanceClasses.find((c) => c.id === classId) || attendanceClasses[0]

  const handleClassChange = (cid) => {
    setClassId(cid)
    const cls = attendanceClasses.find((c) => c.id === cid)
    setSection(cls?.sections[0] || '')
  }

  // Filter students strictly by class and section
  const classStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = s.className === currentClass?.name || s.classId === classId
      const matchSection = !section || s.section === section
      const q = search.toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.roll.includes(q)
      return matchClass && matchSection && matchSearch
    })
  }, [students, classId, currentClass, section, search])

  // Get all dates in this month
  const monthDates = useMemo(() => {
    const days = []
    Object.keys(attendanceStore).forEach((key) => {
      const [d, cId, sec] = key.split('__')
      if (cId === classId && sec === section && d.startsWith(selectedMonth)) {
        if (!days.includes(d)) days.push(d)
      }
    })
    return days.sort()
  }, [attendanceStore, classId, section, selectedMonth])

  // Compute stats for each student
  const studentStats = useMemo(() => {
    return classStudents.map((st) => {
      let p = 0, a = 0, l = 0, e = 0
      const absentDates = []

      monthDates.forEach((d) => {
        const key = `${d}__${classId}__${section}`
        const status = attendanceStore[key]?.records?.[st.id] || 'present'
        if (status === 'present') p++
        else if (status === 'absent') {
          a++
          absentDates.push(d)
        } else if (status === 'late') l++
        else if (status === 'leave') e++
      })

      const total = monthDates.length || 1
      const rate = monthDates.length > 0 ? Math.round((p / total) * 100) : 100
      return {
        ...st,
        totalSchoolDays: monthDates.length,
        presentDays: p,
        absentDays: a,
        lateDays: l,
        leaveDays: e,
        attendanceRate: rate,
        absentDates
      }
    })
  }, [classStudents, monthDates, attendanceStore, classId, section])

  // Overall Class Averages
  const classAvg = useMemo(() => {
    if (studentStats.length === 0) return { avg: 0, high: 0, low: 0 }
    const totalRate = studentStats.reduce((sum, s) => sum + s.attendanceRate, 0)
    const avg = Math.round(totalRate / studentStats.length)
    const high = studentStats.filter((s) => s.attendanceRate >= 85).length
    const low = studentStats.filter((s) => s.attendanceRate < 75).length
    return { avg, high, low }
  }, [studentStats])

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="moom-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Attendance Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full moom-input font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Class</label>
            <select
              value={classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full moom-select"
            >
              {attendanceClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full moom-select"
            >
              {(currentClass?.sections || []).map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Search Student</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Roll or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full moom-input pl-9"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="moom-card p-3.5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total Students</span>
          <span className="text-xl font-bold font-mono text-white">{classStudents.length} Students</span>
        </div>
        <div className="moom-card p-3.5 border-[#6c63ff]/20 bg-[#6c63ff]/5">
          <span className="text-[10px] font-bold uppercase text-[#a78bfa] block mb-1">Class Average Attendance</span>
          <span className="text-xl font-black font-mono text-white">{classAvg.avg}%</span>
        </div>
        <div className="moom-card p-3.5 border-emerald-500/20 bg-emerald-500/5">
          <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">Regular Students (≥85%)</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{classAvg.high} Students</span>
        </div>
        <div className="moom-card p-3.5 border-rose-500/20 bg-rose-500/5">
          <span className="text-[10px] font-bold uppercase text-rose-400 block mb-1">At Risk / Irregular (&lt;75%)</span>
          <span className="text-xl font-bold font-mono text-rose-400">{classAvg.low} Students</span>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {studentStats.length === 0 ? (
          <div className="col-span-full moom-card p-10 text-center">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 font-semibold text-sm">No student records found.</p>
          </div>
        ) : (
          studentStats.map((st) => (
            <div
              key={st.id}
              className="moom-card p-4 hover:border-[#6c63ff]/40 transition space-y-3.5 relative overflow-hidden group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={st.avatar}
                    alt={st.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#1e1e2e] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm group-hover:text-[#a78bfa] transition">
                        {st.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[#1c1c28] text-[#a78bfa]">
                        Roll #{st.roll}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {st.className} · Section {st.section} · Phone: {st.guardianPhone}
                    </p>
                  </div>
                </div>

                {/* Percentage Badge */}
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black font-mono shadow ${
                      st.attendanceRate >= 85
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : st.attendanceRate >= 70
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {st.attendanceRate}%
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Monthly Attendance</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>
                    Present: <strong className="text-emerald-400 font-mono">{st.presentDays}</strong> / {st.totalSchoolDays} Days
                  </span>
                  <span>
                    Absent: <strong className="text-rose-400 font-mono">{st.absentDays}</strong> Days
                  </span>
                </div>
                <div className="h-2 bg-[#1c1c28] rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full transition-all"
                    style={{ width: `${(st.presentDays / (st.totalSchoolDays || 1)) * 100}%` }}
                    title={`Present ${st.presentDays} days`}
                  />
                  <div
                    className="bg-amber-500 h-full transition-all"
                    style={{ width: `${(st.lateDays / (st.totalSchoolDays || 1)) * 100}%` }}
                    title={`Late ${st.lateDays} days`}
                  />
                  <div
                    className="bg-sky-500 h-full transition-all"
                    style={{ width: `${(st.leaveDays / (st.totalSchoolDays || 1)) * 100}%` }}
                    title={`Leave ${st.leaveDays} days`}
                  />
                  <div
                    className="bg-rose-500 h-full transition-all"
                    style={{ width: `${(st.absentDays / (st.totalSchoolDays || 1)) * 100}%` }}
                    title={`Absent ${st.absentDays} days`}
                  />
                </div>
              </div>

              {/* Recent Absent Alert if any */}
              {st.absentDates.length > 0 && (
                <div className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Absent Dates: {st.absentDates.slice(0, 3).join(', ')}
                    {st.absentDates.length > 3 ? ` (+${st.absentDates.length - 3} more)` : ''}
                  </span>
                </div>
              )}

              {/* Bottom Action Button */}
              <div className="pt-2 border-t border-[#1e1e2e] flex items-center justify-between">
                <span className="text-[11px] text-slate-500">ID: {st.id}</span>
                <button
                  onClick={() => onSelectStudent(st)}
                  className="px-3.5 py-1.5 bg-[#6c63ff]/10 hover:bg-[#6c63ff] text-[#a78bfa] hover:text-white border border-[#6c63ff]/30 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View 360° Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB 4 – CLASS & SECTION MANAGEMENT
══════════════════════════════════════════════════════════════ */
function ManageClassesTab({ showToast }) {
  const { attendanceClasses, addClass, deleteClass, addSection, deleteSection } = useDashboard()
  const [newClassName, setNewClassName] = useState('')
  const [sectionInputs, setSectionInputs] = useState({})

  const handleAddClass = () => {
    if (!newClassName.trim()) return
    addClass(newClassName.trim())
    setNewClassName('')
    showToast(`Class "${newClassName.trim()}" added successfully.`)
  }

  const handleAddSection = (classId) => {
    const name = (sectionInputs[classId] || '').trim()
    if (!name) return
    addSection(classId, name)
    setSectionInputs((p) => ({ ...p, [classId]: '' }))
    showToast(`Section "${name}" added successfully.`)
  }

  return (
    <div className="space-y-4">
      {/* Add New Class */}
      <div className="moom-card p-5">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#a78bfa]" />
          Create New Class
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          e.g. Class 6, Class 7, Class 11, or HSC 1st Year
        </p>
        <div className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="Enter class name..."
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
            className="moom-input flex-1"
          />
          <button
            onClick={handleAddClass}
            className="moom-btn-primary px-5 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Class
          </button>
        </div>
      </div>

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attendanceClasses.map((cls) => (
          <div key={cls.id} className="moom-card p-4 space-y-3.5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#a78bfa]" />
                <span className="font-black text-white text-base">{cls.name}</span>
                <span className="text-[10px] text-slate-400 bg-[#1c1c28] px-2 py-0.5 rounded-full font-mono">
                  {cls.sections.length} Sections
                </span>
              </div>
              <button
                onClick={() => {
                  deleteClass(cls.id)
                  showToast(`Class "${cls.name}" deleted.`)
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Delete Class"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Sections Pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 block">Sections:</label>
              <div className="flex flex-wrap gap-2">
                {cls.sections.map((sec) => (
                  <div
                    key={sec}
                    className="flex items-center gap-1.5 bg-[#16161f] border border-[#1e1e2e] rounded-xl px-3 py-1 text-xs font-semibold text-slate-200"
                  >
                    <span>Section {sec}</span>
                    <button
                      onClick={() => {
                        deleteSection(cls.id, sec)
                        showToast(`Section "${sec}" deleted.`)
                      }}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Delete Section"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Section Input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="New section (e.g. C, Science, Iris)..."
                value={sectionInputs[cls.id] || ''}
                onChange={(e) => setSectionInputs((p) => ({ ...p, [cls.id]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSection(cls.id)}
                className="moom-input flex-1 text-xs"
              />
              <button
                onClick={() => handleAddSection(cls.id)}
                className="px-3.5 py-1.5 bg-[#6c63ff]/15 hover:bg-[#6c63ff]/25 text-[#a78bfa] border border-[#6c63ff]/30 rounded-xl text-xs font-bold transition inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Section
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN ATTENDANCE MANAGER COMPONENT
══════════════════════════════════════════════════════════════ */
export default function AttendanceManager() {
  const { resetAttendanceToDemo, schoolInfo } = useDashboard()
  const [activeTab, setActiveTab] = useState('take')
  const [toast, setToast] = useState(null)
  const [showGuide, setShowGuide] = useState(false)
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  const handleResetDemo = () => {
    resetAttendanceToDemo()
    showToast('✓ Full demo attendance data loaded for September & October!')
  }

  return (
    <div className="space-y-5">
      <Toast msg={toast} />

      {/* Student 360 Comprehensive Profile Modal */}
      {selectedStudentForProfile && (
        <Student360ProfileModal
          student={selectedStudentForProfile}
          onClose={() => setSelectedStudentForProfile(null)}
          initialTab="attendance"
        />
      )}

      {/* Header Bar */}
      <div className="moom-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#a78bfa] bg-[#6c63ff]/10 border border-[#6c63ff]/20 px-2.5 py-1 rounded-full mb-1">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span>Smart Digital Attendance Register</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Attendance & Absence Management
          </h2>
          <p className="text-xs text-slate-400">
            Class and section-wise digital attendance recording, daily and monthly class overviews, and student attendance profiles
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGuide((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition inline-flex items-center gap-1.5 ${
              showGuide
                ? 'bg-[#6c63ff]/20 text-[#a78bfa] border-[#6c63ff]/40'
                : 'bg-[#16161f] text-slate-300 border-[#1e1e2e] hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-[#a78bfa]" />
            <span>Guide</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            title="Reload Demo Attendance Data"
          >
            <Sparkles className="w-4 h-4" />
            <span>Reload Demo Data</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2.5 bg-[#16161f] hover:bg-[#1c1c28] rounded-xl text-slate-400 hover:text-white border border-[#1e1e2e] transition"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      {showGuide && (
        <div className="moom-card p-5 border-[#6c63ff]/30 bg-[#6c63ff]/5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-[#a78bfa]" />
              Guide to 4 Core Attendance Features:
            </h3>
            <button onClick={() => setShowGuide(false)} className="text-xs text-slate-400 hover:text-white">
              Close ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#16161f] p-3 rounded-xl border border-[#1e1e2e] space-y-1">
              <span className="font-bold text-[#a78bfa] block">1. Take Attendance:</span>
              <p className="text-slate-300">
                Select date, class, and section. Click P, A, L, or E buttons, or click 'Mark All Present' and click save.
              </p>
            </div>
            <div className="bg-[#16161f] p-3 rounded-xl border border-[#1e1e2e] space-y-1">
              <span className="font-bold text-emerald-400 block">2. Attendance Records:</span>
              <p className="text-slate-300">
                View daily attendance lists for any date, or switch to monthly view for daily bar charts and full registers.
              </p>
            </div>
            <div className="bg-[#16161f] p-3 rounded-xl border border-[#1e1e2e] space-y-1">
              <span className="font-bold text-amber-400 block">3. Student Profiles:</span>
              <p className="text-slate-300">
                Inspect student monthly attendance percentages (%), regular vs at-risk students, and detailed missed dates.
              </p>
            </div>
            <div className="bg-[#16161f] p-3 rounded-xl border border-[#1e1e2e] space-y-1">
              <span className="font-bold text-sky-400 block">4. Manage Classes:</span>
              <p className="text-slate-300">
                Create new classes like Class 6 A, 6 B and dynamically add or remove sections.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex bg-[#16161f] p-1.5 rounded-2xl border border-[#1e1e2e] gap-1.5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === id
                ? 'bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#1c1c28]'
            }`}
          >
            <Icon className="w-4 h-4" />
            <div className="text-left">
              <span className="block leading-tight">{label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'take' && <TakeAttendanceTab showToast={showToast} />}
      {activeTab === 'records' && (
        <CheckAttendanceTab onSelectStudent={(st) => setSelectedStudentForProfile(st)} />
      )}
      {activeTab === 'profiles' && (
        <StudentAttendanceProfilesTab onSelectStudent={(st) => setSelectedStudentForProfile(st)} />
      )}
      {activeTab === 'manage' && <ManageClassesTab showToast={showToast} />}
    </div>
  )
}
