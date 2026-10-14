import Reveal from './Reveal'
import { useLanguage } from '../context/LanguageContext'

export default function Academics() {
  const { lang, t } = useLanguage()

  const cards = lang === 'bn' ? [
    { icon: '📖', bg: 'linear-gradient(150deg,#ede9fe,#fff)', title: 'সাধারণ মাধ্যমিক শিক্ষাক্রম', text: 'এনসিটিবি শিক্ষাক্রম অনুযায়ী ৬ষ্ঠ থেকে ১০ম শ্রেণিতে বাংলা, ইংরেজি, গণিত, বিজ্ঞান, বিজিএস ও ধর্ম পাঠদান।' },
    { icon: '🔬', bg: 'linear-gradient(150deg,#ffe4ec,#fff)', title: 'বিজ্ঞান ও কম্পিউটার ল্যাব', text: 'আধুনিক পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ল্যাবরেটরি ও ডিজিটাল মাল্টিমিডিয়া কম্পিউটার ল্যাব।' },
    { icon: '⚽', bg: 'linear-gradient(150deg,#d5fbee,#fff)', title: 'ক্লাব ও ক্রীড়া', text: 'বিজ্ঞান ক্লাব, বিতর্ক পরিষদ, স্কাউট, ক্রিকেট, ফুটবল, চিত্রকলা ও সাংস্কৃতিক কার্যক্রম।' },
  ] : [
    { icon: '📖', bg: 'linear-gradient(150deg,#ede9fe,#fff)', title: 'General Secondary Curriculum', text: 'NCTB curriculum in Bangla, English, Mathematics, Science, BGS, and Religion for Classes 6 to 10.' },
    { icon: '🔬', bg: 'linear-gradient(150deg,#ffe4ec,#fff)', title: 'Science & Computer Labs', text: 'Modern Physics, Chemistry, Biology laboratories and digital multimedia computer lab.' },
    { icon: '⚽', bg: 'linear-gradient(150deg,#d5fbee,#fff)', title: 'Clubs and sports', text: 'Science club, debate society, scouts, cricket, football, drawing and cultural programs.' },
  ]

  const routine = lang === 'bn' ? [
    ['সকাল', 'সকাল ৮:৩০ - ১১:৩০', 'মূল তাত্ত্বিক বক্তৃতা (৬ষ্ঠ থেকে ১০ম শ্রেণি)'],
    ['বিরতি', 'সকাল ১১:৩০ - দুপুর ১২:১৫', 'টিফিন বিরতি ও নামাজ'],
    ['অপরাহ্ন', 'দুপুর ১২:১৫ - বিকাল ৩:০০', 'বিজ্ঞান ল্যাব ব্যবহারিক, আইসিটি ও সহ-শিক্ষা কার্যক্রম'],
  ] : [
    ['Morning', '8:30 to 11:30', 'Core theory lectures (Classes 6 to 10)'],
    ['Break', '11:30 to 12:15', 'Tiffin break and prayer'],
    ['Afternoon', '12:15 to 3:00', 'Science lab practicals, ICT and co-curricular'],
  ]

  return (
    <section id="academics" className="bg-lilac scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <Reveal as="h2" className="sec-title font-display">
          {lang === 'bn' ? 'শিক্ষা কার্যক্রম' : 'Academics'}
        </Reveal>
        <Reveal as="p" delay={90} className="text-ink/70 mt-1">
          {lang === 'bn'
            ? 'বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগে সাধারণ মাধ্যমিক শিক্ষাক্রম।'
            : 'General secondary curriculum across Science, Business Studies and Humanities.'}
        </Reveal>

        <Reveal delay={180} className="mt-8 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article key={c.title} className="acad-card" style={{ background: c.bg }}>
              <span className="acad-icon" aria-hidden="true">{c.icon}</span>
              <h3 className="font-display font-bold text-xl">{c.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{c.text}</p>
            </article>
          ))}
        </Reveal>

        <Reveal delay={270} className="mt-8 rounded-[1.25rem] overflow-hidden bg-paper shadow-[0_14px_34px_-18px_rgba(91,61,245,.4)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="text-left font-bold p-3">
                {lang === 'bn' ? 'শ্রেণি রুটিন, রবিবার থেকে বৃহস্পতিবার' : 'Class routine, Sunday to Thursday'}
              </caption>
              <thead className="bg-board text-chalk">
                <tr>
                  <th className="text-left p-3">{lang === 'bn' ? 'পিরিয়ড' : 'Period'}</th>
                  <th className="text-left p-3">{lang === 'bn' ? 'সময়' : 'Time'}</th>
                  <th className="text-left p-3">{lang === 'bn' ? 'বিষয়' : 'Classes'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10">
                {routine.map(([period, time, what]) => (
                  <tr key={period}>
                    <td className="p-3">{period}</td>
                    <td className="p-3">{time}</td>
                    <td className="p-3">{what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
