import { useState } from 'react'
import Reveal from './Reveal'
import { contact } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Contact() {
  const { lang, num } = useLanguage()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setName('')
    setMsg('')
  }

  const rows = lang === 'bn' ? [
    ['ঠিকানা', 'মিরাশানী একাডেমি (উচ্চ বিদ্যালয়), কলেজ রোড, উপজেলা সদর, ব্রাহ্মণবাড়িয়া'],
    ['ফোন', `${num(contact.phone)} / ${num(contact.altPhone)}`],
    ['ইমেইল', contact.email],
    ['কার্যালয় সময়', 'রবিবার থেকে বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৪:০০'],
  ] : [
    ['Address', contact.address],
    ['Phone', `${contact.phone} / ${contact.altPhone}`],
    ['Email', contact.email],
    ['Office hours', contact.hours],
  ]

  return (
    <section id="contact" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
      <div className="grid md:grid-cols-2 gap-10">
        <Reveal>
          <h2 className="sec-title font-display">
            {lang === 'bn' ? 'বিদ্যালয়ে যোগাযোগ করুন' : 'Contact the school'}
          </h2>
          <dl className="mt-6 space-y-4 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="font-bold text-board">{k}</dt>
                <dd className="text-ink/80">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal as="form" delay={90} onSubmit={submit} className="form-card space-y-3">
          <label htmlFor="cName" className="block text-sm font-bold">
            {lang === 'bn' ? 'আপনার নাম' : 'Name'}
          </label>
          <input
            id="cName"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            placeholder={lang === 'bn' ? 'যেমন: মো. রফিকুল ইসলাম' : 'e.g. John Doe'}
          />

          <label htmlFor="cMsg" className="block text-sm font-bold">
            {lang === 'bn' ? 'আপনার বার্তা' : 'Message'}
          </label>
          <textarea
            id="cMsg"
            required
            rows={4}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="field"
            placeholder={lang === 'bn' ? 'এখানে আপনার বার্তা লিখুন...' : 'Write your message here...'}
          />

          <button className="btn bg-board text-chalk px-5 py-3 font-bold hover:bg-boardlt">
            {lang === 'bn' ? 'বার্তা পাঠান' : 'Send message'}
          </button>

          {sent && (
            <p className="text-sm font-medium text-board bg-mint/15 p-3 rounded-xl border border-mint/30" role="status">
              {lang === 'bn'
                ? 'আপনার বার্তা পাঠানো হয়েছে। ২ কার্যদিবসের মধ্যে যোগাযোগ করা হবে।'
                : 'Message sent. We will reply within two working days.'}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
