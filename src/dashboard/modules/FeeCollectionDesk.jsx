import { useState } from 'react'
import {
  DollarSign,
  Search,
  Printer,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function FeeCollectionDesk({ preSelectedStudent }) {
  const {
    students,
    feeTransactions,
    expenses,
    collectFee,
    addExpense,
    setCurrentReceipt
  } = useDashboard()

  const [activeTab, setActiveTab] = useState('collect') // 'collect' | 'ledger' | 'expense'
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(preSelectedStudent || students[0] || null)

  // Fee Collection Form State
  const [selectedFeeItems, setSelectedFeeItems] = useState({
    tuition: true,
    exam: false,
    ict: true,
    transport: false,
    session: false
  })

  const [feeAmounts, setFeeAmounts] = useState({
    tuition: 800,
    exam: 600,
    ict: 200,
    transport: 500,
    session: 1200
  })

  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('bKash Online')
  const [txId, setTxId] = useState('')
  const [successToast, setSuccessToast] = useState(null)

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Payroll',
    amount: '',
    paidTo: '',
    method: 'Cash'
  })

  // Calculate totals
  const subTotal = Object.keys(selectedFeeItems).reduce((sum, key) => {
    return selectedFeeItems[key] ? sum + (Number(feeAmounts[key]) || 0) : sum
  }, 0)
  const grandTotal = Math.max(0, subTotal - Number(discount || 0))

  const totalIncome = feeTransactions.reduce((acc, t) => acc + Number(t.amount || 0), 0)
  const totalExpense = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0)
  const netBalance = totalIncome - totalExpense

  const handleSelectStudent = (st) => {
    setSelectedStudent(st)
    setStudentSearch('')
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault()
    if (!selectedStudent) {
      alert('Please select a student first.')
      return
    }

    const feeDescription = Object.keys(selectedFeeItems)
      .filter((k) => selectedFeeItems[k])
      .map((k) => {
        if (k === 'tuition') return 'Monthly Tuition'
        if (k === 'exam') return 'Exam Fee'
        if (k === 'ict') return 'ICT Lab Charge'
        if (k === 'transport') return 'Bus Transport'
        return 'Session Charge'
      })
      .join(' + ')

    const paymentPayload = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      class: `${selectedStudent.className} (${selectedStudent.section})`,
      roll: selectedStudent.roll,
      month: 'October 2026',
      feeType: feeDescription || 'Academic Monthly Fee',
      amount: grandTotal,
      paymentMethod,
      txId: txId || (paymentMethod.includes('Cash') ? `CSH-${Math.floor(1000 + Math.random() * 9000)}` : `TX-${Math.floor(100000 + Math.random() * 900000)}`),
      receivedBy: 'Senior Cashier'
    }

    const createdTx = collectFee(paymentPayload)
    setSuccessToast(`৳${grandTotal} payment processed successfully! Voucher: ${createdTx.voucherNo}`)
    setTimeout(() => setSuccessToast(null), 4000)
    setTxId('')
  }

  const handleCreateExpense = (e) => {
    e.preventDefault()
    if (!expenseForm.title || !expenseForm.amount) {
      alert('Please fill out expense title and amount.')
      return
    }

    addExpense(expenseForm)
    setExpenseForm({
      title: '',
      category: 'Payroll',
      amount: '',
      paidTo: '',
      method: 'Cash'
    })
    setSuccessToast('New expense entry logged successfully!')
    setTimeout(() => setSuccessToast(null), 3000)
  }

  const searchedStudents = studentSearch
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.roll.includes(studentSearch) ||
          s.id.toLowerCase().includes(studentSearch.toLowerCase())
      )
    : []

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16161f] text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-xs">{successToast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 moom-card p-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Fast Billing & Accounts Counter</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Fee Collection POS & Accounts
          </h2>
          <p className="text-xs text-slate-400">
            One-click student fee collection, instant money receipt printing, and expense ledger
          </p>
        </div>

        <div className="flex bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e]">
          <button
            onClick={() => setActiveTab('collect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'collect' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fee Collection Desk
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'ledger' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Collection Register
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'expense' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Expense Ledger
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="moom-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Total Revenue (Inflow)</span>
            <span className="text-2xl font-black font-mono text-emerald-400">৳{totalIncome.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Tuition & session charges</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="moom-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Total Expenses (Outflow)</span>
            <span className="text-2xl font-black font-mono text-rose-400">৳{totalExpense.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 block mt-1">Salaries & utilities</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="moom-card p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block uppercase">Net Treasury Balance</span>
            <span className="text-2xl font-black font-mono text-white">৳{netBalance.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1">✓ Healthy Reserve</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#6c63ff]/10 text-[#a78bfa] border border-[#6c63ff]/20 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {activeTab === 'collect' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Selector */}
          <div className="space-y-4">
            <div className="moom-card p-5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#a78bfa]" />
                <span>Select Student</span>
              </h3>

              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Type name, roll or student ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full moom-input"
                />

                {searchedStudents.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#16161f] border border-[#1e1e2e] rounded-xl shadow-2xl z-20 max-h-48 overflow-y-auto divide-y divide-[#1e1e2e]">
                    {searchedStudents.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleSelectStudent(st)}
                        className="p-2.5 hover:bg-[#6c63ff]/10 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-white block">{st.name}</span>
                          <span className="text-[10px] text-slate-400">{st.className} · Roll {st.roll}</span>
                        </div>
                        <span className="font-mono text-[10px] text-[#a78bfa] font-bold">{st.id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedStudent && (
                <div className="bg-[#16161f] border border-[#1e1e2e] rounded-xl p-4 text-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#6c63ff]"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedStudent.name}</h4>
                      <p className="text-slate-400">{selectedStudent.className} ({selectedStudent.section})</p>
                      <p className="font-mono text-[#a78bfa] font-bold">Roll: {selectedStudent.roll} · {selectedStudent.id}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1e1e2e] flex items-center justify-between">
                    <span className="text-slate-400">Current Outstanding Due:</span>
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                      ৳{selectedStudent.feeDue || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Roster Switch */}
            <div className="moom-card p-5">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">Quick Student Switch</h4>
              <div className="space-y-1">
                {students.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudent(s)}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                      selectedStudent?.id === s.id
                        ? 'bg-[#6c63ff]/15 text-white font-bold border border-[#6c63ff]/30'
                        : 'text-slate-400 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span>{s.name} (Roll {s.roll})</span>
                    <span className="text-[10px] text-slate-500">{s.className}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Billing Breakdown Form */}
          <div className="lg:col-span-2 moom-card p-6">
            <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-400" />
              <span>Billing Breakdown & Fee Heads</span>
            </h3>

            <form onSubmit={handlePaymentSubmit} className="space-y-5">
              <div className="space-y-2.5">
                {[
                  { key: 'tuition', label: 'Monthly Academic Tuition Fee', defaultVal: 800 },
                  { key: 'exam', label: 'Half-Yearly / Annual Examination Fee', defaultVal: 600 },
                  { key: 'ict', label: 'Computer & Digital Lab Maintenance', defaultVal: 200 },
                  { key: 'transport', label: 'School Bus Transport Fare', defaultVal: 500 },
                  { key: 'session', label: 'Annual Campus Development Charge', defaultVal: 1200 }
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      selectedFeeItems[item.key]
                        ? 'bg-[#16161f] border-[#6c63ff]/40 shadow-[0_0_10px_rgba(108,99,255,0.1)]'
                        : 'bg-[#111118] border-[#1e1e2e] opacity-60'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-slate-200">
                      <input
                        type="checkbox"
                        checked={selectedFeeItems[item.key]}
                        onChange={(e) =>
                          setSelectedFeeItems({ ...selectedFeeItems, [item.key]: e.target.checked })
                        }
                        className="rounded border-[#1e1e2e] bg-[#16161f] accent-[#6c63ff] w-4 h-4"
                      />
                      <span>{item.label}</span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-500 font-bold">৳</span>
                      <input
                        type="number"
                        disabled={!selectedFeeItems[item.key]}
                        value={feeAmounts[item.key]}
                        onChange={(e) =>
                          setFeeAmounts({ ...feeAmounts, [item.key]: Number(e.target.value) })
                        }
                        className="w-24 moom-input text-right font-mono font-bold text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount and Payment Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Scholarship / Waiver Discount (৳)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full moom-input font-mono font-bold text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full moom-select font-semibold"
                  >
                    <option value="bKash Online">bKash Online Gateway</option>
                    <option value="Nagad Gateway">Nagad Mobile Pay</option>
                    <option value="Cash Counter">Cash Counter (Direct)</option>
                    <option value="Rocket Pay">Rocket Pay</option>
                    <option value="Sonali Bank Ltd">Sonali Bank Deposit</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 mb-1">Transaction ID / Reference Memo</label>
                  <input
                    type="text"
                    placeholder="e.g. TrxID: BK9877265 or Bank Deposit Slip #"
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    className="w-full moom-input font-mono"
                  />
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="bg-[#16161f] border border-[#1e1e2e] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Net Payable Amount</span>
                  <span className="text-xs text-[#a78bfa]">Waiver Deducted</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-emerald-400">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={grandTotal <= 0}
                  className="moom-btn-primary px-6 py-3 rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Printer className="w-4 h-4" />
                  <span>Accept Payment & Print Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Collection Ledger */}
      {activeTab === 'ledger' && (
        <div className="moom-table-container">
          <div className="p-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">All Fee Collections & Vouchers</h3>
            <span className="text-xs text-slate-400 font-mono">Records: {feeTransactions.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="moom-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Student Name</th>
                  <th>Class & Roll</th>
                  <th>Fee Particulars</th>
                  <th>Method</th>
                  <th className="text-right">Amount (৳)</th>
                  <th className="text-center">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {feeTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="font-mono font-bold text-[#a78bfa]">{tx.voucherNo}</td>
                    <td className="font-bold text-white">{tx.studentName}</td>
                    <td className="text-slate-400 text-xs">
                      {tx.class} (Roll {tx.roll})
                    </td>
                    <td className="text-slate-300 text-xs">{tx.feeType}</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold text-white">
                      ৳{Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => setCurrentReceipt(tx)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold inline-flex items-center gap-1 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Expenses */}
      {activeTab === 'expense' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="moom-card p-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span>Record Institutional Expense</span>
            </h3>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab Reagents"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full moom-select"
                >
                  <option value="Payroll">Faculty & Staff Payroll</option>
                  <option value="Utilities">Utilities & Electricity</option>
                  <option value="Laboratory">Laboratory & Computing</option>
                  <option value="Maintenance">Campus Maintenance</option>
                  <option value="Extracurricular">Sports & Extracurricular</option>
                  <option value="Administrative">Administrative Sundries</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full moom-input font-mono font-bold text-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Paid To / Payee</label>
                <input
                  type="text"
                  placeholder="Vendor or payee name"
                  value={expenseForm.paidTo}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paidTo: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Payment Method</label>
                <select
                  value={expenseForm.method}
                  onChange={(e) => setExpenseForm({ ...expenseForm, method: e.target.value })}
                  className="w-full moom-select"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Cheque">Bank Cheque</option>
                  <option value="bKash Merchant">bKash Merchant</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl moom-btn-rose font-bold text-xs shadow transition mt-2 cursor-pointer"
              >
                Log Expense Entry
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 moom-table-container">
            <div className="p-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Expense Ledger & Cash Outflows</h3>
              <span className="text-xs font-bold text-rose-400 font-mono">Total: ৳{totalExpense.toLocaleString()}</span>
            </div>

            <table className="moom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Particulars</th>
                  <th>Category</th>
                  <th>Payee</th>
                  <th className="text-right">Amount (৳)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="font-mono text-slate-400 text-xs">{exp.date}</td>
                    <td className="font-bold text-white text-xs">{exp.title}</td>
                    <td>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-white/5 text-slate-300 text-[10px] font-semibold border border-white/10">
                        {exp.category}
                      </span>
                    </td>
                    <td className="text-slate-400 text-xs">{exp.paidTo}</td>
                    <td className="text-right font-mono font-bold text-rose-400 text-xs">
                      ৳{Number(exp.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
