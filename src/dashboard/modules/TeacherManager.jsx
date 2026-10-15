import { useState, useEffect } from 'react'
import {
  GraduationCap,
  UserPlus,
  Search,
  Phone,
  Mail,
  BookOpen,
  Award,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  UploadCloud,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import api from '../../lib/api'
import { uploadToImgbb } from '../../lib/imgbb'

export default function TeacherManager() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const initialForm = {
    name: '',
    nameBn: '',
    designation: 'Senior Teacher',
    designationBn: '',
    department: 'Science',
    qualification: 'M.Sc / B.Ed',
    experience: '10 Years Experience',
    experienceBn: '১০ বছরের অভিজ্ঞতা',
    phone: '',
    email: '',
    salary: 35000,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    bio: '',
    bioBn: '',
    assignedClass: 'Class 9',
    subjects: 'Physics, Mathematics',
  }

  const [formData, setFormData] = useState(initialForm)

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const res = await api.getTeachers()
      if (res && res.success && Array.isArray(res.data)) {
        setTeachers(res.data)
      }
    } catch (err) {
      console.warn('Error fetching teachers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData(initialForm)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (t) => {
    setEditingId(t._id || t.id)
    setFormData({
      name: t.name || '',
      nameBn: t.nameBn || '',
      designation: t.designation || 'Senior Teacher',
      designationBn: t.designationBn || '',
      department: t.department || 'Science',
      qualification: t.qualification || '',
      experience: t.experience || '',
      experienceBn: t.experienceBn || '',
      phone: t.phone || '',
      email: t.email || '',
      salary: t.salary || 35000,
      photo: t.photo || '',
      bio: t.bio || '',
      bioBn: t.bioBn || '',
      assignedClass: t.assignedClass || '',
      subjects: Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.subjects || ''),
    })
    setIsModalOpen(true)
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const res = await uploadToImgbb(file)
      const finalUrl = typeof res === 'string' ? res : (res?.url || res?.data?.url || '')
      if (finalUrl) {
        setFormData((prev) => ({ ...prev, photo: finalUrl }))
        showToast('✓ Photo uploaded successfully!')
      } else {
        showToast(res?.message || '❌ Failed to upload photo')
      }
    } catch {
      showToast('❌ Failed to upload photo')
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Please enter faculty name.')
      return
    }

    const payload = {
      ...formData,
      subjects: typeof formData.subjects === 'string'
        ? formData.subjects.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.subjects,
    }

    try {
      if (editingId) {
        const res = await api.updateTeacher(editingId, payload)
        if (res && res.success) {
          showToast('✓ Faculty profile updated!')
        }
      } else {
        const res = await api.createTeacher(payload)
        if (res && res.success) {
          showToast('✓ New faculty member added!')
        }
      }
      setIsModalOpen(false)
      fetchTeachers()
      window.dispatchEvent(new Event('mpa_teachers_updated'))
    } catch (err) {
      showToast(`❌ Error saving: ${err.message}`)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from faculty directory?`)) return
    try {
      const res = await api.deleteTeacher(id)
      if (res && res.success) {
        showToast('✓ Faculty member removed')
        fetchTeachers()
        window.dispatchEvent(new Event('mpa_teachers_updated'))
      }
    } catch (err) {
      showToast(`❌ Error deleting: ${err.message}`)
    }
  }

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset faculty list to default verified teachers?')) return
    try {
      const res = await api.resetTeachers()
      if (res && res.success) {
        showToast('✓ Restored default teachers')
        fetchTeachers()
        window.dispatchEvent(new Event('mpa_teachers_updated'))
      }
    } catch (err) {
      showToast(`❌ Error resetting: ${err.message}`)
    }
  }

  const filteredTeachers = teachers.filter((t) => {
    const q = searchQuery.toLowerCase()
    return (
      !q ||
      t.name?.toLowerCase().includes(q) ||
      t.nameBn?.toLowerCase().includes(q) ||
      t.department?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16161f] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 moom-card p-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty & Academic Staff Directory (Live MongoDB)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Teachers & Faculty Council
          </h2>
          <p className="text-xs text-slate-400">
            Manage teacher profiles, designations, photo uploads, departments and public website faculty page
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="moom-btn-ghost px-3.5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            title="Restore default faculty list"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="moom-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <UserPlus className="w-4 h-4" />
            <span>Appoint Faculty</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="moom-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by faculty name, subject or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full moom-input pl-9 text-xs"
          />
        </div>
        <span className="text-xs font-bold text-slate-400">
          Total Faculty in Database: <strong className="text-white">{teachers.length}</strong>
        </span>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">Loading faculty from database...</div>
      ) : filteredTeachers.length === 0 ? (
        <div className="moom-card p-12 text-center text-slate-400 text-xs">No faculty found. Click "Appoint Faculty" to add one.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((tch) => (
            <div
              key={tch._id || tch.id}
              className="moom-card p-5 flex flex-col justify-between hover:border-[#6c63ff]/40 transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={tch.photo}
                      alt={tch.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#1e1e2e] shadow-md ring-2 ring-[#6c63ff]/20"
                    />
                    <div>
                      <h3 className="font-black text-white text-sm leading-tight">{tch.name}</h3>
                      {tch.nameBn && <p className="text-[11px] text-slate-400 mt-0.5">{tch.nameBn}</p>}
                      <p className="text-[11px] font-bold text-[#a78bfa] mt-0.5">{tch.designation}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block">{tch.department}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleOpenEdit(tch)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#6c63ff] text-slate-300 hover:text-white transition"
                      title="Edit teacher profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tch._id || tch.id, tch.name)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500 text-slate-300 hover:text-white transition"
                      title="Delete teacher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 bg-[#16161f] p-3.5 rounded-xl border border-[#1e1e2e]">
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                    <span className="font-semibold text-slate-200">{tch.qualification || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Subjects: {Array.isArray(tch.subjects) ? tch.subjects.join(', ') : tch.subjects}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{tch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-mono text-slate-400 truncate">{tch.email}</span>
                  </div>
                </div>

                {tch.bio && (
                  <p className="mt-3 text-[11px] text-slate-400 italic line-clamp-2">
                    "{tch.bio}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#1e1e2e] flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Salary: <strong className="font-mono text-white">৳{tch.salary?.toLocaleString()}</strong>
                </span>
                <span className="text-[10px] font-bold text-mint bg-mint/10 border border-mint/20 px-2 py-0.5 rounded-full">
                  {tch.experience || 'Faculty'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Appoint / Edit Faculty */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#111118] text-slate-200 rounded-2xl shadow-2xl overflow-hidden border border-[#1e1e2e] my-8">
            <div className="px-6 py-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">
                {editingId ? 'Edit Faculty Profile' : 'Appoint Faculty Member'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto moom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Faculty Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Faculty Name (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Designation (English)</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Designation (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.designationBn}
                    onChange={(e) => setFormData({ ...formData, designationBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full moom-input"
                  >
                    <option value="Administration">Administration (প্রশাসন)</option>
                    <option value="Science">Science (বিজ্ঞান)</option>
                    <option value="Commerce">Commerce (বাণিজ্য)</option>
                    <option value="Humanities">Humanities (মানবিক)</option>
                    <option value="Languages">Languages (ভাষা)</option>
                    <option value="ICT & STEM">ICT & STEM (আইসিটি ও এসটিইএম)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Academic Qualifications</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full moom-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full moom-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Experience (English)</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Experience (বাংলা)</label>
                  <input
                    type="text"
                    value={formData.experienceBn}
                    onChange={(e) => setFormData({ ...formData, experienceBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Monthly Salary Scale (৳)</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full moom-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Assigned Class</label>
                  <input
                    type="text"
                    value={formData.assignedClass}
                    onChange={(e) => setFormData({ ...formData, assignedClass: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-400 mb-1">Photo URL / ImgBB Upload</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://..."
                      className="w-full moom-input font-mono text-xs"
                    />
                    <label className="moom-btn-ghost px-3 py-2 rounded-xl cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-xs font-bold">
                      <UploadCloud className="w-4 h-4 text-[#a78bfa]" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-400 mb-1">Assigned Subjects (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.subjects}
                    onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-400 mb-1">Teacher Bio (English)</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-400 mb-1">Teacher Bio (বাংলা)</label>
                  <textarea
                    rows={2}
                    value={formData.bioBn}
                    onChange={(e) => setFormData({ ...formData, bioBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="moom-btn-ghost px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="moom-btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
