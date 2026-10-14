import { useRef, useState } from 'react'
import {
  LayoutDashboard,
  ExternalLink,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Layers,
  PencilLine,
  Inbox,
  HardDrive,
  History,
  ChevronRight,
} from 'lucide-react'
import {
  useSiteVersion,
  getSection,
  getSectionMeta,
  isSectionCustomized,
  exportBackup,
  importBackup,
  resetAllSections,
  useActivityLog,
  clearActivityLog,
  useNewSubmissionCount,
  SITE_STORAGE_KEYS,
} from '../../lib/siteStore'
import { PageHeader, StatCard, ConfirmModal, useToast, downloadText, formatDateTime } from './CmsKit'
import { SECTION_META, CMS_TABS, countItems, collectMedia } from './cmsMeta'

const STORAGE_BUDGET = 5 * 1024 * 1024 // typical localStorage quota (~5 MB)

function storageUsage() {
  try {
    let bytes = 0
    Object.values(SITE_STORAGE_KEYS).forEach((k) => {
      bytes += (localStorage.getItem(k) || '').length * 2
    })
    return bytes
  } catch {
    return 0
  }
}

const fmtBytes = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

/* Content checks that point out things an editor probably wants to fix. */
function runHealthChecks() {
  const issues = []
  const bilingualKeys = Object.keys(SECTION_META).filter((k) => {
    const v = getSection(k)
    return v && Array.isArray(v.bn)
  })

  bilingualKeys.forEach((k) => {
    const v = getSection(k)
    if (v.bn.length !== (v.en || []).length) {
      issues.push({
        level: 'warn',
        section: k,
        text: `${SECTION_META[k].label}: content lists are out of sync (${v.bn.length} vs ${(v.en || []).length} items)`,
      })
    }
  })

  const slides = getSection('slideImages') || []
  if (slides.length < 3) issues.push({ level: 'warn', section: 'slideImages', text: `Hero slider has only ${slides.length} slide(s) — 3 or more looks better` })

  const imageChecks = [
    ['events', 'image', 'Events'],
    ['gallery', 'src', 'Gallery'],
    ['teachers', 'photo', 'Faculty'],
    ['reviews', 'avatar', 'Reviews'],
  ]
  imageChecks.forEach(([section, field, label]) => {
    const list = getSection(section)?.bn || []
    const missing = list.filter((i) => !i[field]).length
    if (missing) issues.push({ level: 'warn', section, text: `${label}: ${missing} item(s) have no image` })
  })

  const toppers = getSection('toppers') || {}
  const noPhoto = Object.values(toppers).flat().filter((t) => !t.photo).length
  if (noPhoto) issues.push({ level: 'warn', section: 'toppers', text: `Top performers: ${noPhoto} student(s) have no photo` })

  const notices = getSection('notices')?.bn || []
  if (notices.length && !notices.some((n) => n.pinned)) {
    issues.push({ level: 'info', section: 'notices', text: 'No notice is pinned — important announcements can be pinned to the top' })
  }

  const contact = getSection('contact') || {}
  ;['phone', 'email', 'address'].forEach((f) => {
    if (!String(contact[f] || '').trim()) issues.push({ level: 'error', section: 'contact', text: `Contact details: ${f} is empty` })
  })

  const bigImages = collectMedia(getSection).filter((m) => m.isData && m.url.length > 700_000).length
  if (bigImages) issues.push({ level: 'warn', section: 'slideImages', text: `${bigImages} uploaded image(s) are larger than ~500 KB — use an image URL to save browser storage` })

  return issues
}

export default function CmsOverview({ onNavigate }) {
  useSiteVersion()
  const log = useActivityLog()
  const newInbox = useNewSubmissionCount()
  const [toastNode, toast] = useToast()
  const [confirm, setConfirm] = useState(null)
  const fileRef = useRef(null)

  const keys = Object.keys(SECTION_META)
  const meta = getSectionMeta()
  const customizedCount = keys.filter((k) => isSectionCustomized(k)).length
  const totalItems = keys.reduce((sum, k) => sum + (k === 'contact' ? 0 : countItems(k, getSection(k))), 0)
  const issues = runHealthChecks()
  const used = storageUsage()
  const pct = Math.min(100, Math.round((used / STORAGE_BUDGET) * 100))

  const doExport = () => {
    downloadText(`mirashani-cms-backup-${new Date().toISOString().slice(0, 10)}.json`, exportBackup())
    toast('✓ Backup downloaded')
  }

  const doImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const res = importBackup(await file.text())
    if (res.ok) toast(`✓ Backup restored (${res.count} customized sections)`)
    else toast(res.error, 'error')
  }

  const levelStyle = {
    error: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
    warn: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
    info: 'text-sky-400 bg-sky-500/10 border-sky-500/25',
  }

  return (
    <div className="space-y-6">
      {toastNode}
      <PageHeader
        icon={LayoutDashboard}
        badge="Website CMS"
        title="Website Control Center"
        subtitle="Manage every page of the public website — content, media, enquiries and backups — from one place"
        actions={
          <>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="moom-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open website
            </a>
            <button onClick={doExport} className="moom-btn-ghost px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Backup
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="moom-btn-ghost px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" /> Restore
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={doImport} data-testid="cms-restore-input" />
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon={Layers} label="Content sections" value={keys.length} hint={`${totalItems} items live`} tone="violet" />
        <StatCard icon={PencilLine} label="Customized" value={`${customizedCount}/${keys.length}`} hint="Edited from dashboard" tone="amber" />
        <StatCard
          icon={Inbox}
          label="New in inbox"
          value={newInbox}
          hint="Applications & messages"
          tone={newInbox ? 'rose' : 'emerald'}
          onClick={() => onNavigate(CMS_TABS.inbox)}
        />
        <StatCard
          icon={HardDrive}
          label="Browser storage"
          value={`${pct}%`}
          hint={`${fmtBytes(used)} of ~5 MB`}
          tone={pct > 80 ? 'rose' : pct > 50 ? 'amber' : 'sky'}
        />
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        {/* Section grid */}
        <div className="xl:col-span-2 space-y-3">
          <h3 className="text-sm font-black text-white">All website sections</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {keys.map((k) => {
              const m = SECTION_META[k]
              const Icon = m.icon
              const custom = isSectionCustomized(k)
              return (
                <button
                  key={k}
                  onClick={() => onNavigate(m.page, m.tab)}
                  className="moom-card p-4 text-left flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#6c63ff]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{m.label}</p>
                    <p className="text-[11px] text-slate-400">
                      {k === 'contact' ? 'Singleton record' : `${countItems(k, getSection(k))} items`} ·{' '}
                      <span className={custom ? 'text-amber-400' : ''}>
                        {custom ? `edited ${meta[k] ? formatDateTime(meta[k]) : ''}` : 'default'}
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#a78bfa] transition" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <div className="moom-card p-4 space-y-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              {issues.length === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              Content health
            </h3>
            {issues.length === 0 ? (
              <p className="text-xs text-slate-400">Everything looks good. No missing images, mismatches or empty contact details.</p>
            ) : (
              <ul className="space-y-2">
                {issues.map((i, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onNavigate(SECTION_META[i.section].page, SECTION_META[i.section].tab)}
                      className={`w-full text-left text-[11px] leading-snug px-3 py-2 rounded-lg border ${levelStyle[i.level]}`}
                    >
                      {i.text}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="moom-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#a78bfa]" /> Recent activity
              </h3>
              {log.length > 0 && (
                <button onClick={clearActivityLog} className="text-[10px] font-bold text-slate-500 hover:text-white">
                  Clear
                </button>
              )}
            </div>
            {log.length === 0 ? (
              <p className="text-xs text-slate-400">Changes you publish will be listed here.</p>
            ) : (
              <ul className="divide-y divide-[#1e1e2e] max-h-72 overflow-y-auto moom-scrollbar">
                {log.slice(0, 15).map((l) => (
                  <li key={l.id} className="py-2">
                    <p className="text-xs font-semibold text-slate-200">
                      {SECTION_META[l.section]?.label || 'All sections'}{' '}
                      <span className="text-[10px] font-bold uppercase text-[#a78bfa]">{l.action}</span>
                    </p>
                    {l.detail && <p className="text-[11px] text-slate-400">{l.detail}</p>}
                    <p className="text-[10px] font-mono text-slate-500">{formatDateTime(l.at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="moom-card p-4 space-y-2 border-rose-500/20">
            <h3 className="text-sm font-black text-white">Danger zone</h3>
            <p className="text-[11px] text-slate-400">Discard every dashboard edit and restore the original website content.</p>
            <button
              onClick={() =>
                setConfirm({
                  title: 'Restore ALL website content',
                  confirmLabel: 'Restore everything',
                  message:
                    'All edited sections (notices, events, teachers, toppers, contact details…) will go back to the original content. Inbox submissions are kept. Download a backup first if unsure.',
                  onConfirm: () => {
                    resetAllSections()
                    setConfirm(null)
                    toast('✓ Website content restored to defaults')
                  },
                })
              }
              className="moom-btn-rose px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore all defaults
            </button>
          </div>
        </div>
      </div>

      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
