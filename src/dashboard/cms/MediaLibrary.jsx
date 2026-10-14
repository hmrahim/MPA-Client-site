import { useMemo, useState } from 'react'
import { Images, Search, Copy, Replace, ScanSearch, ImageOff, Link2, Upload } from 'lucide-react'
import { useSiteVersion, getSection, saveSection } from '../../lib/siteStore'
import { PageHeader, Modal, EmptyState, StatCard, Thumb, useToast } from './CmsKit'
import { collectMedia, IMAGE_SECTIONS } from './cmsMeta'

const short = (url) => (url.startsWith('data:') ? 'Uploaded image (embedded)' : url.replace(/^https?:\/\//, '').slice(0, 56))

/** Replace every occurrence of oldUrl inside the image fields of the content sections. */
function replaceEverywhere(oldUrl, newUrl) {
  let touched = 0
  IMAGE_SECTIONS.forEach(({ section, keys }) => {
    const data = getSection(section)
    if (!data) return
    let changed = false
    const patchList = (list) =>
      list.map((item) => {
        const copy = { ...item }
        keys.forEach((k) => {
          if (copy[k] === oldUrl) {
            copy[k] = newUrl
            changed = true
            touched += 1
          }
        })
        return copy
      })
    let next
    if (Array.isArray(data)) next = patchList(data)
    else if (Array.isArray(data.bn)) next = { ...data, bn: patchList(data.bn), en: patchList(data.en || []) }
    else next = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? patchList(v) : v]))
    if (changed) saveSection(section, next, 'Image replaced from Media Library')
  })
  return touched
}

export default function MediaLibrary() {
  useSiteVersion()
  const [toastNode, toast] = useToast()
  const [query, setQuery] = useState('')
  const [usageFilter, setUsageFilter] = useState('')
  const [broken, setBroken] = useState({}) // url -> true/false
  const [checking, setChecking] = useState(false)
  const [replacing, setReplacing] = useState(null)
  const [newUrl, setNewUrl] = useState('')

  const media = collectMedia(getSection)
  const labels = [...new Set(media.flatMap((m) => m.usages.map((u) => u.label)))]

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return media.filter((m) => {
      if (usageFilter && !m.usages.some((u) => u.label === usageFilter)) return false
      if (!q) return true
      return m.url.toLowerCase().includes(q) || m.usages.some((u) => (u.title || '').toLowerCase().includes(q))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.length, query, usageFilter, JSON.stringify(media.map((m) => m.url))])

  const embedded = media.filter((m) => m.isData).length
  const brokenCount = Object.values(broken).filter(Boolean).length

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      toast('✓ URL copied')
    } catch {
      toast('Copy is not available in this browser', 'error')
    }
  }

  const checkAll = async () => {
    setChecking(true)
    const external = media.filter((m) => !m.isData)
    const results = {}
    const test = (url) =>
      new Promise((resolve) => {
        const img = new Image()
        const timer = setTimeout(() => resolve(true), 8000)
        img.onload = () => {
          clearTimeout(timer)
          resolve(false)
        }
        img.onerror = () => {
          clearTimeout(timer)
          resolve(true)
        }
        img.src = url
      })
    for (let i = 0; i < external.length; i += 6) {
      const batch = external.slice(i, i + 6)
      const out = await Promise.all(batch.map((m) => test(m.url)))
      batch.forEach((m, j) => {
        results[m.url] = out[j]
      })
      setBroken((prev) => ({ ...prev, ...results }))
    }
    setChecking(false)
    const bad = Object.values(results).filter(Boolean).length
    toast(bad ? `${bad} image(s) failed to load` : '✓ All images loaded successfully', bad ? 'error' : 'ok')
  }

  const doReplace = () => {
    const url = newUrl.trim()
    if (!url) return
    const count = replaceEverywhere(replacing.url, url)
    setReplacing(null)
    setNewUrl('')
    toast(`✓ Replaced in ${count} place${count === 1 ? '' : 's'}`)
  }

  return (
    <div className="space-y-5">
      {toastNode}
      <PageHeader
        icon={Images}
        badge="Website CMS · Media"
        title="Media Library"
        subtitle="Every image used on the public website, where it is used, and one-click replacement"
        accent="sky"
        actions={
          <button
            onClick={checkAll}
            disabled={checking || !media.length}
            className="moom-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <ScanSearch className="w-3.5 h-3.5" /> {checking ? 'Checking…' : 'Check broken images'}
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Images} label="Unique images" value={media.length} tone="sky" />
        <StatCard icon={Link2} label="External URLs" value={media.length - embedded} tone="violet" />
        <StatCard icon={Upload} label="Uploaded (embedded)" value={embedded} tone="emerald" hint="Stored in browser" />
        <StatCard icon={ImageOff} label="Broken" value={brokenCount} tone={brokenCount ? 'rose' : 'emerald'} hint={checking ? 'Scanning…' : 'After check'} />
      </div>

      <div className="moom-card p-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            aria-label="Search media"
            className="moom-input w-full pl-8"
            placeholder="Search by URL or title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select aria-label="Usage filter" className="moom-select" value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)}>
          <option value="">All sections</option>
          {labels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <span className="text-[11px] text-slate-500 font-semibold">{shown.length} shown</span>
      </div>

      {shown.length === 0 ? (
        <EmptyState icon={Images} title="No images found" hint="Add images from the Homepage, Events, Faculty or Results pages." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {shown.map((m) => (
            <div key={m.url} className="moom-card overflow-hidden flex flex-col">
              <div className="relative aspect-[16/10] bg-[#16161f]">
                <Thumb src={m.url} className="w-full h-full !rounded-none !border-0" />
                {broken[m.url] && (
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/90 text-white">
                    Broken
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <p className="text-[11px] text-slate-400 font-mono break-all line-clamp-2" title={m.isData ? 'Embedded image' : m.url}>
                  {short(m.url)}
                </p>
                <div className="flex flex-wrap gap-1">
                  {m.usages.slice(0, 4).map((u, i) => (
                    <span
                      key={i}
                      title={u.title}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/25"
                    >
                      {u.label}
                    </span>
                  ))}
                  {m.usages.length > 4 && <span className="text-[9px] text-slate-500">+{m.usages.length - 4}</span>}
                </div>
                <div className="mt-auto flex gap-1.5 pt-1">
                  <button
                    onClick={() => copy(m.url)}
                    disabled={m.isData}
                    className="flex-1 moom-btn-ghost px-2 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center justify-center gap-1 disabled:opacity-40"
                  >
                    <Copy className="w-3 h-3" /> Copy URL
                  </button>
                  <button
                    onClick={() => {
                      setReplacing(m)
                      setNewUrl('')
                    }}
                    className="flex-1 moom-btn-ghost px-2 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center justify-center gap-1"
                  >
                    <Replace className="w-3 h-3" /> Replace
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {replacing && (
        <Modal
          title="Replace image everywhere"
          subtitle={`Used in ${replacing.usages.length} place(s) on the website`}
          onClose={() => setReplacing(null)}
          footer={
            <div className="flex justify-end gap-2">
              <button onClick={() => setReplacing(null)} className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={doReplace}
                disabled={!newUrl.trim()}
                className="moom-btn-primary px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
              >
                Replace
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Thumb src={replacing.url} className="w-16 h-16" />
              <p className="text-[11px] text-slate-400 font-mono break-all">{short(replacing.url)}</p>
            </div>
            <div>
              <label htmlFor="media-new-url" className="block text-[11px] font-bold text-slate-300 mb-1">
                New image URL
              </label>
              <input
                id="media-new-url"
                className="moom-input w-full"
                placeholder="https://…"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-1">To use an uploaded file, edit the item directly and use Upload.</p>
            </div>
            {newUrl.trim() && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Preview</p>
                <Thumb src={newUrl.trim()} className="w-28 h-20" />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
