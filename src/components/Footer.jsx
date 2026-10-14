import { Link } from 'react-router-dom'
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react'
import { contact } from '../data/content'
import { useLanguage } from '../context/LanguageContext'

export default function Footer() {
  const { lang, t, num } = useLanguage()

  return (
    <footer className="bg-gradient-to-b from-[#14103a] to-[#0a071f] text-chalk border-t border-white/10 relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-iris via-brick to-gold grid place-items-center text-white shadow-xl">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                  {lang === 'bn' ? 'মিরাশানী একাডেমি' : 'MIRASHANI'}
                </h3>
                <p className="text-xs tracking-wider text-gold font-semibold">
                  {lang === 'bn' ? 'উচ্চ বিদ্যালয় · সাধারণ মাধ্যমিক শিক্ষা' : 'Academy · High School'}
                </p>
              </div>
            </div>

            <p className="text-sm text-chalk/75 leading-relaxed">
              {lang === 'bn'
                ? '৬ষ্ঠ থেকে ১০ম শ্রেণি (এসএসসি) পর্যন্ত সাধারণ শিক্ষা, নৈতিক চরিত্র ও বিজ্ঞানমনস্ক জাতি গঠনে প্রতিশ্রুতিবদ্ধ।'
                : 'Fostering academic excellence, moral leadership, and scientific mindset for students from Class Six to Ten (SSC).'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-mint">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('govtAffiliated')}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              {t('quickNav')}
            </h4>
            <ul className="space-y-2.5 text-sm text-chalk/80">
              <li>
                <Link to="/" className="hover:text-gold hover:underline transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-gold hover:underline transition-colors">
                  {t('navNotices')}
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-gold hover:underline transition-colors">
                  {t('navResults')}
                </Link>
              </li>
              <li>
                <Link to="/toppers" className="hover:text-gold hover:underline transition-colors">
                  {t('navToppers')}
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-gold hover:underline transition-colors">
                  {t('navAcademics')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-gold hover:underline transition-colors">
                  {t('navEvents')}
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="hover:text-gold hover:underline transition-colors">
                  {t('navTeachers')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Groups & Portal */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brick" />
              {t('academicDivisions')}
            </h4>
            <ul className="space-y-2.5 text-sm text-chalk/80">
              <li>
                <Link to="/academics" className="hover:text-mint hover:underline transition-colors">
                  {lang === 'bn' ? 'বিজ্ঞান বিভাগ' : 'Science Group'}
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-mint hover:underline transition-colors">
                  {lang === 'bn' ? 'ব্যবসায় শিক্ষা বিভাগ' : 'Business Studies'}
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-mint hover:underline transition-colors">
                  {lang === 'bn' ? 'মানবিক বিভাগ' : 'Humanities Group'}
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-mint hover:underline transition-colors">
                  {lang === 'bn' ? 'নিম্ন মাধ্যমিক (৬ষ্ঠ - ৮ম)' : 'Junior Secondary (Class 6-8)'}
                </Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-mint hover:underline transition-colors">
                  {lang === 'bn' ? 'অনলাইন ভর্তি সেশন ২০২৭' : 'Online Admission Form 2027'}
                </Link>
              </li>
              <li>
                <Link to="/student-dashboard" className="inline-flex items-center gap-1.5 text-gold font-bold hover:underline">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('studentToolsQuick')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="font-display font-bold text-white text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mint" />
              {t('campusOffice')}
            </h4>
            <div className="space-y-3 text-sm text-chalk/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>
                  {lang === 'bn'
                    ? 'মিরাশানী একাডেমি (উচ্চ বিদ্যালয়), কলেজ রোড, উপজেলা সদর, ব্রাহ্মণবাড়িয়া, বাংলাদেশ'
                    : contact.address}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-mint shrink-0" />
                <span>{num(contact.phone)} / {num(contact.altPhone)}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brick shrink-0" />
                <span>{contact.email}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-chalk/60 shrink-0 mt-0.5" />
                <span>
                  {lang === 'bn' ? 'রবিবার - বৃহস্পতিবার: সকাল ৮:০০ - বিকাল ৪:০০' : contact.hours}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-chalk/60">
          <p>
            &copy; {num(new Date().getFullYear())} {lang === 'bn' ? 'মিরাশানী একাডেমি (উচ্চ বিদ্যালয়)' : 'Mirashani Academy (General High School)'}. {t('copyright')}
          </p>
          <p className="flex items-center gap-1">
            {lang === 'bn' ? 'শিক্ষার্থী ও শিক্ষকদের সেবায় নিবেদিত' : 'Built for students and faculty'}{' '}
            <Heart className="w-3.5 h-3.5 text-brick fill-brick inline" />
          </p>
        </div>
      </div>
    </footer>
  )
}
