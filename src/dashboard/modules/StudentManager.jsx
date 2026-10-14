import { useState, useMemo } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Printer,
  FileText,
  CreditCard,
  Trash2,
  Eye,
  CheckCircle2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  ArrowUpDown,
  X
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import Student360ProfileModal from '../modals/Student360ProfileModal'

export default function StudentManager({ isAddModalOpen, setIsAddModalOpen, setActiveTab }) {
  const {
    students,
    attendanceClasses: classes,
    addStudent,
    deleteStudent,
    setCurrentStudentForId,
    setCurrentTcStudent
  } = useDashboard()

  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSection, setSelectedSection] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [feeFilter, setFeeFilter] = useState('all') // all | due | paid
  const [bloodFilter, setBloodFilter] = useState('all')
  const [sortBy, setSortBy] = useState('roll') // roll | name | feeDue
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudentForView, setSelectedStudentForView] = useState(null)

  const activeClassObj = classes.find((c) => c.id === selectedClass)
  const sectionOptions = activeClassObj ? activeClassObj.sections : []

  const classCounts = useMemo(() => {
    const m = {}
    students.forEach((s) => {
      m[s.classId] = (m[s.classId] || 0) + 1
    })
    return m
  }, [students])

  const pickClass = (id) => {
    setSelectedClass(id)
    setSelectedSection('all')
  }

  const resetFilters = () => {
    setSelectedClass('all')
    setSelectedSection('all')
    setGenderFilter('all')
    setFeeFilter('all')
    setBloodFilter('all')
    setSortBy('roll')
    setSearchQuery('')
  }

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    classId: 'ac10',
    className: 'Class 10',
    section: 'Science',
    roll: '',
    gender: 'Male',
    bloodGroup: 'A+',
    dob: '2010-01-01',
    fatherName: '',
    motherName: '',
    guardianPhone: '',
    address: 'Mirashani, Madhabpur'
  })

  const filteredStudents = students
    .filter((s) => {
      const matchClass = selectedClass === 'all' || s.classId === selectedClass
      const matchSection = selectedSection === 'all' || s.section === selectedSection
      const matchGender = genderFilter === 'all' || s.gender === genderFilter
      const matchBlood = bloodFilter === 'all' || s.bloodGroup === bloodFilter
      const matchFee =
        feeFilter === 'all' || (feeFilter === 'due' ? (s.feeDue || 0) > 0 : (s.feeDue || 0) === 0)
      const query = searchQuery.trim().toLowerCase()
      const matchSearch =
        !query ||
        s.name.toLowerCase().includes(query) ||
        String(s.roll).includes(query) ||
        s.id.toLowerCase().includes(query) ||
        (s.guardianPhone && s.guardianPhone.includes(query)) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(query))
      return matchClass && matchSection && matchGender && matchBlood && matchFee && matchSearch
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'feeDue') return (b.feeDue || 0) - (a.feeDue || 0)
      // roll: class order → section → numeric roll
      const ci = classes.findIndex((c) => c.id === a.classId) - classes.findIndex((c) => c.id === b.classId)
      if (ci) return ci
      const sc = String(a.section).localeCompare(String(b.section))
      if (sc) return sc
      return parseInt(a.roll, 10) - parseInt(b.roll, 10)
    })

  const hasActiveFilters =
    selectedClass !== 'all' ||
    selectedSection !== 'all' ||
    genderFilter !== 'all' ||
    feeFilter !== 'all' ||
    bloodFilter !== 'all' ||
    searchQuery.trim() !== ''

  const totalDue = filteredStudents.reduce((sum, s) => sum + (s.feeDue || 0), 0)

  const exportCsv = () => {
    const header = ['Student ID', 'Name', 'Class', 'Section', 'Roll', 'Gender', 'Blood Group', 'Father', 'Guardian Phone', 'Fee Due']
    const rows = filteredStudents.map((s) => [s.id, s.name, s.className, s.section, s.roll, s.gender, s.bloodGroup, s.fatherName, s.guardianPhone, s.feeDue || 0])
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `students${selectedClass !== 'all' ? '-' + selectedClass : ''}${selectedSection !== 'all' ? '-' + selectedSection : ''}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCreateStudent = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.roll) {
      alert('Please enter student name and roll number.')
      return
    }

    const classObj = classes.find((c) => c.id === formData.classId)
    const newStudent = {
      ...formData,
      className: classObj ? classObj.name : 'Class 10'
    }

    addStudent(newStudent)
    setIsAddModalOpen(false)
    setFormData({
      name: '',
      classId: 'ac10',
      className: 'Class 10',
      section: 'Science',
      roll: '',
      gender: 'Male',
      bloodGroup: 'A+',
      dob: '2010-01-01',
      fatherName: '',
      motherName: '',
      guardianPhone: '',
      address: 'Mirashani, Madhabpur'
    })
  }

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to remove student '${name}' permanently?`)) {
      deleteStudent(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 moom-card p-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#a78bfa] bg-[#6c63ff]/10 border border-[#6c63ff]/20 px-2.5 py-1 rounded-full mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Student Administration & Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Student Directory & Admissions
          </h2>
          <p className="text-xs text-slate-400">
            Manage student records, generate digital ID cards and official Transfer Certificates (TC)
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="moom-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Admission</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="moom-card p-4 space-y-4">
        {/* Class chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 moom-scrollbar">
          {[{ id: 'all', name: 'All Classes', count: students.length }, ...classes.map((c) => ({ id: c.id, name: c.name, count: classCounts[c.id] || 0 }))].map((c) => (
            <button
              key={c.id}
              onClick={() => pickClass(c.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
                selectedClass === c.id
                  ? 'bg-[#6c63ff] text-white border-[#6c63ff] shadow-[0_0_14px_rgba(108,99,255,0.45)]'
                  : 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {c.name}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedClass === c.id ? 'bg-white/20' : 'bg-white/10 text-slate-400'}`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* Section chips (appear once a class is picked) */}
        {activeClassObj && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mr-1">Section</span>
            {['all', ...sectionOptions].map((sec) => {
              const count =
                sec === 'all'
                  ? classCounts[selectedClass] || 0
                  : students.filter((s) => s.classId === selectedClass && s.section === sec).length
              return (
                <button
                  key={sec}
                  onClick={() => setSelectedSection(sec)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition ${
                    selectedSection === sec
                      ? 'bg-[#6c63ff]/20 text-[#c4b5fd] border-[#6c63ff]/50'
                      : 'bg-white/[0.03] text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {sec === 'all' ? 'All Sections' : sec}
                  <span className="text-[10px] text-slate-500">{count}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Search + extra filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, roll, ID, guardian, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full moom-input pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="moom-select" aria-label="Gender">
              <option value="all">Any Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select value={feeFilter} onChange={(e) => setFeeFilter(e.target.value)} className="moom-select" aria-label="Fee status">
              <option value="all">Any Fee Status</option>
              <option value="due">Fee Due</option>
              <option value="paid">Fully Paid</option>
            </select>
            <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} className="moom-select" aria-label="Blood group">
              <option value="all">Any Blood Group</option>
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <div className="inline-flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-slate-500" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="moom-select" aria-label="Sort by">
                <option value="roll">Sort: Class & Roll</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="feeDue">Sort: Highest Fee Due</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:ml-auto">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="moom-btn-ghost px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
            <button
              onClick={exportCsv}
              disabled={!filteredStudents.length}
              className="moom-btn-emerald px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 font-semibold border-t border-white/5 pt-3">
          <span>Showing <strong className="text-white">{filteredStudents.length}</strong> of {students.length} students</span>
          <span>Total due: <strong className="text-amber-400 font-mono">৳{totalDue.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Students Data Table (moom24 style) */}
      <div className="moom-table-container">
        <div className="overflow-x-auto">
          <table className="moom-table">
            <thead>
              <tr>
                <th className="w-16">Roll</th>
                <th>Student</th>
                <th>Class & Section</th>
                <th>Blood Group</th>
                <th>Guardian Contact</th>
                <th>Fee Due</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No student records found matching query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr key={st.id}>
                    <td className="font-mono font-bold text-[#a78bfa]">{st.roll}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={st.avatar}
                          alt={st.name}
                          className="w-9 h-9 rounded-full object-cover border border-[#1e1e2e]"
                        />
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForView(st)}
                          className="text-left group"
                          title="Open full profile"
                        >
                          <span className="font-bold text-white block group-hover:text-[#a78bfa] transition">{st.name}</span>
                          <span className="text-[11px] font-mono text-slate-400">{st.id}</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-200 block">{st.className}</span>
                      <span className="text-[11px] text-slate-400">{st.section}</span>
                    </td>
                    <td>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-xs">
                        {st.bloodGroup}
                      </span>
                    </td>
                    <td>
                      <span className="text-slate-300 font-medium block">{st.fatherName || 'Guardian'}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{st.guardianPhone}</span>
                    </td>
                    <td>
                      {st.feeDue > 0 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-xs">
                          ৳{st.feeDue} Due
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                          Paid
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* ID Card Action */}
                        <button
                          onClick={() => setCurrentStudentForId(st)}
                          title="Print Digital ID Card"
                          className="p-1.5 rounded-lg bg-[#6c63ff]/10 hover:bg-[#6c63ff]/20 text-[#a78bfa] border border-[#6c63ff]/20 transition"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        {/* Transfer Certificate */}
                        <button
                          onClick={() => setCurrentTcStudent(st)}
                          title="Issue Transfer Certificate"
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Profile View */}
                        <button
                          onClick={() => setSelectedStudentForView(st)}
                          title="Open Full Student Profile"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(st.id, st.name)}
                          title="Delete Student"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add New Student Modal (moom24 dark modal) ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#111118] text-slate-200 rounded-2xl shadow-2xl overflow-hidden border border-[#1e1e2e] my-8">
            <div className="px-6 py-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#a78bfa]" />
                <h3 className="font-bold text-base text-white">Enroll New Student</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abdullah Al Noman"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => {
                      const c = classes.find((x) => x.id === e.target.value)
                      setFormData({ ...formData, classId: e.target.value, section: c?.sections[0] || '' })
                    }}
                    className="w-full moom-select"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Section / Group</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full moom-select"
                  >
                    {(classes.find((c) => c.id === formData.classId)?.sections || []).map((sec) => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Class Roll Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15"
                    value={formData.roll}
                    onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    className="w-full moom-input font-mono font-bold text-[#a78bfa]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full moom-select"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Guardian Mobile *</label>
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    className="w-full moom-input font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="Father's name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full moom-input font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="Village, Post Office, Upazila, District"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="moom-btn-primary px-6 py-2 rounded-xl text-xs font-bold"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Full Student 360° Profile ── */}
      {selectedStudentForView && (
        <Student360ProfileModal
          student={selectedStudentForView}
          onClose={() => setSelectedStudentForView(null)}
          initialTab="overview"
        />
      )}
    </div>
  )
}
