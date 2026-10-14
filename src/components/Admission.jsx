import { useLanguage } from '../context/LanguageContext'
import Reveal from './Reveal'

export default function Admission() {
  const { lang } = useLanguage()

  const steps = lang === 'bn' ? [
    ['ফরম বিক্রয়', '১ - ৩০ নভেম্বর'],
    ['ভর্তি পরীক্ষা', '১০ ডিসেম্বর'],
    ['ফলাফল প্রকাশ', '১৫ ডিসেম্বর'],
    ['ক্লাস শুরু', '২ জানুয়ারি'],
  ] : [
    ['Form sale', '1 to 30 November'],
    ['Admission test', '10 December'],
    ['Result', '15 December'],
    ['Classes begin', '2 January'],
  ]

  return (
    <section id="admission" className="admission text-chalk scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <h2 className="sec-title font-display">
            {lang === 'bn' ? '২০২৭ সালের ভর্তি শুরু হয়েছে' : 'Admission open for 2027'}
          </h2>
          <p className="mt-3 text-chalk/80">
            {lang === 'bn'
              ? '১ নভেম্বর থেকে ৬ষ্ঠ থেকে ৯ম শ্রেণির জন্য আবেদন গ্রহণ করা হচ্ছে। জন্ম সনদ, দুই কপি ছবি ও পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র নিয়ে আসুন।'
              : 'Applications for Class Six to Nine are accepted from 1 November. Bring the birth certificate, two photos and the previous school\'s transfer certificate.'}
          </p>
          <a href="#contact" className="btn inline-block mt-6 bg-white text-iris px-5 py-3 font-bold shadow-[0_14px_30px_-10px_rgba(0,0,0,.4)]">
            {lang === 'bn' ? 'কার্যালয়ে যোগাযোগ করুন' : 'Visit the office'}
          </a>
        </Reveal>
        <Reveal as="ul" delay={90} className="grid grid-cols-2 gap-3 text-sm">
          {steps.map(([title, when]) => (
            <li key={title} className="admission-step p-4">
              <b className="block">{title}</b>
              {when}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
