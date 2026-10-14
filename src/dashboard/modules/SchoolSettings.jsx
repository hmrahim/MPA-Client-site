import { useState } from 'react'
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  RefreshCw,
  Building,
  UserCheck,
  KeyRound,
  Bell,
  Globe
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

const roles = [
  { value: 'principal', label: 'Principal / Headmaster', icon: '🎓' },
  { value: 'admin', label: 'Admin Officer', icon: '🛡️' },
  { value: 'accountant', label: 'Accountant', icon: '💰' },
  { value: 'teacher', label: 'Class Teacher', icon: '📚' },
]

export default function SchoolSettings() {
  const { schoolInfo, setSchoolInfo, activeRole, setActiveRole, resetAllDataToDefault } = useDashboard()

  const [formData, setFormData] = useState({ ...schoolInfo })
  const [toast, setToast] = useState(null)
  const [activeTab, setActiveTab] = useState('general')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSchoolInfo(formData)
    showToast('✓ School information and configuration saved successfully!')
  }

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset ALL data to default? This cannot be undone.')) {
      resetAllDataToDefault()
      showToast('✓ All data has been reset to default values!')
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const tabs = [
    { id: 'general', label: 'General Info', icon: Building },
    { id: 'access', label: 'Access Control', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Settings },
  ]

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl animate-bounce"
          style={{ background: '#111118', border: '1px solid #6c63ff', color: '#e2e8f0' }}
        >
          <CheckCircle2 className="w-5 h-5" style={{ color: '#6c63ff' }} />
          <span className="font-semibold text-sm">{toast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold px-2.5 py-1 rounded-full mb-1" style={{ background: 'rgba(108,99,255,0.12)', color: '#a78bfa' }}>
            <Settings className="w-3.5 h-3.5" />
            System Configuration
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#e2e8f0' }}>School Settings</h2>
          <p className="text-sm" style={{ color: '#94a3b8' }}>Manage institution profile, access control, and system preferences</p>
        </div>
        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <RefreshCw className="w-4 h-4" />
          Reset All Data
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition flex-1 justify-center"
              style={active
                ? { background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }
                : { color: '#94a3b8', background: 'transparent' }
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* General Info Tab */}
      {activeTab === 'general' && (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="p-6 rounded-2xl space-y-5" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
            <div className="flex items-center gap-2 mb-1">
              <Building className="w-4 h-4" style={{ color: '#6c63ff' }} />
              <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>Institution Profile</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>School / Institution Name</label>
                <input
                  className="moom-input"
                  value={formData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="e.g. Mirashani Academy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>EIIN Number</label>
                <input
                  className="moom-input"
                  value={formData.eiin || ''}
                  onChange={e => handleChange('eiin', e.target.value)}
                  placeholder="e.g. 108123"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Established Year</label>
                <input
                  className="moom-input"
                  value={formData.estd || ''}
                  onChange={e => handleChange('estd', e.target.value)}
                  placeholder="e.g. 1995"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Board of Education</label>
                <input
                  className="moom-input"
                  value={formData.board || ''}
                  onChange={e => handleChange('board', e.target.value)}
                  placeholder="e.g. Sylhet Education Board"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Current Academic Session</label>
                <input
                  className="moom-input"
                  value={formData.currentSession || ''}
                  onChange={e => handleChange('currentSession', e.target.value)}
                  placeholder="e.g. 2025-2026"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Contact Phone</label>
                <input
                  className="moom-input"
                  value={formData.phone || ''}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="e.g. +880 1700-000000"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Full Address</label>
                <input
                  className="moom-input"
                  value={formData.address || ''}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="Village, Upazila, District"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Headmaster / Principal Name</label>
                <input
                  className="moom-input"
                  value={formData.principalName || ''}
                  onChange={e => handleChange('principalName', e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Email Address</label>
                <input
                  type="email"
                  className="moom-input"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="school@example.com"
                />
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 rounded-xl" style={{ background: '#16161f', border: '1px solid #1e1e2e' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#94a3b8' }}>Live Preview — Official Header</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 text-yellow-400 flex items-center justify-center font-black text-xl border-2 border-yellow-400 shrink-0">
                  {(formData.name || 'MA').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-indigo-950 text-base leading-tight">{formData.name || 'School Name'}</p>
                  <p className="text-[10px] text-slate-500">EIIN: {formData.eiin || '—'} · Est: {formData.estd || '—'} · {formData.board || '—'}</p>
                  <p className="text-[10px] text-slate-400">{formData.address || '—'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }}
              >
                <Save className="w-4 h-4" />
                Save Institution Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access' && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-4 h-4" style={{ color: '#6c63ff' }} />
              <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>Active Role / Login Mode</h3>
            </div>
            <p className="text-xs mb-4" style={{ color: '#94a3b8' }}>Select the current user's role to control dashboard feature visibility.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map(role => (
                <button
                  key={role.value}
                  onClick={() => setActiveRole(role.value)}
                  className="flex items-center gap-3 p-4 rounded-xl text-left transition"
                  style={activeRole === role.value
                    ? { background: 'rgba(108,99,255,0.15)', border: '1px solid #6c63ff', color: '#e2e8f0' }
                    : { background: '#16161f', border: '1px solid #1e1e2e', color: '#94a3b8' }
                  }
                >
                  <span className="text-2xl">{role.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{role.label}</p>
                    {activeRole === role.value && (
                      <p className="text-xs mt-0.5" style={{ color: '#a78bfa' }}>Currently Active</p>
                    )}
                  </div>
                  {activeRole === role.value && (
                    <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" style={{ color: '#6c63ff' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="w-4 h-4" style={{ color: '#f59e0b' }} />
              <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>Security &amp; Password</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Current Password</label>
                <input type="password" className="moom-input" placeholder="Enter current password" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>New Password</label>
                <input type="password" className="moom-input" placeholder="Enter new password" />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition"
                style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <KeyRound className="w-4 h-4" />
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl space-y-4" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4" style={{ color: '#6c63ff' }} />
            <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>Notification Preferences</h3>
          </div>

          {[
            { label: 'Fee Due Alerts', desc: 'Notify when student fees are overdue by 7+ days', enabled: true },
            { label: 'Attendance Alerts', desc: 'Alert when attendance drops below 75%', enabled: true },
            { label: 'Exam Result Published', desc: 'Notify parents/students when results are posted', enabled: false },
            { label: 'New Admission', desc: 'Alert admin on new student registration', enabled: true },
            { label: 'SMS Delivery Reports', desc: 'Track bulk SMS delivery status', enabled: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#16161f', border: '1px solid #1e1e2e' }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{item.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>{item.desc}</p>
              </div>
              <div
                className="w-12 h-6 rounded-full flex items-center cursor-pointer transition-all"
                style={{ background: item.enabled ? 'rgba(108,99,255,0.3)' : '#1e1e2e', padding: '2px' }}
              >
                <div
                  className="w-5 h-5 rounded-full transition-all"
                  style={{
                    background: item.enabled ? '#6c63ff' : '#475569',
                    transform: item.enabled ? 'translateX(24px)' : 'translateX(0)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4" style={{ color: '#6c63ff' }} />
              <h3 className="font-bold text-sm" style={{ color: '#e2e8f0' }}>System Preferences</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Language</label>
                <select className="moom-select">
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Time Zone</label>
                <select className="moom-select">
                  <option>Asia/Dhaka (GMT+6)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Currency</label>
                <select className="moom-select">
                  <option>BDT (৳) — Bangladeshi Taka</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#94a3b8' }}>Date Format</label>
                <select className="moom-select">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="p-6 rounded-2xl" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: '#e2e8f0' }}>System Information</h3>
            <div className="space-y-3">
              {[
                { label: 'App Version', value: 'MPA ERP v2.0.0' },
                { label: 'Build', value: 'Production (Vite + React)' },
                { label: 'Database', value: 'LocalStorage (Client-side)' },
                { label: 'Last Data Reset', value: 'Never' },
                { label: 'Total Students', value: 'Dynamic from context' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: '#1e1e2e' }}>
                  <span className="text-sm" style={{ color: '#94a3b8' }}>{item.label}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: '#e2e8f0' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h3 className="font-bold text-sm mb-2" style={{ color: '#f87171' }}>⚠️ Danger Zone</h3>
            <p className="text-xs mb-4" style={{ color: '#94a3b8' }}>Resetting data will remove all students, teachers, fees, results, and restore mock defaults. This action cannot be undone.</p>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition"
              style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset All Data to Default
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
