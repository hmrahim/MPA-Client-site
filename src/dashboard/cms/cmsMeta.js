import {
  Home,
  Megaphone,
  CalendarDays,
  Trophy,
  GraduationCap,
  Users,
  Phone,
  Inbox,
  Images,
  LayoutDashboard,
} from 'lucide-react'

/* Dashboard tab ids for every CMS page */
export const CMS_TABS = {
  overview: 'cms-overview',
  slider: 'cms-slider',
  headmaster: 'cms-headmaster',
  academicGroups: 'cms-academic-groups',
  routine: 'cms-routine',
  facilities: 'cms-facilities',
  clubs: 'cms-clubs',
  homepage: 'cms-homepage',
  notices: 'cms-notices',
  events: 'cms-events',
  results: 'cms-results',
  academics: 'cms-academics',
  teachers: 'cms-teachers',
  siteinfo: 'cms-siteinfo',
  inbox: 'cms-inbox',
  media: 'cms-media',
}

/* One row per editable section: used by overview cards, health checks and logs */
export const SECTION_META = {
  slideImages: { label: 'Hero slider', page: CMS_TABS.slider, tab: 'slideImages', icon: Home },
  heroStats: { label: 'Homepage stats', page: CMS_TABS.homepage, tab: 'heroStats', icon: Home },
  teachWords: { label: 'Typewriter words', page: CMS_TABS.homepage, tab: 'teachWords', icon: Home },
  tickerItems: { label: 'News ticker', page: CMS_TABS.homepage, tab: 'tickerItems', icon: Home },
  reviews: { label: 'Guardian reviews', page: CMS_TABS.homepage, tab: 'reviews', icon: Home },
  schoolFaqs: { label: 'FAQ', page: CMS_TABS.homepage, tab: 'schoolFaqs', icon: Home },
  notices: { label: 'Notice board', page: CMS_TABS.notices, icon: Megaphone },
  events: { label: 'Events', page: CMS_TABS.events, tab: 'events', icon: CalendarDays },
  gallery: { label: 'Photo gallery', page: CMS_TABS.events, tab: 'gallery', icon: CalendarDays },
  exams: { label: 'Exam list', page: CMS_TABS.results, tab: 'exams', icon: Trophy },
  resultFiles: { label: 'Result downloads', page: CMS_TABS.results, tab: 'resultFiles', icon: Trophy },
  toppers: { label: 'Top performers', page: CMS_TABS.results, tab: 'toppers', icon: Trophy },
  academicGroups: { label: 'Academic groups', page: CMS_TABS.academicGroups, tab: 'academicGroups', icon: GraduationCap },
  schoolClubs: { label: 'Clubs', page: CMS_TABS.clubs, tab: 'schoolClubs', icon: GraduationCap },
  schoolFacilities: { label: 'Facilities', page: CMS_TABS.facilities, tab: 'schoolFacilities', icon: GraduationCap },
  dailyRoutineSchedule: { label: 'Discipline & Routine', page: CMS_TABS.routine, tab: 'dailyRoutineSchedule', icon: GraduationCap },
  teachers: { label: 'Faculty profiles', page: CMS_TABS.teachers, icon: Users },
  contact: { label: 'Contact details', page: CMS_TABS.siteinfo, icon: Phone },
}

export const CMS_PAGE_ICONS = {
  overview: LayoutDashboard,
  inbox: Inbox,
  media: Images,
}

export function countItems(key, value) {
  if (!value) return 0
  if (key === 'contact') return Object.values(value).filter(Boolean).length
  if (Array.isArray(value)) return value.length
  if (Array.isArray(value.bn)) return Math.max(value.bn.length, value.en?.length || 0)
  return Object.values(value).reduce((sum, v) => sum + (Array.isArray(v) ? v.length : 0), 0)
}

/* Every image URL referenced by the website content, with where it is used. */
const IMAGE_FIELDS = [
  { section: 'slideImages', keys: ['url'], label: 'Hero slider' },
  { section: 'events', keys: ['image'], label: 'Events' },
  { section: 'gallery', keys: ['src'], label: 'Gallery' },
  { section: 'teachers', keys: ['photo'], label: 'Faculty' },
  { section: 'reviews', keys: ['avatar'], label: 'Reviews' },
  { section: 'toppers', keys: ['photo'], label: 'Toppers' },
]

export function collectMedia(getSection) {
  const map = new Map()
  const add = (url, label, title) => {
    if (!url || typeof url !== 'string') return
    const entry = map.get(url) || { url, usages: [], isData: url.startsWith('data:') }
    if (!entry.usages.some((u) => u.label === label && u.title === title)) entry.usages.push({ label, title })
    map.set(url, entry)
  }
  IMAGE_FIELDS.forEach(({ section, keys, label }) => {
    const data = getSection(section)
    if (!data) return
    const lists = Array.isArray(data)
      ? [data]
      : Array.isArray(data.bn)
      ? [data.bn]
      : Object.values(data).filter(Array.isArray)
    lists.flat().forEach((item) => {
      keys.forEach((k) => add(item?.[k], label, item?.t || item?.label || item?.n || item?.nameEn || item?.tag || ''))
    })
  })
  return [...map.values()]
}

export const IMAGE_SECTIONS = IMAGE_FIELDS
