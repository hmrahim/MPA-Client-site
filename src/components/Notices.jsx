import { useState, useEffect, useMemo } from 'react'
import Reveal from './Reveal'
import api from '../lib/api'
import { notices as defaultNoticesData } from '../data/content'
import { useLanguage } from '../context/LanguageContext'
import NoticePadModal from './modals/NoticePadModal'
import { Download } from 'lucide-react'

export default function Notices() {
  const { lang, t, num } = useLanguage()

  const [noticesData, setNoticesData] = useState([])
  const [padConfig, setPadConfig] = useState(null)
  const [activePadNotice, setActivePadNotice] = useState(null)

  useEffect(() => {
    loadNotices()
    const handleUpdate = () => loadNotices()
    window.addEventListener('mpa_notices_updated', handleUpdate)
    return () => {
      window.removeEventListener('mpa_notices_updated', handleUpdate)
    }
  }, [])

  const loadNotices = async () => {
    try {
      const res = await api.getNotices()
      if (res && res.data) {
        if (res.data.padConfig) setPadConfig(res.data.padConfig)
        if (Array.isArray(res.data.notices) && res.data.notices.length > 0) {
          setNoticesData(res.data.notices.filter((n) => n.isActive !== false))
        }
      } else {
        setNoticesData(defaultNoticesData[lang] || defaultNoticesData.bn || [])
      }
    } catch (err) {
      setNoticesData(defaultNoticesData[lang] || defaultNoticesData.bn || [])
    }
  }

  const allLabel = lang === 'bn' ? 'সব' : 'All'
  const cats = useMemo(() => {
    const set = new Set()
    noticesData.forEach((n) => {
      const c = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
      if (c) set.add(c)
    })
    return [allLabel, ...Array.from(set)]
  }, [noticesData, lang, allLabel])

  const [cat, setCat] = useState(allLabel)

  const shown = useMemo(() => {
    return noticesData.filter((n) => {
      if (cat === allLabel) return true
      const c = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
      return c === cat
    })
  }, [noticesData, cat, allLabel, lang])

  return (
    <section id="notices" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
      <Reveal as="h2" className="sec-title font-display">{t('noticeHeading')}</Reveal>
      <Reveal as="p" delay={90} className="text-ink/70 mt-1">
        {lang === 'bn' ? 'বিদ্যালয় কার্যালয়ের প্রতিটি ঘোষণা এক জায়গায়।' : 'Every announcement from the school office, in one place.'}
      </Reveal>

      <Reveal delay={180} className="mt-6 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={c === cat}
            className={`px-4 py-2 rounded-full border border-ink/25 text-sm font-medium transition cursor-pointer ${
              c === cat ? 'tab-on bg-board text-chalk' : 'bg-white hover:bg-ink/5 text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </Reveal>

      <Reveal delay={270} className="pop-in mt-6 grid md:grid-cols-2 gap-4">
        {shown.map((n) => {
          const itemTitle = lang === 'bn' ? (n.titleBn || n.title) : (n.title || n.titleBn)
          const itemText = lang === 'bn' ? (n.textBn || n.text) : (n.text || n.textBn)
          const itemCat = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
          const itemDate = lang === 'bn' ? (n.dateBn || n.date) : (n.date || n.dateBn)

          return (
            <article key={n.id || n._id} data-tilt className="card notice-card flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold text-brick">{itemCat}</span>
                  <span className="text-ink/60">{num ? num(itemDate) : itemDate}</span>
                </div>
                <h3 className="font-display font-bold text-lg">{itemTitle}</h3>
                <p className="text-sm text-ink/75 mt-1 whitespace-pre-line line-clamp-3">{itemText}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActivePadNotice(n)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-iris hover:underline cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'bn' ? 'অফিসিয়াল প্যাড / পিডিএফ' : 'Official Pad / PDF'}</span>
                </button>
              </div>
            </article>
          )
        })}
      </Reveal>

      {/* Official School Pad Modal */}
      {activePadNotice && (
        <NoticePadModal
          notice={activePadNotice}
          padConfig={padConfig}
          lang={lang}
          onClose={() => setActivePadNotice(null)}
        />
      )}
    </section>
  )
}
