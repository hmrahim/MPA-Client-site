import { contact, tickerItems as tickerData } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Ticker() {
  const { lang, t, num } = useLanguage()

  const tickerItems = tickerData[lang] || tickerData.bn

  const text = tickerItems.join('\u00a0\u00a0\u00a0\u2726\u00a0\u00a0\u00a0')

  return (
    <div className="ticker text-ink text-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-4">
        <b className="shrink-0 bg-ink text-gold px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {t('tickerLatest')}
        </b>
        <div className="overflow-hidden flex-1">
          <p className="marq whitespace-nowrap font-medium text-xs sm:text-sm">{text}</p>
        </div>
        <p className="hidden md:block shrink-0 text-xs font-semibold">
          {num(contact.phone)} &nbsp;|&nbsp; {contact.email}
        </p>
      </div>
    </div>
  )
}
