import { Printer, X, Award } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function ReportCardModal() {
  const { currentReportCard, setCurrentReportCard, schoolInfo } = useDashboard()

  if (!currentReportCard) return null

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-8" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>

        {/* Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 print:hidden" style={{ background: '#16161f', borderBottom: '1px solid #1e1e2e' }}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: '#f59e0b' }} />
            <h3 className="font-bold text-base" style={{ color: '#e2e8f0' }}>Academic Transcript &amp; Marksheet</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-sm rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }}
            >
              <Printer className="w-4 h-4" />
              <span>Print Marksheet</span>
            </button>
            <button
              onClick={() => setCurrentReportCard(null)}
              className="p-1.5 rounded-lg transition"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Body */}
        <div className="p-8 print:p-4 bg-white text-slate-800" id="printable-report-card">
          {/* Header */}
          <div className="border-b-2 border-indigo-950 pb-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-950 text-yellow-400 flex items-center justify-center font-black text-2xl border-2 border-yellow-400 shadow">
                {(schoolInfo.name || 'MA').slice(0, 2).toUpperCase()}
              </div>
              <div className="text-center flex-1 px-4">
                <h1 className="text-2xl font-black text-indigo-950 tracking-tight">{schoolInfo.name}</h1>
                <p className="text-xs text-slate-600 font-semibold">Est: {schoolInfo.estd} · EIIN: {schoolInfo.eiin} · {schoolInfo.board}</p>
                <p className="text-xs text-slate-500">{schoolInfo.address}</p>
                <div className="inline-block mt-1 px-4 py-1 bg-indigo-900 text-yellow-300 font-bold text-xs rounded-full uppercase tracking-wider">
                  ACADEMIC TRANSCRIPT
                </div>
              </div>
              <div className="text-right text-[11px] border border-slate-300 rounded p-1.5 bg-slate-50">
                <p className="font-bold text-slate-700">Grading Scale:</p>
                <p>80–100 = A+ (5.00)</p>
                <p>70–79 = A (4.00)</p>
                <p>60–69 = A- (3.50)</p>
                <p>50–59 = B (3.00)</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-2 bg-slate-100 py-1 rounded text-center">
              Exam: <span className="text-indigo-950">{currentReportCard.exam}</span> · Academic Year: {schoolInfo.currentSession}
            </p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-6">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{currentReportCard.studentName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Class &amp; Section:</span>
              <span className="font-semibold text-slate-900">{currentReportCard.class} ({currentReportCard.section})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll No:</span>
              <span className="font-mono font-bold text-indigo-950">{currentReportCard.roll}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID:</span>
              <span className="font-mono font-bold text-slate-800">{currentReportCard.studentId}</span>
            </div>
          </div>

          {/* Marks Table */}
          <table className="w-full text-xs border-collapse border border-slate-300 mb-6">
            <thead>
              <tr className="bg-indigo-950 text-white text-center">
                <th className="py-2 px-2 border border-slate-400">Code</th>
                <th className="py-2 px-3 text-left border border-slate-400">Subject</th>
                <th className="py-2 px-2 border border-slate-400">Written</th>
                <th className="py-2 px-2 border border-slate-400">MCQ</th>
                <th className="py-2 px-2 border border-slate-400">Practical</th>
                <th className="py-2 px-2 border border-slate-400">Total</th>
                <th className="py-2 px-2 border border-slate-400">Grade</th>
                <th className="py-2 px-2 border border-slate-400">GP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentReportCard.subjects.map((s, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-1.5 px-2 text-center font-mono text-slate-500 border border-slate-300">{s.code}</td>
                  <td className="py-1.5 px-3 font-semibold text-slate-900 border border-slate-300">{s.name}</td>
                  <td className="py-1.5 px-2 text-center font-mono border border-slate-300">{s.written || '—'}</td>
                  <td className="py-1.5 px-2 text-center font-mono border border-slate-300">{s.mcq || '—'}</td>
                  <td className="py-1.5 px-2 text-center font-mono border border-slate-300">{s.practical || '—'}</td>
                  <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-900 border border-slate-300">{s.total}</td>
                  <td className="py-1.5 px-2 text-center font-bold text-indigo-950 border border-slate-300">{s.grade}</td>
                  <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800 border border-slate-300">{Number(s.gpa).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Result Summary */}
          <div className="grid grid-cols-3 gap-4 bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center mb-6">
            <div>
              <p className="text-xs text-indigo-800 font-medium">Total Marks Obtained</p>
              <p className="text-xl font-mono font-black text-indigo-950">{currentReportCard.totalMarks}</p>
            </div>
            <div className="border-x border-indigo-200">
              <p className="text-xs text-indigo-800 font-medium">Grade Point Average (GPA)</p>
              <p className="text-2xl font-mono font-black text-emerald-700">{currentReportCard.gpa} ({currentReportCard.grade})</p>
            </div>
            <div>
              <p className="text-xs text-indigo-800 font-medium">Merit Position</p>
              <p className="text-xl font-bold text-indigo-950">{currentReportCard.meritPosition || '1st'}</p>
            </div>
          </div>

          {/* Remarks */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs mb-8">
            <span className="font-bold text-slate-700">Class Teacher's Remarks: </span>
            <span className="text-slate-600 italic">{currentReportCard.remarks || 'Keep up regular study habits and maintain discipline.'}</span>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-300 text-center text-xs">
            <div>
              <div className="h-10 flex items-end justify-center font-semibold text-slate-700">Class Teacher</div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Class Teacher's Signature</p>
            </div>
            <div>
              <div className="h-10 flex items-end justify-center font-semibold text-slate-700">Guardian</div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Guardian's Signature</p>
            </div>
            <div>
              <div className="h-10 flex items-end justify-center font-bold text-indigo-950">{schoolInfo.principalName}</div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Headmaster's Signature &amp; Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
