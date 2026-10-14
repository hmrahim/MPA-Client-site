// Shared exam / fee helpers used by the admin dashboard and the student portal.

/* ─── Exam / marksheet helpers ───────────────────────────────── */
export const EXAMS = [
  { name: 'First Term Assessment 2026', short: 'First Term', date: 'Mar 2026', published: true, shift: -4 },
  { name: 'Half-Yearly Examination 2026', short: 'Half-Yearly', date: 'Jun 2026', published: true, shift: 0 },
  { name: 'Pre-Test Examination 2026', short: 'Pre-Test', date: 'Oct 2026', published: false, shift: 3 },
  { name: 'Annual Examination 2026', short: 'Annual', date: 'Dec 2026', published: false, shift: 5 }
]

export const gradeOf = (marks, full = 100) => {
  const pct = (marks / full) * 100
  if (pct >= 80) return { grade: 'A+', gpa: 5.0 }
  if (pct >= 70) return { grade: 'A', gpa: 4.0 }
  if (pct >= 60) return { grade: 'A-', gpa: 3.5 }
  if (pct >= 50) return { grade: 'B', gpa: 3.0 }
  if (pct >= 40) return { grade: 'C', gpa: 2.0 }
  if (pct >= 33) return { grade: 'D', gpa: 1.0 }
  return { grade: 'F', gpa: 0.0 }
}
const fullMarksOf = (sub) => (sub.code === '154' ? 50 : 100)
const hashStr = (str) => [...String(str)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

// Subject list for a student (used when no stored result exists for an exam).
const baseSubjects = (st) => {
  const base = parseFloat(st.gpa) || 4.5
  const lvl = Math.min(1, Math.max(0, (base - 3.5) / 1.5)) // 0..1
  const w = (max) => Math.round(max * (0.62 + 0.36 * lvl))
  const science = ['9', '10'].some((n) => st.className === `Class ${n}`)
  const list = [
    { code: '101', name: 'Bangla 1st Paper', w: 70, m: 30 },
    { code: '102', name: 'Bangla 2nd Paper', w: 70, m: 30 },
    { code: '107', name: 'English 1st Paper', w: 100, m: 0 },
    { code: '108', name: 'English 2nd Paper', w: 100, m: 0 },
    { code: '109', name: 'General Mathematics', w: 70, m: 30 },
    { code: '136', name: science ? 'Science / Business Studies' : 'General Science', w: 50, m: 25, p: 25 },
    { code: '154', name: 'ICT (Digital Tech)', w: 0, m: 25, p: 25 }
  ]
  return list.map((x) => ({ code: x.code, name: x.name, written: w(x.w), mcq: w(x.m), practical: x.p ? w(x.p) : 0 }))
}

const withTotals = (subs) => {
  const subjects = subs.map((sub) => {
    const total = (sub.written || 0) + (sub.mcq || 0) + (sub.practical || 0)
    const g = gradeOf(total, fullMarksOf(sub))
    return { ...sub, total, full: fullMarksOf(sub), grade: g.grade, gpa: g.gpa }
  })
  const failed = subjects.some((x) => x.grade === 'F')
  const gpa = failed ? 0 : subjects.reduce((a, x) => a + x.gpa, 0) / subjects.length
  const totalMarks = subjects.reduce((a, x) => a + x.total, 0)
  const fullTotal = subjects.reduce((a, x) => a + x.full, 0)
  return {
    subjects,
    totalMarks,
    fullTotal,
    percentage: Math.round((totalMarks / fullTotal) * 1000) / 10,
    gpa: gpa.toFixed(2),
    grade: failed ? 'F' : gpa >= 5 ? 'A+' : gpa >= 4 ? 'A' : gpa >= 3.5 ? 'A-' : gpa >= 3 ? 'B' : gpa >= 2 ? 'C' : 'D',
    passed: !failed
  }
}

// Marks for one student in one exam (deterministic per student + exam).
const generateMarks = (st, exam) => {
  const subs = baseSubjects(st).map((sub) => {
    const h = hashStr(`${st.id}|${exam.name}|${sub.code}`)
    const d = (h % 9) - 4 + exam.shift // small, stable variation
    return { ...sub, written: Math.max(0, sub.written ? sub.written + d : 0), mcq: sub.mcq ? Math.max(0, Math.min(sub.code === '154' ? 25 : 30, sub.mcq + (d > 0 ? 1 : -1))) : 0 }
  })
  return withTotals(subs)
}

const enrichStored = (r) => {
  const subjects = (r.subjects || []).map((sub) => ({ ...sub, full: sub.full || fullMarksOf(sub), gpa: Number(sub.gpa) || 0 }))
  const fullTotal = subjects.reduce((a, x) => a + x.full, 0)
  const totalMarks = r.totalMarks ?? subjects.reduce((a, x) => a + x.total, 0)
  return {
    ...r,
    subjects,
    fullTotal,
    totalMarks,
    percentage: fullTotal ? Math.round((totalMarks / fullTotal) * 1000) / 10 : 0,
    passed: !subjects.some((x) => x.grade === 'F')
  }
}

export const gradeColor = (g) =>
  g === 'A+' ? 'text-emerald-400' : g === 'A' ? 'text-sky-400' : g === 'F' ? 'text-rose-400' : 'text-amber-400'
export const barColor = (pct) =>
  pct >= 80 ? 'bg-emerald-500' : pct >= 70 ? 'bg-sky-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'


/** One entry per exam: stored result if present, else generated from the student's profile. */
export function buildExamResults(student, students, examResults) {
  return EXAMS.map((exam) => {
    const stored = examResults.find(
      (r) =>
        r.exam === exam.name &&
        (r.studentId === student.id || (r.roll === student.roll && r.class === student.className && r.section === student.section))
    )
    const published = exam.published || !!stored
    if (!published) return { exam, published: false }

    const core = stored ? enrichStored(stored) : generateMarks(student, exam)
    const mates = students.filter((x) => x.classId === student.classId && x.section === student.section)
    let rank = stored?.meritPosition
    if (!rank) {
      const higher = mates.filter((x) => x.id !== student.id && generateMarks(x, exam).totalMarks > core.totalMarks).length
      rank = higher + 1
    }
    const result = {
      studentId: student.id,
      studentName: student.name,
      roll: student.roll,
      class: student.className,
      section: student.section,
      remarks:
        stored?.remarks ||
        (core.passed
          ? parseFloat(core.gpa) >= 4.5
            ? 'Outstanding academic performance. Keep up the excellent work.'
            : 'Good progress. Consistent revision will lift the results further.'
          : 'Needs additional support in failed subjects. Guardian meeting recommended.'),
      ...core,
      exam: exam.name,
      meritPosition: rank,
      classSize: mates.length,
      isStored: !!stored
    }
    return { exam, published: true, result }
  })
}

export const MONTHLY_TUITION = 1200
const FEE_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October']

/** Monthly tuition ledger (Jan–Oct 2026). Pending amount comes from student.feeDue, latest months first. */
export function buildFeeLedger(student) {
  let remaining = student.feeDue || 0
  const rows = FEE_MONTHS.map((m, idx) => ({ name: `${m} 2026`, short: m.slice(0, 3), fee: MONTHLY_TUITION, idx }))
  // assign pending from the latest month backwards
  for (let i = rows.length - 1; i >= 0; i--) {
    const due = Math.min(remaining, MONTHLY_TUITION)
    rows[i].amountDue = due
    rows[i].status = due === 0 ? 'Paid' : due === MONTHLY_TUITION ? 'Due' : 'Partial'
    remaining -= due
  }
  const billed = rows.reduce((a, r) => a + r.fee, 0)
  const pending = student.feeDue || 0
  return { rows, billed, pending, paid: Math.max(0, billed - pending) }
}
