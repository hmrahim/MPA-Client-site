import { useEffect, useState } from 'react'

/** Types and erases each word in `words` forever. `words` must be a stable array. */
export default function useTypewriter(words, { type = 90, erase = 40, hold = 1400, pause = 300 } = {}) {
  const [text, setText] = useState('')

  useEffect(() => {
    let wi = 0
    let ci = 0
    let deleting = false
    let id

    const tick = () => {
      const word = words[wi]
      ci += deleting ? -1 : 1
      setText(word.slice(0, ci))
      let delay = deleting ? erase : type
      if (!deleting && ci === word.length) {
        deleting = true
        delay = hold
      } else if (deleting && ci === 0) {
        deleting = false
        wi = (wi + 1) % words.length
        delay = pause
      }
      id = setTimeout(tick, delay)
    }

    id = setTimeout(tick, type)
    return () => clearTimeout(id)
  }, [words, type, erase, hold, pause])

  return text
}
