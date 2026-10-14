import { useState } from 'react'
import Reveal from './Reveal'
import { classes, reviews } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

const blank = { name: '', child: 'Six', stars: '5', text: '' }

export default function Reviews() {
  const { lang, num } = useLanguage()
  const reviewList = reviews[lang] || reviews.bn
  const classKeys = classes.keys
  const classLabels = classes[lang] || classes.bn

  const [form, setForm] = useState(blank)
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm(blank)
  }

  return (
    <section id="reviews" className="max-w-6xl mx-auto px-4 py-16 scroll-mt-24">
      <Reveal as="h2" className="sec-title font-display">
        {lang === 'bn' ? 'অভিভাবকদের মতামত' : 'What guardians say'}
      </Reveal>
      <Reveal as="p" delay={90} className="text-ink/70 mt-1">
        {lang === 'bn'
          ? 'আপনার মূল্যবান মতামত আমাদের শিক্ষাদানকে সমৃদ্ধ করে।'
          : 'Your feedback shapes how we teach. Share yours below.'}
      </Reveal>

      <Reveal delay={180} className="mt-8 grid lg:grid-cols-5 gap-8">
        <div className="pop-in lg:col-span-3 grid sm:grid-cols-2 gap-4">
          {reviewList.map((r) => (
            <figure key={r.n} data-tilt className="card">
              <div className="text-gold text-lg" aria-label={`${r.s} out of 5 stars`}>
                {'★'.repeat(r.s)}
                <span className="text-ink/20">{'★'.repeat(5 - r.s)}</span>
              </div>
              <blockquote className="text-sm mt-2 text-ink/85">"{r.t}"</blockquote>
              <figcaption className="mt-3 text-sm">
                <b>{r.n}</b>, {r.c}
              </figcaption>
            </figure>
          ))}
        </div>

        <form onSubmit={submit} className="form-card lg:col-span-2 space-y-3 self-start">
          <h3 className="font-display font-bold text-xl">
            {lang === 'bn' ? 'মতামত লিখুন' : 'Write a review'}
          </h3>
          <div>
            <label htmlFor="rName" className="block text-sm font-bold mb-1">
              {lang === 'bn' ? 'আপনার নাম' : 'Your name'}
            </label>
            <input
              id="rName"
              required
              value={form.name}
              onChange={set('name')}
              className="field"
              placeholder={lang === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your name'}
            />
          </div>
          <div>
            <label htmlFor="rChild" className="block text-sm font-bold mb-1">
              {lang === 'bn' ? 'সন্তানের শ্রেণি' : "Child's class"}
            </label>
            <select id="rChild" value={form.child} onChange={set('child')} className="field">
              {classKeys.map((key, i) => (
                <option key={key} value={key}>{classLabels[i]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rStars" className="block text-sm font-bold mb-1">
              {lang === 'bn' ? 'রেটিং' : 'Rating'}
            </label>
            <select id="rStars" value={form.stars} onChange={set('stars')} className="field">
              <option value="5">{lang === 'bn' ? '৫ তারা' : '5 stars'}</option>
              <option value="4">{lang === 'bn' ? '৪ তারা' : '4 stars'}</option>
              <option value="3">{lang === 'bn' ? '৩ তারা' : '3 stars'}</option>
              <option value="2">{lang === 'bn' ? '২ তারা' : '2 stars'}</option>
              <option value="1">{lang === 'bn' ? '১ তারা' : '1 star'}</option>
            </select>
          </div>
          <div>
            <label htmlFor="rText" className="block text-sm font-bold mb-1">
              {lang === 'bn' ? 'আপনার অভিজ্ঞতা / পর্যালোচনা' : 'Your review'}
            </label>
            <textarea
              id="rText"
              required
              rows={4}
              value={form.text}
              onChange={set('text')}
              className="field"
              placeholder={lang === 'bn' ? 'আপনার অভিজ্ঞতা বিস্তারিত লিখুন...' : 'Write your review here...'}
            />
          </div>
          <button className="btn w-full bg-board text-chalk py-3 font-bold hover:bg-boardlt">
            {lang === 'bn' ? 'মতামত জমা দিন' : 'Submit review'}
          </button>
          {sent && (
            <p className="text-sm font-medium text-board bg-mint/15 p-3 rounded-xl border border-mint/30" role="status">
              {lang === 'bn'
                ? 'ধন্যবাদ। বিদ্যালয় কর্তৃপক্ষ অনুমোদনের পর এটি প্রদর্শিত হবে।'
                : 'Thank you. Your review will appear after the office approves it.'}
            </p>
          )}
        </form>
      </Reveal>
    </section>
  )
}
