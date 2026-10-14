import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function MoneyReceiptModal() {
  const { currentReceipt, setCurrentReceipt, schoolInfo } = useDashboard()

  if (!currentReceipt) return null

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8" style={{ background: '#111118', border: '1px solid #1e1e2e' }}>

        {/* Modal Controls — hidden during print */}
        <div className="flex items-center justify-between px-6 py-4 print:hidden" style={{ background: '#16161f', borderBottom: '1px solid #1e1e2e' }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: '#6c63ff' }} />
            <h3 className="font-bold text-base" style={{ color: '#e2e8f0' }}>Official Money Receipt</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 font-semibold text-sm rounded-lg transition"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', color: '#fff' }}
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => setCurrentReceipt(null)}
              className="p-1.5 rounded-lg transition"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt — white for print */}
        <div className="p-8 print:p-4 bg-white text-slate-800" id="printable-receipt">
          {/* Header */}
          <div className="border-b-2 border-indigo-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-yellow-400 flex items-center justify-center font-black text-2xl border-2 border-yellow-400 shadow">
                  {(schoolInfo.name || 'MA').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-indigo-950 tracking-tight">{schoolInfo.name}</h1>
                  <p className="text-xs text-slate-600 font-medium">Est: {schoolInfo.estd} · EIIN: {schoolInfo.eiin}</p>
                  <p className="text-xs text-slate-500">{schoolInfo.address}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-indigo-100 text-indigo-900 font-bold px-3 py-1 rounded text-xs tracking-wider uppercase mb-1">
                  Fee Receipt
                </div>
                <p className="text-xs font-semibold text-slate-700">Voucher No: <span className="font-mono text-indigo-900 font-bold">{currentReceipt.voucherNo}</span></p>
                <p className="text-xs text-slate-500">Date: {currentReceipt.date} · {currentReceipt.time}</p>
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs mb-6">
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-bold text-slate-900 text-sm">{currentReceipt.studentName || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Class &amp; Section:</span>
              <span className="font-semibold text-slate-900">{currentReceipt.class || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Roll No:</span>
              <span className="font-mono font-bold text-indigo-900">{currentReceipt.roll || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Student ID:</span>
              <span className="font-mono font-bold text-slate-800">{currentReceipt.studentId || '—'}</span>
            </div>
          </div>

          {/* Fee Table */}
          <table className="w-full text-xs border-collapse mb-6">
            <thead>
              <tr className="bg-indigo-950 text-white text-left">
                <th className="py-2.5 px-3 rounded-l-md font-semibold">SL</th>
                <th className="py-2.5 px-3 font-semibold">Description / Fee Head</th>
                <th className="py-2.5 px-3 font-semibold">Month / Session</th>
                <th className="py-2.5 px-3 text-right rounded-r-md font-semibold">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 border-b border-slate-200">
              <tr>
                <td className="py-3 px-3 font-mono">01</td>
                <td className="py-3 px-3 font-semibold text-slate-900">{currentReceipt.feeType}</td>
                <td className="py-3 px-3 text-slate-600">{currentReceipt.month || 'Current Session'}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">৳{Number(currentReceipt.amount).toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-50">
                <td colSpan={3} className="py-2.5 px-3 text-right font-bold text-slate-700">Total Collected:</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-indigo-950 text-base">
                  ৳{Number(currentReceipt.amount).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment metadata */}
          <div className="flex flex-wrap items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-8 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Payment Method: <strong>{currentReceipt.paymentMethod}</strong></span>
              {currentReceipt.txId && (
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-[11px]">
                  Txn ID: {currentReceipt.txId}
                </span>
              )}
            </div>
            <div className="font-medium text-emerald-800">
              Status: <span className="font-bold">Fully Paid</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-4 border-t border-slate-200 text-center text-xs">
            <div>
              <div className="h-10 flex items-end justify-center">
                <span className="text-slate-400 italic text-[11px]">Digital Auth</span>
              </div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Collector's Signature &amp; Seal</p>
              <p className="text-[10px] text-slate-500">{currentReceipt.receivedBy || 'Accounts Department'}</p>
            </div>
            <div>
              <div className="h-10 flex items-end justify-center font-bold text-indigo-900">
                <span>{schoolInfo.principalName}</span>
              </div>
              <p className="border-t border-slate-400 pt-1 font-semibold text-slate-800">Headmaster / Principal</p>
              <p className="text-[10px] text-slate-500">{schoolInfo.name}</p>
            </div>
          </div>

          <div className="mt-8 pt-3 border-t border-dashed border-slate-300 text-center text-[10px] text-slate-400">
            * This is a computer-generated digital receipt. Contact the school office for any inquiries. Thank you.
          </div>
        </div>
      </div>
    </div>
  )
}
