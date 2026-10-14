import { useState } from 'react'
import Reveal from './Reveal'
import { avatar } from '../lib/art'
import { toppers, classes } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

const medals = ['🥇', '🥈', '🥉']

export default function Toppers() {
  const { lang, num } = useLanguage()
  const [cls, setCls] = useState('Ten')
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  return (
    <section id="toppers" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
      <Reveal as="h2" className="sec-title font-display">
        {lang === 'bn' ? 'সকল শ্রেণির সেরা ১০ শিক্ষার্থী' : 'Top 10 students of every class'}
      </Reveal>
      <Reveal as="p" delay={90} className="text-ink/70 mt-1">
        {lang === 'bn'
          ? 'সর্বশেষ পরীক্ষার মেধা তালিকা অনুযায়ী সাজানো। প্রতিদিনের পরিশ্রমই এনে দেয় এই গৌরব।'
          : 'Ranked by the latest exam. Every name on this list started as a student who kept showing up.'}
      </Reveal>

      <Reveal delay={180} className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Class">
        {classKeys.map((c, i) => (
          <button
            key={c}
            role="tab"
            aria-selected={c === cls}
            onClick={() => setCls(c)}
            className={`btn px-4 py-2 border border-ink/25 text-sm font-bold ${c === cls ? 'tab-on' : 'bg-white'}`}
          >
            {classLabels[i]}
          </button>
        ))}
      </Reveal>

      <Reveal as="ol" delay={270} className="pop-in mt-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {(toppers[cls] || []).map((entry, i) => {
          const studentName = typeof entry === 'object'
            ? (lang === 'bn' ? entry.name : entry.nameEn || entry.name)
            : entry
          const photo = typeof entry === 'object' ? entry.photo : ''
          const top3 = i < 3
          return (
            <li key={`${cls}-${i}`} data-tilt className={`topper-card ${top3 ? 'topper-top' : ''}`}>
              {top3 && <span className="medal" aria-hidden="true">{medals[i]}</span>}
              <div className={`avatar ${top3 ? 'avatar-gold' : ''}`}>
                <img src={photo || avatar(studentName)} alt={studentName} className="w-full h-full object-cover" />
              </div>
              <p className="mt-3 font-display font-bold">{studentName}</p>
              <p className="text-xs text-ink/60">
                {lang === 'bn'
                  ? `${classLabels[classKeys.indexOf(cls)]} · রোল ${num(entry.roll || i + 1)}`
                  : `Class ${cls}, Rank ${i + 1}`}
              </p>
            </li>
          )
        })}
      </Reveal>

      <Reveal delay={360} className="motivate mt-12 text-chalk p-8 md:p-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-display font-bold text-2xl text-gold">
            {lang === 'bn' ? 'শীর্ষ ১০-এ নাম নেই? পরবর্তী সুযোগ তোমারই!' : 'Not in the top 10 yet? Your turn is next.'}
          </h3>
          <p className="mt-3 text-chalk/80 max-w-xl">
            {lang === 'bn'
              ? 'মেধাতালিকা একদিনের মূল্যায়ন মাত্র। প্রতি সেমিস্টারে যারা সবচেয়ে বেশি উন্নতি করেছে, শতভাগ উপস্থিত ছিল কিংবা সহপাঠীকে সাহায্য করেছে, আমরা তাদেরও পুরস্কৃত করি।'
              : 'Rank is one number on one day. Every term we also honour the students who improved the most, never missed a class, or helped a classmate. Your name can be on this board too.'}
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="bg-boardlt rounded-md px-4 py-3">
            <b className="text-gold">{lang === 'bn' ? 'সর্বাধিক উন্নতি পুরস্কার' : 'Most improved'}</b>
            <br />
            {lang === 'bn' ? 'প্রতি টার্মে প্রদান করা হয়' : 'Awarded each term'}
          </li>
          <li className="bg-boardlt rounded-md px-4 py-3">
            <b className="text-gold">{lang === 'bn' ? 'শতভাগ উপস্থিতি সনদ' : 'Perfect attendance'}</b>
            <br />
            {lang === 'bn' ? 'নিয়মিত শিক্ষার্থীদের জন্য' : 'Certificate every term'}
          </li>
          <li className="bg-boardlt rounded-md px-4 py-3">
            <b className="text-gold">{lang === 'bn' ? 'সেরা উদ্ভাবন প্রজেক্ট' : 'Best project'}</b>
            <br />
            {lang === 'bn' ? 'বিজ্ঞান মেলা ও বিতর্ক ট্রফি' : 'Science Fair & Debate Trophy'}
          </li>
        </ul>
      </Reveal>
    </section>
  )
}
