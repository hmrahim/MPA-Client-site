/* ================================================================
   Site CMS Store
   ----------------------------------------------------------------
   Dashboard theke public website er content edit korar engine.

   - data/content.js nijer export gulo `registerSiteContent()` a register kore.
   - Dashboard save korle localStorage a override jay + live object in-place
     update hoy, tai public page navigate korle sathe sathe notun content dekha jay.
   - Public form (Admission / Contact / SMS subscribe) `addSubmission()` diye
     dashboard Inbox a data pathay.
   ================================================================ */
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'mpa_site_cms_v1'
const META_KEY = 'mpa_site_cms_meta_v1'
const SUBMISSIONS_KEY = 'mpa_site_submissions_v1'
const LOG_KEY = 'mpa_site_cms_log_v1'
const BACKUP_VERSION = 1

let registry = {} // sectionKey -> live exported object/array from content.js
let defaults = {} // sectionKey -> pristine deep clone (before overrides)
let version = 0
const listeners = new Set()
const snapshotCache = {}
let submissionsCache = null
let logCache = null

/* ── helpers ── */
const hasWindow = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined'
const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)))

function read(key, fallback) {
  if (!hasWindow()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  if (!hasWindow()) return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('[siteStore] storage write failed', err)
  }
}

function applyValue(target, value) {
  if (Array.isArray(target)) {
    target.splice(0, target.length, ...clone(value))
    return
  }
  Object.keys(target).forEach((k) => {
    if (!(k in value)) delete target[k]
  })
  Object.entries(clone(value)).forEach(([k, v]) => {
    target[k] = v
  })
}

function emit() {
  version += 1
  Object.keys(snapshotCache).forEach((k) => delete snapshotCache[k])
  submissionsCache = null
  logCache = null
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getVersion = () => version

/* ── registration (called once from data/content.js) ── */
export function registerSiteContent(sources) {
  registry = sources
  defaults = {}
  const overrides = read(STORAGE_KEY, {})
  Object.entries(sources).forEach(([key, target]) => {
    defaults[key] = clone(target)
    if (overrides[key] !== undefined) applyValue(target, overrides[key])
  })
}

if (hasWindow()) {
  // Another tab (dashboard) saved something → refresh live objects here.
  window.addEventListener('storage', (e) => {
    if (![STORAGE_KEY, SUBMISSIONS_KEY, LOG_KEY, META_KEY].includes(e.key)) return
    if (e.key === STORAGE_KEY) {
      const overrides = read(STORAGE_KEY, {})
      Object.entries(registry).forEach(([key, target]) => {
        applyValue(target, overrides[key] !== undefined ? overrides[key] : defaults[key])
      })
    }
    emit()
  })
}

/* ── section API ── */
export function getSection(key) {
  if (!registry[key]) return undefined
  if (!snapshotCache[key] || snapshotCache[key].v !== version) {
    snapshotCache[key] = { v: version, value: clone(registry[key]) }
  }
  return snapshotCache[key].value
}

export function getSectionDefault(key) {
  return clone(defaults[key])
}

export function isSectionCustomized(key) {
  return read(STORAGE_KEY, {})[key] !== undefined
}

export function getSectionMeta() {
  return read(META_KEY, {})
}

export function saveSection(key, value, detail = '') {
  if (!registry[key]) return false
  const overrides = read(STORAGE_KEY, {})
  overrides[key] = clone(value)
  write(STORAGE_KEY, overrides)
  applyValue(registry[key], value)
  const meta = read(META_KEY, {})
  meta[key] = new Date().toISOString()
  write(META_KEY, meta)
  pushLog({ section: key, action: 'update', detail })
  emit()
  return true
}

export function resetSection(key) {
  if (!registry[key]) return
  const overrides = read(STORAGE_KEY, {})
  delete overrides[key]
  write(STORAGE_KEY, overrides)
  applyValue(registry[key], defaults[key])
  const meta = read(META_KEY, {})
  delete meta[key]
  write(META_KEY, meta)
  pushLog({ section: key, action: 'reset', detail: 'Restored default content' })
  emit()
}

export function resetAllSections() {
  write(STORAGE_KEY, {})
  write(META_KEY, {})
  Object.entries(registry).forEach(([key, target]) => applyValue(target, defaults[key]))
  pushLog({ section: 'all', action: 'reset', detail: 'All website content restored to default' })
  emit()
}

export function useSiteSection(key) {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return [getSection(key), (value, detail) => saveSection(key, value, detail)]
}

/** Re-render when anything in the CMS store changes. */
export function useSiteVersion() {
  return useSyncExternalStore(subscribe, getVersion, getVersion)
}

/* ── activity log ── */
function pushLog(entry) {
  const log = read(LOG_KEY, [])
  log.unshift({ id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`, at: new Date().toISOString(), ...entry })
  write(LOG_KEY, log.slice(0, 80))
}

export function getActivityLog() {
  if (!logCache) logCache = read(LOG_KEY, [])
  return logCache
}

export function clearActivityLog() {
  write(LOG_KEY, [])
  emit()
}

export function useActivityLog() {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return getActivityLog()
}

/* ── submissions inbox (public forms → dashboard) ── */
export function getSubmissions() {
  if (!submissionsCache) submissionsCache = read(SUBMISSIONS_KEY, [])
  return submissionsCache
}

export function addSubmission(type, data) {
  const list = read(SUBMISSIONS_KEY, [])
  const item = {
    id: `${type.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    type, // 'admission' | 'contact' | 'subscriber'
    status: 'new',
    createdAt: new Date().toISOString(),
    ...data,
  }
  list.unshift(item)
  write(SUBMISSIONS_KEY, list.slice(0, 1000))
  emit()
  return item
}

export function updateSubmission(id, patch) {
  const list = read(SUBMISSIONS_KEY, []).map((s) => (s.id === id ? { ...s, ...patch } : s))
  write(SUBMISSIONS_KEY, list)
  emit()
}

export function deleteSubmissions(ids) {
  const set = new Set(Array.isArray(ids) ? ids : [ids])
  write(
    SUBMISSIONS_KEY,
    read(SUBMISSIONS_KEY, []).filter((s) => !set.has(s.id))
  )
  emit()
}

export function useSubmissions() {
  useSyncExternalStore(subscribe, getVersion, getVersion)
  return getSubmissions()
}

export function useNewSubmissionCount() {
  const list = useSubmissions()
  return list.filter((s) => s.status === 'new').length
}

/* ── backup / restore ── */
export function exportBackup() {
  return JSON.stringify(
    {
      kind: 'mpa-site-cms-backup',
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      sections: read(STORAGE_KEY, {}),
      submissions: read(SUBMISSIONS_KEY, []),
    },
    null,
    2
  )
}

export function importBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'Invalid JSON file' }
  }
  if (!data || data.kind !== 'mpa-site-cms-backup' || typeof data.sections !== 'object') {
    return { ok: false, error: 'This is not a Mirashani CMS backup file' }
  }
  const clean = {}
  Object.entries(data.sections).forEach(([key, value]) => {
    if (registry[key]) clean[key] = value
  })
  write(STORAGE_KEY, clean)
  Object.entries(registry).forEach(([key, target]) => {
    applyValue(target, clean[key] !== undefined ? clean[key] : defaults[key])
  })
  if (Array.isArray(data.submissions)) write(SUBMISSIONS_KEY, data.submissions)
  pushLog({ section: 'all', action: 'import', detail: `Imported backup (${Object.keys(clean).length} sections)` })
  emit()
  return { ok: true, count: Object.keys(clean).length }
}

export const SITE_STORAGE_KEYS = { STORAGE_KEY, META_KEY, SUBMISSIONS_KEY, LOG_KEY }
