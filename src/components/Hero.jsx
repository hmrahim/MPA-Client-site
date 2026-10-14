import { useMemo, useState } from 'react'
import Banner from './Banner'
import Doodles from './Doodles'
import useTypewriter from '../hooks/useTypewriter'
import useCountUp from '../hooks/useCountUp'
import { avatar } from '../lib/art'
import { classes, heroStats, notices, teachWords, toppers } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

function Stat({ icon, label, value }) {
  const shown = useCountUp(value)
  return (
    <div className="hero-stat">
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <dt className="text-xs text-chalk/60">{label}</dt>
      <dd className="font-display font-bold text-[2.3rem] text-gold">{shown}</dd>
    </div>
  )
}

export default function Hero({ onLookup }) {
  const { lang, t, num } = useLanguage()
  const word = useTypewriter(teachWords[lang] || teachWords.bn)
  const [cls, setCls] = useState('Ten')
  const [roll, setRoll] = useState('')

  const topperName = toppers.Ten[0]
  const stack = useMemo(() => ['Rafi Ahmed', 'Tanha Akter', 'Nabila Karim', 'Farhan Sadik', 'Ayesha Siddika'], [])

  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.en

  const submit = (e) => {
    e.preventDefault()
    onLookup({ cls, roll })
    document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const noticeList = notices[lang] || notices.bn
  const statList = heroStats[lang] || heroStats.bn

  return (
    <section className="hero-bg text-chalk">
      <div className="blob w-72 h-72 bg-brick -top-10 -left-10" />
      <div className="blob w-80 h-80 bg-gold right-0 top-1/3" style={{ animationDelay: '-4s', opacity: 0.25 }} />
      <div className="blob w-64 h-64 bg-mint bottom-0 left-1/3" style={{ animationDelay: '-8s', opacity: 0.3 }} />
      <div className="hero-doodles absolute inset-0 pointer-events-none text-chalk" aria-hidden="true">
        <Doodles count={27} />
      </div>

      {/* headline + result card */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-5 gap-10 items-center">
        <div className="md:col-span-3 hero-copy">
          <p className="hero-badge font-medium mb-3">
            {lang === 'bn' ? '৬ষ্ঠ থেকে ১০ম শ্রেণি · সাধারণ মাধ্যমিক শিক্ষা' : 'Classes Six to Ten · General Secondary Education'}
          </p>
          <h1 className="grad-text font-display font-extrabold leading-[1.05]">
            {lang === 'bn' ? 'জ্ঞান, চরিত্র ও শ্রেষ্ঠত্ব' : 'Knowledge, Character & Excellence'}
          </h1>
          <svg className="mt-2 w-64 h-4 text-gold" viewBox="0 0 260 16" fill="none" aria-hidden="true">
            <path className="draw" d="M2 10Q20 0 40 9T80 9T120 9T160 9T200 9T258 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="mt-4 text-2xl font-display font-bold">
            {lang === 'bn' ? 'আমরা শেখাই ' : 'We teach '}
            <span className="text-gold">{word}</span>
            <span className="caret" />
          </p>
          <p className="mt-4 text-chalk/80 max-w-xl text-lg">
            {lang === 'bn'
              ? 'মিরাশানী একাডেমি বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগে প্রথম সারির সাধারণ মাধ্যমিক শিক্ষা প্রদান করে। এখানে নম্বর যাচাই করুন, নোটিশ পড়ুন এবং শিক্ষার্থীর একাডেমিক অগ্রগতি অনুসরণ করুন।'
              : 'Mirashani Academy provides premier general secondary education across Science, Business Studies and Humanities. Check marks, read circulars, and monitor student academic progress here.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#results" className="btn btn-gold bg-gold text-ink font-bold hover:brightness-105">
              {lang === 'bn' ? 'ফলাফল দেখুন' : 'Check your result'}
            </a>
            <a href="#notices" className="btn btn-ghost border border-chalk/40 font-bold hover:bg-boardlt">
              {lang === 'bn' ? 'নোটিশ পড়ুন' : 'Read notices'}
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              {stack.map((n) => (
                <img key={n} src={avatar(n)} alt="" className="w-10 h-10 rounded-full ring-2 ring-white object-cover" />
              ))}
            </div>
            <p className="text-sm text-chalk/80 leading-snug">
              <b className="text-white">
                {lang === 'bn' ? num('1,200+') + ' শিক্ষার্থী' : '1,200+ students'}
              </b>
              {lang === 'bn' ? ' আমাদের সাথে শিখছে ও বড় হচ্ছে' : ' learn and grow with us'}
              <br />
              <span className="text-gold tracking-widest">★★★★★</span>
              {lang === 'bn' ? ' অভিভাবকদের আস্থায় বিশ্বস্ত' : ' trusted by guardians'}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 relative py-6 md:py-4">
          <div className="hc-main glass p-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl grid place-items-center text-2xl bg-gold" aria-hidden="true">📝</span>
              <div>
                <h2 className="font-display font-bold text-xl leading-tight">
                  {lang === 'bn' ? 'ফলাফল যাচাই করুন' : 'Check your result'}
                </h2>
                <p className="text-xs text-chalk/70">
                  {lang === 'bn' ? 'মাত্র ১০ সেকেন্ডে' : 'Takes just 10 seconds'}
                </p>
              </div>
            </div>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <select value={cls} onChange={(e) => setCls(e.target.value)} className="hi" aria-label={lang === 'bn' ? 'শ্রেণি' : 'Class'}>
                {classKeys.map((key, i) => (
                  <option key={key} value={key}>{classLabels[i]}</option>
                ))}
              </select>
              <input
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="hi"
                placeholder={lang === 'bn' ? 'আপনার রোল নম্বর' : 'Your roll number'}
                inputMode="numeric"
                required
                aria-label={lang === 'bn' ? 'রোল নম্বর' : 'Roll number'}
              />
              <button className="btn w-full bg-gold text-ink py-3 font-bold">
                {lang === 'bn' ? 'আমার ফলাফল দেখুন' : 'Show my result'}
              </button>
            </form>
          </div>

          <div className="hc-note">
            <span className="text-2xl" aria-hidden="true">📢</span>
            <div>
              <p className="text-xs font-bold text-brick">
                {lang === 'bn' ? 'সর্বশেষ নোটিশ' : 'Latest notice'}
              </p>
              <p className="text-sm font-semibold leading-snug">{noticeList[0]?.title}</p>
            </div>
          </div>
          <div className="hc-top">
            <img src={avatar(topperName.nameEn)} alt="" className="w-11 h-11 rounded-full ring-2 ring-gold" />
            <div>
              <p className="text-xs font-bold text-brick">
                {lang === 'bn' ? '১০ম শ্রেণির সেরা শিক্ষার্থী' : 'Class Ten topper'}
              </p>
              <p className="text-sm font-bold">
                {lang === 'bn' ? topperName.name : topperName.nameEn}
              </p>
            </div>
            <span className="text-2xl" aria-hidden="true">🥇</span>
          </div>
        </div>
      </div>

      {/* board + slideshow */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-14 grid lg:grid-cols-3 gap-6 items-start">
        <div className="sway glass p-5">
          <h2 className="font-display font-bold text-xl text-gold">
            {lang === 'bn' ? 'আজকের নোটিশ বোর্ড' : 'On the board today'}
          </h2>
          <div className="chalk-line my-3" />
          <ul className="space-y-3 text-sm">
            {noticeList.slice(0, 4).map((n) => (
              <li key={n.id}>
                <span className="text-gold">{n.date}</span>
                <br />
                {n.title}
              </li>
            ))}
          </ul>
          <a href="#notices" className="inline-block mt-4 text-gold font-bold text-sm underline underline-offset-4">
            {lang === 'bn' ? 'সকল নোটিশ দেখুন' : 'See all notices'}
          </a>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-display font-bold text-xl mb-3 text-gold">
            {lang === 'bn' ? 'আমাদের বিদ্যালয়ের মুহূর্ত' : 'Moments from our school'}
          </h2>
          <Banner />
        </div>
      </div>

      {/* stats */}
      <div className="relative z-10">
        <dl className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {statList.map((s) => <Stat key={s.label} {...s} />)}
        </dl>
      </div>

      <svg className="block w-full -mb-px relative z-10" viewBox="0 0 1440 90" preserveAspectRatio="none" height="70" aria-hidden="true">
        <path d="M0 50Q240 110 480 55T960 50T1440 45V90H0z" fill="#faf8ff" />
      </svg>
    </section>
  )
}
