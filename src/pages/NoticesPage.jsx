import { useState, useMemo, useEffect } from 'react'
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Pin,
  Eye,
  AlertCircle,
  Bell,
  CheckCircle,
  Printer,
  Sparkles,
} from 'lucide-react'
import api from '../lib/api'
import { notices as defaultNoticesData } from '../data/content'
import { addSubmission } from '../lib/siteStore'
import { useLanguage } from '../context/LanguageContext'
import NoticePadModal from '../components/modals/NoticePadModal'

const DEFAULT_PAD_CONFIG = {
  schoolName: 'Mirashani Polytechnic Academy',
  schoolNameBn: 'মিরাশানী পলিটেকনিক একাডেমি',
  subHeader: 'An Exemplary Institution of Excellence & Character',
  subHeaderBn: 'একটি আদর্শ ও ঐতিহ্যবাহী বিদ্যাপীঠ',
  address: 'Mirashani, Madhavpur, Habiganj, Bangladesh',
  addressBn: 'মিরাশানী, মাধবপুর, হবিগঞ্জ, বাংলাদেশ',
  phone: '+880 1712-345678',
  email: 'info@mirashaniacademy.edu.bd',
  website: 'www.mirashaniacademy.edu.bd',
  eiin: '129485',
  estd: '1998',
  schoolCode: '4521',
  logoText: 'MPA',
  logoUrl: '',
  watermarkText: 'MIRASHANI ACADEMY',
  signatoryTitle: 'Headmaster / Principal',
  signatoryTitleBn: 'প্রধান শিক্ষক',
  signatoryName: 'Md. Rafiqul Islam',
  signatoryNameBn: 'মোঃ রফিকুল ইসলাম',
  signatureUrl: '',
  sealUrl: '',
}

const DEFAULT_SMS_ALERT = {
  isActive: true,
  title: 'Get Instant Notices via SMS Alert',
  titleBn: 'এসএমএস অ্যালার্টের মাধ্যমে নোটিশ পান',
  subtitle: 'Guardians can subscribe their mobile number to receive exam schedules and emergency school closures directly.',
  subtitleBn: 'অভিভাবকগণ মোবাইল নম্বর নিবন্ধন করে সরাসরি পরীক্ষার রুটিন ও জরুরি ছুটির বার্তা পেতে পারেন।',
  inputPlaceholder: 'e.g. 017XXXXXXXX',
  inputPlaceholderBn: 'যেমন: ০১৭XXXXXXXX',
  buttonText: 'Subscribe Free',
  buttonTextBn: 'বিনামূল্যে সাবস্ক্রাইব',
  successMsg: 'Thank you! Your mobile number has been registered for notice alerts.',
  successMsgBn: 'ধন্যবাদ! আপনার মোবাইল নম্বর নোটিশ অ্যালার্টের জন্য নিবন্ধিত হয়েছে।',
}

export default function NoticesPage() {
  const { lang, num } = useLanguage()

  const [noticesData, setNoticesData] = useState([])
  const [padConfig, setPadConfig] = useState(DEFAULT_PAD_CONFIG)
  const [smsAlert, setSmsAlert] = useState(DEFAULT_SMS_ALERT)
  const [pageMeta, setPageMeta] = useState({
    title: 'School Notice Board',
    titleBn: 'বিদ্যালয় নোটিশ বোর্ড',
    subtitle: 'Stay updated with academic examination routines, holiday declarations, admission circulars, and official announcements published by the Mirashani Academy administration.',
    subtitleBn: 'মিরাশানী একাডেমি প্রশাসন কর্তৃক প্রকাশিত সকল একাডেমিক পরীক্ষার রুটিন, ছুটির ঘোষণা, ভর্তি সার্কুলার এবং গুরুত্বপূর্ণ নোটিশ এক নজরে দেখুন।',
    tag: 'Official Circulars & Notice Board',
    tagBn: 'অফিসিয়াল সার্কুলার ও নোটিশ বোর্ড',
  })
  const [loading, setLoading] = useState(true)

  // Filter & Search states
  const allLabel = lang === 'bn' ? 'সকল নোটিশ' : 'All'
  const [selectedCat, setSelectedCat] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [mobileNum, setMobileNum] = useState('')

  // Notice Pad Modal State
  const [activePadNotice, setActivePadNotice] = useState(null)

  useEffect(() => {
    fetchNotices()

    const handleUpdate = () => {
      fetchNotices()
    }
    window.addEventListener('mpa_notices_updated', handleUpdate)
    return () => {
      window.removeEventListener('mpa_notices_updated', handleUpdate)
    }
  }, [])

  const fetchNotices = async () => {
    try {
      const res = await api.getNotices()
      if (res && res.data) {
        applyFetchedData(res.data)
      } else {
        fallbackToDefault()
      }
    } catch (err) {
      console.warn('NoticesPage DB fetch error, fallback to content', err)
      fallbackToDefault()
    } finally {
      setLoading(false)
    }
  }

  const applyFetchedData = (data) => {
    if (data.padConfig) {
      setPadConfig({ ...DEFAULT_PAD_CONFIG, ...data.padConfig })
    }
    if (data.smsAlert) {
      setSmsAlert({ ...DEFAULT_SMS_ALERT, ...data.smsAlert })
    }
    if (data.title || data.titleBn) {
      setPageMeta({
        title: data.title || 'School Notice Board',
        titleBn: data.titleBn || 'বিদ্যালয় নোটিশ বোর্ড',
        subtitle: data.subtitle || '',
        subtitleBn: data.subtitleBn || '',
        tag: data.tag || 'Official Circulars & Notice Board',
        tagBn: data.tagBn || 'অফিসিয়াল সার্কুলার ও নোটিশ বোর্ড',
      })
    }
    if (Array.isArray(data.notices) && data.notices.length > 0) {
      const activeOnly = data.notices.filter((n) => n.isActive !== false)
      setNoticesData(activeOnly)
    } else {
      fallbackToDefault()
    }
  }

  const fallbackToDefault = () => {
    const list = defaultNoticesData[lang] || defaultNoticesData.bn || []
    setNoticesData(list)
  }

  // Categories list with stable ID and localized label
  const categoryTabs = useMemo(() => {
    const tabs = [{ key: 'ALL', label: allLabel }]
    const seen = new Set()
    noticesData.forEach((n) => {
      const rawCat = n.cat || n.catBn
      if (rawCat && !seen.has(rawCat)) {
        seen.add(rawCat)
        const label = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
        tabs.push({ key: rawCat, label: label || rawCat })
      }
    })
    return tabs
  }, [noticesData, lang, allLabel])

  // Filtered notices
  const filteredNotices = useMemo(() => {
    return noticesData.filter((n) => {
      const rawCat = n.cat || n.catBn
      const matchCat =
        selectedCat === 'ALL' ||
        selectedCat === allLabel ||
        rawCat === selectedCat ||
        n.cat === selectedCat ||
        n.catBn === selectedCat

      const titleVal = (lang === 'bn' ? (n.titleBn || n.title) : (n.title || n.titleBn)) || ''
      const textVal = (lang === 'bn' ? (n.textBn || n.text) : (n.text || n.textBn)) || ''
      const memoVal = n.memoNo || ''

      const q = searchQuery.toLowerCase()
      const matchSearch =
        !q ||
        titleVal.toLowerCase().includes(q) ||
        textVal.toLowerCase().includes(q) ||
        memoVal.toLowerCase().includes(q) ||
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.titleBn && n.titleBn.toLowerCase().includes(q))

      return matchCat && matchSearch
    })
  }, [noticesData, selectedCat, allLabel, searchQuery, lang])

  const pinnedNotices = filteredNotices.filter((n) => n.pinned)
  const regularNotices = filteredNotices.filter((n) => !n.pinned)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!mobileNum) return
    try {
      await api.createSubmission('subscriber', { phone: mobileNum, lang })
    } catch (err) {
      console.warn('Backend submission error, fallback to local store', err)
    }
    addSubmission('subscriber', { phone: mobileNum, lang })
    setSubscribed(true)
    setTimeout(() => {
      setMobileNum('')
      setSubscribed(false)
    }, 4500)
  }

  const handleDownloadNotice = (notice) => {
    setActivePadNotice(notice)
  }

  const isAlertActive = smsAlert?.isActive !== false
  const alertTitle = (lang === 'bn' ? (smsAlert?.titleBn || smsAlert?.title) : (smsAlert?.title || smsAlert?.titleBn)) || 'Get Instant Notices via SMS Alert'
  const alertSubtitle = (lang === 'bn' ? (smsAlert?.subtitleBn || smsAlert?.subtitle) : (smsAlert?.subtitle || smsAlert?.subtitleBn)) || 'Guardians can subscribe their mobile number to receive exam schedules and emergency school closures directly.'
  const alertPlaceholder = (lang === 'bn' ? (smsAlert?.inputPlaceholderBn || smsAlert?.inputPlaceholder) : (smsAlert?.inputPlaceholder || smsAlert?.inputPlaceholderBn)) || 'e.g. 017XXXXXXXX'
  const alertBtn = (lang === 'bn' ? (smsAlert?.buttonTextBn || smsAlert?.buttonText) : (smsAlert?.buttonText || smsAlert?.buttonTextBn)) || 'Subscribe Free'
  const alertSuccess = (lang === 'bn' ? (smsAlert?.successMsgBn || smsAlert?.successMsg) : (smsAlert?.successMsg || smsAlert?.successMsgBn)) || 'Thank you! Your mobile number has been registered for notice alerts.'

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <FileText className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? (pageMeta.tagBn || pageMeta.tag) : (pageMeta.tag || pageMeta.tagBn)}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? (pageMeta.titleBn || pageMeta.title) : (pageMeta.title || pageMeta.titleBn)}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn' ? (pageMeta.subtitleBn || pageMeta.subtitle) : (pageMeta.subtitle || pageMeta.subtitleBn)}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <FileText className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-ink/10 shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-ink/50 shrink-0 hidden sm:block" />
            {categoryTabs.map((tab) => {
              const isSelected = selectedCat === tab.key || (tab.key === 'ALL' && (selectedCat === 'ALL' || selectedCat === allLabel))
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCat(tab.key)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-board text-chalk shadow-md scale-105'
                      : 'bg-paper text-ink/75 hover:bg-ink/10'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices by keyword...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-ink/20 text-xs sm:text-sm focus:ring-2 focus:ring-iris/30 focus:border-iris outline-none"
            />
          </div>
        </div>

        {/* Pinned / Urgent Notices */}
        {pinnedNotices.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-brick fill-brick" />
              <h2 className="font-display font-bold text-lg text-board uppercase tracking-wider">
                {lang === 'bn' ? 'পিন করা ও জরুরি ঘোষণা' : 'Pinned & Important Announcements'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {pinnedNotices.map((n) => {
                const itemTitle = lang === 'bn' ? (n.titleBn || n.title) : (n.title || n.titleBn)
                const itemText = lang === 'bn' ? (n.textBn || n.text) : (n.text || n.textBn)
                const itemCat = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
                const itemAuthor = lang === 'bn' ? (n.authorBn || n.author) : (n.author || n.authorBn)
                const itemDate = lang === 'bn' ? (n.dateBn || n.date) : (n.date || n.dateBn)

                return (
                  <div
                    key={n.id || n._id}
                    className="bg-white rounded-2xl p-6 border-2 border-brick/40 shadow-lg hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brick bg-brick/10 px-3 py-1 rounded-full">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {itemCat} &middot; {lang === 'bn' ? 'জরুরি' : 'Urgent'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-ink/60">
                          <Calendar className="w-3.5 h-3.5" />
                          {num(itemDate)}
                        </span>
                      </div>

                      <h3 className="font-display font-extrabold text-xl text-board mb-2">{itemTitle}</h3>
                      <p className="text-sm text-ink/75 leading-relaxed mb-4 whitespace-pre-line">{itemText}</p>
                    </div>

                    <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                      <span className="text-xs text-ink/50 font-medium truncate max-w-[150px] sm:max-w-xs">
                        {lang === 'bn' ? 'প্রকাশক:' : 'Issued by:'} {itemAuthor}
                      </span>
                      <button
                        onClick={() => handleDownloadNotice(n)}
                        className="btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-board text-chalk text-xs font-bold hover:bg-boardlt shadow-sm cursor-pointer"
                        title={lang === 'bn' ? 'অফিসিয়াল স্কুল প্যাডে দেখুন ও পিডিএফ ডাউনলোড করুন' : 'View on Official Letterhead Pad & Download PDF'}
                      >
                        <Download className="w-3.5 h-3.5 text-gold" />
                        <span>{lang === 'bn' ? 'অফিসিয়াল প্যাড / পিডিএফ' : 'Official Pad / PDF'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Regular Notices Grid */}
        <div>
          <h2 className="font-display font-bold text-lg text-board mb-4">
            {lang === 'bn' ? 'সাম্প্রতিক সকল নোটিশ' : 'All Recent Circulars'}
          </h2>
          {regularNotices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-ink/10">
              <FileText className="w-12 h-12 text-ink/30 mx-auto mb-3" />
              <p className="font-display font-bold text-lg text-board">
                {lang === 'bn' ? 'কোনো নোটিশ পাওয়া যায়নি' : 'No notices found'}
              </p>
              <p className="text-sm text-ink/60 mt-1">
                {lang === 'bn' ? 'অনুসন্ধান রিসেট করুন বা অন্য বিভাগ নির্বাচন করুন।' : 'Try clearing your search query or selecting another category.'}
              </p>
              <button
                onClick={() => {
                  setSelectedCat(allLabel)
                  setSearchQuery('')
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-board text-chalk text-xs font-bold cursor-pointer"
              >
                {lang === 'bn' ? 'রিসেট করুন' : 'Reset Filters'}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNotices.map((n) => {
                const itemTitle = lang === 'bn' ? (n.titleBn || n.title) : (n.title || n.titleBn)
                const itemText = lang === 'bn' ? (n.textBn || n.text) : (n.text || n.textBn)
                const itemCat = lang === 'bn' ? (n.catBn || n.cat) : (n.cat || n.catBn)
                const itemAuthor = lang === 'bn' ? (n.authorBn || n.author) : (n.author || n.authorBn)
                const itemDate = lang === 'bn' ? (n.dateBn || n.date) : (n.date || n.dateBn)

                return (
                  <div
                    key={n.id || n._id}
                    className="bg-white rounded-2xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="font-bold text-iris uppercase tracking-wide bg-iris/10 px-2.5 py-0.5 rounded-full">
                          {itemCat}
                        </span>
                        <span className="text-ink/50 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {num(itemDate)}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-board mb-2 leading-snug">{itemTitle}</h3>
                      <p className="text-xs sm:text-sm text-ink/75 leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">{itemText}</p>
                    </div>

                    <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                      <span className="text-[11px] text-ink/50 font-medium truncate max-w-[130px]">
                        {lang === 'bn' ? 'প্রকাশক:' : 'By:'} {itemAuthor}
                      </span>
                      <button
                        onClick={() => handleDownloadNotice(n)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-iris hover:underline cursor-pointer"
                        title={lang === 'bn' ? 'অফিসিয়াল স্কুল প্যাডে দেখুন ও পিডিএফ ডাউনলোড করুন' : 'View on Official Letterhead Pad & Download PDF'}
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{lang === 'bn' ? 'অফিসিয়াল প্যাড / PDF' : 'Letterhead PDF'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* SMS / Notice Notification Subscription Box (Fully Dynamic from Dashboard & Database) */}
        {isAlertActive && (
          <div className="mt-12 sm:mt-16 bg-gradient-to-r from-board via-boardlt to-iris rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-chalk shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Bell className="w-5 h-5 text-gold" />
                <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                  {alertTitle}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-chalk/80">
                {alertSubtitle}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              <input
                type="tel"
                placeholder={alertPlaceholder}
                value={mobileNum}
                onChange={(e) => setMobileNum(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-chalk/50 border border-white/20 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-gold flex-1 min-w-0"
                required
              />
              <button
                type="submit"
                className="btn px-5 py-2.5 rounded-xl bg-gold text-ink font-bold text-xs sm:text-sm hover:brightness-110 shadow-md shrink-0 cursor-pointer text-center"
              >
                {alertBtn}
              </button>
            </form>
          </div>
        )}

        {subscribed && (
          <div className="fixed bottom-6 right-6 z-50 bg-board text-white px-5 py-3 rounded-2xl shadow-2xl border border-gold flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-mint" />
            <p className="text-xs font-bold">
              {alertSuccess}
            </p>
          </div>
        )}

        {/* Official School Pad Modal for Print & PDF Download */}
        {activePadNotice && (
          <NoticePadModal
            notice={activePadNotice}
            padConfig={padConfig}
            lang={lang}
            onClose={() => setActivePadNotice(null)}
          />
        )}
      </div>
    </div>
  )
}
