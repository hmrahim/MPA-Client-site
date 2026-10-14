import { createContext, useContext, useState, useEffect } from 'react'
import {
  initialSchoolInfo,
  classesList,
  initialStudents,
  initialTeachers,
  initialAttendanceStore,
  initialFeesTransactions,
  initialWeeklyRoutine,
  initialExamResults,
  initialBooks,
  initialBorrowings,
  initialTransportRoutes,
  initialHostelRooms,
  initialSmsLogs,
  initialExpenses
} from '../data/mockData'

const DashboardContext = createContext()

const STORAGE_KEYS = {
  STUDENTS: 'mpa_erp_v3_students',
  TEACHERS: 'mpa_erp_v2_teachers',
  // New multi-date attendance store: { "date__classId__section": { records: {studentId: status} } }
  ATTENDANCE_V3: 'mpa_erp_v3_attendance',
  ATT_CLASSES: 'mpa_erp_v3_att_classes',
  TRANSACTIONS: 'mpa_erp_v2_transactions',
  EXPENSES: 'mpa_erp_v2_expenses',
  BOOKS: 'mpa_erp_v2_books',
  BORROWINGS: 'mpa_erp_v2_borrowings',
  EXAM_RESULTS: 'mpa_erp_v2_exam_results',
  ROUTINE: 'mpa_erp_v2_routine',
  SMS_LOGS: 'mpa_erp_v2_sms_logs',
  SCHOOL_INFO: 'mpa_erp_v2_school_info'
}

// Default dynamic classes (teacher can add/remove classes & sections)
const initialAttendanceClasses = [
  { id: 'ac6',  name: 'Class 6',  sections: ['A', 'B'] },
  { id: 'ac7',  name: 'Class 7',  sections: ['A', 'B'] },
  { id: 'ac8',  name: 'Class 8',  sections: ['A', 'B'] },
  { id: 'ac9',  name: 'Class 9',  sections: ['Science', 'Business', 'Humanities'] },
  { id: 'ac10', name: 'Class 10', sections: ['Science', 'Business', 'Humanities'] },
]

function loadStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch (err) {
    console.warn('Storage read failed', err)
    return fallback
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.warn('Storage write failed', err)
  }
}

export function DashboardProvider({ children }) {
  const [schoolInfo, setSchoolInfo] = useState(() => loadStorage(STORAGE_KEYS.SCHOOL_INFO, initialSchoolInfo))
  const [classes] = useState(classesList)
  const [students, setStudents] = useState(() => {
    const loaded = loadStorage(STORAGE_KEYS.STUDENTS, initialStudents)
    if (!Array.isArray(loaded) || loaded.length < 30) return initialStudents
    return loaded
  })
  const [teachers, setTeachers] = useState(() => loadStorage(STORAGE_KEYS.TEACHERS, initialTeachers))
  // attendanceStore: { "YYYY-MM-DD__classId__section": { records: { studentId: 'present'|'absent'|'late'|'leave' } } }
  const [attendanceStore, setAttendanceStore] = useState(() => {
    const loaded = loadStorage(STORAGE_KEYS.ATTENDANCE_V3, initialAttendanceStore)
    if (!loaded || Object.keys(loaded).length < 50) return initialAttendanceStore
    return loaded
  })
  // Dynamic class & section list for attendance
  const [attendanceClasses, setAttendanceClasses] = useState(() => loadStorage(STORAGE_KEYS.ATT_CLASSES, initialAttendanceClasses))
  const [feeTransactions, setFeeTransactions] = useState(() => loadStorage(STORAGE_KEYS.TRANSACTIONS, initialFeesTransactions))
  const [expenses, setExpenses] = useState(() => loadStorage(STORAGE_KEYS.EXPENSES, initialExpenses))
  const [books, setBooks] = useState(() => loadStorage(STORAGE_KEYS.BOOKS, initialBooks))
  const [borrowings, setBorrowings] = useState(() => loadStorage(STORAGE_KEYS.BORROWINGS, initialBorrowings))
  const [examResults, setExamResults] = useState(() => loadStorage(STORAGE_KEYS.EXAM_RESULTS, initialExamResults))
  const [weeklyRoutine, setWeeklyRoutine] = useState(() => loadStorage(STORAGE_KEYS.ROUTINE, initialWeeklyRoutine))
  const [smsLogs, setSmsLogs] = useState(() => loadStorage(STORAGE_KEYS.SMS_LOGS, initialSmsLogs))
  const [transportRoutes] = useState(initialTransportRoutes)
  const [hostelRooms] = useState(initialHostelRooms)

  // System States
  const [activeRole, setActiveRole] = useState('admin') // 'admin' | 'teacher' | 'accountant' | 'librarian'
  const [globalSearch, setGlobalSearch] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Fee Due Notice Sent', desc: 'SMS reminders sent to 15 students in Class 10', time: '10 mins ago', unread: true },
    { id: 2, title: 'Daily Attendance Complete', desc: 'Overall attendance is 95.4% today', time: '1 hour ago', unread: true },
    { id: 3, title: 'New Library Acquisitions', desc: '12 new Olympiad mathematics books added', time: 'Yesterday', unread: false }
  ])

  // Modals for printing & viewing
  const [currentReceipt, setCurrentReceipt] = useState(null)
  const [currentStudentForId, setCurrentStudentForId] = useState(null)
  const [currentReportCard, setCurrentReportCard] = useState(null)
  const [currentTcStudent, setCurrentTcStudent] = useState(null)

  // Sync to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.STUDENTS, students), [students])
  useEffect(() => saveStorage(STORAGE_KEYS.TEACHERS, teachers), [teachers])
  useEffect(() => saveStorage(STORAGE_KEYS.ATTENDANCE_V3, attendanceStore), [attendanceStore])
  useEffect(() => saveStorage(STORAGE_KEYS.ATT_CLASSES, attendanceClasses), [attendanceClasses])
  useEffect(() => saveStorage(STORAGE_KEYS.TRANSACTIONS, feeTransactions), [feeTransactions])
  useEffect(() => saveStorage(STORAGE_KEYS.EXPENSES, expenses), [expenses])
  useEffect(() => saveStorage(STORAGE_KEYS.BOOKS, books), [books])
  useEffect(() => saveStorage(STORAGE_KEYS.BORROWINGS, borrowings), [borrowings])
  useEffect(() => saveStorage(STORAGE_KEYS.EXAM_RESULTS, examResults), [examResults])
  useEffect(() => saveStorage(STORAGE_KEYS.ROUTINE, weeklyRoutine), [weeklyRoutine])
  useEffect(() => saveStorage(STORAGE_KEYS.SMS_LOGS, smsLogs), [smsLogs])
  useEffect(() => saveStorage(STORAGE_KEYS.SCHOOL_INFO, schoolInfo), [schoolInfo])

  // Action methods
  const addStudent = (newStudent) => {
    const student = {
      ...newStudent,
      id: `STU-${1000 + students.length + 1}`,
      attendanceRate: 100,
      feeDue: 0,
      status: 'Active',
      avatar: newStudent.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    }
    setStudents((prev) => [student, ...prev])
    return student
  }

  const updateStudent = (id, updatedFields) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s)))
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  const addTeacher = (teacher) => {
    const newTch = {
      ...teacher,
      id: `TCH-${String(teachers.length + 1).padStart(2, '0')}`,
      status: 'Present',
      avatar: teacher.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    }
    setTeachers((prev) => [...prev, newTch])
    return newTch
  }

  // ── Attendance Actions ─────────────────────────────────────────
  /** Build a unique key from date + classId + section */
  const attKey = (date, classId, section) => `${date}__${classId}__${section}`

  /** Get records for a specific date / class / section */
  const getAttendanceForDate = (date, classId, section) => {
    return attendanceStore[attKey(date, classId, section)]?.records || {}
  }

  /** Mark a single student's status for the active date/class/section */
  const markStudentAttendance = (date, classId, section, studentId, status) => {
    const key = attKey(date, classId, section)
    setAttendanceStore((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        records: {
          ...(prev[key]?.records || {}),
          [studentId]: status
        }
      }
    }))
  }

  /** Mark all students in a list for a date/class/section */
  const markAllStudentAttendance = (date, classId, section, studentIds, status) => {
    const key = attKey(date, classId, section)
    setAttendanceStore((prev) => {
      const nextRecords = { ...(prev[key]?.records || {}) }
      studentIds.forEach((id) => { nextRecords[id] = status })
      return { ...prev, [key]: { ...prev[key], records: nextRecords } }
    })
  }

  /**
   * Get monthly attendance summary for a student.
   * Returns array of { date, status } for the given YYYY-MM, classId, section.
   */
  const getMonthlyAttendanceSummary = (yearMonth, classId, section, studentId) => {
    // yearMonth = 'YYYY-MM'
    const days = []
    Object.entries(attendanceStore).forEach(([key, val]) => {
      const [d, cId, sec] = key.split('__')
      if (d.startsWith(yearMonth) && cId === classId && sec === section) {
        const status = val.records?.[studentId]
        if (status) days.push({ date: d, status })
      }
    })
    return days.sort((a, b) => a.date.localeCompare(b.date))
  }

  /**
   * Get daily class attendance percentage for a given date/class/section
   * against the students list.
   */
  const getDailyAttendancePercent = (date, classId, section, studentsInClass) => {
    const records = getAttendanceForDate(date, classId, section)
    if (!studentsInClass.length) return 0
    const present = studentsInClass.filter((s) => (records[s.id] || 'present') === 'present').length
    return Math.round((present / studentsInClass.length) * 100)
  }

  // ── Attendance Class/Section Management ───────────────────────
  const addClass = (name) => {
    const id = `ac${Date.now()}`
    const newClass = { id, name, sections: ['A'] }
    setAttendanceClasses((prev) => [...prev, newClass])
    return newClass
  }

  const deleteClass = (classId) => {
    setAttendanceClasses((prev) => prev.filter((c) => c.id !== classId))
  }

  const addSection = (classId, sectionName) => {
    setAttendanceClasses((prev) =>
      prev.map((c) =>
        c.id === classId && !c.sections.includes(sectionName)
          ? { ...c, sections: [...c.sections, sectionName] }
          : c
      )
    )
  }

  const deleteSection = (classId, sectionName) => {
    setAttendanceClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, sections: c.sections.filter((s) => s !== sectionName) }
          : c
      )
    )
  }

  // ── Other Actions ─────────────────────────────────────────────
  const collectFee = (paymentData) => {
    const nextTx = {
      id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
      voucherNo: `VR-${new Date().getFullYear()}-${String(feeTransactions.length + 85).padStart(3, '0')}`,
      ...paymentData,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Paid'
    }
    setFeeTransactions((prev) => [nextTx, ...prev])

    // Update student's feeDue
    if (paymentData.studentId && paymentData.amount) {
      setStudents((prev) =>
        prev.map((s) => {
          if (s.id === paymentData.studentId) {
            const nextDue = Math.max(0, (s.feeDue || 0) - Number(paymentData.amount))
            return { ...s, feeDue: nextDue }
          }
          return s
        })
      )
    }

    setCurrentReceipt(nextTx)
    return nextTx
  }

  const addExpense = (expense) => {
    const newExp = {
      id: `EXP-${expenses.length + 105}`,
      date: new Date().toISOString().split('T')[0],
      ...expense
    }
    setExpenses((prev) => [newExp, ...prev])
    return newExp
  }

  const issueBook = (bookId, studentId, dueDate) => {
    const book = books.find((b) => b.id === bookId)
    const student = students.find((s) => s.id === studentId)
    if (!book || !student) return false

    const newBorrow = {
      id: `BOR-${borrowings.length + 505}`,
      bookId,
      bookTitle: book.title,
      studentId,
      studentName: student.name,
      class: student.className,
      roll: student.roll,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'borrowed'
    }

    setBorrowings((prev) => [newBorrow, ...prev])
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1), issuedCount: (b.issuedCount || 0) + 1 } : b))
    )
    return true
  }

  const returnBook = (borrowId) => {
    const borrow = borrowings.find((b) => b.id === borrowId)
    if (!borrow) return

    setBorrowings((prev) => prev.map((b) => (b.id === borrowId ? { ...b, status: 'returned', returnDate: new Date().toISOString().split('T')[0] } : b)))
    setBooks((prev) =>
      prev.map((b) => (b.id === borrow.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b))
    )
  }

  const addBook = (bookData) => {
    const newBk = {
      id: `BK-${books.length + 106}`,
      availableCopies: Number(bookData.totalCopies),
      issuedCount: 0,
      ...bookData
    }
    setBooks((prev) => [...prev, newBk])
    return newBk
  }

  const saveExamResult = (resultData) => {
    setExamResults((prev) => {
      const idx = prev.findIndex((r) => r.studentId === resultData.studentId && r.exam === resultData.exam)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = resultData
        return next
      }
      return [resultData, ...prev]
    })
  }

  const sendSms = ({ recipientGroup, message, count }) => {
    const newLog = {
      id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
      recipientGroup,
      count: count || 45,
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      message,
      status: 'Delivered'
    }
    setSmsLogs((prev) => [newLog, ...prev])
    return newLog
  }

  const updateRoutineSlot = (day, periodIdx, updatedSlot) => {
    setWeeklyRoutine((prev) => {
      const daySchedule = [...(prev[day] || [])]
      daySchedule[periodIdx] = { ...daySchedule[periodIdx], ...updatedSlot }
      return { ...prev, [day]: daySchedule }
    })
  }

  const resetAttendanceToDemo = () => {
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE_V3)
    localStorage.removeItem(STORAGE_KEYS.STUDENTS)
    localStorage.removeItem(STORAGE_KEYS.ATT_CLASSES)
    setStudents(initialStudents)
    setAttendanceClasses(initialAttendanceClasses)
    setAttendanceStore(initialAttendanceStore)
  }

  const resetAllDataToDefault = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k))
    setSchoolInfo(initialSchoolInfo)
    setStudents(initialStudents)
    setTeachers(initialTeachers)
    setAttendanceStore(initialAttendanceStore)
    setAttendanceClasses(initialAttendanceClasses)
    setFeeTransactions(initialFeesTransactions)
    setExpenses(initialExpenses)
    setBooks(initialBooks)
    setBorrowings(initialBorrowings)
    setExamResults(initialExamResults)
    setWeeklyRoutine(initialWeeklyRoutine)
    setSmsLogs(initialSmsLogs)
  }

  return (
    <DashboardContext.Provider
      value={{
        schoolInfo,
        setSchoolInfo,
        classes,
        students,
        teachers,
        // New attendance API
        attendanceStore,
        attendanceClasses,
        getAttendanceForDate,
        markStudentAttendance,
        markAllStudentAttendance,
        getMonthlyAttendanceSummary,
        getDailyAttendancePercent,
        addClass,
        deleteClass,
        addSection,
        deleteSection,
        feeTransactions,
        expenses,
        books,
        borrowings,
        examResults,
        weeklyRoutine,
        smsLogs,
        transportRoutes,
        hostelRooms,
        activeRole,
        setActiveRole,
        globalSearch,
        setGlobalSearch,
        notifications,
        setNotifications,
        currentReceipt,
        setCurrentReceipt,
        currentStudentForId,
        setCurrentStudentForId,
        currentReportCard,
        setCurrentReportCard,
        currentTcStudent,
        setCurrentTcStudent,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        collectFee,
        addExpense,
        issueBook,
        returnBook,
        addBook,
        saveExamResult,
        sendSms,
        updateRoutineSlot,
        resetAttendanceToDemo,
        resetAllDataToDefault
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
