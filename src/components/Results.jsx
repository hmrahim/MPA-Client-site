import { useState } from 'react'
import Reveal from './Reveal'
import { classes, exams, resultFiles } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Results({ lookup, setLookup }) {
  const { lang, num } = useLanguage()
  const examList = exams[lang] || exams.bn
  const fileList = resultFiles[lang] || resultFiles.bn
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  const [exam, setExam] = useState(examList[0])
  const [out, setOut] = useState(null)

  const submit = (e) => {
    e.preventDefault()
    setOut({ exam, cls: lookup.cls, roll: lookup.roll })
  }

  return (
    <section id="results" className="bg-lilac scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        <Reveal>
          <h2 className="sec-title font-display">
            {lang === 'bn' ? 'আপনার ফলাফল দেখুন' : 'Check your result'}
          </h2>
          <p className="text-ink/70 mt-2 max-w-md">
            {lang === 'bn'
              ? 'পরীক্ষা, শ্রেণি ও রোল নম্বর নির্বাচন করুন। নম্বরপত্র নোটিশ বোর্ডেও পাওয়া যাবে।'
              : 'Choose the exam, your class and roll number. Marksheets are also pinned on the notice board.'}
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p className="font-bold text-board">
              {lang === 'bn' ? 'প্রকাশিত ফলাফল ও গেজেট' : 'Published results'}
            </p>
            <ul className="divide-y divide-ink/10 border border-ink/10 rounded-2xl bg-paper overflow-hidden">
              {fileList.map((r) => (
                <li key={r.name} className="flex justify-between gap-3 p-3 text-xs sm:text-sm">
                  <span>{r.name}</span>
                  <a href={r.link} className="font-bold text-iris underline underline-offset-4 shrink-0">
                    {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal as="form" delay={90} onSubmit={submit} className="form-card space-y-4 self-start">
          <div>
            <label htmlFor="exam" className="block text-sm font-bold mb-1">
              {lang === 'bn' ? 'পরীক্ষা' : 'Exam'}
            </label>
            <select id="exam" value={exam} onChange={(e) => setExam(e.target.value)} className="field">
              {examList.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cls" className="block text-sm font-bold mb-1">
                {lang === 'bn' ? 'শ্রেণি' : 'Class'}
              </label>
              <select id="cls" value={lookup.cls} onChange={(e) => setLookup({ ...lookup, cls: e.target.value })} className="field">
                {classKeys.map((key, i) => (
                  <option key={key} value={key}>{classLabels[i]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="roll" className="block text-sm font-bold mb-1">
                {lang === 'bn' ? 'রোল নম্বর' : 'Roll number'}
              </label>
              <input
                id="roll"
                required
                inputMode="numeric"
                value={lookup.roll}
                onChange={(e) => setLookup({ ...lookup, roll: e.target.value })}
                className="field"
                placeholder={lang === 'bn' ? 'যেমন: ১ বা ১৪' : 'e.g. 14'}
              />
            </div>
          </div>
          <button className="btn w-full bg-board text-chalk py-3 font-bold hover:bg-boardlt">
            {lang === 'bn' ? 'ফলাফল দেখুন' : 'Show result'}
          </button>
          {out && (
            <div role="status" className="text-sm rounded-xl p-4 bg-gold/20 border border-gold text-board">
              {lang === 'bn'
                ? `শ্রেণি: ${out.cls}, রোল: ${num(out.roll)}, পরীক্ষা: ${out.exam} এর ফলাফল খোঁজা হচ্ছে...`
                : `Searching for Class ${out.cls}, Roll ${out.roll} in ${out.exam}.`}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
