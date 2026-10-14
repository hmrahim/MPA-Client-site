import { useState, useRef, useCallback } from 'react'
import { CheckCircle2, X, AlertTriangle, ImagePlus, Upload, Link2, Inbox } from 'lucide-react'

/* ── Site routes (used by "link" selects) ── */
export const SITE_ROUTES = [
  { value: '/', label: 'Home (/)' },
  { value: '/notices', label: 'Notices (/notices)' },
  { value: '/results', label: 'Results (/results)' },
  { value: '/toppers', label: 'Top 10 (/toppers)' },
  { value: '/academics', label: 'Academics (/academics)' },
  { value: '/events', label: 'Events (/events)' },
  { value: '/teachers', label: 'Teachers (/teachers)' },
  { value: '/admission', label: 'Admission (/admission)' },
  { value: '/contact', label: 'Contact (/contact)' },
  { value: '/student-dashboard', label: 'Student Portal (/student-dashboard)' },
]

/* ── Toast ── */
export function useToast() {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)
  const show = useCallback((message, tone = 'ok') => {
    setToast({ message, tone })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3000)
  }, [])
  const node = toast ? (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-[90] bg-[#16161f] text-white px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
        toast.tone === 'error' ? 'border-rose-500/50' : 'border-[#6c63ff]/40'
      }`}
    >
      {toast.tone === 'error' ? (
        <AlertTriangle className="w-5 h-5 text-rose-400" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
      )}
      <span className="font-semibold text-xs">{toast.message}</span>
    </div>
  ) : null
  return [node, show]
}

/* ── Page header ── */
export function PageHeader({ icon: Icon, badge, title, subtitle, actions, accent = 'violet' }) {
  const tones = {
    violet: 'text-[#a78bfa] bg-[#6c63ff]/10 border-[#6c63ff]/25',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  }
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 moom-card p-5">
      <div className="min-w-0">
        <div
          className={`inline-flex items-center gap-2 text-xs font-bold border px-2.5 py-1 rounded-full mb-1.5 ${tones[accent]}`}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{badge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}

/* ── Tabs ── */
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto moom-scrollbar pb-1" role="tablist">
      {tabs.map((t) => {
        const Icon = t.icon
        const on = active === t.id
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.id)}
            className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
              on
                ? 'bg-gradient-to-r from-[#6c63ff]/25 to-[#a78bfa]/10 border-[#6c63ff]/40 text-white'
                : 'bg-[#16161f] border-[#1e1e2e] text-slate-400 hover:text-white'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">{t.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Modal ── */
export function Modal({ title, subtitle, onClose, children, footer, wide }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${
          wide ? 'max-w-4xl' : 'max-w-xl'
        } max-h-[92vh] flex flex-col bg-[#111118] border border-[#1e1e2e] rounded-2xl shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#1e1e2e] shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-black text-white truncate">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto moom-scrollbar p-5">{children}</div>
        {footer && <div className="px-5 py-3.5 border-t border-[#1e1e2e] shrink-0 bg-[#111118]">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-bold">
            Cancel
          </button>
          <button onClick={onConfirm} className="moom-btn-rose px-4 py-2 rounded-xl text-xs font-bold">
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>
    </Modal>
  )
}

export function EmptyState({ icon: Icon = Inbox, title, hint, action }) {
  return (
    <div className="moom-card p-10 text-center">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-[#a78bfa]" />
      </div>
      <p className="text-sm font-bold text-white">{title}</p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'violet', onClick }) {
  const tones = {
    violet: 'text-[#a78bfa] bg-[#6c63ff]/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    sky: 'text-sky-400 bg-sky-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
  }
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag onClick={onClick} className="moom-card p-4 text-left w-full flex items-center gap-3.5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate">{label}</p>
        <p className="text-xl font-black text-white leading-tight">{value}</p>
        {hint && <p className="text-[10px] text-slate-400 truncate">{hint}</p>}
      </div>
    </Tag>
  )
}

/* ── Image helpers ── */
export function compressImageFile(file, maxSide = 1280, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Not a valid image'))
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export function Thumb({ src, className = 'w-10 h-10', alt = '' }) {
  const [broken, setBroken] = useState(false)
  if (!src || broken) {
    return (
      <div
        className={`${className} rounded-lg bg-[#16161f] border border-[#1e1e2e] flex items-center justify-center shrink-0`}
      >
        <ImagePlus className="w-4 h-4 text-slate-600" />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setBroken(true)}
      className={`${className} rounded-lg object-cover border border-[#1e1e2e] shrink-0`}
    />
  )
}

function ImageField({ value, onChange, id }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const isData = typeof value === 'string' && value.startsWith('data:')

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      onChange(await compressImageFile(file))
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Thumb src={value} className="w-16 h-16" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="relative">
            <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id={id}
              className="moom-input w-full pl-8"
              placeholder="https://… image URL"
              value={isData ? '(uploaded image)' : value || ''}
              readOnly={isData}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="moom-btn-ghost px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1.5"
            >
              <Upload className="w-3 h-3" />
              {busy ? 'Processing…' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-400"
              >
                Remove
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>
          {err && <p className="text-[11px] text-rose-400">{err}</p>}
        </div>
      </div>
    </div>
  )
}

/* ── Field renderer ──
   field = { key, label, type, required, placeholder, options, help, rows, full }
   types: text | textarea | number | select | toggle | image | stars | route | list */
export function Field({ field, value, onChange, error, idPrefix = 'f' }) {
  const id = `${idPrefix}-${field.key}`
  const common = 'moom-input w-full'
  let control

  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          id={id}
          rows={field.rows || 3}
          className={`${common} resize-y`}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
      break
    case 'number':
      control = (
        <input
          id={id}
          type="number"
          className={common}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
      )
      break
    case 'select':
    case 'route': {
      const options = field.type === 'route' ? SITE_ROUTES : field.options || []
      const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
      const hasValue = normalized.some((o) => o.value === value)
      control = (
        <select id={id} className={`moom-select w-full`} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {!hasValue && <option value={value ?? ''}>{value || '— select —'}</option>}
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    }
    case 'toggle':
      control = (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full border transition ${
            value ? 'bg-[#6c63ff] border-[#6c63ff]' : 'bg-[#16161f] border-[#1e1e2e]'
          }`}
        >
          <span
            className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all ${
              value ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      )
      break
    case 'image':
      control = <ImageField id={id} value={value} onChange={onChange} />
      break
    case 'stars':
      control = (
        <div className="flex gap-1" id={id}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star`}
              onClick={() => onChange(n)}
              className={`text-xl leading-none ${n <= (value || 0) ? 'text-amber-400' : 'text-slate-600'}`}
            >
              ★
            </button>
          ))}
        </div>
      )
      break
    case 'list':
      control = (
        <textarea
          id={id}
          rows={field.rows || 3}
          className={`${common} resize-y`}
          placeholder={field.placeholder || 'One item per line'}
          value={Array.isArray(value) ? value.join('\n') : value ?? ''}
          onChange={(e) => onChange(e.target.value.split('\n'))}
        />
      )
      break
    default:
      control = (
        <input
          id={id}
          type="text"
          className={common}
          placeholder={field.placeholder}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }

  return (
    <div className={field.full ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="block text-[11px] font-bold text-slate-300 mb-1">
        {field.label}
        {field.required && <span className="text-rose-400"> *</span>}
      </label>
      {control}
      {field.help && !error && <p className="text-[10px] text-slate-500 mt-1">{field.help}</p>}
      {error && <p className="text-[11px] text-rose-400 mt-1">{error}</p>}
    </div>
  )
}

/* ── Download helpers ── */
export function downloadText(filename, text, mime = 'application/json') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 500)
}

export function toCsv(rows, columns) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  return [columns.map((c) => esc(c.label)).join(','), ...rows.map((r) => columns.map((c) => esc(r[c.key])).join(','))].join(
    '\n'
  )
}

export const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}
