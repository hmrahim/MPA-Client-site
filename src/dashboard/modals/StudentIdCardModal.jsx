import { Printer, X, Award, QrCode } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function StudentIdCardModal() {
  const { currentStudentForId, setCurrentStudentForId, schoolInfo } = useDashboard()

  if (!currentStudentForId) return null

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden my-8" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>

        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 print:hidden" style={{ background: '#16161f', borderBottom: '1px solid #1e1e2e' }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: '#f59e0b' }} />
            <h3 className="font-bold text-base" style={{ color: '#e2e8f0' }}>Student ID Card</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-sm rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }}
            >
              <Printer className="w-4 h-4" />
              <span>Print ID Card</span>
            </button>
            <button
              onClick={() => setCurrentStudentForId(null)}
              className="p-1.5 rounded-lg transition"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ID Card Presentation */}
        <div className="p-8 print:p-0 flex flex-col items-center justify-center gap-6 print:bg-white" style={{ background: '#0a0a0f' }}>
          {/* Card Front */}
          <div className="w-[340px] bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-950 flex flex-col text-slate-800">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white p-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-400 text-indigo-950 font-black text-lg flex items-center justify-center shadow mb-1">
                {(schoolInfo.name || 'MA').slice(0, 2).toUpperCase()}
              </div>
              <h2 className="font-black text-sm tracking-tight leading-tight">{schoolInfo.name}</h2>
              <p className="text-[10px] text-white/70 font-medium">Est: {schoolInfo.estd} · EIIN: {schoolInfo.eiin}</p>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold uppercase tracking-wider">
                STUDENT IDENTITY CARD
              </div>
            </div>

            {/* Photo & Details */}
            <div className="p-4 flex flex-col items-center gap-3">
              {/* Photo */}
              <div className="relative -mt-6">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                  <img
                    src={currentStudentForId.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentStudentForId.name || 'S')}&background=6c63ff&color=fff&size=150`}
                    alt={currentStudentForId.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow border border-white">
                  {currentStudentForId.bloodGroup || 'A+'}
                </span>
              </div>

              {/* Student Name */}
              <div className="text-center">
                <h3 className="font-black text-base text-indigo-950 leading-tight">{currentStudentForId.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{currentStudentForId.className} — Roll: {currentStudentForId.roll}</p>
              </div>

              {/* Info Table */}
              <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs space-y-1">
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono font-bold text-indigo-950">{currentStudentForId.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Class &amp; Section:</span>
                  <span className="font-bold text-slate-800">{currentStudentForId.className} ({currentStudentForId.section})</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Class Roll:</span>
                  <span className="font-bold text-indigo-900">{currentStudentForId.roll}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-0.5">
                  <span className="text-slate-500">Guardian Phone:</span>
                  <span className="font-mono text-slate-800">{currentStudentForId.guardianPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valid Until:</span>
                  <span className="font-semibold text-emerald-700">31 Dec 2026</span>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200 text-center">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-8 h-8 text-slate-800" />
                  <div className="text-left">
                    <p className="text-[8px] font-mono text-slate-500">EIIN: {schoolInfo.eiin}</p>
                    <p className="text-[8px] font-bold text-indigo-950">{(schoolInfo.name || '').toUpperCase()}</p>
                  </div>
                </div>
                <div>
                  <div className="h-6 flex items-end justify-center text-[10px] font-bold text-indigo-900">
                    {(schoolInfo.principalName || '').split(' ')[0]}
                  </div>
                  <p className="border-t border-slate-400 text-[8px] font-bold text-slate-700">Headmaster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
