import {
  Globe,
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
  Sliders,
  Clock,
  Building2,
} from 'lucide-react'
// Side-effect import: guarantees the public content is registered with the CMS store
import '../../data/content'
import { CMS_TABS } from './cmsMeta'
import CmsOverview from './CmsOverview'
import InboxManager from './InboxManager'
import MediaLibrary from './MediaLibrary'
import HeroSliderManager from '../modules/HeroSliderManager'
import HeadmasterManager from '../modules/HeadmasterManager'
import AcademicGroupsManager from '../modules/AcademicGroupsManager'
import RoutineManager from '../modules/RoutineManager'
import FacilitiesManager from '../modules/FacilitiesManager'
import ClubsManager from '../modules/ClubsManager'
import NoticeManager from '../modules/NoticeManager'
import { HomepageCms, EventsCms, ResultsCms, AcademicsCms, TeachersCms, SiteInfoCms } from './ContentPages'

/** Sidebar groups for the "Website CMS" part of the dashboard. */
export function getCmsNavGroups(inboxCount = 0) {
  return [
    {
      id: 'cms-site',
      label: 'Website CMS',
      items: [
        { id: CMS_TABS.overview, label: 'Website Control', icon: Globe, badge: 'CMS', badgeColor: 'violet' },
        { id: CMS_TABS.slider, label: 'Hero Slider', icon: Sliders, badge: 'Hero', badgeColor: 'violet' },
        { id: CMS_TABS.headmaster, label: 'Headmaster Vision', icon: Trophy, badge: 'Message', badgeColor: 'emerald' },
        { id: CMS_TABS.academicGroups, label: 'Academic Groups', icon: GraduationCap, badge: 'Groups', badgeColor: 'indigo' },
        { id: CMS_TABS.routine, label: 'Discipline & Routine', icon: Clock, badge: 'Routine', badgeColor: 'amber' },
        { id: CMS_TABS.facilities, label: 'Modern Facilities', icon: Building2, badge: 'Campus', badgeColor: 'teal' },
        { id: CMS_TABS.clubs, label: 'Student Clubs & Activities', icon: Trophy, badge: 'Clubs', badgeColor: 'rose' },
        { id: CMS_TABS.homepage, label: 'Homepage', icon: Home },
        { id: CMS_TABS.notices, label: 'Notice Board', icon: Megaphone },
        { id: CMS_TABS.events, label: 'Events & Gallery', icon: CalendarDays },
        { id: CMS_TABS.results, label: 'Results & Toppers', icon: Trophy },
        { id: CMS_TABS.academics, label: 'Academics Page', icon: GraduationCap },
        { id: CMS_TABS.teachers, label: 'Faculty Profiles', icon: Users },
        { id: CMS_TABS.siteinfo, label: 'Contact & Site Info', icon: Phone },
      ],
    },
    {
      id: 'cms-engage',
      label: 'Website Engagement',
      items: [
        {
          id: CMS_TABS.inbox,
          label: 'Website Inbox',
          icon: Inbox,
          badge: inboxCount > 0 ? String(inboxCount) : undefined,
          badgeColor: 'emerald',
        },
        { id: CMS_TABS.media, label: 'Media Library', icon: Images },
      ],
    },
  ]
}

export const CMS_TAB_IDS = Object.values(CMS_TABS)
export const isCmsTab = (id) => CMS_TAB_IDS.includes(id)

export const CMS_TAB_LABELS = {
  [CMS_TABS.overview]: 'Website Control',
  [CMS_TABS.slider]: 'Hero Slider',
  [CMS_TABS.headmaster]: 'Headmaster Vision',
  [CMS_TABS.academicGroups]: 'Academic Groups & Disciplines',
  [CMS_TABS.routine]: 'Discipline & Routine',
  [CMS_TABS.facilities]: 'Modern Facilities',
  [CMS_TABS.clubs]: 'Student Clubs & Activities',
  [CMS_TABS.homepage]: 'Homepage',
  [CMS_TABS.notices]: 'Notice Board',
  [CMS_TABS.events]: 'Events & Gallery',
  [CMS_TABS.results]: 'Results & Toppers',
  [CMS_TABS.academics]: 'Academics Page',
  [CMS_TABS.teachers]: 'Faculty Profiles',
  [CMS_TABS.siteinfo]: 'Contact & Site Info',
  [CMS_TABS.inbox]: 'Website Inbox',
  [CMS_TABS.media]: 'Media Library',
}

/** Renders the page for a CMS tab. `param` selects an inner tab (e.g. 'gallery'). */
export function CmsPage({ tab, param, onNavigate, setActiveTab }) {
  switch (tab) {
    case CMS_TABS.overview:
      return <CmsOverview onNavigate={onNavigate} />
    case CMS_TABS.slider:
      return <HeroSliderManager />
    case CMS_TABS.headmaster:
      return <HeadmasterManager />
    case CMS_TABS.academicGroups:
      return <AcademicGroupsManager />
    case CMS_TABS.routine:
      return <RoutineManager />
    case CMS_TABS.facilities:
      return <FacilitiesManager />
    case CMS_TABS.clubs:
      return <ClubsManager />
    case CMS_TABS.homepage:
      return <HomepageCms key={param || 'default'} initialTab={param} />
    case CMS_TABS.notices:
      return <NoticeManager />
    case CMS_TABS.events:
      return <EventsCms key={param || 'default'} initialTab={param} />
    case CMS_TABS.results:
      return <ResultsCms key={param || 'default'} initialTab={param} />
    case CMS_TABS.academics:
      return <AcademicsCms key={param || 'default'} initialTab={param} />
    case CMS_TABS.teachers:
      return <TeachersCms />
    case CMS_TABS.siteinfo:
      return <SiteInfoCms />
    case CMS_TABS.inbox:
      return <InboxManager setActiveTab={setActiveTab} />
    case CMS_TABS.media:
      return <MediaLibrary />
    default:
      return null
  }
}

export { LayoutDashboard }
