import { Printer, X, FileText } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function TransferCertificateModal() {
  const { currentTcStudent, setCurrentTcStudent, schoolInfo } = useDashboard()

  if (!currentTcStudent) return null

  const handlePrint = () => window.print()

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>

        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 print:hidden" style={{ background: '#16161f', borderBottom: '1px solid #1e1e2e' }}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#6c63ff' }} />
            <h3 className="font-bold text-base" style={{ color: '#e2e8f0' }}>Transfer Certificate (TC)</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-sm rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }}
            >
              <Printer className="w-4 h-4" />
              <span>Print TC</span>
            </button>
            <button
              onClick={() => setCurrentTcStudent(null)}
              className="p-1.5 rounded-lg transition"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable TC Body */}
        <div className="p-10 print:p-6 bg-white text-slate-800 border-8 border-indigo-950/10 m-2 rounded-xl" id="printable-tc">
          {/* Header */}
          <div className="border-b-2 border-indigo-950 pb-4 mb-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950 text-yellow-400 flex items-center justify-center font-black text-2xl border-2 border-yellow-400 shadow mb-2">
              {(schoolInfo.name || 'MA').slice(0, 2).toUpperCase()}
            </div>
            <h1 className="text-2xl font-black text-indigo-950 tracking-tight">{schoolInfo.name}</h1>
            <p className="text-xs text-slate-600 font-semibold">Est: {schoolInfo.estd} · EIIN: {schoolInfo.eiin}</p>
            <p className="text-xs text-slate-500">{schoolInfo.address}</p>

            <div className="mt-4">
              <span className="px-6 py-1.5 bg-indigo-950 text-yellow-300 font-bold text-sm rounded-md tracking-wider uppercase inline-block">
                TRANSFER CERTIFICATE
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 mt-4 px-2">
              <span>Memo No: MA/TC/2026/{currentTcStudent.roll || '01'}</span>
              <span>Date: {today}</span>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-5 text-sm text-slate-800 leading-relaxed text-justify">
            <p>
              This is to certify that <strong className="text-indigo-950 border-b border-dotted border-indigo-950 pb-0.5">{currentTcStudent.name}</strong>,
              Father: <strong className="text-slate-900">{currentTcStudent.fatherName || 'Md. Harunur Rashid'}</strong>,
              Mother: <strong className="text-slate-900">{currentTcStudent.motherName || 'Nasima Begum'}</strong>,
              Address: {currentTcStudent.address || 'Mirashani, Madhavpur, Habiganj'}.
            </p>
            <p>
              He/She was a regular student of <strong className="text-indigo-950">{currentTcStudent.className}</strong>, Section <strong className="text-indigo-950">{currentTcStudent.section}</strong> at this institution.
              According to the school register, his/her class roll number is <strong className="font-mono font-bold text-indigo-950">{currentTcStudent.roll}</strong> and Student ID is <strong className="font-mono text-indigo-950">{currentTcStudent.id}</strong>.
              Date of Birth: <strong className="font-mono">{currentTcStudent.dob || '2010-04-12'}</strong>.
            </p>
            <p>
              His/Her conduct and character during the period of study at this institution were satisfactory. All dues including tuition fees and other charges have been fully paid. There are no outstanding liabilities.
            </p>
            <p>
              We wish him/her all the best for future endeavors and academic success.
            </p>
          </div>

          {/* Reason */}
          <div className="mt-8 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <p><strong>Reason for TC:</strong> Guardian's workplace transfer / application for admission to a higher class elsewhere.</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-16 mt-8 text-center text-xs">
            <div>
              <div className="h-10 flex items-end justify-center font-semibold text-slate-700">Head Assistant</div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Prepared By (Signature)</p>
            </div>
            <div>
              <div className="h-10 flex items-end justify-center font-bold text-indigo-950">{schoolInfo.principalName}</div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Headmaster / Principal</p>
              <p className="text-[10px] text-slate-500">{schoolInfo.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
