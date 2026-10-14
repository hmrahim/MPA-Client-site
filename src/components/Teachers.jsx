import { useMemo } from 'react'
import Reveal from './Reveal'
import { avatar } from '../lib/art'
import { teachers } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Teachers() {
  const { lang, t } = useLanguage()
  const teacherList = teachers[lang] || teachers.bn
  const list = useMemo(() => teacherList.map((teacher) => ({ ...teacher, img: teacher.photo || avatar(teacher.n + teacher.r) })), [teacherList])

  return (
    <section id="teachers" className="bg-lilac scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Reveal as="h2" className="sec-title font-display">
          {lang === 'bn' ? 'আমাদের শিক্ষকমণ্ডলী' : 'Our teachers'}
        </Reveal>
        <Reveal delay={90} className="pop-in mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {list.map((teacher, i) => (
            <div key={i} className="teacher text-center">
              <img src={teacher.img} alt="" className="w-24 h-24 mx-auto rounded-full ring-4 ring-gold object-cover" />
              <p className="mt-3 font-bold">{teacher.n}</p>
              <p className="text-sm text-ink/70">{teacher.r}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
