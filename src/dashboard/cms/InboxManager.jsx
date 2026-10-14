import { useMemo, useState, useEffect } from 'react'
import {
  Inbox,
  UserCheck,
  MessageSquare,
  BellRing,
  Search,
  Trash2,
  Download,
  Eye,
  Mail,
  Phone,
  GraduationCap,
  Send,
  RefreshCw,
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { useSubmissions, updateSubmission, deleteSubmissions, addSubmission } from '../../lib/siteStore'
import api from '../../lib/api'
import {
  PageHeader,
  Tabs,
  Modal,
  ConfirmModal,
  EmptyState,
  StatCard,
  useToast,
  downloadText,
  toCsv,
  formatDateTime,
} from './CmsKit'

const STATUS = {
  admission: [
    { id: 'new', label: 'New', tone: 'sky' },
    { id: 'review', label: 'In review', tone: 'amber' },
    { id: 'accepted', label: 'Accepted', tone: 'emerald' },
    { id: 'rejected', label: 'Rejected', tone: 'rose' },
    { id: 'enrolled', label: 'Enrolled', tone: 'violet' },
  ],
  contact: [
    { id: 'new', label: 'New', tone: 'sky' },
    { id: 'read', label: 'Read', tone: 'slate' },
    { id: 'replied', label: 'Replied', tone: 'emerald' },
    { id: 'archived', label: 'Archived', tone: 'slate' },
  ],
  subscriber: [
    { id: 'new', label: 'New', tone: 'sky' },
    { id: 'active', label: 'Active', tone: 'emerald' },
    { id: 'unsubscribed', label: 'Unsubscribed', tone: 'rose' },
  ],
}

const TONES = {
  sky: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  rose: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  violet: 'bg-[#6c63ff]/15 text-[#a78bfa] border-[#6c63ff]/25',
  slate: 'bg-white/5 text-slate-400 border-white/10',
}

function StatusPill({ type, status }) {
  const s = STATUS[type].find((x) => x.id === status) || STATUS[type][0]
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${TONES[s.tone]}`}>
      {s.label}
    </span>
  )
}

const CLASS_NUM = { Six: 6, Seven: 7, Eight: 8, Nine: 9, Ten: 10 }

function sectionFor(classNum, group = '') {
  if (classNum < 9) return 'A'
  if (/বিজ্ঞান|science/i.test(group)) return 'Science'
  if (/ব্যবসায়|business|commerce/i.test(group)) return 'Business'
  return 'Humanities'
}

const COLUMNS = {
  admission: [
    { key: 'appTrackingNo', label: 'Tracking no' },
    { key: 'studentName', label: 'Student', bold: true },
    { key: 'desiredClass', label: 'Class' },
    { key: 'guardianPhone', label: 'Guardian phone' },
    { key: 'createdAt', label: 'Applied', date: true },
  ],
  contact: [
    { key: 'name', label: 'From', bold: true },
    { key: 'subject', label: 'Subject' },
    { key: 'phone', label: 'Phone' },
    { key: 'createdAt', label: 'Received', date: true },
  ],
  subscriber: [
    { key: 'phone', label: 'Mobile number', bold: true },
    { key: 'lang', label: 'Language' },
    { key: 'createdAt', label: 'Subscribed', date: true },
  ],
}

const DETAIL_FIELDS = {
  admission: [
    ['studentName', 'Student name'],
    ['desiredClass', 'Desired class'],
    ['preferredGroup', 'Preferred group'],
    ['gender', 'Gender'],
    ['dob', 'Date of birth'],
    ['fatherName', "Father's name"],
    ['motherName', "Mother's name"],
    ['guardianPhone', 'Guardian phone'],
    ['address', 'Address'],
    ['previousSchool', 'Previous school'],
    ['appTrackingNo', 'Tracking no'],
  ],
  contact: [
    ['name', 'Name'],
    ['phone', 'Phone'],
    ['email', 'Email'],
    ['subject', 'Subject'],
    ['message', 'Message'],
  ],
  subscriber: [
    ['phone', 'Mobile number'],
    ['lang', 'Language'],
  ],
}

export default function InboxManager({ setActiveTab, initialType = 'admission' }) {
  const { addStudent, students } = useDashboard()
  const all = useSubmissions()
  const [toastNode, toast] = useToast()

  const [type, setType] = useState(initialType)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [openId, setOpenId] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const [syncing, setSyncing] = useState(false)

  const syncBackendSubmissions = async () => {
    setSyncing(true)
    try {
      const res = await api.getSubmissions()
      if (res && res.success && Array.isArray(res.data)) {
        res.data.forEach((srv) => {
          const srvId = srv.appTrackingNo || srv._id
          const exists = all.some((local) => local.id === srvId || local._id === srv._id)
          if (!exists) {
            addSubmission(srv.type || 'admission', {
              id: srvId,
              _id: srv._id,
              ...srv,
            })
          }
        })
      }
    } catch (err) {
      console.warn('Submissions sync warning:', err)
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    syncBackendSubmissions()
  }, [])

  const byType = (t) => all.filter((s) => s.type === t)
  const countNew = (t) => byType(t).filter((s) => s.status === 'new').length

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return byType(type).filter((s) => {
      if (statusFilter && s.status !== statusFilter) return false
      if (!q) return true
      return Object.values(s).some((v) => typeof v === 'string' && v.toLowerCase().includes(q))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, type, query, statusFilter])

  const open = all.find((s) => s.id === openId)

  const openDetail = (item) => {
    setOpenId(item.id)
    if (item.status === 'new' && item.type !== 'subscriber') {
      const nextStatus = item.type === 'contact' ? 'read' : 'review'
      updateSubmission(item.id, { status: nextStatus })
      if (item._id) {
        api.updateSubmission(item._id, { status: nextStatus }).catch((err) => console.warn(err))
      }
    }
  }

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))
  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const exportCsv = () => {
    const cols = [...COLUMNS[type], ...DETAIL_FIELDS[type].filter(([k]) => !COLUMNS[type].some((c) => c.key === k)).map(([key, label]) => ({ key, label })), { key: 'status', label: 'Status' }]
    downloadText(`${type}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows, cols), 'text/csv')
    toast('✓ CSV exported')
  }

  const enroll = (item) => {
    const classNum = CLASS_NUM[item.desiredClass] || 6
    const section = sectionFor(classNum, item.preferredGroup)
    const className = `Class ${classNum}`
    const classId = `ac${classNum}`
    const sameRoom = students.filter((s) => s.classId === classId && s.section === section)
    const nextRoll = String(Math.max(0, ...sameRoom.map((s) => parseInt(s.roll, 10) || 0)) + 1).padStart(2, '0')
    const created = addStudent({
      name: item.studentName,
      classId,
      className,
      section,
      roll: nextRoll,
      gender: item.gender || 'Male',
      bloodGroup: '—',
      dob: item.dob || '',
      fatherName: item.fatherName || '',
      motherName: item.motherName || '',
      guardianPhone: item.guardianPhone || '',
      address: item.address || '',
      admissionDate: new Date().toISOString().slice(0, 10),
      previousSchool: item.previousSchool || '',
    })
    updateSubmission(item.id, { status: 'enrolled', enrolledAs: created.id })
    toast(`✓ ${item.studentName} enrolled in ${className} (${section}) · Roll ${nextRoll}`)
  }

  const tabs = [
    { id: 'admission', label: 'Admission Applications', icon: UserCheck, count: byType('admission').length },
    { id: 'contact', label: 'Contact Messages', icon: MessageSquare, count: byType('contact').length },
    { id: 'subscriber', label: 'SMS Subscribers', icon: BellRing, count: byType('subscriber').length },
  ]

  return (
    <div className="space-y-5">
      {toastNode}
      <PageHeader
        icon={Inbox}
        badge="Website CMS · Inbox"
        title="Website Inbox"
        subtitle="Everything visitors submit on the public site: admission forms, contact messages and notice subscribers"
        accent="rose"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={UserCheck} label="New applications" value={countNew('admission')} tone="sky" onClick={() => setType('admission')} />
        <StatCard icon={MessageSquare} label="Unread messages" value={countNew('contact')} tone="amber" onClick={() => setType('contact')} />
        <StatCard icon={BellRing} label="New subscribers" value={countNew('subscriber')} tone="emerald" onClick={() => setType('subscriber')} />
        <StatCard
          icon={GraduationCap}
          label="Enrolled from web"
          value={byType('admission').filter((s) => s.status === 'enrolled').length}
          tone="violet"
        />
      </div>

      <Tabs
        tabs={tabs}
        active={type}
        onChange={(t) => {
          setType(t)
          setSelected(new Set())
          setStatusFilter('')
          setQuery('')
        }}
      />

      <div className="moom-card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            aria-label="Search inbox"
            className="moom-input w-full pl-8"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Status filter" className="moom-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS[type].map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-slate-500 font-semibold">{rows.length} shown</span>
        <div className="ml-auto flex items-center gap-2">
          {type === 'subscriber' && (
            <button
              onClick={() => setActiveTab && setActiveTab('notices')}
              className="moom-btn-emerald px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send SMS
            </button>
          )}
          {selected.size > 0 && (
            <button
              onClick={() =>
                setConfirm({
                  title: `Delete ${selected.size} item(s)`,
                  message: 'Selected submissions will be permanently removed from the inbox.',
                  onConfirm: () => {
                    deleteSubmissions([...selected])
                    setSelected(new Set())
                    setConfirm(null)
                    toast('✓ Deleted')
                  },
                })
              }
              className="moom-btn-rose px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.size})
            </button>
          )}
          <button
            onClick={exportCsv}
            disabled={!rows.length}
            className="moom-btn-ghost px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={byType(type).length === 0 ? 'Nothing here yet' : 'No matching items'}
          hint={
            byType(type).length === 0
              ? 'New submissions from the public website will appear here automatically.'
              : 'Try clearing the search or status filter.'
          }
        />
      ) : (
        <div className="moom-table-container moom-scrollbar">
          <table className="moom-table">
            <thead>
              <tr>
                <th className="w-8">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                  />
                </th>
                {COLUMNS[type].map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th>Status</th>
                <th className="text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={r.status === 'new' ? 'bg-[#6c63ff]/[0.04]' : ''}>
                  <td>
                    <input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                  </td>
                  {COLUMNS[type].map((c) => (
                    <td key={c.key} className={c.bold ? 'font-bold text-white' : 'text-slate-300'}>
                      {c.date ? formatDateTime(r[c.key]) : r[c.key] || <span className="text-slate-600">—</span>}
                    </td>
                  ))}
                  <td>
                    <StatusPill type={type} status={r.status} />
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => openDetail(r)}
                      aria-label={`Open ${r.id}`}
                      className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal
          wide
          title={open.type === 'admission' ? open.studentName || 'Admission application' : open.type === 'contact' ? open.subject || 'Message' : open.phone}
          subtitle={`${open.id} · ${formatDateTime(open.createdAt)}`}
          onClose={() => setOpenId(null)}
          footer={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="inbox-status" className="text-[11px] font-bold text-slate-400">
                  Status
                </label>
                <select
                  id="inbox-status"
                  className="moom-select"
                  value={open.status}
                  onChange={(e) => {
                    const nextVal = e.target.value
                    updateSubmission(open.id, { status: nextVal })
                    if (open._id) {
                      api.updateSubmission(open._id, { status: nextVal }).catch((err) => console.warn(err))
                    }
                  }}
                >
                  {STATUS[open.type].map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {open.type === 'admission' && open.status !== 'enrolled' && (
                  <button
                    onClick={() => {
                      enroll(open)
                      if (open._id) {
                        api.updateSubmission(open._id, { status: 'enrolled' }).catch((err) => console.warn(err))
                      }
                    }}
                    className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" /> Enroll as student
                  </button>
                )}
                {open.type === 'contact' && open.email && (
                  <a
                    href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject || 'Your message'}`)}`}
                    onClick={() => {
                      updateSubmission(open.id, { status: 'replied' })
                      if (open._id) {
                        api.updateSubmission(open._id, { status: 'replied' }).catch((err) => console.warn(err))
                      }
                    }}
                    className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Reply by email
                  </a>
                )}
                {(open.phone || open.guardianPhone) && (
                  <a
                    href={`tel:${open.phone || open.guardianPhone}`}
                    className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                )}
                <button
                  onClick={() =>
                    setConfirm({
                      title: 'Delete submission',
                      message: 'This submission will be permanently removed.',
                      onConfirm: () => {
                        deleteSubmissions(open.id)
                        if (open._id) {
                          api.deleteSubmission(open._id).catch((err) => console.warn(err))
                        }
                        setOpenId(null)
                        setConfirm(null)
                        toast('✓ Deleted')
                      },
                    })
                  }
                  className="moom-btn-rose px-3 py-2 rounded-xl text-xs font-bold"
                  aria-label="Delete submission"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          }
        >
          <div className="space-y-5">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {DETAIL_FIELDS[open.type]
                .filter(([k]) => open[k])
                .map(([k, label]) => (
                  <div key={k} className={k === 'message' || k === 'address' ? 'sm:col-span-2' : ''}>
                    <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</dt>
                    <dd className="text-sm text-slate-200 mt-0.5 whitespace-pre-wrap break-words">{open[k]}</dd>
                  </div>
                ))}
              {open.enrolledAs && (
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Student ID</dt>
                  <dd className="text-sm text-[#a78bfa] mt-0.5 font-mono">{open.enrolledAs}</dd>
                </div>
              )}
            </dl>
            <div>
              <label htmlFor="inbox-note" className="block text-[11px] font-bold text-slate-300 mb-1">
                Internal note (only visible in dashboard)
              </label>
              <textarea
                id="inbox-note"
                rows={3}
                className="moom-input w-full resize-y"
                placeholder="e.g. Called guardian, test on 10 Dec"
                value={open.note || ''}
                onChange={(e) => updateSubmission(open.id, { note: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      )}

      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
