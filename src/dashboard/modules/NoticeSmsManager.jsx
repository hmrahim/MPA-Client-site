import { useState, useEffect, useMemo } from 'react'
import {
  Send,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PhoneCall,
  Save,
  RotateCcw,
  Trash2,
  Users,
  Search,
  CheckSquare,
  Square,
  UserPlus,
  X
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import api from '../../lib/api'

export default function NoticeSmsManager() {
  const { smsLogs = [], sendSms, schoolInfo = {}, students = [], teachers = [] } = useDashboard()

  const [activeTab, setActiveTab] = useState('sms') // 'sms' | 'notice' | 'subscribers'
  const [targetGroup, setTargetGroup] = useState('All Class 10 Parents')
  const [smsText, setSmsText] = useState(
    'Dear Guardian, Class 10 Pre-Test examinations will commence from Oct 15, 2026. Please ensure regular attendance. - Mirashani Academy'
  )
  const [toastMessage, setToastMessage] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([])
  const [customRecipients, setCustomRecipients] = useState([])
  const [newCustomName, setNewCustomName] = useState('')
  const [newCustomPhone, setNewCustomPhone] = useState('')
  const [showAddCustom, setShowAddCustom] = useState(false)

  const [smsAlertConfig, setSmsAlertConfig] = useState({
    isActive: true,
    title: 'Get Instant Notices via SMS Alert',
    titleBn: 'এসএমএস অ্যালার্টের মাধ্যমে নোটিশ পান',
    subtitle: 'Guardians can subscribe their mobile number to receive exam schedules and emergency school closures directly.',
    subtitleBn: 'অভিভাবকগণ মোবাইল নম্বর নিবন্ধন করে সরাসরি পরীক্ষার রুটিন ও জরুরি ছুটির বার্তা পেতে পারেন।',
    inputPlaceholder: 'e.g. 017XXXXXXXX',
    inputPlaceholderBn: 'যেমন: ০১৭XXXXXXXX',
    buttonText: 'Subscribe Free',
    buttonTextBn: 'বিনামূল্যে সাবস্ক্রাইব',
    successMsg: 'Thank you! Your mobile number has been registered for notice alerts.',
    successMsgBn: 'ধন্যবাদ! আপনার মোবাইল নম্বর নোটিশ অ্যালার্টের জন্য নিবন্ধিত হয়েছে।',
  })
  const [savingAlert, setSavingAlert] = useState(false)

  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'Academic',
    priority: 'Urgent',
    content: ''
  })

  const templates = [
    {
      title: 'Exam Schedule Notice',
      text: `Dear Guardian, Half-Yearly Examination 2026 will commence from Oct 15. The examination timetable is posted on the portal. - ${schoolInfo.name || 'Mirashani Academy'}`
    },
    {
      title: 'Fee Due Reminder',
      text: `Dear Guardian, monthly academic fees and exam dues for the current term are requested to be cleared by the 10th of this month. - Accounts Office, ${schoolInfo.name || 'Mirashani Academy'}`
    },
    {
      title: 'Holiday Announcement',
      text: `Notice is hereby given that academic activities of the school will remain closed tomorrow due to official holiday. - ${schoolInfo.name || 'Mirashani Academy'}`
    },
    {
      title: 'Parent-Teacher Meeting',
      text: `Dear Guardian, a parent-teacher consultation meeting is scheduled for this Saturday at 10:00 AM in the school auditorium. Your presence is appreciated.`
    }
  ]

  // Build list of candidate recipients based on active targetGroup
  const candidateRecipients = useMemo(() => {
    let list = []
    if (targetGroup === 'All Class 10 Parents') {
      list = (students || [])
        .filter((s) => (s.className || '').toLowerCase().includes('10'))
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01712-345678',
          guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
          tag: 'Class 10',
          badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
        }))
    } else if (targetGroup === 'All Class 9 Parents') {
      list = (students || [])
        .filter((s) => (s.className || '').toLowerCase().includes('9'))
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01718-445566',
          guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
          tag: 'Class 9',
          badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
        }))
    } else if (targetGroup === 'All Class 8 Parents') {
      list = (students || [])
        .filter((s) => (s.className || '').toLowerCase().includes('8'))
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01731-811001',
          guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
          tag: 'Class 8',
          badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        }))
    } else if (targetGroup === 'All Class 7 Parents') {
      list = (students || [])
        .filter((s) => (s.className || '').toLowerCase().includes('7'))
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01721-711001',
          guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
          tag: 'Class 7',
          badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
        }))
    } else if (targetGroup === 'All Class 6 Parents') {
      list = (students || [])
        .filter((s) => (s.className || '').toLowerCase().includes('6'))
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01711-611001',
          guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
          tag: 'Class 6',
          badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }))
    } else if (targetGroup === 'Fee Defaulter Students') {
      list = (students || [])
        .filter((s) => (s.feeDue || 0) > 0)
        .map((s) => ({
          id: s.id,
          name: s.name,
          role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
          phone: s.guardianPhone || s.phone || '01822-334455',
          guardian: `Due: ৳${s.feeDue} · ${s.fatherName || 'Guardian'}`,
          tag: `Due: ৳${s.feeDue}`,
          badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }))
    } else if (targetGroup === 'All Faculty and Staff') {
      list = (teachers || []).map((t) => ({
        id: t.id,
        name: t.name,
        role: `${t.designation} · ${t.department || 'Staff'}`,
        phone: t.phone || '+880 1711-234567',
        guardian: t.qualification || t.designation,
        tag: 'Faculty',
        badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20'
      }))
    } else if (targetGroup === 'SMS Alert Subscribers') {
      list = (subscribers || []).map((sub, idx) => ({
        id: sub._id || sub.id || `SUB-${idx}`,
        name: sub.name || `Subscriber #${idx + 1}`,
        role: `Website Alert Subscriber · Lang: ${sub.data?.lang || 'bn'}`,
        phone: sub.phone || sub.guardianPhone || sub.data?.phone || '01700-000000',
        guardian: 'Public Subscriber',
        tag: 'Subscriber',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      }))
    } else {
      // 'All Students and Guardians'
      list = (students || []).map((s) => ({
        id: s.id,
        name: s.name,
        role: `${s.className} (${s.section}) · Roll: ${s.roll}`,
        phone: s.guardianPhone || s.phone || '01712-345678',
        guardian: s.fatherName ? `Father: ${s.fatherName}` : (s.motherName ? `Mother: ${s.motherName}` : 'Guardian'),
        tag: s.className,
        badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
      }))
    }

    return [...list, ...customRecipients]
  }, [targetGroup, students, teachers, subscribers, customRecipients])

  // Automatically select all candidate recipients when target group changes or new list loads
  useEffect(() => {
    setSelectedRecipientIds(candidateRecipients.map((r) => r.id))
  }, [candidateRecipients])

  // Selection controls
  const handleSelectAll = () => {
    setSelectedRecipientIds(candidateRecipients.map((r) => r.id))
  }

  const handleDeselectAll = () => {
    setSelectedRecipientIds([])
  }

  const toggleSelectRecipient = (id) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const isAllSelected =
    candidateRecipients.length > 0 &&
    candidateRecipients.every((r) => selectedRecipientIds.includes(r.id))

  const isSomeSelected =
    candidateRecipients.some((r) => selectedRecipientIds.includes(r.id)) && !isAllSelected

  const handleToggleMasterCheckbox = () => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }

  // Filtered recipients by search input
  const filteredRecipients = useMemo(() => {
    if (!searchQuery.trim()) return candidateRecipients
    const q = searchQuery.toLowerCase()
    return candidateRecipients.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.phone?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q) ||
        r.guardian?.toLowerCase().includes(q) ||
        r.tag?.toLowerCase().includes(q)
    )
  }, [candidateRecipients, searchQuery])

  // Add custom recipient
  const handleAddCustomRecipient = (e) => {
    if (e) e.preventDefault()
    if (!newCustomPhone.trim()) {
      alert('Please enter a mobile phone number')
      return
    }
    const newRecipient = {
      id: `CUSTOM-${Date.now()}`,
      name: newCustomName.trim() || `Custom Contact`,
      role: 'Custom Added Recipient',
      phone: newCustomPhone.trim(),
      guardian: 'Manual Recipient',
      tag: 'Custom',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
    setCustomRecipients((prev) => [newRecipient, ...prev])
    setSelectedRecipientIds((prev) => [newRecipient.id, ...prev])
    setNewCustomName('')
    setNewCustomPhone('')
    setShowAddCustom(false)
    setToastMessage(`✓ Added ${newRecipient.phone} to recipient list!`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleSendSms = (e) => {
    e.preventDefault()
    if (!smsText.trim()) {
      alert('Please enter SMS message.')
      return
    }
    if (selectedRecipientIds.length === 0) {
      alert('Please select at least one recipient phone number to send SMS.')
      return
    }

    const selectedList = candidateRecipients.filter((r) =>
      selectedRecipientIds.includes(r.id)
    )
    const previewNumbers = selectedList.slice(0, 3).map((r) => r.phone).join(', ')

    sendSms({
      recipientGroup: `${targetGroup} (${selectedRecipientIds.length} recipients)`,
      message: smsText,
      count: selectedRecipientIds.length,
      recipients: selectedList
    })

    setToastMessage(
      `✓ SMS broadcast dispatched to ${selectedRecipientIds.length} recipient numbers (${previewNumbers}${
        selectedRecipientIds.length > 3 ? '...' : ''
      })!`
    )
    setTimeout(() => setToastMessage(null), 4000)
  }

  useEffect(() => {
    fetchNoticeConfig()
    fetchSubscribers()
  }, [])

  const fetchNoticeConfig = async () => {
    try {
      const res = await api.getNotices()
      if (res && res.data && res.data.smsAlert) {
        setSmsAlertConfig((prev) => ({ ...prev, ...res.data.smsAlert }))
      }
    } catch (err) {
      console.warn('Could not load notice SMS config', err)
    }
  }

  const fetchSubscribers = async () => {
    setLoadingSubscribers(true)
    try {
      const res = await api.getSubmissions('type=subscriber')
      if (res && res.data) {
        setSubscribers(res.data)
      }
    } catch (err) {
      console.warn('Could not load subscribers', err)
    } finally {
      setLoadingSubscribers(false)
    }
  }

  const handleSaveSmsAlert = async (e) => {
    if (e) e.preventDefault()
    setSavingAlert(true)
    try {
      const res = await api.getNotices()
      const currentData = res?.data || {}
      const updated = {
        ...currentData,
        smsAlert: smsAlertConfig,
      }
      const saveRes = await api.updateNotices(updated)
      if (saveRes && saveRes.success) {
        window.dispatchEvent(new Event('mpa_notices_updated'))
        setToastMessage('✓ SMS Alert Box Settings saved directly to Database!')
      } else {
        throw new Error(saveRes?.message || 'Failed to save')
      }
    } catch (err) {
      console.error(err)
      setToastMessage('⚠ Error saving SMS alert settings: ' + err.message)
    } finally {
      setSavingAlert(false)
      setTimeout(() => setToastMessage(null), 3500)
    }
  }

  const handlePublishNotice = (e) => {
    e.preventDefault()
    if (!noticeForm.title || !noticeForm.content) {
      alert('Please provide notice title and description.')
      return
    }

    setToastMessage('✓ Notice published on official board successfully!')
    setNoticeForm({ title: '', category: 'Academic', priority: 'Urgent', content: '' })
    setTimeout(() => setToastMessage(null), 3500)
  }

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
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full mb-1">
            <Send className="w-3.5 h-3.5" />
            <span>Communications Gateway & Broadcast Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            SMS Broadcast & Notice Board
          </h2>
          <p className="text-xs text-slate-400">
            Automated parent SMS broadcast gateway with smartphone mockup preview and digital bulletin board
          </p>
        </div>

        <div className="flex bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'sms' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulk SMS Gateway
          </button>
          <button
            onClick={() => setActiveTab('notice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'notice' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Official Notices
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'subscribers' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS Alert Box & Subscribers ({subscribers.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'sms' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SMS Dispatcher Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="moom-card p-6">
              <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#a78bfa]" />
                <span>Parent SMS Broadcast Console</span>
              </h3>

              <form onSubmit={handleSendSms} className="space-y-4 text-xs">
                {/* Target Recipient Group Dropdown */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">
                      Target Recipient Group *
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Total in group: <strong className="text-white">{candidateRecipients.length}</strong>
                    </span>
                  </div>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full moom-select font-semibold"
                  >
                    <option value="All Class 10 Parents">Class 10 Parents (Guardians)</option>
                    <option value="All Class 9 Parents">Class 9 Parents (Guardians)</option>
                    <option value="All Class 8 Parents">Class 8 Parents (Guardians)</option>
                    <option value="All Class 7 Parents">Class 7 Parents (Guardians)</option>
                    <option value="All Class 6 Parents">Class 6 Parents (Guardians)</option>
                    <option value="All Students and Guardians">Entire Academy (All Students & Guardians)</option>
                    <option value="Fee Defaulter Students">Fee Overdue Students (Pending Dues)</option>
                    <option value="All Faculty and Staff">Faculty & Administration Staff</option>
                    <option value="SMS Alert Subscribers">Public SMS Alert Subscribers</option>
                  </select>
                </div>

                {/* Recipient Numbers Selection & Inspection Box */}
                <div className="bg-[#12121a] rounded-xl border border-[#1e1e2e] p-4 space-y-3">
                  {/* Top Bar with Title, Counts, and Selection Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e1e2e]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                            Recipient Phone Numbers
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              selectedRecipientIds.length > 0
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {selectedRecipientIds.length} of {candidateRecipients.length} Selected
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Inspect target numbers, toggle individual checkboxes, or use Select All.
                        </p>
                      </div>
                    </div>

                    {/* Action buttons: Select All / Deselect All / Add Custom Number */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-2.5 py-1 rounded-lg bg-[#6c63ff]/15 hover:bg-[#6c63ff]/25 text-[#a78bfa] hover:text-white text-xs font-semibold border border-[#6c63ff]/30 flex items-center gap-1.5 transition"
                        title="Select all numbers in this list"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Select All</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAll}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
                        title="Deselect all numbers"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>Deselect All</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCustom(!showAddCustom)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#6c63ff]/20 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition"
                        title="Add a manual recipient number"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#a78bfa]" />
                        <span>+ Add Number</span>
                      </button>
                    </div>
                  </div>

                  {/* Add Custom Number Form */}
                  {showAddCustom && (
                    <div className="p-3 bg-[#16161f] rounded-lg border border-[#6c63ff]/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">Add Manual Recipient Number</span>
                        <button
                          type="button"
                          onClick={() => setShowAddCustom(false)}
                          className="text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Name / Note (e.g. Managing Committee Member)"
                          value={newCustomName}
                          onChange={(e) => setNewCustomName(e.target.value)}
                          className="moom-input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Mobile Number (e.g. 017XXXXXXXX)"
                          value={newCustomPhone}
                          onChange={(e) => setNewCustomPhone(e.target.value)}
                          className="moom-input text-xs font-mono"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAddCustomRecipient}
                          className="moom-btn-primary px-3 py-1 rounded-lg font-bold text-xs"
                        >
                          Add & Select Number
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search Filter Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search recipient name, student roll, guardian, or phone number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full moom-input pl-8 py-1.5 text-xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Scrollable Numbers List */}
                  <div className="max-h-64 overflow-y-auto no-scrollbar border border-[#1e1e2e] rounded-xl bg-[#0e0e14]">
                    {filteredRecipients.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">
                        No recipient numbers matching "{searchQuery}"
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-[#16161f] border-b border-[#1e1e2e] z-10">
                          <tr className="text-slate-400 uppercase tracking-wider text-[10px]">
                            <th className="p-2.5 w-10 text-center">
                              <input
                                type="checkbox"
                                checked={isAllSelected}
                                ref={(el) => {
                                  if (el) el.indeterminate = isSomeSelected
                                }}
                                onChange={handleToggleMasterCheckbox}
                                className="rounded accent-[#6c63ff] cursor-pointer"
                                title={isAllSelected ? 'Deselect All' : 'Select All'}
                              />
                            </th>
                            <th className="p-2.5">Recipient / Student</th>
                            <th className="p-2.5">Class / Designation</th>
                            <th className="p-2.5">Target Mobile Number</th>
                            <th className="p-2.5 text-right">Group Tag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1e1e2e]/60">
                          {filteredRecipients.map((r, idx) => {
                            const isSelected = selectedRecipientIds.includes(r.id)
                            return (
                              <tr
                                key={r.id || idx}
                                onClick={() => toggleSelectRecipient(r.id)}
                                className={`cursor-pointer transition hover:bg-white/[0.04] ${
                                  isSelected ? 'bg-[#6c63ff]/[0.08]' : 'opacity-60'
                                }`}
                              >
                                <td className="p-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectRecipient(r.id)}
                                    className="rounded accent-[#6c63ff] cursor-pointer"
                                  />
                                </td>
                                <td className="p-2.5">
                                  <div className="font-semibold text-white">{r.name}</div>
                                  <div className="text-[10px] text-slate-400">{r.guardian}</div>
                                </td>
                                <td className="p-2.5 text-slate-300 font-medium">
                                  {r.role}
                                </td>
                                <td className="p-2.5 font-mono">
                                  <span className="inline-flex items-center gap-1.5 text-white bg-[#16161f] px-2 py-1 rounded-md border border-white/5 font-bold tracking-wide">
                                    <Smartphone className="w-3 h-3 text-emerald-400" />
                                    <span>{r.phone}</span>
                                  </span>
                                </td>
                                <td className="p-2.5 text-right">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${r.badgeColor}`}
                                  >
                                    {r.tag}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Summary under table */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400 px-1 pt-1">
                    <span>
                      Showing {filteredRecipients.length} of {candidateRecipients.length} numbers in group
                    </span>
                    <span className="text-white font-medium">
                      <strong className="text-emerald-400 font-mono">{selectedRecipientIds.length}</strong> numbers selected for SMS dispatch
                    </span>
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <label className="block font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Pre-built Quick Templates</label>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSmsText(tpl.text)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#6c63ff]/20 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition"
                      >
                        {tpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-400 uppercase tracking-wider">SMS Message Content *</label>
                    <span className="font-mono text-slate-500 text-[11px]">
                      Characters: {smsText.length} · Parts: {Math.ceil(smsText.length / 160) || 1}
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full moom-input"
                    placeholder="Type SMS text..."
                  />
                </div>

                {/* Bottom cost and credits indicator */}
                <div className="bg-[#16161f] p-3.5 rounded-xl border border-[#1e1e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#a78bfa]" />
                    <span className="text-slate-300">
                      Targeted Numbers: <strong className="text-white font-mono text-sm">{selectedRecipientIds.length}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-mono">
                      Estimated: <strong className="text-white">{selectedRecipientIds.length * (Math.ceil(smsText.length / 160) || 1)}</strong> Credits
                    </span>
                    <span className="text-emerald-400 font-mono">8,450 Credits Available</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={selectedRecipientIds.length === 0}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2 transition ${
                      selectedRecipientIds.length > 0
                        ? 'moom-btn-primary cursor-pointer'
                        : 'bg-slate-700/50 text-slate-400 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Broadcast to {selectedRecipientIds.length} Selected Numbers</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Delivery History */}
            <div className="moom-table-container">
              <div className="p-4 bg-[#16161f] border-b border-[#1e1e2e] font-bold text-xs text-white uppercase tracking-wider">
                Recent Gateway Delivery Logs
              </div>
              <div className="divide-y divide-[#1e1e2e] text-xs">
                {smsLogs.map((log) => (
                  <div key={log.id} className="p-4 space-y-1.5 hover:bg-white/[0.01]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{log.recipientGroup}</span>
                      <span className="font-mono text-[11px] text-slate-500">{log.date}</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{log.message}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500 font-mono text-[11px]">Count: {log.count} SMS</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Smartphone Live Preview Mockup (moom24 style) */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Guardian Mobile Phone Preview
            </span>

            <div className="w-[280px] bg-[#16161f] rounded-[36px] p-3 shadow-2xl border-4 border-[#1e1e2e] relative">
              {/* Speaker Notch */}
              <div className="w-20 h-4 bg-black/60 rounded-b-xl mx-auto mb-3" />

              {/* Inner Screen */}
              <div className="bg-[#0a0a0f] rounded-[26px] p-3 min-h-[460px] flex flex-col justify-between text-slate-200 border border-[#1e1e2e]">
                <div className="border-b border-[#1e1e2e] pb-2 text-center">
                  <span className="font-mono text-[10px] text-slate-500">MESSAGES (SMS)</span>
                  <h4 className="font-bold text-xs text-white mt-0.5">{schoolInfo.eiin || '108420'} - {schoolInfo.name || 'Mirashani Academy'}</h4>
                </div>

                <div className="space-y-3 my-auto">
                  <div className="bg-[#16161f] rounded-2xl rounded-tl-none p-3.5 shadow border border-[#1e1e2e] text-xs">
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/5 text-[9px] text-slate-400 font-mono">
                      <span>TO: {candidateRecipients.find((r) => selectedRecipientIds.includes(r.id))?.phone || 'Selected Numbers'}</span>
                      <span className="text-emerald-400 font-bold">{selectedRecipientIds.length} Target{selectedRecipientIds.length !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
                      {smsText || 'Live preview of message appears here...'}
                    </p>
                    <span className="text-[9px] text-slate-500 font-mono block text-right mt-2">
                      Now · Delivered via Gateway
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#1e1e2e] pt-2 text-center text-[10px] text-slate-500">
                  Official SMS Gateway Channel
                </div>
              </div>

              {/* Home bar */}
              <div className="w-24 h-1 bg-white/30 rounded-full mx-auto mt-2" />
            </div>

            {/* Recipient breakdown card under smartphone */}
            <div className="w-[280px] mt-4 p-3.5 bg-[#16161f] rounded-xl border border-[#1e1e2e] text-xs space-y-2">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Target Group:</span>
                <span className="font-semibold text-white truncate max-w-[140px]">{targetGroup}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Selected Numbers:</span>
                <span className="font-bold text-emerald-400 font-mono">{selectedRecipientIds.length} Numbers</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>SMS Parts:</span>
                <span className="font-mono text-slate-300">{Math.ceil(smsText.length / 160) || 1} Part(s)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-white/5">
                <span>Total Credits:</span>
                <span className="font-mono font-bold text-white">
                  {selectedRecipientIds.length * (Math.ceil(smsText.length / 160) || 1)} Credits
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'notice' ? (
        /* Notices Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="moom-card p-6">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#a78bfa]" />
              <span>Publish Official Notice</span>
            </h3>

            <form onSubmit={handlePublishNotice} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Annual Science Fair"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                  className="w-full moom-select"
                >
                  <option value="Academic">Academic Exams & Results</option>
                  <option value="Holiday">Vacation & Holidays</option>
                  <option value="Administrative">Administrative & Parent Meets</option>
                  <option value="Extracurricular">Sports & Cultural Fest</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Priority Level</label>
                <select
                  value={noticeForm.priority}
                  onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                  className="w-full moom-select"
                >
                  <option value="Urgent">Urgent Priority</option>
                  <option value="Normal">Normal Announcement</option>
                  <option value="Special">Special Institutional Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Full Description *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type the full notice body..."
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl moom-btn-primary font-bold text-xs shadow"
              >
                Post to Notice Board
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Active Published Bulletins</h3>

            <div className="space-y-3">
              <div className="moom-card p-5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                    Urgent Notice
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Published: Oct 02, 2026</span>
                </div>
                <h4 className="font-bold text-sm text-white">Half-Yearly Examination 2026 Routine Finalized</h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  All students and guardians are informed that Half-Yearly Examinations will commence on Oct 15. Admit cards will be available from the administration office upon clearance of institutional dues.
                </p>
                <div className="pt-2 border-t border-[#1e1e2e] flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Authorized: {schoolInfo.principalName}</span>
                  <span className="text-[#a78bfa] font-semibold cursor-pointer hover:underline">Download PDF Document</span>
                </div>
              </div>

              <div className="moom-card p-5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                    Academic Advisory
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">Published: Sep 28, 2026</span>
                </div>
                <h4 className="font-bold text-sm text-white">Special Practical Sessions for Class 10 Science Examinees</h4>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Intensive physics and higher mathematics practical mentoring classes will be conducted daily from 03:00 PM to 04:15 PM in Science Labs 1 & 2.
                </p>
                <div className="pt-2 border-t border-[#1e1e2e] flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Authorized: Prof. Dr. Shahinur Rahman, Asst. Headmaster</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 3: SMS Alert Box Customizer & Subscribers List */
        <div className="space-y-6">
          <div className="moom-card p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e2e] pb-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#a78bfa]" />
                  <span>Public Notice Board "SMS Alert Box" Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full dynamic control of the SMS subscription box displayed on the Notices page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlertConfig.isActive !== false}
                    onChange={(e) =>
                      setSmsAlertConfig({ ...smsAlertConfig, isActive: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-xs font-bold text-slate-300">
                    {smsAlertConfig.isActive !== false ? 'Active (Visible)' : 'Hidden'}
                  </span>
                </label>
              </div>
            </div>

            <form onSubmit={handleSaveSmsAlert} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Heading (English)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.title || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, title: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Heading (Bengali)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.titleBn || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, titleBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Subtitle / Description (English)</label>
                  <textarea
                    rows={2}
                    value={smsAlertConfig.subtitle || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, subtitle: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Subtitle / Description (Bengali)</label>
                  <textarea
                    rows={2}
                    value={smsAlertConfig.subtitleBn || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, subtitleBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Input Field Placeholder (English)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.inputPlaceholder || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, inputPlaceholder: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Input Field Placeholder (Bengali)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.inputPlaceholderBn || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, inputPlaceholderBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Button Text (English)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.buttonText || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, buttonText: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Button Text (Bengali)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.buttonTextBn || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, buttonTextBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Success Toast (English)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.successMsg || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, successMsg: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Success Toast (Bengali)</label>
                  <input
                    type="text"
                    value={smsAlertConfig.successMsgBn || ''}
                    onChange={(e) => setSmsAlertConfig({ ...smsAlertConfig, successMsgBn: e.target.value })}
                    className="w-full moom-input"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingAlert}
                  className="moom-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingAlert ? 'Saving...' : 'Save SMS Alert Config'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Subscribers Table */}
          <div className="moom-table-container">
            <div className="p-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-white uppercase tracking-wider block">
                  Subscribed Mobile Numbers ({subscribers.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Submissions captured live from the public Notice Board SMS Alert form
                </span>
              </div>
              <button
                type="button"
                onClick={fetchSubscribers}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {loadingSubscribers ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading subscribers...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No mobile subscribers registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="moom-table">
                  <thead>
                    <tr>
                      <th className="w-12">#</th>
                      <th>Mobile Number</th>
                      <th>Status</th>
                      <th>Language</th>
                      <th>Submitted On</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, idx) => (
                      <tr key={sub._id || sub.id || idx}>
                        <td className="font-mono text-slate-500">{idx + 1}</td>
                        <td className="font-mono font-bold text-white">
                          {sub.phone || sub.guardianPhone || sub.data?.phone || '—'}
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {sub.status || 'Active'}
                          </span>
                        </td>
                        <td className="uppercase font-mono text-[11px] text-slate-400">
                          {sub.data?.lang || 'bn'}
                        </td>
                        <td className="font-mono text-[11px] text-slate-400">
                          {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm('Delete this subscriber?')) {
                                await api.deleteSubmission(sub._id || sub.id)
                                fetchSubscribers()
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                            title="Delete subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
