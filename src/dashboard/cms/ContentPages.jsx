import { useState } from 'react'
import {
  Home,
  Megaphone,
  CalendarDays,
  Trophy,
  GraduationCap,
  Users,
  Phone,
  Images,
  Newspaper,
  Quote,
  HelpCircle,
  BarChart3,
  Type,
  FileDown,
  Award,
  ListChecks,
  Building2,
  Clock,
  Save,
  ExternalLink,
} from 'lucide-react'
import { useSiteSection, useSiteVersion, getSection, resetSection, isSectionCustomized } from '../../lib/siteStore'
import CollectionEditor from './CollectionEditor'
import AcademicGroupsManager from '../modules/AcademicGroupsManager'
import RoutineManager from '../modules/RoutineManager'
import FacilitiesManager from '../modules/FacilitiesManager'
import ClubsManager from '../modules/ClubsManager'
import ToppersManager from '../modules/ToppersManager'
import EventsGalleryManager from '../modules/EventsGalleryManager'
import TeacherManager from '../modules/TeacherManager'
import { SCHEMAS, CONTACT_FIELDS } from './cmsSchemas'
import { countItems } from './cmsMeta'
import { PageHeader, Tabs, Field, useToast } from './CmsKit'

/* Generic page: header + tab strip → CollectionEditor per tab */
function SchemaTabsPage({ icon, badge, title, subtitle, accent, tabs, previewPath, initialTab }) {
  const [active, setActive] = useState(tabs.some((t) => t.id === initialTab) ? initialTab : tabs[0].id)
  useSiteVersion() // keep tab counts live
  const counts = tabs.map((t) => countItems(t.id, getSection(t.id)))
  const current = tabs.find((t) => t.id === active)

  return (
    <div className="space-y-5">
      <PageHeader
        icon={icon}
        badge={badge}
        title={title}
        subtitle={subtitle}
        accent={accent}
        actions={
          previewPath && (
            <a
              href={previewPath}
              target="_blank"
              rel="noreferrer"
              className="moom-btn-ghost px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open website page
            </a>
          )
        }
      />
      {tabs.length > 1 && (
        <Tabs
          tabs={tabs.map((t, i) => ({ id: t.id, label: t.label, icon: t.icon, count: counts[i] }))}
          active={active}
          onChange={setActive}
        />
      )}
      {current.id === 'academicGroups' ? (
        <AcademicGroupsManager key="academicGroups" />
      ) : current.id === 'dailyRoutineSchedule' ? (
        <RoutineManager key="dailyRoutineSchedule" />
      ) : current.id === 'schoolFacilities' ? (
        <FacilitiesManager key="schoolFacilities" />
      ) : current.id === 'schoolClubs' ? (
        <ClubsManager key="schoolClubs" />
      ) : current.id === 'toppers' ? (
        <ToppersManager key="toppers" />
      ) : current.id === 'events' || current.id === 'gallery' ? (
        <EventsGalleryManager initialSubTab={current.id} key={current.id} />
      ) : current.id === 'teachers' ? (
        <TeacherManager key="teachers" />
      ) : (
        <CollectionEditor key={current.id} schema={SCHEMAS[current.id]} />
      )}
    </div>
  )
}

/* ── Homepage ── */
export function HomepageCms({ initialTab }) {
  const tabs = [
    { id: 'slideImages', label: 'Hero Slider', icon: Images },
    { id: 'heroStats', label: 'Stats Counters', icon: BarChart3 },
    { id: 'teachWords', label: 'Typewriter Words', icon: Type },
    { id: 'tickerItems', label: 'News Ticker', icon: Newspaper },
    { id: 'reviews', label: 'Reviews', icon: Quote },
    { id: 'schoolFaqs', label: 'FAQ', icon: HelpCircle },
  ]
  return (
    <SchemaTabsPage
      icon={Home}
      badge="Website CMS · Homepage"
      title="Homepage Content"
      subtitle="Slider, counters, headline words, ticker, guardian reviews and FAQ of the home page"
      previewPath="/"
      tabs={tabs}
      initialTab={initialTab}
    />
  )
}

/* ── Notices ── */
export function NoticesCms() {
  return (
    <SchemaTabsPage
      icon={Megaphone}
      badge="Website CMS · Notice Board"
      title="Notice Board Manager"
      subtitle="Publish, pin and categorize notices"
      accent="amber"
      previewPath="/notices"
      tabs={[{ id: 'notices', label: 'Notices', icon: Megaphone }]}
    />
  )
}

/* ── Events & Gallery ── */
export function EventsCms({ initialTab }) {
  const tabs = [
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'gallery', label: 'Photo Gallery', icon: Images },
  ]
  return (
    <SchemaTabsPage
      icon={CalendarDays}
      badge="Website CMS · Events"
      title="Events & Gallery"
      subtitle="School calendar events and the campus photo gallery"
      accent="sky"
      previewPath="/events"
      tabs={tabs}
      initialTab={initialTab}
    />
  )
}

/* ── Results & Toppers ── */
export function ResultsCms({ initialTab }) {
  const tabs = [
    { id: 'toppers', label: 'Top Performers', icon: Award },
    { id: 'resultFiles', label: 'Result Downloads', icon: FileDown },
    { id: 'exams', label: 'Exam List', icon: ListChecks },
  ]
  return (
    <SchemaTabsPage
      icon={Trophy}
      badge="Website CMS · Results"
      title="Results & Top Performers"
      subtitle="Class toppers, downloadable gazettes and the exam names used by result search"
      accent="emerald"
      previewPath="/results"
      tabs={tabs}
      initialTab={initialTab}
    />
  )
}

/* ── Academics ── */
export function AcademicsCms({ initialTab }) {
  const tabs = [
    { id: 'academicGroups', label: 'Groups', icon: GraduationCap },
    { id: 'schoolFacilities', label: 'Facilities', icon: Building2 },
    { id: 'schoolClubs', label: 'Clubs', icon: Users },
    { id: 'dailyRoutineSchedule', label: 'Daily Schedule', icon: Clock },
  ]
  return (
    <SchemaTabsPage
      icon={GraduationCap}
      badge="Website CMS · Academics"
      title="Academics Page"
      subtitle="Science / Business / Humanities groups, facilities, clubs and the daily school schedule"
      previewPath="/academics"
      tabs={tabs}
      initialTab={initialTab}
    />
  )
}

/* ── Public faculty page ── */
export function TeachersCms() {
  return (
    <SchemaTabsPage
      icon={Users}
      badge="Website CMS · Faculty"
      title="Faculty Profiles (Public)"
      subtitle="Teachers shown on the website. Staff payroll / attendance stays in Teachers & Staff."
      previewPath="/teachers"
      tabs={[{ id: 'teachers', label: 'Faculty', icon: Users }]}
    />
  )
}

/* ── Site info (contact singleton) ── */
export function SiteInfoCms() {
  const [contact, save] = useSiteSection('contact')
  const [form, setForm] = useState(() => ({ ...contact }))
  const [errors, setErrors] = useState({})
  const [toastNode, toast] = useToast()
  const customized = isSectionCustomized('contact')

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    CONTACT_FIELDS.forEach((f) => {
      if (f.required && !String(form[f.key] ?? '').trim()) errs[f.key] = 'This field is required'
    })
    setErrors(errs)
    if (Object.keys(errs).length) return
    const cleaned = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]))
    save(cleaned, 'Contact details updated')
    toast('✓ Contact details published')
  }

  return (
    <div className="space-y-5">
      {toastNode}
      <PageHeader
        icon={Phone}
        badge="Website CMS · Site Info"
        title="Contact & Site Information"
        subtitle="Used in the website header bar, ticker, footer and the contact page"
        accent="rose"
        actions={
          <>
            <a
              href="/contact"
              target="_blank"
              rel="noreferrer"
              className="moom-btn-ghost px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open contact page
            </a>
            {customized && (
              <button
                onClick={() => {
                  resetSection('contact')
                  setErrors({})
                  toast('✓ Default contact details restored')
                }}
                className="moom-btn-ghost px-3.5 py-2 rounded-xl text-xs font-bold"
              >
                Restore defaults
              </button>
            )}
          </>
        }
      />

      <form onSubmit={submit} className="moom-card p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          {CONTACT_FIELDS.map((f) => (
            <Field
              key={f.key}
              idPrefix="contact"
              field={f}
              value={form[f.key]}
              onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
              error={errors[f.key]}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <button type="submit" className="moom-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> Publish changes
          </button>
        </div>
      </form>
    </div>
  )
}
