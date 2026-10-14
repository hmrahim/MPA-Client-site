import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { translations, formatNumberByLang } from '../data/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  // Default language is Bengali (bn)
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('mpa-lang') || 'bn'
    } catch {
      return 'bn'
    }
  })

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'bn' ? 'en' : 'bn'
      try {
        localStorage.setItem('mpa-lang', next)
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const setLanguage = useCallback((newLang) => {
    const validLang = newLang === 'en' ? 'en' : 'bn'
    setLang(validLang)
    try {
      localStorage.setItem('mpa-lang', validLang)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key, fallback = '') => translations[lang]?.[key] || fallback || key,
    [lang]
  )

  const num = useCallback(
    (v) => formatNumberByLang(v, lang),
    [lang]
  )

  const value = useMemo(
    () => ({ lang, t, num, toggleLanguage, setLanguage }),
    [lang, t, num, toggleLanguage, setLanguage]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
