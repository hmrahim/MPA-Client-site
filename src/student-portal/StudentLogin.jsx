import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, LogIn, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
import { useDashboard } from '../dashboard/context/DashboardContext'

/**
 * Student sign-in: Class → Section → Roll + Date of birth.
 * NOTE: this is a front-end demo gate only. Real student accounts need a backend.
 */
export default function StudentLogin({ onLogin }) {
  const { students, attendanceClasses: classes, schoolInfo } = useDashboard()
  const [classId, setClassId] = useState(classes[classes.length - 1]?.id || '')
  const [section, setSection] = useState(classes[classes.length - 1]?.sections[0] || '')
  const [roll, setRoll] = useState('')
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')

  const sections = classes.find((c) => c.id === classId)?.sections || []

  const submit = (e) => {
    e.preventDefault()
    const found = students.find(
      (s) =>
        s.classId === classId &&
        s.section === section &&
        parseInt(s.roll, 10) === parseInt(roll, 10) &&
        s.dob === dob
    )
    if (!found) {
      setError('No student matches these details. Check class, section, roll and date of birth.')
      return
    }
    setError('')
    onLogin(found.id)
  }

  const fillDemo = () => {
    const demo = students.find((s) => s.id === 'STU-1001') || students[0]
    if (!demo) return
    setClassId(demo.classId)
    setSection(demo.section)
    setRoll(demo.roll)
    setDob(demo.dob)
    setError('')
  }

  return (
    <div className="moom-dashboard-root min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="moom-ambient-glow" style={{ width: 520, height: 520, top: -200, left: -160 }} />
      <div className="moom-ambient-glow" style={{ width: 460, height: 460, top: 'auto', left: 'auto', bottom: -180, right: -140 }} />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to website
        </Link>

        <div className="moom-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6c63ff] to-[#a78bfa] flex items-center justify-center shadow-[0_0_24px_rgba(108,99,255,0.5)]">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">Student Portal</h1>
              <p className="text-xs text-slate-400">{schoolInfo.name}</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Class</label>
                <select
                  value={classId}
                  onChange={(e) => {
                    setClassId(e.target.value)
                    setSection(classes.find((c) => c.id === e.target.value)?.sections[0] || '')
                  }}
                  className="w-full moom-select"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section / Group</label>
                <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full moom-select">
                  {sections.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Class Roll Number</label>
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="e.g. 01"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full moom-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Date of Birth</label>
              <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)} className="w-full moom-input font-mono" />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="w-full moom-btn-primary py-2.5 rounded-xl text-sm font-bold inline-flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Open My Portal
            </button>
          </form>

          <button
            type="button"
            onClick={fillDemo}
            className="mt-4 w-full moom-btn-ghost py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" /> Fill demo student login
          </button>
          <p className="text-[10px] text-slate-500 mt-3 text-center leading-relaxed">
            Demo sign-in using school records (class, roll &amp; date of birth). A production portal needs secure student accounts.
          </p>
        </div>
      </div>
    </div>
  )
}
