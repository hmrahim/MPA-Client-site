/* ============ MIRASHANI ACADEMY (GENERAL SECONDARY HIGH SCHOOL) DATA ============ */
import { registerSiteContent } from '../lib/siteStore'

// High quality realistic general school photography (Unsplash high-res direct CDN)
export const slideImages = [
  {
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1920&q=85',
    tag: 'Campus Life',
    ctaLink: '/academics',
  },
  {
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1920&q=85',
    tag: 'Science Labs',
    ctaLink: '/academics',
  },
  {
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=85',
    tag: 'Central Library',
    ctaLink: '/academics',
  },
  {
    url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1920&q=85',
    tag: 'Sports Day',
    ctaLink: '/events',
  },
  {
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=85',
    tag: 'Cultural Festival',
    ctaLink: '/events',
  },
  {
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1920&q=85',
    tag: 'Award Ceremony',
    ctaLink: '/toppers',
  },
]

// Bilingual notices
export const notices = {
  bn: [
    {
      id: 1,
      cat: 'পরীক্ষা',
      catEn: 'Exam',
      pinned: true,
      date: '২৫ সেপ্টেম্বর ২০২৬',
      title: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৬ রুটিন ও প্রবেশপত্র বিতরণ',
      text: '৬ষ্ঠ থেকে ১০ম শ্রেণির পরীক্ষা ১০ অক্টোবর ২০২৬ থেকে শুরু হবে। বিস্তারিত সময়সূচি ডাউনলোড করা যাবে। প্রবেশপত্র পেতে সব বেতন পরিশোধ করতে হবে।',
      file: '#',
      views: 620,
      author: 'পরীক্ষা নিয়ন্ত্রক',
    },
    {
      id: 2,
      cat: 'ভর্তি',
      catEn: 'Admission',
      pinned: true,
      date: '২০ সেপ্টেম্বর ২০২৬',
      title: 'সেশন ২০২৭ ভর্তি বিজ্ঞপ্তি (৬ষ্ঠ থেকে ৯ম শ্রেণি)',
      text: '১ নভেম্বর ২০২৬ থেকে অনলাইন ও অফলাইন ভর্তি আবেদন শুরু। ৯ম শ্রেণিতে বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগে ভর্তি নেওয়া হবে।',
      file: '#',
      views: 1140,
      author: 'ভর্তি কমিটি',
    },
    {
      id: 3,
      cat: 'ছুটি',
      catEn: 'Holiday',
      pinned: false,
      date: '২২ সেপ্টেম্বর ২০২৬',
      title: 'জাতীয় সরকারি ছুটিতে বৃহস্পতিবার বিদ্যালয় বন্ধ',
      text: 'সকল একাডেমিক ক্লাস ও প্রশাসনিক কার্যালয় বন্ধ থাকবে। রবিবার সকাল ৮:৩০টায় স্বাভাবিক ক্লাস শুরু হবে।',
      file: '',
      views: 410,
      author: 'প্রধান শিক্ষকের দপ্তর',
    },
    {
      id: 4,
      cat: 'ফলাফল',
      catEn: 'Result',
      pinned: false,
      date: '১৫ সেপ্টেম্বর ২০২৬',
      title: '১০ম শ্রেণির প্রাক-পরীক্ষা / মডেল টেস্টের ফলাফল প্রকাশিত',
      text: 'এসএসসি পরীক্ষার্থীদের মডেল টেস্টের ফলাফল অনলাইন পোর্টালে প্রকাশিত হয়েছে। অভিভাবকদের সংশ্লিষ্ট শ্রেণিশিক্ষকের সাথে ফলাফল পর্যালোচনার অনুরোধ করা হচ্ছে।',
      file: '#',
      views: 1480,
      author: 'একাডেমিক পরিষদ',
    },
    {
      id: 5,
      cat: 'ক্লাব',
      catEn: 'Club',
      pinned: false,
      date: '১২ সেপ্টেম্বর ২০২৬',
      title: 'বার্ষিক বিজ্ঞান মেলা ও আন্তঃশ্রেণি গণিত অলিম্পিয়াডে নিবন্ধন',
      text: '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীরা কার্যকরী পদার্থ/রসায়ন প্রজেক্ট মডেল জমা দিতে ও গণিত অলিম্পিয়াডে নিবন্ধন করতে পারবে।',
      file: '#',
      views: 790,
      author: 'বিজ্ঞান ও গণিত ক্লাব',
    },
    {
      id: 6,
      cat: 'স্কাউট',
      catEn: 'Scouts',
      pinned: false,
      date: '০৮ সেপ্টেম্বর ২০২৬',
      title: 'বাংলাদেশ স্কাউট ও গার্ল গাইড বার্ষিক ক্যাম্পফায়ার ও প্রশিক্ষণ শিবির',
      text: 'স্কুলের স্কাউট দল ও গার্ল গাইডের নিবন্ধিত সদস্যরা ৩ দিনের আঞ্চলিক প্রশিক্ষণ শিবিরে অংশগ্রহণ করবে।',
      file: '',
      views: 520,
      author: 'স্কাউট দলনেতা',
    },
  ],
  en: [
    {
      id: 1,
      cat: 'Exam',
      catEn: 'Exam',
      pinned: true,
      date: '25 Sep 2026',
      title: 'Half-Yearly Examination 2026 Routine & Admit Card Distribution',
      text: 'Examinations for Classes Six to Ten commence on 10 October 2026. The comprehensive subject schedule is available for download. All tuition dues must be cleared before receiving official admit cards.',
      file: '#',
      views: 620,
      author: 'Exam Controller Desk',
    },
    {
      id: 2,
      cat: 'Admission',
      catEn: 'Admission',
      pinned: true,
      date: '20 Sep 2026',
      title: 'Admission Circular for Session 2027 (Classes 6 to 9)',
      text: 'Online and offline admission applications begin 1 November 2026. Academic streams open in Class 9: Science (বিজ্ঞান), Business Studies (ব্যবসায় শিক্ষা), and Humanities (মানবিক).',
      file: '#',
      views: 1140,
      author: 'Admission Committee',
    },
    {
      id: 3,
      cat: 'Holiday',
      catEn: 'Holiday',
      pinned: false,
      date: '22 Sep 2026',
      title: 'School Closed on Thursday for National Public Holiday',
      text: 'All academic classes and administrative offices will remain closed. Regular classes will resume according to standard school routine on Sunday at 8:30 AM.',
      file: '',
      views: 410,
      author: 'Headmaster Desk',
    },
    {
      id: 4,
      cat: 'Result',
      catEn: 'Result',
      pinned: false,
      date: '15 Sep 2026',
      title: 'Class Ten Pre-Test / Model Test Results Published Online',
      text: 'SSC candidate model test evaluation results are now published on our verified online marksheet portal. Guardians are requested to review subject marks with respective class teachers.',
      file: '#',
      views: 1480,
      author: 'Academic Council',
    },
    {
      id: 5,
      cat: 'Club',
      catEn: 'Club',
      pinned: false,
      date: '12 Sep 2026',
      title: 'Annual Science Fair & Inter-Class Math Olympiad Registration',
      text: 'Students from Classes 6 to 10 are invited to submit working physics/chemistry project models, Rubik speed cube entries, and register for the math problem-solving olympiad.',
      file: '#',
      views: 790,
      author: 'Science & Math Club',
    },
    {
      id: 6,
      cat: 'Scouts',
      catEn: 'Scouts',
      pinned: false,
      date: '08 Sep 2026',
      title: 'Bangladesh Scout & Girl Guide Annual Campfire & Training Camp',
      text: 'Registered members of the school Scout troop and Girl Guides contingent will participate in the 3-day regional training camp and social community service on school grounds.',
      file: '',
      views: 520,
      author: 'Scout Troop Leader',
    },
  ],
}

export const classes = {
  bn: ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'],
  en: ['Six', 'Seven', 'Eight', 'Nine', 'Ten'],
  keys: ['Six', 'Seven', 'Eight', 'Nine', 'Ten'],
}

export const academicGroups = {
  bn: [
    {
      name: 'বিজ্ঞান বিভাগ',
      icon: '🔬',
      desc: 'পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান এবং উচ্চতর গণিতের গভীর পাঠ ও নিয়মিত ব্যবহারিক ল্যাব ক্লাস। ভবিষ্যৎ প্রকৌশলী, চিকিৎসক ও বিজ্ঞানী গড়ার আদর্শ বিভাগ।',
      subjects: ['পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত', 'সাধারণ গণিত', 'আইসিটি', 'বাংলা', 'ইংরেজি'],
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-cyan-500/30',
      pathway: 'উচ্চ মাধ্যমিক (এইচএসসি বিজ্ঞান), মেডিকেল (এমবিবিএস), প্রকৌশল (বুয়েট), প্রযুক্তি ও গবেষণা',
    },
    {
      name: 'ব্যবসায় শিক্ষা',
      icon: '📊',
      desc: 'হিসাববিজ্ঞান, ব্যবসায় উদ্যোগ এবং ফিন্যান্স ও ব্যাংকিং। শিক্ষার্থীদের ব্যবসায়িক দূরদর্শিতা, আর্থিক হিসাব ও ব্যবস্থাপনা দক্ষতা বৃদ্ধি করে।',
      subjects: ['হিসাববিজ্ঞান', 'ব্যবসায় উদ্যোগ', 'ফিন্যান্স ও ব্যাংকিং', 'সাধারণ বিজ্ঞান', 'সাধারণ গণিত', 'আইসিটি', 'বাংলা', 'ইংরেজি'],
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      pathway: 'উচ্চ মাধ্যমিক (এইচএসসি বাণিজ্য), বিবিএ/এমবিএ (আইবিএ), চার্টার্ড একাউন্টেন্সি (সিএ)',
    },
    {
      name: 'মানবিক বিভাগ',
      icon: '📜',
      desc: 'বাংলাদেশ ও বিশ্বসভ্যতার ইতিহাস, ভূগোল ও পরিবেশ, পৌরনীতি ও নাগরিকতা এবং অর্থনীতি। সামাজিক সচেতনতা, আইন ও প্রশাসনিক দক্ষতা গড়ে তোলে।',
      subjects: ['ইতিহাস ও সভ্যতা', 'ভূগোল ও পরিবেশ', 'পৌরনীতি ও নাগরিকতা', 'অর্থনীতি', 'সাধারণ বিজ্ঞান', 'আইসিটি', 'বাংলা', 'ইংরেজি'],
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      pathway: 'উচ্চ মাধ্যমিক (এইচএসসি মানবিক), আইন (এলএলবি), সিভিল সার্ভিস (বিসিএস), সাংবাদিকতা',
    },
    {
      name: 'জুনিয়র সেকশন (৬ষ্ঠ - ৮ম শ্রেণি)',
      icon: '📚',
      desc: 'বাংলা ব্যাকরণ ও সাহিত্য, ইংরেজি কথোপকথন, সাধারণ গণিত, সমন্বিত বিজ্ঞান এবং তথ্য ও যোগাযোগ প্রযুক্তির মজবুত ভিত্তি।',
      subjects: ['বাংলা (১ম ও ২য়)', 'ইংরেজি ব্যাকরণ', 'গণিত', 'সাধারণ বিজ্ঞান', 'বিজিএস', 'আইসিটি', 'ধর্ম ও নৈতিকতা'],
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      pathway: 'এসএসসি বিজ্ঞান, ব্যবসায় শিক্ষা বা মানবিক বিভাগে মসৃণ রূপান্তর',
    },
  ],
  en: [
    {
      name: 'Science Group (বিজ্ঞান বিভাগ)',
      icon: '🔬',
      desc: 'Rigorous national curriculum in Physics, Chemistry, Biology, and Higher Mathematics supported by daily hands-on laboratory sessions. Ideal for future doctors, engineers, and scientists.',
      subjects: ['Physics', 'Chemistry', 'Biology', 'Higher Math', 'General Math', 'ICT', 'Bangla', 'English'],
      color: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-cyan-500/30',
      pathway: 'Higher Secondary (HSC Science), Medical (MBBS), Engineering (BUET), Technology & Research',
    },
    {
      name: 'Business Studies (ব্যবসায় শিক্ষা)',
      icon: '📊',
      desc: 'Accounting, Business Entrepreneurship, and Finance & Banking. Developing analytical thinking, commercial acumen, financial management, and leadership skills.',
      subjects: ['Accounting', 'Business Entrepreneurship', 'Finance & Banking', 'General Science', 'General Math', 'ICT', 'Bangla', 'English'],
      color: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/30',
      pathway: 'Higher Secondary (HSC Commerce), BBA/MBA (IBA), Chartered Accountancy (CA), Banking & Corporate',
    },
    {
      name: 'Humanities Group (মানবিক বিভাগ)',
      icon: '📜',
      desc: 'History of Bangladesh & World Civilization, Geography & Environment, Civics & Citizenship, and Economics. Cultivating critical reasoning, social justice, and constitutional awareness.',
      subjects: ['History & Civilization', 'Geography & Environment', 'Civics & Citizenship', 'Economics', 'General Science', 'ICT', 'Bangla', 'English'],
      color: 'from-emerald-500/20 to-teal-500/20',
      border: 'border-emerald-500/30',
      pathway: 'Higher Secondary (HSC Humanities), Law (LLB), Civil Services (BCS), Journalism & Literature',
    },
    {
      name: 'Junior Secondary (৬ষ্ঠ - ৮ম শ্রেণি)',
      icon: '📚',
      desc: 'Foundational secondary curriculum focusing on Bangla literature, communicative English grammar, foundational mathematics, integrated general science, and moral values.',
      subjects: ['Bangla (১ম ও ২য়)', 'English Grammar', 'Mathematics', 'General Science', 'BGS', 'ICT', 'Religion & Moral'],
      color: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30',
      pathway: 'Smooth transition to SSC Science, Business Studies or Humanities groups with high grade readiness',
    },
  ],
}

export const schoolClubs = {
  bn: [
    { name: 'বিজ্ঞান ও উদ্ভাবন ক্লাব', icon: '🚀', desc: 'সাপ্তাহিক ব্যবহারিক পরীক্ষা, বিজ্ঞান মডেল প্রদর্শনী, জ্যোতির্বিদ্যা পর্যবেক্ষণ ও গণিত অলিম্পিয়াড কর্মশালা।' },
    { name: 'বিদ্যালয় বিতর্ক পরিষদ', icon: '🎙️', desc: 'বাংলা ও ইংরেজিতে সংসদীয় ও ঐতিহ্যবাহী বিতর্ক, তাৎক্ষণিক বক্তৃতা ও আন্তঃস্কুল চ্যাম্পিয়নশিপ।' },
    { name: 'বাংলাদেশ স্কাউট ও গার্ল গাইড', icon: '🏕️', desc: 'চরিত্র গঠন, আউটডোর ক্যাম্পিং, প্রাথমিক চিকিৎসা, ট্রাফিক সচেতনতা ও জাতীয় দুর্যোগ ত্রাণ স্বেচ্ছাসেবা।' },
    { name: 'সাংস্কৃতিক ও পারফর্মিং আর্টস', icon: '🎭', desc: 'দেশাত্মবোধক সংগীত, নজরুল-রবীন্দ্র সংগীত, আবৃত্তি, নাট্য মঞ্চায়ন ও জাতীয় উদযাপন অনুষ্ঠান।' },
    { name: 'ক্রীড়া ও অ্যাথলেটিক্স সংসদ', icon: '🏆', desc: 'ফুটবল কাপ টুর্নামেন্ট, ক্রিকেট লিগ, ব্যাডমিন্টন, ১০০ মিটার স্প্রিন্ট ও বার্ষিক অ্যাথলেটিক্স মিট।' },
    { name: 'ভাষা ও সাহিত্য ক্লাব', icon: '📖', desc: 'বানান প্রতিযোগিতা, সৃজনশীল লেখা, কবিতা আবৃত্তি ও বিদ্যালয়ের বার্ষিক ওয়াল ম্যাগাজিন প্রকাশ।' },
  ],
  en: [
    { name: 'Science & Innovation Club (বিজ্ঞান ক্লাব)', icon: '🚀', desc: 'Weekly practical experiments, science model displays, astronomy sky-watching, and Math Olympiad workshops.' },
    { name: 'School Debating Society (বিতর্ক পরিষদ)', icon: '🎙️', desc: 'Parliamentary and traditional debate in Bangla & English, extempore speech, and inter-school championship.' },
    { name: 'Bangladesh Scouts & Girl Guides (স্কাউট ও গাইড)', icon: '🏕️', desc: 'Character building, outdoor camping, first aid, traffic awareness, and national disaster relief volunteerism.' },
    { name: 'Cultural & Performing Arts (সাংস্কৃতিক সংসদ)', icon: '🎭', desc: 'Patriotic songs, Nazrul-Rabindra sangeet, recitation, theatre staging, and national celebration events.' },
    { name: 'Sports & Athletics Association (ক্রীড়া পরিষদ)', icon: '🏆', desc: 'Football cup tournaments, cricket leagues, badminton tournaments, 100m sprint, and annual athletics meet.' },
    { name: 'Language & Literary Club (সাহিত্য ও ভাষা ক্লাব)', icon: '📖', desc: 'Spelling bee contests, creative writing, poetry recitations, and publishing the school annual wall magazine.' },
  ],
}

export const schoolFacilities = {
  bn: [
    { title: 'আধুনিক বিজ্ঞানাগার', desc: 'পদার্থবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের জন্য আলাদা, পূর্ণ সজ্জিত ল্যাবরেটরি।', icon: '🔬', metric: '৩টি বিশেষ ল্যাব' },
    { title: 'মাল্টিমিডিয়া ডিজিটাল ক্লাসরুম', desc: 'ইন্টারেক্টিভ স্মার্ট প্রজেক্টর ও অডিওভিজ্যুয়াল সেটআপ সহ আধুনিক শ্রেণিকক্ষ।', icon: '🖥️', metric: 'স্মার্ট ডিসপ্লে' },
    { title: 'কেন্দ্রীয় একাডেমিক পাঠাগার', desc: '১০,০০০+ জাতীয় পাঠ্যপুস্তক গাইড, বিশ্বকোষ, সাহিত্য ও নিরিবিলি পাঠকক্ষ।', icon: '📚', metric: '১০,০০০+ বই' },
    { title: 'আইসিটি ও কম্পিউটার ল্যাব', desc: 'ব্রডব্যান্ড ইন্টারনেট সংযুক্ত ৪০টি আধুনিক কম্পিউটার ও ডিজিটাল টাইপিং স্টেশন।', icon: '💻', metric: '৪০টি ওয়ার্কস্টেশন' },
    { title: 'বিশাল সবুজ খেলার মাঠ', desc: 'ফুটবল গোলপোস্ট, ক্রিকেট পিচ, ভলিবল কোর্ট ও দৌড়ের ট্র্যাক সহ বিস্তৃত মাঠ।', icon: '⚽', metric: 'পূর্ণ আকারের মাঠ' },
    { title: 'শহীদ মিনার ও সাংস্কৃতিক মঞ্চ', desc: 'ভাষা দিবস (২১শে ফেব্রুয়ারি), বিজয় দিবস ও স্বাধীনতা দিবস উদযাপনের জন্য স্থায়ী স্থাপনা।', icon: '🏛️', metric: 'উন্মুক্ত সাংস্কৃতিক প্লাজা' },
    { title: 'বিশুদ্ধ পানি ও ক্যান্টিন', desc: 'বহু-স্তরের আরও ফিল্টার করা পানীয় জল ও স্বাস্থ্যকর ক্যান্টিন সহ সুবিধা।', icon: '💧', metric: 'আরও ফিল্টার বিশুদ্ধ পানি' },
    { title: 'ক্যাম্পাস নিরাপত্তা ও সিসিটিভি', desc: 'নিরাপদ সীমানা প্রাচীর, ২৪/৭ সিসিটিভি ক্যামেরা ও মেয়েদের জন্য আলাদা কমন রুম।', icon: '🛡️', metric: '২৪/৭ নিরাপদ ক্যাম্পাস' },
  ],
  en: [
    { title: 'Modern Science Labs', desc: 'Separate, fully equipped laboratories for Physics, Chemistry, and Biology with microscopes, burners, glassware, and certified reagents.', icon: '🔬', metric: '3 Specialized Labs' },
    { title: 'Multimedia Digital Classrooms', desc: 'Interactive smart projectors and audiovisual setups making abstract science, math, and geography topics easy to understand.', icon: '🖥️', metric: 'Smart Displays' },
    { title: 'Central Academic Library', desc: 'Rich collection of over 10,000+ national textbook guides, encyclopedias, literature, and quiet reading booths.', icon: '📚', metric: '10,000+ Books' },
    { title: 'ICT & Computer Lab', desc: '40 modern networked computers with high-speed broadband internet, digital typing stations, and introductory programming.', icon: '💻', metric: '40 Workstations' },
    { title: 'Large Green Sports Playground', desc: 'Expansive field with football goalposts, cricket pitch, volleyball court, and running track for daily physical exercise.', icon: '⚽', metric: 'Full-size Ground' },
    { title: 'Shaheed Minar & Cultural Stage', desc: 'Architectural monument for Language Day (21st February), Victory Day, Independence Day, and school open-air assemblies.', icon: '🏛️', metric: 'Open Cultural Plaza' },
    { title: 'Pure Drinking Water & Cafeteria', desc: 'Multi-stage RO filtered drinking water points and hygienic canteen providing fresh, nutritious tiffin snacks.', icon: '💧', metric: 'RO Filtered Pure Water' },
    { title: 'Campus Safety & CCTV Security', desc: 'Secured boundary perimeter, 24/7 CCTV surveillance cameras across all corridors, and dedicated girls\' common room.', icon: '🛡️', metric: '24/7 Safe Campus' },
  ],
}

export const dailyRoutineSchedule = {
  bn: [
    { time: 'সকাল ৮:৩০ - ৯:০০', title: 'প্রাত্যহিক সমাবেশ ও শারীরিক কসরত', desc: 'জাতীয় সংগীত, ধর্মীয় পাঠ, বিদ্যালয় শপথ ও প্রধান মাঠে পিটি ব্যায়াম।' },
    { time: 'সকাল ৯:০০ - ১০:৩০', title: '১ম ও ২য় একাডেমিক পিরিয়ড', desc: 'মূল বিষয়: বাংলা ১ম/২য় পত্র, ইংরেজি যোগাযোগমূলক ব্যাকরণ ও সাধারণ গণিত।' },
    { time: 'সকাল ১০:৩০ - দুপুর ১২:০০', title: '৩য় ও ৪র্থ একাডেমিক পিরিয়ড', desc: 'বিষয়ভিত্তিক পাঠ: পদার্থবিজ্ঞান, রসায়ন, হিসাববিজ্ঞান, ইতিহাস, ভূগোল ও উচ্চতর গণিত।' },
    { time: 'দুপুর ১২:০০ - ১২:৪৫', title: 'মধ্যাহ্ন বিরতি ও জোহরের নামাজ', desc: 'পুষ্টিকর টিফিন, সামাজিক মেলামেশা ও বিদ্যালয়ের নামাজ কক্ষে জোহরের নামাজ।' },
    { time: 'দুপুর ১২:৪৫ - ২:১৫', title: '৫ম ও ৬ষ্ঠ একাডেমিক পিরিয়ড', desc: 'বিজ্ঞান ব্যবহারিক ল্যাব, আইসিটি কম্পিউটার ল্যাব পাঠ, জীববিজ্ঞান ব্যবচ্ছেদ ও বিজিএস বক্তৃতা।' },
    { time: 'দুপুর ২:১৫ - ৩:০০', title: '৭ম পিরিয়ড ও শ্রেণি পর্যালোচনা', desc: 'সংশয় দূরীকরণ, হোমওয়ার্ক ডায়েরি যাচাই, পাঠাগার রেফারেন্স পাঠ ও নৈতিক গাইডেন্স।' },
    { time: 'বিকাল ৩:০০ - ৪:৩০', title: 'সহ-পাঠ্যক্রম ও বহিরাঙ্গন কার্যক্রম', desc: 'বাংলাদেশ স্কাউট প্যারেড, বিতর্ক অনুশীলন, ফুটবল/ক্রিকেট খেলা ও বিজ্ঞান ক্লাব প্রকল্প।' },
  ],
  en: [
    { time: '08:30 AM - 09:00 AM', title: 'Morning Assembly & Physical Drill', desc: 'National anthem, recitation from holy scriptures, school oath, and PT exercise in the main playground.' },
    { time: '09:00 AM - 10:30 AM', title: '1st & 2nd Academic Periods', desc: 'Core academic subjects: Bangla 1st/2nd Paper, English Communicative Grammar, and General Mathematics.' },
    { time: '10:30 AM - 12:00 PM', title: '3rd & 4th Academic Periods', desc: 'Discipline subjects: Physics, Chemistry, Accounting, History, Geography, and Higher Mathematics.' },
    { time: '12:00 PM - 12:45 PM', title: 'Mid-Day Tiffin & Dhuhr Prayer Break', desc: 'Nutritious lunch tiffin, socializing, and congregational Zohr prayer in the school prayer room.' },
    { time: '12:45 PM - 02:15 PM', title: '5th & 6th Academic Periods', desc: 'Science Laboratory Practicals, ICT Computer Lab lessons, Biology dissection, and BGS lectures.' },
    { time: '02:15 PM - 03:00 PM', title: '7th Period & Class Review', desc: 'Doubt clearing, homework diary checking, library reference reading, and moral guidance.' },
    { time: '03:00 PM - 04:30 PM', title: 'Co-Curricular & Outdoor Activities', desc: 'Bangladesh Scouts parade, debate practice, football/cricket games, and science club projects.' },
  ],
}

export const exams = {
  bn: ['অর্ধ-বার্ষিক পরীক্ষা ২০২৬', 'বার্ষিক পরীক্ষা ২০২৫', 'প্রাক-পরীক্ষা ২০২৫', 'এসএসসি মডেল টেস্ট ২০২৬'],
  en: ['Half-Yearly Exam 2026', 'Annual Exam 2025', 'Pre-Test Exam 2025', 'SSC Model Test 2026'],
}

export const resultFiles = {
  bn: [
    { name: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৬ - সংহত গেজেট (৬ষ্ঠ-১০ম শ্রেণি)', link: '#', size: '২.৪ এমবি' },
    { name: '১০ম শ্রেণির এসএসসি মডেল টেস্ট অফিসিয়াল মেধা তালিকা ২০২৬', link: '#', size: '১.৬ এমবি' },
    { name: 'বার্ষিক পরীক্ষা ২০২৫ - শীর্ষ মেধা তালিকা ও গ্রেড শিট', link: '#', size: '৩.১ এমবি' },
    { name: '৮ম শ্রেণির জুনিয়র বৃত্তি মডেল পরীক্ষার গেজেট', link: '#', size: '১.২ এমবি' },
  ],
  en: [
    { name: 'Half-Yearly Exam 2026 - Consolidated Gazette (Classes 6-10)', link: '#', size: '2.4 MB' },
    { name: 'Class 10 SSC Model Test Official Merit List 2026', link: '#', size: '1.6 MB' },
    { name: 'Annual Examination 2025 - Top Merit List & Grade Sheets', link: '#', size: '3.1 MB' },
    { name: 'Class 8 Junior Scholarship Model Exam Gazettes', link: '#', size: '1.2 MB' },
  ],
}

export const toppers = {
  Six: [
    { name: 'রাফি আহমেদ', nameEn: 'Rafi Ahmed', roll: '1', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৭৫/৭০০', marksEn: '675/700', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', badge: '১ম স্থান (গোল্ডেন এ+)', badgeEn: '1st in Class (Golden A+)' },
    { name: 'তানহা আক্তার', nameEn: 'Tanha Akter', roll: '2', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৬৮/৭০০', marksEn: '668/700', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', badge: '২য় স্থান (গোল্ডেন এ+)', badgeEn: '2nd in Class (Golden A+)' },
    { name: 'সাব্বির হোসেন', nameEn: 'Sabbir Hossain', roll: '3', gpa: '৪.৯৫', gpaEn: '4.95', marks: '৬৫২/৭০০', marksEn: '652/700', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', badge: '৩য় স্থান', badgeEn: '3rd in Class' },
    { name: 'মিম চৌধুরী', nameEn: 'Mim Chowdhury', roll: '4', gpa: '৪.৯০', gpaEn: '4.90', marks: '৬৪৪/৭০০', marksEn: '644/700', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'আরিফ ইসলাম', nameEn: 'Arif Islam', roll: '5', gpa: '৪.৮৮', gpaEn: '4.88', marks: '৬৩৬/৭০০', marksEn: '636/700', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'নুসরাত জাহান', nameEn: 'Nusrat Jahan', roll: '6', gpa: '৪.৮৫', gpaEn: '4.85', marks: '৬২৮/৭০০', marksEn: '628/700', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'শাকিব খান', nameEn: 'Shakib Khan', roll: '7', gpa: '৪.৮০', gpaEn: '4.80', marks: '৬২০/৭০০', marksEn: '620/700', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'প্রিয়া দাস', nameEn: 'Priya Das', roll: '8', gpa: '৪.৭৮', gpaEn: '4.78', marks: '৬১৪/৭০০', marksEn: '614/700', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'তাহমিদ হাসান', nameEn: 'Tahmid Hasan', roll: '9', gpa: '৪.৭৫', gpaEn: '4.75', marks: '৬০৮/৭০০', marksEn: '608/700', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'সাদিয়া রহমান', nameEn: 'Sadia Rahman', roll: '10', gpa: '৪.৭০', gpaEn: '4.70', marks: '৬০২/৭০০', marksEn: '602/700', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
  ],
  Seven: [
    { name: 'নাবিলা করিম', nameEn: 'Nabila Karim', roll: '1', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৮২/৭০০', marksEn: '682/700', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', badge: '১ম স্থান (গোল্ডেন এ+)', badgeEn: '1st in Class (Golden A+)' },
    { name: 'ইমরান হোসেন', nameEn: 'Imran Hossain', roll: '2', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৭৪/৭০০', marksEn: '674/700', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', badge: '২য় স্থান (গোল্ডেন এ+)', badgeEn: '2nd in Class (Golden A+)' },
    { name: 'সুমাইয়া আক্তার', nameEn: 'Sumaiya Akter', roll: '3', gpa: '৪.৯৫', gpaEn: '4.95', marks: '৬৬০/৭০০', marksEn: '660/700', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', badge: '৩য় স্থান', badgeEn: '3rd in Class' },
    { name: 'রাকিব হাসান', nameEn: 'Rakib Hasan', roll: '4', gpa: '৪.৯০', gpaEn: '4.90', marks: '৬৫০/৭০০', marksEn: '650/700', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'জান্নাত ফেরদৌস', nameEn: 'Jannat Ferdous', roll: '5', gpa: '৪.৮৮', gpaEn: '4.88', marks: '৬৪২/৭০০', marksEn: '642/700', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'মাহিন সরকার', nameEn: 'Mahin Sarker', roll: '6', gpa: '৪.৮২', gpaEn: '4.82', marks: '৬৩৪/৭০০', marksEn: '634/700', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'তিশা রায়', nameEn: 'Tisha Roy', roll: '7', gpa: '৪.৮০', gpaEn: '4.80', marks: '৬২৬/৭০০', marksEn: '626/700', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'ফাহিম আহমেদ', nameEn: 'Fahim Ahmed', roll: '8', gpa: '৪.৭৮', gpaEn: '4.78', marks: '৬১৮/৭০০', marksEn: '618/700', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'লামিয়া সুলতানা', nameEn: 'Lamia Sultana', roll: '9', gpa: '৪.৭২', gpaEn: '4.72', marks: '৬১০/৭০০', marksEn: '610/700', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'রিয়াদ মিয়া', nameEn: 'Riyad Mia', roll: '10', gpa: '৪.৭০', gpaEn: '4.70', marks: '৬০৪/৭০০', marksEn: '604/700', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
  ],
  Eight: [
    { name: 'ফারহান সাদিক', nameEn: 'Farhan Sadik', roll: '1', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৮৮/৭০০', marksEn: '688/700', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', badge: '১ম স্থান (ট্যালেন্টপুল)', badgeEn: '1st in Class (Talentpool)' },
    { name: 'আনিকা তাবাস্সুম', nameEn: 'Anika Tabassum', roll: '2', gpa: '৫.০০', gpaEn: '5.00', marks: '৬৮০/৭০০', marksEn: '680/700', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', badge: '২য় স্থান (গোল্ডেন এ+)', badgeEn: '2nd in Class (Golden A+)' },
    { name: 'জুবায়ের আলী', nameEn: 'Zubayer Ali', roll: '3', gpa: '৪.৯৫', gpaEn: '4.95', marks: '৬৬৮/৭০০', marksEn: '668/700', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', badge: '৩য় স্থান', badgeEn: '3rd in Class' },
    { name: 'মায়শা খাতুন', nameEn: 'Maisha Khatun', roll: '4', gpa: '৪.৯২', gpaEn: '4.92', marks: '৬৫৮/৭০০', marksEn: '658/700', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'সোহান মৃধা', nameEn: 'Sohan Mridha', roll: '5', gpa: '৪.৮৮', gpaEn: '4.88', marks: '৬৪৮/৭০০', marksEn: '648/700', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'ইশরাত জাহান', nameEn: 'Ishrat Jahan', roll: '6', gpa: '৪.৮৫', gpaEn: '4.85', marks: '৬৩৮/৭০০', marksEn: '638/700', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'তানভীর আলম', nameEn: 'Tanvir Alam', roll: '7', gpa: '৪.৮০', gpaEn: '4.80', marks: '৬৩০/৭০০', marksEn: '630/700', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'রিমি আক্তার', nameEn: 'Rimi Akter', roll: '8', gpa: '৪.৭৮', gpaEn: '4.78', marks: '৬২২/৭০০', marksEn: '622/700', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'নাঈম উদ্দিন', nameEn: 'Nayeem Uddin', roll: '9', gpa: '৪.৭৫', gpaEn: '4.75', marks: '৬১৫/৭০০', marksEn: '615/700', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'শারমিন নিলা', nameEn: 'Sharmin Nila', roll: '10', gpa: '৪.৭২', gpaEn: '4.72', marks: '৬০৯/৭০০', marksEn: '609/700', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
  ],
  Nine: [
    { name: 'সামিউল হক', nameEn: 'Samiul Haque', roll: '1', gpa: '৫.০০', gpaEn: '5.00', marks: '৮৮৫/৯০০', marksEn: '885/900', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', badge: 'বিজ্ঞানে ১ম (গোল্ডেন এ+)', badgeEn: '1st in Science (Golden A+)' },
    { name: 'তাসনিম আরা', nameEn: 'Tasnim Ara', roll: '2', gpa: '৫.০০', gpaEn: '5.00', marks: '৮৭৮/৯০০', marksEn: '878/900', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', badge: 'বিজ্ঞানে ২য় (গোল্ডেন এ+)', badgeEn: '2nd in Science (Golden A+)' },
    { name: 'মেহেদী হাসান', nameEn: 'Mehedi Hasan', roll: '3', gpa: '৪.৯৫', gpaEn: '4.95', marks: '৮৬৪/৯০০', marksEn: '864/900', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', badge: 'বাণিজ্যে ১ম', badgeEn: '1st in Commerce' },
    { name: 'রুবাইয়া ইসলাম', nameEn: 'Rubaiya Islam', roll: '4', gpa: '৪.৯০', gpaEn: '4.90', marks: '৮৫২/৯০০', marksEn: '852/900', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', badge: 'মানবিকে শীর্ষ', badgeEn: 'Top in Humanities' },
    { name: 'অর্ণব পল', nameEn: 'Arnob Paul', roll: '5', gpa: '৪.৮৫', gpaEn: '4.85', marks: '৮৪০/৯০০', marksEn: '840/900', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'সাদমান সাকিব', nameEn: 'Sadman Sakib', roll: '6', gpa: '৪.৮২', gpaEn: '4.82', marks: '৮৩২/৯০০', marksEn: '832/900', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'মৌ আক্তার', nameEn: 'Mou Akter', roll: '7', gpa: '৪.৮০', gpaEn: '4.80', marks: '৮২৫/৯০০', marksEn: '825/900', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'হাবিব খান', nameEn: 'Habib Khan', roll: '8', gpa: '৪.৭৮', gpaEn: '4.78', marks: '৮১৮/৯০০', marksEn: '818/900', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'পূজা রানী', nameEn: 'Puja Rani', roll: '9', gpa: '৪.৭৫', gpaEn: '4.75', marks: '৮১০/৯০০', marksEn: '810/900', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'শাফিন আহমেদ', nameEn: 'Shafin Ahmed', roll: '10', gpa: '৪.৭০', gpaEn: '4.70', marks: '৮০২/৯০০', marksEn: '802/900', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
  ],
  Ten: [
    { name: 'আয়েশা সিদ্দিকা', nameEn: 'Ayesha Siddika', roll: '1', gpa: '৫.০০', gpaEn: '5.00', marks: '৮৯২/৯০০', marksEn: '892/900', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', badge: 'বিজ্ঞানে ১ম (গোল্ডেন এ+)', badgeEn: '1st in Science (Golden A+)' },
    { name: 'রাহাত করিম', nameEn: 'Rahat Karim', roll: '2', gpa: '৫.০০', gpaEn: '5.00', marks: '৮৮৬/৯০০', marksEn: '886/900', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', badge: 'বিজ্ঞানে ২য় (গোল্ডেন এ+)', badgeEn: '2nd in Science (Golden A+)' },
    { name: 'নাফিসা আনজুম', nameEn: 'Nafisa Anjum', roll: '3', gpa: '৫.০০', gpaEn: '5.00', marks: '৮৭৮/৯০০', marksEn: '878/900', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', badge: 'ব্যবসায় শিক্ষায় ১ম', badgeEn: '1st in Business Studies' },
    { name: 'তওহিদ ইসলাম', nameEn: 'Tawhid Islam', roll: '4', gpa: '৪.৯৫', gpaEn: '4.95', marks: '৮৬৫/৯০০', marksEn: '865/900', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', badge: 'মানবিকে ১ম', badgeEn: '1st in Humanities' },
    { name: 'সিনথিয়া শারমিন', nameEn: 'Sinthia Sharmin', roll: '5', gpa: '৪.৯০', gpaEn: '4.90', marks: '৮৫৪/৯০০', marksEn: '854/900', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'রাতুল আহমেদ', nameEn: 'Ratul Ahmed', roll: '6', gpa: '৪.৮৮', gpaEn: '4.88', marks: '৮৪৬/৯০০', marksEn: '846/900', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'কাজী মিম', nameEn: 'Kazi Mim', roll: '7', gpa: '৪.৮৫', gpaEn: '4.85', marks: '৮৩৮/৯০০', marksEn: '838/900', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'আশিক মাহমুদ', nameEn: 'Ashik Mahmud', roll: '8', gpa: '৪.৮০', gpaEn: '4.80', marks: '৮৩০/৯০০', marksEn: '830/900', photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'লিমা আক্তার', nameEn: 'Lima Akter', roll: '9', gpa: '৪.৭৮', gpaEn: '4.78', marks: '৮২২/৯০০', marksEn: '822/900', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
    { name: 'জুবায়ের হাসান', nameEn: 'Jubayer Hasan', roll: '10', gpa: '৪.৭৫', gpaEn: '4.75', marks: '৮১৫/৯০০', marksEn: '815/900', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', badge: 'শীর্ষ ১০', badgeEn: 'Top 10' },
  ],
}

// Generates an authentic general school academic marksheet for any class/roll
export function generateStudentResult(className, rollNum, examName, lang = 'bn') {
  const rollInt = parseInt(rollNum, 10) || 1
  const classList = toppers[className] || toppers.Ten
  const matchedStudent = classList.find((s) => s.roll === String(rollInt))

  const studentName = matchedStudent
    ? (lang === 'bn' ? matchedStudent.name : matchedStudent.nameEn)
    : (lang === 'bn' ? `শিক্ষার্থী ${rollNum}` : `Student ${rollNum}`)
  const isTop3 = rollInt <= 3
  const baseScore = Math.max(55, 96 - Math.min(rollInt * 3, 38))

  const subjectsBn = [
    { code: '101', name: 'বাংলা (১ম ও ২য় পত্র)', fullMarks: 100, written: Math.min(70, baseScore - 4), mcq: Math.min(30, 26 + (rollInt % 4)), practical: '-' },
    { code: '107', name: 'ইংরেজি (১ম ও ২য় পত্র)', fullMarks: 100, written: Math.min(100, baseScore + (rollInt % 3)), mcq: '-', practical: '-' },
    { code: '109', name: 'গণিত', fullMarks: 100, written: Math.min(70, baseScore - 2), mcq: Math.min(30, 27 + (rollInt % 3)), practical: '-' },
    { code: '136', name: 'পদার্থবিজ্ঞান / সাধারণ বিজ্ঞান', fullMarks: 100, written: Math.min(50, baseScore - 10), mcq: Math.min(25, 23), practical: 24 },
    { code: '137', name: 'রসায়ন / বাংলাদেশ ও বৈশ্বিক অধ্যয়ন', fullMarks: 100, written: Math.min(50, baseScore - 11), mcq: Math.min(25, 22), practical: 23 },
    { code: '138', name: 'জীববিজ্ঞান / ব্যবসায় সংগঠন / ভূগোল', fullMarks: 100, written: Math.min(50, baseScore - 9), mcq: Math.min(25, 24), practical: 25 },
    { code: '154', name: 'তথ্য ও যোগাযোগ প্রযুক্তি (আইসিটি)', fullMarks: 50, written: 23, mcq: 22, practical: 25 },
    { code: '111', name: 'ইসলাম ও নৈতিক শিক্ষা / হিন্দু ধর্ম', fullMarks: 100, written: Math.min(70, baseScore - 3), mcq: Math.min(30, 28), practical: '-' },
  ]
  const subjectsEn = [
    { code: '101', name: 'Bangla (1st & 2nd Paper)', fullMarks: 100, written: Math.min(70, baseScore - 4), mcq: Math.min(30, 26 + (rollInt % 4)), practical: '-' },
    { code: '107', name: 'English (1st & 2nd Paper)', fullMarks: 100, written: Math.min(100, baseScore + (rollInt % 3)), mcq: '-', practical: '-' },
    { code: '109', name: 'Mathematics', fullMarks: 100, written: Math.min(70, baseScore - 2), mcq: Math.min(30, 27 + (rollInt % 3)), practical: '-' },
    { code: '136', name: 'Physics / General Science', fullMarks: 100, written: Math.min(50, baseScore - 10), mcq: Math.min(25, 23), practical: 24 },
    { code: '137', name: 'Chemistry / Bangladesh & Global Studies', fullMarks: 100, written: Math.min(50, baseScore - 11), mcq: Math.min(25, 22), practical: 23 },
    { code: '138', name: 'Biology / Business Org / Geography', fullMarks: 100, written: Math.min(50, baseScore - 9), mcq: Math.min(25, 24), practical: 25 },
    { code: '154', name: 'Information & Communication Tech (ICT)', fullMarks: 50, written: 23, mcq: 22, practical: 25 },
    { code: '111', name: 'Islam & Moral Education / Hindu Religion', fullMarks: 100, written: Math.min(70, baseScore - 3), mcq: Math.min(30, 28), practical: '-' },
  ]

  const subjects = lang === 'bn' ? subjectsBn : subjectsEn

  let totalObtained = 0
  let totalMax = 0
  const evaluatedSubjects = subjects.map((sub) => {
    let obtained = 0
    if (sub.practical === '-') {
      obtained = Number(sub.written || 0) + Number(sub.mcq || 0)
    } else {
      obtained = Number(sub.written || 0) + Number(sub.mcq || 0) + Number(sub.practical || 0)
    }
    totalObtained += obtained
    totalMax += sub.fullMarks

    const pct = (obtained / sub.fullMarks) * 100
    let grade = 'A+'
    let gp = 5.0
    if (pct < 33) { grade = 'F'; gp = 0.0 }
    else if (pct < 40) { grade = 'D'; gp = 1.0 }
    else if (pct < 50) { grade = 'C'; gp = 2.0 }
    else if (pct < 60) { grade = 'B'; gp = 3.0 }
    else if (pct < 70) { grade = 'A-'; gp = 3.5 }
    else if (pct < 80) { grade = 'A'; gp = 4.0 }

    return { ...sub, obtained, grade, gp: gp.toFixed(1) }
  })

  const avgGp = evaluatedSubjects.reduce((acc, curr) => acc + parseFloat(curr.gp), 0) / evaluatedSubjects.length
  const finalGpa = isTop3 ? '5.00' : Math.min(5.0, avgGp).toFixed(2)
  let overallGrade = 'A+'
  if (parseFloat(finalGpa) < 2.0) overallGrade = 'D'
  else if (parseFloat(finalGpa) < 3.0) overallGrade = 'C'
  else if (parseFloat(finalGpa) < 3.5) overallGrade = 'B'
  else if (parseFloat(finalGpa) < 4.0) overallGrade = 'A-'
  else if (parseFloat(finalGpa) < 5.0) overallGrade = 'A'

  return {
    studentName,
    fatherName: lang === 'bn' ? 'মো. দেলোয়ার হোসেন' : 'Md. Delowar Hossain',
    motherName: lang === 'bn' ? 'বেগম রোকেয়া' : 'Begum Rokeya',
    roll: rollNum,
    regNo: `2024${String(rollInt).padStart(4, '0')}`,
    className,
    section: rollInt % 2 === 0
      ? (lang === 'bn' ? 'বি শাখা (গোলাপ)' : 'Section B (Golap)')
      : (lang === 'bn' ? 'ক শাখা (শাপলা)' : 'Section A (Shapla)'),
    session: lang === 'bn' ? '২০২৬-২০২৭' : '2026-2027',
    examName: examName || (lang === 'bn' ? 'অর্ধ-বার্ষিক পরীক্ষা ২০২৬' : 'Half-Yearly Exam 2026'),
    institute: lang === 'bn' ? 'মিরাশানী একাডেমি (উচ্চ বিদ্যালয়)' : 'Mirashani Academy (General High School)',
    instituteCode: 'MA-108420',
    totalObtained,
    totalMax,
    gpa: finalGpa,
    grade: overallGrade,
    meritPosition: rollInt,
    remarks: isTop3
      ? (lang === 'bn' ? 'অসাধারণ ও উজ্জ্বল ফলাফল (গোল্ডেন এ+)' : 'Outstanding & Brilliant Result (Golden A+)')
      : (lang === 'bn' ? 'কৃতিত্বের সাথে উত্তীর্ণ' : 'Passed with Credit'),
    photo: matchedStudent ? matchedStudent.photo : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    subjects: evaluatedSubjects,
  }
}

export const events = {
  bn: [
    {
      id: 1,
      d: '১০ অক্টো ২০২৬',
      dateBadge: 'অক্টো ১০',
      t: 'অর্ধ-বার্ষিক পরীক্ষা শুরু',
      desc: '৬ষ্ঠ থেকে ১০ম শ্রেণির বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগের নিয়মিত লিখিত ও ব্যবহারিক পরীক্ষা।',
      time: 'সকাল ৯:০০ - দুপুর ১২:৩০',
      location: 'প্রধান একাডেমিক ভবন ও পরীক্ষা হল',
      category: 'পরীক্ষা',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      status: 'আসন্ন',
    },
    {
      id: 2,
      d: '২৬ অক্টো ২০২৬',
      dateBadge: 'অক্টো ২৬',
      t: 'বার্ষিক বিজ্ঞান মেলা ও গণিত অলিম্পিয়াড',
      desc: 'শিক্ষার্থীদের বৈজ্ঞানিক প্রদর্শনী, কার্যকরী পদার্থবিজ্ঞান মডেল, রসায়ন বিস্ময় ও জীববিজ্ঞান নমুনা।',
      time: 'সকাল ১০:০০ - বিকাল ৪:০০',
      location: 'স্কুল অডিটোরিয়াম ও খোলা মাঠ',
      category: 'বিজ্ঞান',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      status: 'নিবন্ধন চলছে',
    },
    {
      id: 3,
      d: '১৬ ডিসে ২০২৬',
      dateBadge: 'ডিসে ১৬',
      t: 'মহান বিজয় দিবসের সাংস্কৃতিক উৎসব',
      desc: 'জাতীয় পতাকা উত্তোলন, দেশাত্মবোধক সংগীত, ঐতিহাসিক নাটক, কবিতা আবৃত্তি ও মুক্তিযোদ্ধা সংবর্ধনা।',
      time: 'সকাল ৮:০০ - দুপুর ১:০০',
      location: 'শহীদ মিনার প্রাঙ্গণ ও মঞ্চ',
      category: 'সাংস্কৃতিক',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      status: 'আসন্ন',
    },
    {
      id: 4,
      d: '২০ ডিসে ২০২৬',
      dateBadge: 'ডিসে ২০',
      t: 'বার্ষিক ক্রীড়া দিবস ও অ্যাথলেটিক্স টুর্নামেন্ট',
      desc: 'আন্তঃহাউস ১০০ মিটার স্প্রিন্ট, ৪x১০০ মিটার রিলে, হাই জাম্প, ফুটবল ফাইনাল ও পুরস্কার বিতরণ।',
      time: 'সকাল ৯:০০ - বিকাল ৫:০০',
      location: 'মিরাশানী কেন্দ্রীয় স্টেডিয়াম মাঠ',
      category: 'ক্রীড়া',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      status: 'আসন্ন',
    },
    {
      id: 5,
      d: '১৫ জানু ২০২৭',
      dateBadge: 'জানু ১৫',
      t: 'বার্ষিক পুরস্কার বিতরণী ও বৃত্তি গালা',
      desc: 'প্রতিটি শ্রেণির শীর্ষ স্থানধারী ও এসএসসি জিপিএ-৫ প্রাপ্তদের ক্রেস্ট, স্বর্ণপদক ও ট্যালেন্টপুল সার্টিফিকেট প্রদান।',
      time: 'সকাল ১১:০০ - বিকাল ৩:০০',
      location: 'স্কুলের প্রধান অডিটোরিয়াম',
      category: 'পুরস্কার',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
      status: 'আসন্ন',
    },
  ],
  en: [
    {
      id: 1,
      d: '10 Oct 2026',
      dateBadge: 'OCT 10',
      t: 'Half-Yearly Examination Commences',
      desc: 'Regular written and practical examinations for Classes Six through Ten across Science, Business Studies and Humanities groups.',
      time: '9:00 AM - 12:30 PM',
      location: 'Main Academic Building & Examination Halls',
      category: 'Examination',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
      status: 'Upcoming',
    },
    {
      id: 2,
      d: '26 Oct 2026',
      dateBadge: 'OCT 26',
      t: 'Annual Science Fair & Math Olympiad',
      desc: 'Student scientific displays, working physics models, chemistry wonders, biology specimens, and Rubik cube contests.',
      time: '10:00 AM - 4:00 PM',
      location: 'School Auditorium & Open Field',
      category: 'Science',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      status: 'Registration Open',
    },
    {
      id: 3,
      d: '16 Dec 2026',
      dateBadge: 'DEC 16',
      t: 'Great Victory Day Cultural Festivities',
      desc: 'National anthem flag hoisting, patriotic choir performance, historical drama, reciting poetry, and freedom fighter felicitation.',
      time: '8:00 AM - 1:00 PM',
      location: 'Shaheed Minar Premises & Stage',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      status: 'Upcoming',
    },
    {
      id: 4,
      d: '20 Dec 2026',
      dateBadge: 'DEC 20',
      t: 'Annual Sports Day & Athletics Tournament',
      desc: 'Inter-house 100m sprint, 4x100m relay races, high jump, long jump, football final match, and grand prize distribution.',
      time: '9:00 AM - 5:00 PM',
      location: 'Mirashani Central Stadium Ground',
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
      status: 'Upcoming',
    },
    {
      id: 5,
      d: '15 Jan 2027',
      dateBadge: 'JAN 15',
      t: 'Annual Prize Giving & Scholarship Gala',
      desc: 'Awarding academic crests, gold medals, and talentpool certificates to top rankers of every class and SSC GPA-5 holders.',
      time: '11:00 AM - 3:00 PM',
      location: 'School Main Auditorium',
      category: 'Awards',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
      status: 'Upcoming',
    },
  ],
}

export const gallery = {
  bn: [
    { label: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', category: 'ক্রীড়া', src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', caption: 'আন্তঃহাউস ১০০ মিটার রিলে স্প্রিন্ট ও ক্রীড়া চ্যাম্পিয়নশিপ' },
    { label: 'বিজ্ঞান ও এসটিইএম প্রদর্শনী', category: 'বিজ্ঞান', src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', caption: 'শিক্ষার্থীরা পদার্থবিজ্ঞান মডেল ও রসায়ন পরীক্ষা প্রদর্শন করছে' },
    { label: 'ডিজিটাল কম্পিউটার ও আইসিটি ল্যাব', category: 'একাডেমিক', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', caption: 'মাল্টিমিডিয়া স্মার্ট ক্লাসরুম ও আইসিটি ডিজিটাল সাক্ষরতা' },
    { label: 'কেন্দ্রীয় পাঠাগার পাঠকক্ষ', category: 'ক্যাম্পাস', src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80', caption: '১০,০০০+ পাঠ্যক্রম ও সাহিত্য বই সহ প্রশস্ত পাঠকক্ষ' },
    { label: 'সাংস্কৃতিক দিবস উদযাপন', category: 'সাংস্কৃতিক', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', caption: 'ঐতিহ্যবাহী লোকসংগীত, নাটক ও দেশাত্মবোধক আবৃত্তি' },
    { label: 'পদক ও পুরস্কার বিতরণ', category: 'পুরস্কার', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', caption: 'গোল্ডেন এ+ প্রাপ্তি ও বৃত্তি ধারকদের সম্মাননা' },
    { label: 'প্রাত্যহিক বিদ্যালয় সমাবেশ', category: 'ক্যাম্পাস', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', caption: 'সকালের জাতীয় সংগীত, বিদ্যালয় শপথ ও শারীরিক কসরত' },
    { label: 'স্কাউট ও গার্ল গাইড ক্যাম্পফায়ার', category: 'স্কাউট', src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80', caption: 'স্কাউটিং নেতৃত্ব শিবির ও সামাজিক সেবামূলক কার্যক্রম' },
  ],
  en: [
    { label: 'Annual Sports Competition', category: 'Sports', src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80', caption: 'Inter-house 100m relay sprint and sports championship' },
    { label: 'Science & STEM Exhibition', category: 'Science', src: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', caption: 'Students demonstrating physics models and chemistry experiments' },
    { label: 'Digital Computer & ICT Lab', category: 'Academic', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80', caption: 'Multimedia smart classroom and ICT digital literacy' },
    { label: 'Central Library Reading Hall', category: 'Campus', src: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80', caption: 'Spacious study hall with 10,000+ curriculum & literature books' },
    { label: 'Cultural Day Celebrations', category: 'Cultural', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', caption: 'Traditional folk songs, drama, and patriotic recitations' },
    { label: 'Merit Medal & Prize Distribution', category: 'Awards', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', caption: 'Honoring Golden A+ achievers and scholarship holders' },
    { label: 'Morning School Assembly', category: 'Campus', src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', caption: 'Morning national anthem, school oath and physical fitness routine' },
    { label: 'Scouts & Girl Guides Campfire', category: 'Scouts', src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80', caption: 'Scouting leadership camp and community social service' },
  ],
}

export const teachers = {
  bn: [
    { n: 'জনাব মো. আব্দুল জলিল মিয়া', r: 'প্রধান শিক্ষক', dept: 'প্রশাসন', deg: 'এম.এস.সি (পদার্থবিজ্ঞান), এম.এড (১ম শ্রেণি, ঢাবি)', exp: '২২ বছরের অভিজ্ঞতা', email: 'headmaster@mirashani.edu.bd', phone: '+880 1711-234567', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', bio: 'নৈতিক শৃঙ্খলা, সাধারণ মাধ্যমিক শিক্ষায় উৎকর্ষ এবং দেশপ্রেমিক নাগরিক গঠনে নিবেদিত।' },
    { n: 'মিসেস শামসুন নাহার বেগম', r: 'সহকারী প্রধান শিক্ষিকা', dept: 'প্রশাসন', deg: 'এম.এ. ইংরেজি (ঢাবি), বি.এড (প্রথম শ্রেণি)', exp: '১৭ বছরের অভিজ্ঞতা', email: 'asst.head@mirashani.edu.bd', phone: '+880 1712-345678', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', bio: 'যোগাযোগমূলক ইংরেজি, বিতর্ক ক্লাব পরামর্শদাতা এবং মেয়েদের কল্যাণ ও নিরাপত্তায় মনোযোগী।' },
    { n: 'জনাব জাহাঙ্গীর কবির', r: 'সিনিয়র শিক্ষক, গণিত ও উচ্চতর গণিত', dept: 'বিজ্ঞান', deg: 'এম.এস.সি. প্রয়োগকৃত গণিত (চুয়েট)', exp: '১৫ বছরের অভিজ্ঞতা', email: 'math.kabir@mirashani.edu.bd', phone: '+880 1713-456789', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', bio: 'স্বজ্ঞাত ধাপে ধাপে সমস্যা সমাধানের মাধ্যমে বীজগণিত, ত্রিকোণমিতি ও জ্যামিতি আনন্দময় করে তোলেন।' },
    { n: 'ডা. নুসরাত জাহান', r: 'সিনিয়র শিক্ষিকা, পদার্থবিজ্ঞান ও রসায়ন', dept: 'বিজ্ঞান', deg: 'পিএইচডি রসায়ন, এম.এস.সি. (রাবি)', exp: '১৩ বছরের অভিজ্ঞতা', email: 'science.nusrat@mirashani.edu.bd', phone: '+880 1715-678901', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', bio: 'মাধ্যমিক বিদ্যালয়ের ল্যাবরেটরি পরীক্ষা তদারক করেন ও জাতীয় বিজ্ঞান মেলায় শিক্ষার্থীদের পরিচালনা করেন।' },
    { n: 'জনাব মাহফুজুর রহমান', r: 'সিনিয়র শিক্ষক, ব্যবসায় শিক্ষা ও হিসাববিজ্ঞান', dept: 'বাণিজ্য', deg: 'এম.কম হিসাববিজ্ঞান, বি.এড', exp: '১২ বছরের অভিজ্ঞতা', email: 'commerce.mahfuz@mirashani.edu.bd', phone: '+880 1716-789012', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: 'এসএসসি বাণিজ্যের জন্য আর্থিক হিসাবরক্ষণ, ব্যবসায় উদ্যোগ ও বাণিজ্যিক নৈতিকতা শেখান।' },
    { n: 'মিসেস ফাহমিদা ইয়াসমিন', r: 'সিনিয়র শিক্ষিকা, ইংরেজি সাহিত্য', dept: 'ভাষা', deg: 'বি.এ. (সম্মান), এম.এ. ইংরেজি (জাবি)', exp: '৮ বছরের অভিজ্ঞতা', email: 'english.fahmida@mirashani.edu.bd', phone: '+880 1718-901234', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', bio: 'সৃজনশীল লেখা, বানান প্রতিযোগিতা ও আত্মবিশ্বাসী ইংরেজি কথোপকথনের দক্ষতায় অনুপ্রেরণা দেন।' },
    { n: 'জনাব তানভীর হাসান', r: 'সিনিয়র শিক্ষক, আইসিটি ও ডিজিটাল সাক্ষরতা', dept: 'আইসিটি ও এসটিইএম', deg: 'বি.এস.সি কম্পিউটার বিজ্ঞান ও প্রকৌশল', exp: '৭ বছরের অভিজ্ঞতা', email: 'ict.tanvir@mirashani.edu.bd', phone: '+880 1714-567890', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', bio: 'মাল্টিমিডিয়া প্রেজেন্টেশন, টাচ টাইপিং, ওয়েব গবেষণার মূলনীতি ও সাইবার নিরাপত্তা শেখান।' },
    { n: 'জনাব কাজী মিজানুর রহমান', r: 'সিনিয়র শিক্ষক, বাংলাদেশ ও বৈশ্বিক অধ্যয়ন (ইতিহাস ও পৌরনীতি)', dept: 'মানবিক', deg: 'এম.এ. ইতিহাস, বি.এড (১ম শ্রেণি)', exp: '১৪ বছরের অভিজ্ঞতা', email: 'history.kazi@mirashani.edu.bd', phone: '+880 1717-890123', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', bio: 'বাংলাদেশের মুক্তিযুদ্ধের ইতিহাস, নাগরিক অধিকার, গণতান্ত্রিক মূল্যবোধ ও বৈশ্বিক ভূগোলে উৎসাহী।' },
  ],
  en: [
    { n: 'Mr. Md. Abdul Jalil Mia', r: 'Headmaster', dept: 'Administration', deg: 'M.Sc (Physics), M.Ed (1st Class, DU)', exp: '22 Years Experience', email: 'headmaster@mirashani.edu.bd', phone: '+880 1711-234567', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80', bio: 'Dedicated to moral discipline, general secondary education excellence, and nurturing patriotic citizens.' },
    { n: 'Mrs. Shamsun Nahar Begum', r: 'Assistant Headmistress', dept: 'Administration', deg: 'M.A. English (DU), B.Ed (First Class)', exp: '17 Years Experience', email: 'asst.head@mirashani.edu.bd', phone: '+880 1712-345678', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', bio: 'Focuses on communicative English, debate club mentorship, and girls\' welfare and safety.' },
    { n: 'Mr. Jahangir Kabir', r: 'Senior Teacher, Mathematics & Higher Math', dept: 'Science', deg: 'M.Sc in Applied Mathematics (CU)', exp: '15 Years Experience', email: 'math.kabir@mirashani.edu.bd', phone: '+880 1713-456789', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', bio: 'Makes algebra, trigonometry, and geometry enjoyable through intuitive step-by-step problem solving.' },
    { n: 'Dr. Nusrat Jahan', r: 'Senior Teacher, Physics & Chemistry', dept: 'Science', deg: 'Ph.D in Chemistry, M.Sc (RU)', exp: '13 Years Experience', email: 'science.nusrat@mirashani.edu.bd', phone: '+880 1715-678901', photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80', bio: 'Supervises secondary school laboratory experiments and leads students in national science fairs.' },
    { n: 'Mr. Mahfuzur Rahman', r: 'Senior Teacher, Business Studies & Accounting', dept: 'Commerce', deg: 'M.Com in Accounting, B.Ed', exp: '12 Years Experience', email: 'commerce.mahfuz@mirashani.edu.bd', phone: '+880 1716-789012', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', bio: 'Teaches financial bookkeeping, business entrepreneurship, and commercial ethics for SSC Commerce.' },
    { n: 'Mrs. Fahmida Yasmin', r: 'Senior Teacher, English Literature', dept: 'Languages', deg: 'B.A. (Hons), M.A. in English (JU)', exp: '8 Years Experience', email: 'english.fahmida@mirashani.edu.bd', phone: '+880 1718-901234', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', bio: 'Inspires creative writing, spelling tournaments, and confident English conversational fluency.' },
    { n: 'Mr. Tanvir Hasan', r: 'Senior Teacher, ICT & Digital Literacy', dept: 'ICT & STEM', deg: 'B.Sc in Computer Science & Engineering', exp: '7 Years Experience', email: 'ict.tanvir@mirashani.edu.bd', phone: '+880 1714-567890', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', bio: 'Instructs multimedia presentation, touch typing, web research basics, and cyber safety for high school.' },
    { n: 'Mr. Kazi Mizanur Rahman', r: 'Senior Teacher, Bangladesh & Global Studies (History & Civics)', dept: 'Humanities', deg: 'M.A. in History, B.Ed (1st Class)', exp: '14 Years Experience', email: 'history.kazi@mirashani.edu.bd', phone: '+880 1717-890123', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80', bio: 'Passionate about Bangladesh Liberation War history, civics, democratic values, and global geography.' },
  ],
}

export const reviews = {
  bn: [
    { n: 'মিসেস রহিমা বেগম', c: '৮ম শ্রেণির শিক্ষার্থীর অভিভাবক', s: 5, t: 'মিরাশানী একাডেমি সত্যিকারের যত্নশীল ও শৃঙ্খলাবদ্ধ সাধারণ বিদ্যালয় পরিবেশ প্রদান করে। আমার ছেলে গণিতে দুর্বল ছিল; এখন সে আত্মবিশ্বাসের সাথে গোল্ডেন এ+ পায়।', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { n: 'জনাব আব্দুল করিম', c: '১০ম শ্রেণির (বিজ্ঞান বিভাগ) শিক্ষার্থীর অভিভাবক', s: 5, t: 'বিজ্ঞান ল্যাবরেটরি ব্যবহারিক ও নিবেদিত শিক্ষকরা আমার মেয়েকে প্রাক-পরীক্ষায় ৫.০০ জিপিএ অর্জনে সাহায্য করেছে। অসাধারণ উচ্চ বিদ্যালয়।', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { n: 'মিসেস শিরিন আক্তার', c: '৬ষ্ঠ শ্রেণির শিক্ষার্থীর অভিভাবক', s: 5, t: 'সবুজ উন্মুক্ত ক্যাম্পাস, পূর্ণ আকারের খেলার মাঠ, বিশুদ্ধ পানীয় জল ও চমৎকার মহিলা শিক্ষিকা। আমার মেয়ে প্রতিদিন সকালের সমাবেশে যেতে পছন্দ করে।', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { n: 'জনাব জাহাঙ্গীর আলম', c: '৯ম শ্রেণির (বাণিজ্য) শিক্ষার্থীর অভিভাবক', s: 5, t: 'অনলাইন ফলাফল অনুসন্ধান, শিক্ষার্থী আইডি কার্ড জেনারেটর ও নোটিশ বোর্ড এটিকে অঞ্চলের সবচেয়ে আধুনিক উচ্চ বিদ্যালয়ে পরিণত করেছে।', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
  ],
  en: [
    { n: 'Mrs. Rahima Begum', c: 'Guardian of Class Eight student', s: 5, t: 'Mirashani Academy provides a truly caring, disciplined general school environment. My son used to struggle in Mathematics; now he secures Golden A+ marks with great confidence.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
    { n: 'Mr. Abdul Karim', c: 'Guardian of Class Ten student (Science Group)', s: 5, t: 'The science laboratory practicals and dedicated teachers helped my daughter achieve a 5.00 GPA in pre-test exams. Outstanding general high school with stellar discipline.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { n: 'Mrs. Shirin Akter', c: 'Guardian of Class Six student', s: 5, t: 'Green open campus, full-size playground, clean drinking water, and excellent female teachers. My daughter looks forward to attending morning assembly every day.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
    { n: 'Mr. Jahangir Alam', c: 'Guardian of Class Nine student (Commerce)', s: 5, t: 'The online result lookup, student ID card generator, and notice board make it the most modern general high school in the region. Transparent and dependable.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80' },
  ],
}

export const schoolFaqs = {
  bn: [
    { q: '৬ষ্ঠ থেকে ৯ম শ্রেণির ভর্তি প্রক্রিয়া কীভাবে কাজ করে?', a: 'ভর্তি ফরম আমাদের অনলাইন পোর্টালের মাধ্যমে জমা দেওয়া যাবে বা সরাসরি স্কুলের প্রশাসনিক কার্যালয় থেকে সংগ্রহ করা যাবে। ডিসেম্বরে বাংলা, ইংরেজি ও সাধারণ গণিতে বয়সোপযোগী লিখিত বাছাই পরীক্ষা অনুষ্ঠিত হয়।' },
    { q: '৯ম ও ১০ম শ্রেণিতে কোন কোন একাডেমিক বিভাগ আছে?', a: 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (এনসিটিবি) অনুযায়ী আমরা বিজ্ঞান, ব্যবসায় শিক্ষা ও মানবিক বিভাগ অফার করি। প্রতিটি বিভাগে বিশেষজ্ঞ শিক্ষক ও ল্যাবরেটরি সেশন রয়েছে।' },
    { q: 'বিদ্যালয়ের দৈনিক সময়সূচি কেমন?', a: 'রবিবার থেকে বৃহস্পতিবার সকাল ৮:৩০ থেকে বিকাল ৩:০০ পর্যন্ত নিয়মিত ক্লাস হয়। সকাল ৮:৩০টায় জাতীয় সংগীত, বিদ্যালয় শপথ ও শারীরিক কসরত দিয়ে প্রাত্যহিক সমাবেশ শুরু হয়। শুক্র ও শনিবার সাপ্তাহিক ছুটি।' },
    { q: 'অভিভাবকরা কীভাবে শিক্ষার্থীর নম্বর ট্র্যাক করতে পারেন?', a: 'অভিভাবকরা ওয়েবসাইটের দ্রুত ফলাফল অনুসন্ধান ব্যবহার করে তাৎক্ষণিকভাবে টার্ম পরীক্ষার নম্বরপত্র ও মেধা অবস্থান দেখতে পারবেন। এছাড়া টার্ম রিপোর্ট কার্ড ও অভিভাবক-শিক্ষক সমাবেশ নিয়মিত আয়োজন করা হয়।' },
    { q: 'মেধা বৃত্তি বা বেতন মওকুফ পাওয়া যায়?', a: 'হ্যাঁ, মিরাশানী একাডেমি প্রতিটি শ্রেণির শীর্ষ স্থানধারী, বোর্ড পরীক্ষায় গোল্ডেন জিপিএ ৫.০০ প্রাপ্ত শিক্ষার্থী ও অসচ্ছল মেধাবী শিক্ষার্থীদের জন্য পূর্ণ ও আংশিক বেতন মওকুফ এবং বৃত্তি সহায়তা প্রদান করে।' },
  ],
  en: [
    { q: 'How does the admission process work for Classes 6 to 9?', a: 'Admission forms can be submitted online through our Online Admission Portal or collected directly from the school administrative office. An age-appropriate written screening test in Bangla, English, and General Mathematics is held in December.' },
    { q: 'What academic groups are available in Class 9 and 10?', a: 'Under the National Curriculum and Textbook Board (NCTB), we offer Science (বিজ্ঞান), Business Studies (ব্যবসায় শিক্ষা), and Humanities (মানবিক) groups with specialized subject teachers and laboratory sessions.' },
    { q: 'What is the daily school schedule?', a: 'Regular school runs from Sunday to Thursday, 8:30 AM to 3:00 PM. Morning Assembly begins promptly at 8:30 AM with the national anthem, school oath, and physical exercise. Friday and Saturday are weekly holidays.' },
    { q: 'How can guardians track student marks and attendance?', a: 'Guardians can access term examination marksheets and merit position instantly using the Fast Result Finder on the school website. In addition, term report cards and parent-teacher assemblies are arranged regularly.' },
    { q: 'Are there merit scholarships or tuition waivers available?', a: 'Yes, Mirashani Academy offers full and partial tuition waivers to top rankers of each class, Golden GPA 5.00 scorers in board examinations, and stipend support for deserving underprivileged students.' },
  ],
}

export const teachWords = {
  bn: ['বিজ্ঞান ও আবিষ্কার', 'গণিত ও যুক্তি', 'সাহিত্য ও ভাষা', 'নৈতিক নেতৃত্ব', 'ক্রীড়া ও চরিত্র'],
  en: ['Science & Discovery', 'Mathematics & Logic', 'Literature & Language', 'Moral Leadership', 'Sports & Character'],
}

export const heroStats = {
  bn: [
    { icon: '🎓', label: 'অধ্যয়নরত শিক্ষার্থী', value: '১,৮৫০+' },
    { icon: '👩‍🏫', label: 'অভিজ্ঞ শিক্ষক-শিক্ষিকা', value: '৫৪' },
    { icon: '🏆', label: 'এসএসসি পাসের হার', value: '৯৯.৪%' },
    { icon: '🏫', label: 'শিক্ষায় সাফল্যের ইতিহাস', value: '২১ বছর' },
  ],
  en: [
    { icon: '🎓', label: 'Enrolled Students', value: '1,850+' },
    { icon: '👩‍🏫', label: 'Dedicated Teachers', value: '54' },
    { icon: '🏆', label: 'SSC Pass Rate', value: '99.4%' },
    { icon: '🏫', label: 'Academic Heritage', value: '21 Yrs' },
  ],
}

export const contact = {
  address: 'Mirashani Academy (General High School), College Road, Upazila Sadar, Brahmanbaria, Bangladesh',
  phone: '+880 1711-000000',
  altPhone: '+880 1811-000000',
  email: 'info@mirashaniacademy.edu.bd',
  admissionEmail: 'admission@mirashaniacademy.edu.bd',
  hours: 'Sunday to Thursday: 8:00 AM - 4:00 PM (Office open)',
  emergency: '+880 1911-000000 (Helpline 24/7)',
}

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/notices', label: 'Notices' },
  { href: '/results', label: 'Results' },
  { href: '/toppers', label: 'Top 10' },
  { href: '/academics', label: 'Academics' },
  { href: '/events', label: 'Events' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/admission', label: 'Admission' },
  { href: '/contact', label: 'Contact' },
  { href: '/student-dashboard', label: 'Student Portal', highlight: true },
]

// Homepage news ticker (editable from Dashboard → Website CMS → Homepage)
export const tickerItems = {
  bn: [
    'অর্ধবার্ষিক পরীক্ষা ২০২৬ এর রুটিন ও প্রবেশপত্র বিতরণ সংক্রান্ত বিজ্ঞপ্তি',
    '২০২৭ শিক্ষাবর্ষে ৬ষ্ঠ থেকে ৯ম শ্রেণিতে অনলাইন ও অফলাইন ভর্তি কার্যক্রম শুরু',
    'বার্ষিক বিজ্ঞান মেলা ও আন্তঃক্লাস গণিত অলিম্পিয়াডের নিবন্ধন চলছে',
    '১০ম শ্রেণির এসএসসি মডেল টেস্ট পরীক্ষার ফলাফল অনলাইন পোর্টালে প্রকাশিত',
    'বাংলাদেশ স্কাউটস ও গার্ল গাইডস বার্ষিক ক্যাম্পফায়ার ও প্রশিক্ষণ ক্যাম্প অনুষ্ঠিত হতে যাচ্ছে',
  ],
  en: [
    'Half-Yearly Examination 2026 Routine & Admit Card Notice Published',
    'Admission Circular for Session 2027 (Classes 6 to 9 Science, Business Studies & Humanities)',
    'Annual Science Fair & Math Olympiad Registration Currently Open',
    'Class Ten Pre-Test / Model Test Results Published on Online Portal',
    'Bangladesh Scout & Girl Guide Annual Campfire & Regional Training Camp',
  ],
}

// Dashboard (Website CMS) can override any of these. Must stay at the end of the file.
registerSiteContent({
  slideImages,
  notices,
  events,
  gallery,
  teachers,
  reviews,
  schoolFaqs,
  teachWords,
  heroStats,
  academicGroups,
  schoolClubs,
  schoolFacilities,
  dailyRoutineSchedule,
  exams,
  resultFiles,
  toppers,
  contact,
  tickerItems,
})
