import { useState, useEffect } from 'react'
import {
  UserCheck,
  CheckCircle,
  FileCheck,
  Download,
  Printer,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react'
import { classes } from '../data/content'
import { addSubmission } from '../lib/siteStore'
import { useLanguage } from '../context/LanguageContext'
import api from '../lib/api'

export default function AdmissionPage() {
  const { lang, num } = useLanguage()
  const classKeys = classes.keys.slice(0, 4) // Classes Six to Nine
  const classLabels = (classes[lang] || classes.bn).slice(0, 4)

  const [step, setStep] = useState(1)
  const [submittedSlip, setSubmittedSlip] = useState(null)
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

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    dob: '',
    gender: 'Male',
    desiredClass: 'Six',
    preferredGroup: lang === 'bn' ? 'বিজ্ঞান বিভাগ' : 'Science Group',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    address: '',
    previousSchool: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNext = (e) => {
    e.preventDefault()
    setStep((s) => s + 1)
  }

  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const appTrackingNo = `MPA-${Math.floor(100000 + Math.random() * 900000)}`
    
    // Send to backend MongoDB
    try {
      await api.createSubmission('admission', { ...formData, appTrackingNo, lang })
    } catch (err) {
      console.warn('Backend submission error, fallback to local siteStore', err)
    }

    addSubmission('admission', { ...formData, appTrackingNo, lang })

    const testDate = schoolInfo?.admissionCircular
      ? (lang === 'bn' ? schoolInfo.admissionCircular.examDateBn : schoolInfo.admissionCircular.examDate)
      : (lang === 'bn' ? '১০ ডিসেম্বর ২০২৬, সকাল ১০:০০' : '10 December 2026 at 10:00 AM')

    const examHall = schoolInfo?.admissionCircular
      ? (lang === 'bn' ? schoolInfo.admissionCircular.examHallBn : schoolInfo.admissionCircular.examHall)
      : (lang === 'bn' ? 'এমপিএ মূল ক্যাম্পাস - কক্ষ ২০৪' : 'MPA Main Campus - Room 204')

    setSubmittedSlip({
      ...formData,
      appTrackingNo,
      appliedAt: new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB'),
      testDate,
      examHall,
    })
    setIsSubmitting(false)
    setStep(4)
  }

  const streams = lang === 'bn' ? [
    { id: 'Science', label: 'বিজ্ঞান বিভাগ', note: 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও উচ্চতর গণিত' },
    { id: 'Commerce', label: 'ব্যবসায় শিক্ষা বিভাগ', note: 'হিসাববিজ্ঞান, ফিন্যান্স ও ব্যবসায় উদ্যোগ' },
    { id: 'Humanities', label: 'মানবিক বিভাগ', note: 'ইতিহাস, পৌরনীতি, ভূগোল ও অর্থনীতি' },
  ] : [
    { id: 'Science', label: 'Science Group (বিজ্ঞান)', note: 'Physics, Chemistry, Biology & Higher Math' },
    { id: 'Commerce', label: 'Business Studies (ব্যবসায় শিক্ষা)', note: 'Accounting, Finance & Entrepreneurship' },
    { id: 'Humanities', label: 'Humanities Group (মানবিক)', note: 'History, Civics, Geography & Economics' },
  ]

  return (
    <div className="min-h-screen bg-paper py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-board via-boardlt to-iris rounded-3xl p-8 sm:p-12 text-chalk mb-12 shadow-xl relative overflow-hidden print:hidden">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gold border border-white/15 mb-3">
              <UserCheck className="w-3.5 h-3.5 text-gold" />
              <span>{lang === 'bn' ? '২০২৭ শিক্ষাবর্ষে ভর্তি চলছে' : 'Session 2027 Admissions Open'}</span>
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
              {lang === 'bn' ? 'অনলাইন ভর্তি পোর্টাল' : 'Online Admission Portal'}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-chalk/80 leading-relaxed">
              {lang === 'bn'
                ? 'মিরাশানী একাডেমিতে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে ভর্তির আবেদন করুন। ৩টি সহজ ধাপে ফরম পূরণ করে তাৎক্ষণিক ভর্তি পরীক্ষার প্রবেশপত্র সংগ্রহ করুন।'
                : 'Join Mirashani Academy (General High School) for Classes Six to Nine. Apply online in 3 easy steps and get your instant Admission Test Admit Slip.'}
            </p>
          </div>
        </div>

        {/* Steps Progress Header */}
        <div className="bg-white rounded-2xl p-3 sm:p-6 border border-ink/10 shadow-sm mb-8 sm:mb-10 max-w-4xl mx-auto print:hidden">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[10px] sm:text-xs font-bold">
            <div className={`p-2 sm:p-2.5 rounded-xl transition-all ${step >= 1 ? 'bg-board text-gold' : 'bg-paper text-ink/40'}`}>
              {lang === 'bn' ? '১. শিক্ষার্থীর তথ্য' : '1. Student Details'}
            </div>
            <div className={`p-2 sm:p-2.5 rounded-xl transition-all ${step >= 2 ? 'bg-board text-gold' : 'bg-paper text-ink/40'}`}>
              {lang === 'bn' ? '২. অভিভাবক' : '2. Guardian'}
            </div>
            <div className={`p-2 sm:p-2.5 rounded-xl transition-all ${step >= 3 ? 'bg-board text-gold' : 'bg-paper text-ink/40'}`}>
              {lang === 'bn' ? '৩. নিশ্চিতকরণ' : '3. Confirm'}
            </div>
          </div>
        </div>

        {/* Multi-Step Application Form Card */}
        {step < 4 && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-ink/10 shadow-xl mb-16 print:hidden">
            {/* Step 1: Student Information */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-board">
                    {lang === 'bn' ? 'ধাপ ১: শিক্ষার্থীর ব্যক্তিগত তথ্য' : 'Step 1: Student Personal Details'}
                  </h3>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {lang === 'bn' ? 'জন্মনিবন্ধন সনদ অনুযায়ী সঠিক তথ্য প্রদান করুন' : 'Please provide accurate birth certificate data'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'শিক্ষার্থীর পূর্ণ নাম (বাংলা/ইংরেজি)' : 'Student Full Name (English)'}
                    </label>
                    <input
                      name="studentName"
                      required
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'}
                    </label>
                    <input
                      name="dob"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'লিঙ্গ' : 'Gender'}
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    >
                      <option value="Male">{lang === 'bn' ? 'ছাত্র' : 'Male'}</option>
                      <option value="Female">{lang === 'bn' ? 'ছাত্রী' : 'Female'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'যে শ্রেণিতে ভর্তি হতে ইচ্ছুক' : 'Admission Desired For Class'}
                    </label>
                    <select
                      name="desiredClass"
                      value={formData.desiredClass}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    >
                      {classKeys.map((c, idx) => (
                        <option key={c} value={c}>
                          {classLabels[idx]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয়ের নাম (যদি থাকে)' : 'Previous School Name (If any)'}
                    </label>
                    <input
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: মিরাশানী সরকারি প্রাথমিক বিদ্যালয়' : 'e.g. Mirashani Primary School'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn px-6 py-3 rounded-xl bg-board text-chalk font-bold text-sm hover:bg-boardlt inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue to Step 2'}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Guardian Information */}
            {step === 2 && (
              <form onSubmit={handleNext} className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-board">
                    {lang === 'bn' ? 'ধাপ ২: অভিভাবক ও যোগাযোগের তথ্য' : 'Step 2: Guardian & Contact Details'}
                  </h3>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {lang === 'bn' ? 'জরুরি যোগাযোগ ও এসএমএস অ্যালার্টের জন্য সঠিক নম্বর দিন' : 'Contact info for SMS alerts and emergency contacts'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'পিতার নাম' : "Father's Name"}
                    </label>
                    <input
                      name="fatherName"
                      required
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: মো. দেলোয়ার হোসেন' : 'e.g. Md. Delowar Hossain'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'মাতার নাম' : "Mother's Name"}
                    </label>
                    <input
                      name="motherName"
                      required
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: বেগম রোকেয়া' : 'e.g. Begum Rokeya'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'অভিভাবকের সক্রিয় মোবাইল নম্বর' : 'Guardian Mobile Number (Active)'}
                    </label>
                    <input
                      name="guardianPhone"
                      type="tel"
                      required
                      value={formData.guardianPhone}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: ০১৭XXXXXXXX' : 'e.g. 017XXXXXXXX'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink/80 mb-1">
                      {lang === 'bn' ? 'গ্রাম / ডাকঘর / ঠিকানা' : 'Village / Ward / Address'}
                    </label>
                    <input
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder={lang === 'bn' ? 'যেমন: মিরাশানী, ডাক: সদর' : 'e.g. Mirashani, Post: Sadar'}
                      className="w-full px-4 py-3 rounded-xl border border-ink/20 text-sm outline-none focus:ring-2 focus:ring-iris/30"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5 cursor-pointer"
                  >
                    {lang === 'bn' ? 'পূর্ববর্তী ধাপে যান' : 'Back to Step 1'}
                  </button>
                  <button
                    type="submit"
                    className="btn px-6 py-3 rounded-xl bg-board text-chalk font-bold text-sm hover:bg-boardlt inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপে যান' : 'Continue to Step 3'}</span>
                    <ArrowRight className="w-4 h-4 text-gold" />
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Stream & Confirmation */}
            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-xl text-board">
                    {lang === 'bn' ? 'ধাপ ৩: একাডেমিক বিভাগ ও যাচাইকরণ' : 'Step 3: Academic Stream & Verification'}
                  </h3>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {lang === 'bn' ? 'পছন্দের বিভাগ নির্বাচন করুন (৯ম-১০ম শ্রেণির ক্ষেত্রে)' : 'Select your preferred group (For Class 9-10 applicants)'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink/80 mb-2">
                    {lang === 'bn' ? 'পছন্দের একাডেমিক বিভাগ' : 'Select Preferred Academic Group'}
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {streams.map((stream) => (
                      <label
                        key={stream.id}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          formData.preferredGroup === stream.label
                            ? 'border-gold bg-gold/10'
                            : 'border-ink/10 hover:border-iris/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="preferredGroup"
                          value={stream.label}
                          checked={formData.preferredGroup === stream.label}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="font-bold text-sm text-board">{stream.label}</span>
                        <span className="text-[11px] text-ink/60 mt-1">{stream.note}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-paper border border-ink/10 text-xs text-ink/80 space-y-1">
                  <p className="font-bold text-board">
                    {lang === 'bn' ? 'ভর্তি পরীক্ষার দিন সাথে আনতে হবে:' : 'Required documents to present on Admission Test Day:'}
                  </p>
                  <p>&bull; {lang === 'bn' ? '২ কপি পাসপোর্ট সাইজের রঙিন ছবি' : '2 copies of recent passport size photographs'}</p>
                  <p>&bull; {lang === 'bn' ? 'অনলাইন ডিজিটাল জন্মনিবন্ধন সনদের ফটোকপি' : 'Photocopy of Online Digital Birth Registration Certificate'}</p>
                  <p>&bull; {lang === 'bn' ? 'পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র বা প্রশংসাপত্র' : 'Original Transfer Certificate (TC) or Marks certificate from previous school'}</p>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-ink/20 text-xs font-bold text-ink hover:bg-ink/5 cursor-pointer text-center"
                  >
                    {lang === 'bn' ? 'পূর্ববর্তী ধাপে যান' : 'Back to Step 2'}
                  </button>
                  <button
                    type="submit"
                    className="btn px-6 sm:px-8 py-3.5 rounded-xl bg-gold text-ink font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{lang === 'bn' ? 'আবেদন নিশ্চিত করুন ও প্রবেশপত্র তৈরি করুন' : 'Submit & Generate Admit Slip'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Step 4: Final Generated Slip & Success */}
        {step === 4 && submittedSlip && (
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 print:hidden">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-mint" />
                <span className="text-sm font-bold text-board">
                  {lang === 'bn' ? 'আবেদন সফলভাবে সম্পন্ন হয়েছে!' : 'Application Successfully Recorded!'}
                </span>
              </div>
              <button
                onClick={() => window.print()}
                className="btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-board text-chalk text-xs sm:text-sm font-bold hover:bg-boardlt shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4 text-gold" />
                <span>{lang === 'bn' ? 'প্রবেশপত্র প্রিন্ট করুন' : 'Print Test Admit Card'}</span>
              </button>
            </div>

            {/* Official Admission Admit Card Slip */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border-2 border-dashed border-board shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
              <div className="border-b-2 border-board pb-4 mb-6 text-center">
                <h3 className="font-display font-black text-xl sm:text-2xl text-board">
                  {lang === 'bn' ? 'মিরাশানী একাডেমি' : 'MIRASHANI ACADEMY'}
                </h3>
                <p className="text-[11px] sm:text-xs uppercase tracking-widest text-ink/70 font-semibold">
                  {lang === 'bn' ? 'কলেজ রোড, উপজেলা সদর · ইআইআইএন: ১০৮৪২০' : 'College Road, Upazila Sadar · EIIN: 108420'}
                </p>
                <div className="mt-2 inline-block px-3 sm:px-4 py-1 rounded-full bg-gold text-ink text-[11px] sm:text-xs font-extrabold uppercase">
                  {lang === 'bn' ? 'ভর্তি পরীক্ষা প্রবেশপত্র ও নিবন্ধন স্লিপ - ২০২৭' : 'ADMISSION TEST ADMIT CARD & REGISTRATION SLIP - 2027'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm bg-paper p-4 sm:p-6 rounded-2xl border border-ink/10 mb-6">
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'আবেদন ট্র্যাকিং নম্বর:' : 'Tracking Application No:'}</span>
                  <strong className="text-iris font-mono text-base font-bold">{submittedSlip.appTrackingNo}</strong>
                </div>
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'আবেদনকৃত শ্রেণি:' : 'Applied For:'}</span>
                  <strong className="text-board">
                    {classLabels[classKeys.indexOf(submittedSlip.desiredClass)] || submittedSlip.desiredClass}
                  </strong>
                </div>
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'শিক্ষার্থীর নাম:' : 'Candidate Name:'}</span>
                  <strong className="text-board font-display text-sm">{submittedSlip.studentName}</strong>
                </div>
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'নির্বাচিত বিভাগ:' : 'Selected Academic Group:'}</span>
                  <strong className="text-board">{submittedSlip.preferredGroup}</strong>
                </div>
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'পিতার নাম:' : "Father's Name:"}</span>
                  <span className="text-board">{submittedSlip.fatherName}</span>
                </div>
                <div>
                  <span className="text-ink/60 block">{lang === 'bn' ? 'অভিভাবকের মোবাইল:' : 'Guardian Mobile:'}</span>
                  <span className="text-board">{num(submittedSlip.guardianPhone)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-board text-chalk text-xs space-y-1 mb-6">
                <div className="flex justify-between">
                  <span className="text-chalk/70">{lang === 'bn' ? 'ভর্তি পরীক্ষার তারিখ ও সময়:' : 'Admission Test Date & Time:'}</span>
                  <strong className="text-gold">{submittedSlip.testDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-chalk/70">{lang === 'bn' ? 'পরীক্ষার কেন্দ্র ও কক্ষ:' : 'Reporting Venue:'}</span>
                  <strong className="text-white">{submittedSlip.examHall}</strong>
                </div>
              </div>

              <div className="pt-6 border-t border-ink/20 flex justify-between items-end text-xs text-ink/70">
                <div>
                  <p className="font-semibold text-board">{lang === 'bn' ? 'ভর্তি কার্যালয়' : 'Admission Office Desk'}</p>
                  <p className="text-[10px]">{lang === 'bn' ? `ইস্যুর তারিখ: ${submittedSlip.appliedAt}` : `Issued on: ${submittedSlip.appliedAt}`}</p>
                </div>
                <div className="text-right">
                  <div className="border-b border-ink/40 w-32 mb-1" />
                  <p className="font-bold text-board">{lang === 'bn' ? 'আহ্বায়কের স্বাক্ষর' : 'Convener Signature'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admission Key Dates & Fees */}
        <div className="grid md:grid-cols-2 gap-8 print:hidden">
          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-iris" />
              <h3 className="font-display font-bold text-xl text-board">
                {lang === 'bn' ? 'ভর্তি সংক্রান্ত জরুরি সময়সূচি (২০২৭)' : 'Important Admission Deadlines (2027)'}
              </h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span className="font-bold text-board">{lang === 'bn' ? 'ফরম বিতরণ ও গ্রহণ' : 'Form Distribution'}</span>
                <span className="text-ink/75">{lang === 'bn' ? '১ নভেম্বর - ৩০ নভেম্বর ২০২৬' : '1 Nov - 30 Nov 2026'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span className="font-bold text-board">{lang === 'bn' ? 'লিখিত ভর্তি পরীক্ষা' : 'Written Admission Test'}</span>
                <span className="text-ink/75">{lang === 'bn' ? '১০ ডিসেম্বর ২০২৬ (সকাল ১০টা)' : '10 December 2026 (10 AM)'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span className="font-bold text-board">{lang === 'bn' ? 'মেধাতালিকা প্রকাশ' : 'Merit List Publication'}</span>
                <span className="text-ink/75">{lang === 'bn' ? '১৫ ডিসেম্বর ২০২৬' : '15 December 2026'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span className="font-bold text-board">{lang === 'bn' ? 'চূড়ান্ত ভর্তি ও বই বিতরণ' : 'Final Admission & Book Distribution'}</span>
                <span className="text-ink/75">{lang === 'bn' ? '২০ ডিসেম্বর - ৩১ ডিসেম্বর ২০২৬' : '20 Dec - 31 Dec 2026'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span className="font-bold text-board">{lang === 'bn' ? 'ওরিয়েন্টেশন ও ক্লাস শুরু' : 'Orientation & Classes Begin'}</span>
                <span className="text-mint font-bold">{lang === 'bn' ? '২ জানুয়ারি ২০২৭' : '2 January 2027'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-ink/10 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-mint" />
              <h3 className="font-display font-bold text-xl text-board">
                {lang === 'bn' ? 'বেতন ও ফি কাঠামো' : 'Tuition & Fee Structure'}
              </h3>
            </div>
            <p className="text-xs text-ink/70 mb-4">
              {lang === 'bn'
                ? 'সরকারি নীতিমালা মোতাবেক নির্ধারিত ফি এবং জিপিএ ৫.০০ প্রাপ্তদের জন্য শতভাগ বৃত্তি সুবিধা।'
                : 'Government regulated, non-profit academic fee structure with full scholarship opportunities for GPA 5.00 scorers.'}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span>{lang === 'bn' ? 'ভর্তি ও রেজিস্ট্রেশন ফি (এককালীন)' : 'Admission & Registration Fee (One-Time)'}</span>
                <strong className="text-board">{lang === 'bn' ? '৳ ১,৫০০' : 'BDT 1,500'}</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span>{lang === 'bn' ? 'মাসিক বেতন (৬ষ্ঠ - ৮ম শ্রেণি)' : 'Monthly Tuition (Class 6 - 8)'}</span>
                <strong className="text-board">{lang === 'bn' ? '৳ ৬০০ / মাস' : 'BDT 600 / month'}</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span>{lang === 'bn' ? 'মাসিক বেতন (৯ম - ১০ম শ্রেণি এসএসসি)' : 'Monthly Tuition (Class 9 - 10 SSC General)'}</span>
                <strong className="text-board">{lang === 'bn' ? '৳ ৮০০ / মাস' : 'BDT 800 / month'}</strong>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-paper">
                <span>{lang === 'bn' ? 'বিজ্ঞান ল্যাব ও আইসিটি চার্জ' : 'Science Lab & Computer Facility Fee'}</span>
                <strong className="text-board">{lang === 'bn' ? '৳ ২৫০ / টার্ম' : 'BDT 250 / term'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
