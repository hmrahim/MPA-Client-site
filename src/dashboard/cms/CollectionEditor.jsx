import { useMemo, useRef, useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  RotateCcw,
  ExternalLink,
  Check,
} from 'lucide-react'
import { useSiteSection, resetSection, isSectionCustomized, saveSection } from '../../lib/siteStore'
import {
  Field,
  Modal,
  ConfirmModal,
  EmptyState,
  Tabs,
  Thumb,
  useToast,
  downloadText,
} from './CmsKit'

/* ================================================================
   Schema contract
   {
     key:        site section key (see data/content.js registerSiteContent)
     mode:       'bilingual' | 'flat' | 'keyed'
     noun:       'Notice'
     primitive:  bilingual lists of plain strings (field key must be 'value')
     fields:     [{ key, label, type, required, shared, full, default, help, placeholder, options, rows }]
     columns:    [{ key, label, kind: 'text'|'badge'|'bool'|'image'|'stars', bold }]
     imageKey:   field shown as a thumbnail in the first column
     filterKey:  field used for the category filter
     searchKeys: fields included in text search
     idKey:      auto-increment numeric id field (notices, events)
     extras:     () => ({...})  extra hidden props for new records
     groups:     keyed mode → [{ key, label }]
     previewPath:'/notices'
   }
   ================================================================ */

const blankFor = (fields) =>
  Object.fromEntries(
    fields.map((f) => [
      f.key,
      f.default !== undefined
        ? f.default
        : f.type === 'toggle'
        ? false
        : f.type === 'stars'
        ? 5
        : f.type === 'list'
        ? []
        : '',
    ])
  )

const pick = (obj = {}, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]))

function normalize(fields, obj) {
  const out = { ...obj }
  fields.forEach((f) => {
    const v = out[f.key]
    if (f.type === 'list') out[f.key] = (Array.isArray(v) ? v : []).map((s) => String(s).trim()).filter(Boolean)
    else if (typeof v === 'string') out[f.key] = v.trim()
  })
  return out
}

const pad = (arr, n, fill) => {
  const next = [...arr]
  while (next.length < n) next.push(typeof fill === 'function' ? fill() : fill)
  return next
}

/* ── Adapters: turn a section value into rows + produce next value for each action ── */
function makeAdapter(schema, data, lang, group) {
  const { mode, primitive } = schema
  const wrap = (v) => (primitive ? { value: v ?? '' } : v ?? {})
  const unwrap = (o) => (primitive ? o.value : o)

  if (mode === 'bilingual') {
    const bn = data.bn || []
    const en = data.en || []
    const n = Math.max(bn.length, en.length)
    const rows = Array.from({ length: n }, (_, i) => ({ _i: i, bn: wrap(bn[i]), en: wrap(en[i]) }))
    const emptyItem = () => (primitive ? '' : {})
    const lists = (draftBn, draftEn) => {
      const len = Math.max(draftBn.length, draftEn.length)
      return { bn: pad(draftBn, len, emptyItem), en: pad(draftEn, len, emptyItem) }
    }
    return {
      rows,
      view: (row) => (row[lang] && Object.keys(row[lang]).length ? row[lang] : row.bn || row.en || {}),
      origin: (row) => ({ bn: row.bn, en: row.en }),
      write: (index, built) => {
        const next = lists([...bn], [...en])
        const target = index === null ? next.bn.length : index
        next.bn[target] = unwrap(built.bn)
        next.en[target] = unwrap(built.en)
        return { ...data, ...lists(next.bn, next.en) }
      },
      remove: (indices) => {
        const drop = new Set(indices)
        const next = lists([...bn], [...en])
        return { ...data, bn: next.bn.filter((_, i) => !drop.has(i)), en: next.en.filter((_, i) => !drop.has(i)) }
      },
      move: (i, dir) => {
        const j = i + dir
        const next = lists([...bn], [...en])
        if (j < 0 || j >= next.bn.length) return data
        ;[next.bn[i], next.bn[j]] = [next.bn[j], next.bn[i]]
        ;[next.en[i], next.en[j]] = [next.en[j], next.en[i]]
        return { ...data, ...next }
      },
      duplicate: (i, tweak) => {
        const next = lists([...bn], [...en])
        const copyBn = JSON.parse(JSON.stringify(next.bn[i]))
        const copyEn = JSON.parse(JSON.stringify(next.en[i]))
        const [b, e] = tweak ? tweak(copyBn, copyEn) : [copyBn, copyEn]
        next.bn.splice(i + 1, 0, b)
        next.en.splice(i + 1, 0, e)
        return { ...data, ...next }
      },
      allIds: () => [...bn, ...en].map((x) => Number(x?.id)).filter((x) => !Number.isNaN(x)),
    }
  }

  const list = mode === 'keyed' ? data[group] || [] : Array.isArray(data) ? data : []
  const put = (nextList) => (mode === 'keyed' ? { ...data, [group]: nextList } : nextList)
  return {
    rows: list.map((item, i) => ({ _i: i, item })),
    view: (row) => row.item,
    origin: (row) => ({ item: row.item }),
    write: (index, built) => {
      const next = [...list]
      if (index === null) next.push(built.item)
      else next[index] = built.item
      return put(next)
    },
    remove: (indices) => {
      const drop = new Set(indices)
      return put(list.filter((_, i) => !drop.has(i)))
    },
    move: (i, dir) => {
      const j = i + dir
      if (j < 0 || j >= list.length) return put(list)
      const next = [...list]
      ;[next[i], next[j]] = [next[j], next[i]]
      return put(next)
    },
    duplicate: (i, tweak) => {
      const next = [...list]
      const copy = JSON.parse(JSON.stringify(next[i]))
      next.splice(i + 1, 0, tweak ? tweak(copy) : copy)
      return put(next)
    },
    allIds: () => list.map((x) => Number(x?.id)).filter((x) => !Number.isNaN(x)),
  }
}

/* ── Cell renderer ── */
function Cell({ col, value }) {
  if (col.kind === 'image') return <Thumb src={value} className="w-9 h-9" />
  if (col.kind === 'bool')
    return value ? (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <Check className="w-3 h-3" /> {col.trueLabel || 'Yes'}
      </span>
    ) : (
      <span className="text-[10px] text-slate-500">—</span>
    )
  if (col.kind === 'badge')
    return value ? (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6c63ff]/15 text-[#a78bfa] border border-[#6c63ff]/25 whitespace-nowrap">
        {value}
      </span>
    ) : (
      <span className="text-slate-600">—</span>
    )
  if (col.kind === 'stars') return <span className="text-amber-400 text-xs tracking-tight">{'★'.repeat(value || 0)}</span>
  if (Array.isArray(value)) return <span className="text-slate-300">{value.length} items</span>
  return (
    <span className={`block max-w-[300px] truncate ${col.bold ? 'font-bold text-white' : 'text-slate-300'}`} title={String(value ?? '')}>
      {value === undefined || value === '' ? <span className="text-slate-600">—</span> : String(value)}
    </span>
  )
}

/* ================================================================ */
export default function CollectionEditor({ schema }) {
  const [data] = useSiteSection(schema.key)
  const [toastNode, toast] = useToast()
  const fileRef = useRef(null)

  const lang = 'en' // dashboard is English-only
  const [group, setGroup] = useState(schema.groups?.[0]?.key)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState(() => new Set())
  const [editor, setEditor] = useState(null) // { index|null, form }
  const [errors, setErrors] = useState({})
  const [confirm, setConfirm] = useState(null)

  const fields = schema.fields
  const sharedFields = schema.mode === 'bilingual' ? fields.filter((f) => f.shared) : []
  const langFields = schema.mode === 'bilingual' ? fields.filter((f) => !f.shared) : fields
  const sharedKeys = sharedFields.map((f) => f.key)
  const langKeys = langFields.map((f) => f.key)

  const adapter = useMemo(
    () => makeAdapter(schema, data, lang, group),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schema, data, lang, group]
  )

  const searchKeys = schema.searchKeys || fields.filter((f) => ['text', 'textarea'].includes(f.type || 'text')).map((f) => f.key)
  const filterOptions = useMemo(() => {
    if (!schema.filterKey) return []
    return [...new Set(adapter.rows.map((r) => adapter.view(r)[schema.filterKey]).filter(Boolean))]
  }, [adapter, schema.filterKey])

  const visibleRows = adapter.rows.filter((row) => {
    const v = adapter.view(row)
    if (filter && v[schema.filterKey] !== filter) return false
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return searchKeys.some((k) => String(v[k] ?? '').toLowerCase().includes(q))
  })
  const isFiltered = !!(query.trim() || filter)
  const customized = isSectionCustomized(schema.key)
  const columns = schema.columns || fields.slice(0, 3).map((f, i) => ({ key: f.key, label: f.label, bold: i === 0 }))

  /* ── persistence ── */
  const commit = (next, message) => {
    saveSection(schema.key, next, message)
    toast(`✓ ${message}`)
  }

  const nextId = () => Math.max(0, ...adapter.allIds()) + 1

  /* ── editor open/close ── */
  const openAdd = () => {
    const extras = schema.extras ? schema.extras() : {}
    const base = blankFor(fields)
    const idPatch = schema.idKey ? { [schema.idKey]: nextId() } : {}
    const form =
      schema.mode === 'bilingual'
        ? {
            shared: pick(base, sharedKeys),
            bn: pick(base, langKeys),
            en: pick(base, langKeys),
            extras: { ...extras, ...idPatch },
          }
        : { item: base, extras: { ...extras, ...idPatch } }
    setErrors({})
    setEditor({ index: null, form })
  }

  const openEdit = (row) => {
    const base = blankFor(fields)
    let form
    if (schema.mode === 'bilingual') {
      const src = row.bn && Object.keys(row.bn).length ? row.bn : row.en
      form = {
        shared: { ...pick(base, sharedKeys), ...pick(src, sharedKeys) },
        bn: { ...pick(base, langKeys), ...pick(row.bn, langKeys) },
        en: { ...pick(base, langKeys), ...pick(row.en, langKeys) },
        origin: adapter.origin(row),
      }
    } else {
      form = { item: { ...base, ...row.item }, origin: adapter.origin(row) }
    }
    setErrors({})
    setEditor({ index: row._i, form })
  }

  const validate = () => {
    const errs = {}
    const check = (fieldList, values, prefix) =>
      fieldList.forEach((f) => {
        if (!f.required) return
        const v = values[f.key]
        const empty = Array.isArray(v) ? v.length === 0 : v === undefined || v === null || String(v).trim() === ''
        if (empty) errs[`${prefix}${f.key}`] = 'This field is required'
      })
    if (schema.mode === 'bilingual') {
      check(sharedFields, editor.form.shared, 'shared.')
      check(langFields, editor.form.en, 'en.')
    } else {
      check(fields, editor.form.item, 'item.')
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const saveEditor = () => {
    if (!validate()) return
    const { form, index } = editor
    let built
    if (schema.mode === 'bilingual') {
      // English-only editing: new items mirror the English content into the
      // legacy 'bn' list so both lists stay aligned; existing 'bn' text is untouched.
      const mk = (l) => ({
        ...(form.extras || {}),
        ...(form.origin?.[l] || {}),
        ...normalize(fields, { ...form.shared, ...(l === 'bn' && index === null ? form.en : form[l]) }),
      })
      built = { bn: mk('bn'), en: mk('en') }
    } else {
      built = { item: { ...(form.extras || {}), ...(form.origin?.item || {}), ...normalize(fields, form.item) } }
    }
    commit(adapter.write(index, built), index === null ? `${schema.noun} added` : `${schema.noun} updated`)
    setEditor(null)
  }

  /* ── row actions ── */
  const doMove = (row, dir) => commit(adapter.move(row._i, dir), `${schema.noun} moved`)
  const doDuplicate = (row) => {
    const tweak = schema.idKey
      ? (() => {
          const id = nextId()
          return schema.mode === 'bilingual'
            ? (b, e) => [
                { ...b, [schema.idKey]: id },
                { ...e, [schema.idKey]: id },
              ]
            : (c) => ({ ...c, [schema.idKey]: id })
        })()
      : undefined
    commit(adapter.duplicate(row._i, tweak), `${schema.noun} duplicated`)
  }
  const doDelete = (indices) => {
    commit(adapter.remove(indices), `${indices.length} ${schema.noun.toLowerCase()}${indices.length > 1 ? 's' : ''} deleted`)
    setSelected(new Set())
    setConfirm(null)
  }

  const toggleSelect = (i) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((r) => selected.has(r._i))
  const toggleAll = () => setSelected(allVisibleSelected ? new Set() : new Set(visibleRows.map((r) => r._i)))

  /* ── import / export ── */
  const doExport = () => {
    downloadText(`${schema.key}.json`, JSON.stringify(data, null, 2))
    toast('✓ Section exported')
  }
  const doImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      const valid =
        schema.mode === 'bilingual'
          ? Array.isArray(parsed?.bn) && Array.isArray(parsed?.en)
          : schema.mode === 'keyed'
          ? parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          : Array.isArray(parsed)
      if (!valid) throw new Error('shape')
      commit(parsed, 'Section imported')
    } catch {
      toast('Import failed — file shape does not match this section', 'error')
    }
  }

  /* ── render ── */
  const renderEditorFields = () => {
    const { form } = editor
    const setShared = (k, v) => setEditor((s) => ({ ...s, form: { ...s.form, shared: { ...s.form.shared, [k]: v } } }))
    const setLangVal = (l, k, v) => setEditor((s) => ({ ...s, form: { ...s.form, [l]: { ...s.form[l], [k]: v } } }))
    const setItem = (k, v) => setEditor((s) => ({ ...s, form: { ...s.form, item: { ...s.form.item, [k]: v } } }))

    if (schema.mode !== 'bilingual') {
      return (
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((f) => (
            <Field
              key={f.key}
              idPrefix="ed"
              field={f}
              value={form.item[f.key]}
              onChange={(v) => setItem(f.key, v)}
              error={errors[`item.${f.key}`]}
            />
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-5">
        {sharedFields.length > 0 && (
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Common fields
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {sharedFields.map((f) => (
                <Field
                  key={f.key}
                  idPrefix="ed-sh"
                  field={f}
                  value={form.shared[f.key]}
                  onChange={(v) => setShared(f.key, v)}
                  error={errors[`shared.${f.key}`]}
                />
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4">
          {[
            ['en', 'Details'],
          ].map(([l, label]) => (
            <div key={l} className="moom-card-subtle p-4 space-y-4">
              <p className="text-xs font-black text-[#a78bfa]">{label}</p>
              {langFields.map((f) => (
                <Field
                  key={f.key}
                  idPrefix={`ed-${l}`}
                  field={{ ...f, full: false }}
                  value={form[l][f.key]}
                  onChange={(v) => setLangVal(l, f.key, v)}
                  error={errors[`${l}.${f.key}`]}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {toastNode}

      {schema.groups && (
        <Tabs
          tabs={schema.groups.map((g) => ({
            id: g.key,
            label: g.label,
            count: (data[g.key] || []).length,
          }))}
          active={group}
          onChange={(g) => {
            setGroup(g)
            setSelected(new Set())
            setFilter('')
            setQuery('')
          }}
        />
      )}

      {schema.hint && <p className="text-[11px] text-slate-400">{schema.hint}</p>}

      {/* Toolbar */}
      <div className="moom-card p-3 flex flex-col xl:flex-row xl:items-center gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              aria-label={`Search ${schema.noun}`}
              className="moom-input w-full pl-8"
              placeholder={`Search ${schema.noun.toLowerCase()}…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {schema.filterKey && (
            <select
              aria-label="Filter"
              className="moom-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All {schema.filterLabel || 'categories'}</option>
              {filterOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          )}
          <span className="text-[11px] text-slate-500 font-semibold">
            {visibleRows.length}
            {isFiltered ? ` / ${adapter.rows.length}` : ''} {schema.noun.toLowerCase()}
            {adapter.rows.length === 1 ? '' : 's'}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              customized
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {customized ? 'Customized' : 'Default content'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={() =>
                setConfirm({
                  title: `Delete ${selected.size} selected`,
                  message: `${selected.size} ${schema.noun.toLowerCase()}(s) will be removed from the live website. This cannot be undone (you can restore defaults later).`,
                  onConfirm: () => doDelete([...selected]),
                })
              }
              className="moom-btn-rose px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete ({selected.size})
            </button>
          )}
          {schema.previewPath && (
            <a
              href={schema.previewPath}
              target="_blank"
              rel="noreferrer"
              className="moom-btn-ghost px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View live
            </a>
          )}
          <button onClick={doExport} title="Export JSON" className="moom-btn-ghost p-2 rounded-xl" aria-label="Export section">
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            title="Import JSON"
            className="moom-btn-ghost p-2 rounded-xl"
            aria-label="Import section"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={doImport} />
          {customized && (
            <button
              onClick={() =>
                setConfirm({
                  title: 'Restore default content',
                  confirmLabel: 'Restore',
                  message: `All your changes in this section will be discarded and the original ${schema.title || schema.noun} content will be restored.`,
                  onConfirm: () => {
                    resetSection(schema.key)
                    setConfirm(null)
                    toast('✓ Default content restored')
                  },
                })
              }
              title="Restore defaults"
              className="moom-btn-ghost p-2 rounded-xl"
              aria-label="Restore defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button onClick={openAdd} className="moom-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Add {schema.noun}
          </button>
        </div>
      </div>

      {/* List */}
      {visibleRows.length === 0 ? (
        <EmptyState
          title={isFiltered ? 'No matching items' : `No ${schema.noun.toLowerCase()} yet`}
          hint={isFiltered ? 'Try clearing the search or filter.' : `Click “Add ${schema.noun}” to create the first one.`}
        />
      ) : (
        <div className="moom-table-container moom-scrollbar">
          <table className="moom-table">
            <thead>
              <tr>
                <th className="w-8">
                  <input type="checkbox" aria-label="Select all" checked={allVisibleSelected} onChange={toggleAll} />
                </th>
                <th className="w-10">#</th>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => {
                const v = adapter.view(row)
                return (
                  <tr key={row._i}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${row._i + 1}`}
                        checked={selected.has(row._i)}
                        onChange={() => toggleSelect(row._i)}
                      />
                    </td>
                    <td className="text-slate-500 font-mono text-xs">{row._i + 1}</td>
                    {columns.map((c) => (
                      <td key={c.key}>
                        <Cell col={c} value={v[c.key]} />
                      </td>
                    ))}
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => doMove(row, -1)}
                          disabled={isFiltered || row._i === 0}
                          title={isFiltered ? 'Clear filters to reorder' : 'Move up'}
                          aria-label="Move up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:hover:bg-transparent"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => doMove(row, 1)}
                          disabled={isFiltered || row._i === adapter.rows.length - 1}
                          title={isFiltered ? 'Clear filters to reorder' : 'Move down'}
                          aria-label="Move down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-25 disabled:hover:bg-transparent"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => doDuplicate(row)}
                          title="Duplicate"
                          aria-label="Duplicate"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(row)}
                          title="Edit"
                          aria-label="Edit"
                          className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setConfirm({
                              title: `Delete ${schema.noun.toLowerCase()}`,
                              message: 'This item will be removed from the live website.',
                              onConfirm: () => doDelete([row._i]),
                            })
                          }
                          title="Delete"
                          aria-label="Delete"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editor && (
        <Modal
          wide={schema.mode === 'bilingual'}
          title={editor.index === null ? `Add ${schema.noun}` : `Edit ${schema.noun} #${editor.index + 1}`}
          subtitle="Changes go live on the public website immediately after saving."
          onClose={() => setEditor(null)}
          footer={
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditor(null)} className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-bold">
                Cancel
              </button>
              <button onClick={saveEditor} className="moom-btn-primary px-5 py-2 rounded-xl text-xs font-bold">
                {editor.index === null ? 'Publish' : 'Save changes'}
              </button>
            </div>
          }
        >
          {renderEditorFields()}
        </Modal>
      )}

      {confirm && <ConfirmModal {...confirm} onCancel={() => setConfirm(null)} />}
    </div>
  )
}
