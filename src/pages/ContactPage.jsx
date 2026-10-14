import { useState, useEffect } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Building2,
} from 'lucide-react'
import { contact as defaultContact } from '../data/content'
import { addSubmission } from '../lib/siteStore'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function ContactPage() {
  const { lang, num } = useLanguage()
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [schoolInfo, setSchoolInfo] = useState(() => {
    try {
      const cached = localStorage.getItem('mpa_school_info_cache')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    api.getSchoolInfo().then((res) => {
      if (res && res.success && res.data) {
        setSchoolInfo(res.data)
        localStorage.setItem('mpa_school_info_cache', JSON.stringify(res.data))
      }
    }).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await api.createSubmission('contact', { ...formData, lang })
    } catch (err) {
      console.warn('Backend message error', err)
    }
    addSubmission('contact', { ...formData, lang })
    setSubmitted(true)
    setIsSubmitting(false)
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const contactData = {
    address: schoolInfo?.address || defaultContact.address,
    addressBn: schoolInfo?.addressBn || 'মিরাশানী একাডেমি (উচ্চ বিদ্যালয়), কলেজ রোড, উপজেলা সদর, ব্রাহ্মণবাড়িয়া',
    phone: schoolInfo?.phone || defaultContact.phone,
    altPhone: schoolInfo?.altPhone || defaultContact.altPhone,
    email: schoolInfo?.email || defaultContact.email,
    hours: schoolInfo?.hours || defaultContact.hours,
    hoursBn: schoolInfo?.hoursBn || 'রবিবার থেকে বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৪:০০ (খোলা)',
    emergency: schoolInfo?.emergency || defaultContact.emergency,
  }

  const officeHours = lang === 'bn' ? contactData.hoursBn : contactData.hours

  const inquiryTopics = lang === 'bn' ? [
    'নতুন শিক্ষার্থী ভর্তি তথ্য',
    'ফলাফল ও প্রত্যয়নপত্র সংক্রান্ত',
    'বেতন ও ফি সংক্রান্ত অনুসন্ধান',
    'বিজ্ঞান ল্যাব ও একাডেমিক বিভাগ',
    'প্রধান শিক্ষকের সাথে সাক্ষাতের আবেদন',
  ] : [
    'New Student Admission',
    'Result & Certificate Issue',
    'Tuition & Fees Inquiries',
    'Science Lab & Academic Group Info',
    'Guardian Meeting Appointment',
  ]

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? 'প্রশাসনের সাথে সরাসরি যোগাযোগ' : 'Get in Touch with Administration'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'যোগাযোগ ও ক্যাম্পাসের অবস্থান' : 'Contact & Location'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'ভর্তি, পরীক্ষার সময়সূচি বা শিক্ষার্থী সংক্রান্ত যেকোনো প্রয়োজনে আমাদের ক্যাম্পাসে আসুন বা হেল্পডেস্কে বার্তা পাঠান।'
                : 'Have questions regarding student admissions, examination schedules, or academic counseling? Reach out to our campus helpdesk or visit our office during working hours.'}
            </p>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-12 gap-10 mb-16">
          {/* Left: Office Information & Dept Numbers */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-md space-y-6">
              <h2 className="font-display font-bold text-2xl text-board">
                {lang === 'bn' ? 'বিদ্যালয় কার্যালয়' : 'Campus Office'}
              </h2>

              <div className="space-y-4 text-sm text-ink/80">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold grid place-items-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-board">
                      {lang === 'bn' ? 'ক্যাম্পাসের ঠিকানা' : 'Physical Address'}
                    </strong>
                    <span>
                      {lang === 'bn'
                        ? contactData.addressBn
                        : contactData.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-mint/20 text-mint grid place-items-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-board">
                      {lang === 'bn' ? 'টেলিফোন ও হেল্পলাইন' : 'Direct Telephone'}
                    </strong>
                    <span>{num(contactData.phone)} / {num(contactData.altPhone)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brick/10 text-brick grid place-items-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-board">
                      {lang === 'bn' ? 'দাপ্তরিক ইমেইল' : 'Official Email'}
                    </strong>
                    <span>{contactData.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-iris/10 text-iris grid place-items-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-board">
                      {lang === 'bn' ? 'সাক্ষাৎ ও অফিস সময়' : 'Visiting & Office Hours'}
                    </strong>
                    <span>{officeHours}</span>
                  </div>
                </div>
              </div>

              {/* Department Directory */}
              <div className="pt-6 border-t border-ink/10">
                <h3 className="font-display font-bold text-sm text-board mb-3 uppercase tracking-wider">
                  {lang === 'bn' ? 'সরাসরি দপ্তর এক্সটেনশন' : 'Direct Office Extensions'}
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-paper">
                    <span className="font-medium text-board">
                      {lang === 'bn' ? 'প্রধান শিক্ষকের সচিবালয়:' : 'Principal Secretarial Desk:'}
                    </span>
                    <span className="font-mono text-iris font-bold">{lang === 'bn' ? 'এক্স: ১০১' : 'Ext: 101'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-paper">
                    <span className="font-medium text-board">
                      {lang === 'bn' ? 'ভর্তি ও ছাত্রকল্যাণ ডেস্ক:' : 'Admission & Student Affairs:'}
                    </span>
                    <span className="font-mono text-iris font-bold">{lang === 'bn' ? 'এক্স: ১০৪' : 'Ext: 104'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-paper">
                    <span className="font-medium text-board">
                      {lang === 'bn' ? 'হিসাব ও ফি কাউন্টার:' : 'Accounts & Fee Counter:'}
                    </span>
                    <span className="font-mono text-iris font-bold">{lang === 'bn' ? 'এক্স: ১০৮' : 'Ext: 108'}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-paper">
                    <span className="font-medium text-board">
                      {lang === 'bn' ? 'বিজ্ঞান ল্যাব ও পরীক্ষা ডেস্ক:' : 'Science Lab & Academic Desk:'}
                    </span>
                    <span className="font-mono text-iris font-bold">{lang === 'bn' ? 'এক্স: ১১২' : 'Ext: 112'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-ink/10 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-iris" />
                <h2 className="font-display font-bold text-2xl text-board">
                  {lang === 'bn' ? 'অনলাইন বার্তা বা অনুসন্ধান পাঠান' : 'Send an Official Inquiry'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink/70 mb-6">
                {lang === 'bn'
                  ? 'আমাদের প্রশাসনিক কর্মকর্তারা কার্যদিবসের মধ্যে আপনার বার্তার উত্তর প্রদান করবেন।'
                  : 'Our administrative staff reviews and replies to guardian inquiries within 24 working hours.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your Full Name'}
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'bn' ? 'যেমন: মো. রফিকুল ইসলাম' : 'e.g. Md. Rafiq'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={lang === 'bn' ? 'যেমন: ০১৭XXXXXXXX' : 'e.g. 017XXXXXXXX'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={lang === 'bn' ? 'যেমন: name@example.com' : 'e.g. name@example.com'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'অনুসন্ধানের বিষয়' : 'Inquiry Topic'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30 cursor-pointer"
                    >
                      <option value="">{lang === 'bn' ? 'বিষয় নির্বাচন করুন' : 'Select Topic'}</option>
                      {inquiryTopics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink/80 mb-1">
                    {lang === 'bn' ? 'আপনার বিস্তারিত বার্তা' : 'Your Detailed Message'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'bn' ? 'এখানে আপনার প্রশ্ন বা বার্তা লিখুন...' : 'Write your questions or notes here...'}
                    className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-full sm:w-auto px-8 py-3.5 rounded-xl bg-board text-chalk font-bold text-sm hover:bg-boardlt shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>{lang === 'bn' ? 'বার্তা প্রেরণ করুন' : 'Transmit Message'}</span>
                </button>
              </form>

              {submitted && (
                <div className="mt-6 p-4 rounded-2xl bg-mint/15 border border-mint/30 flex items-center gap-3 text-sm text-board font-medium animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-mint shrink-0" />
                  <p>
                    {lang === 'bn'
                      ? 'আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! খুব দ্রুত আমাদের অফিস যোগাযোগ করবে।'
                      : 'Your message has been received! Our office will get back to you shortly.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Realistic Interactive Campus Location Map Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-ink/10 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-board" />
            <h3 className="font-display font-bold text-xl text-board">
              {lang === 'bn' ? 'ক্যাম্পাসের অবস্থান ও দিকনির্দেশনা' : 'Campus Location & Directions'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-ink/70 mb-6">
            {lang === 'bn'
              ? 'কলেজ রোডের প্রধান সড়কের পাশেই মনোরম পরিবেশে ক্যাম্পাস অবস্থিত। যেকোনো গণপরিবহনে সহজে পৌঁছানো যায়।'
              : 'Located right beside College Road, easily accessible by public transport, auto-rickshaw and school bus routes.'}
          </p>

          <div className="w-full h-80 rounded-2xl overflow-hidden border border-ink/15 relative bg-slate-100 flex items-center justify-center">
            <iframe
              title="Campus Map"
              src="https://maps.google.com/maps?q=Brahmanbaria+Bangladesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
