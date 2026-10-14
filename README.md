# Mirashani Polytechnic Academy — School Website

Vite + React 19 + Tailwind CSS v4 implementation of the Mirashani Polytechnic Academy design.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
npm run preview    # preview the build
npm run lint
```

## Where to edit content

Everything visitors read lives in **`src/data/content.js`**:
notices, result files, top-10 students, events, teachers, guardian reviews,
gallery, slideshow, hero stats and contact details.

- **Real photos**: put images in `public/img/` and use the path, e.g.
  - topper: `{ name: 'Rafi Ahmed', photo: '/img/six-1.jpg' }`
  - teacher: add `photo: '/img/head.jpg'`
  - gallery tile: add `photo: '/img/sports.jpg'`
- **Colours / fonts**: `@theme` block at the top of `src/index.css`.

## Project structure

```
src/
  App.jsx                 page composition + shared result-lookup state
  index.css               Tailwind theme, keyframes, component styles
  data/content.js         all editable content
  lib/art.js              generated SVG avatars and scene images
  hooks/                  useTypewriter, useCountUp
  components/
    Ticker, Header, Hero (+ Banner slideshow), Notices, Results,
    Toppers, Academics, Events (+ gallery), Teachers, Reviews,
    Admission, Contact, Footer
    Reveal.jsx            scroll-in animation wrapper
    Doodles.jsx           floating school icons
    effects/              CursorGlow (+ card tilt), ScrollProgress, Confetti
```

## Connecting a backend (currently demo only)

| Form | File | What to do |
| --- | --- | --- |
| Result lookup (hero + Results) | `components/Results.jsx` → `submit` | call your API with exam, class, roll and show the marks |
| Write a review | `components/Reviews.jsx` → `submit` | POST the review; approve it before showing publicly |
| Contact | `components/Contact.jsx` → `submit` | send name + message to your backend or email service |

## Notes

- Animations respect `prefers-reduced-motion`.
- The cursor glow is hidden on touch devices.
- Tilt effect: add `data-tilt` to any element to get the 3D hover tilt.
