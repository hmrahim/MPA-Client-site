import { useState } from 'react'
import {
  BookOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  BookmarkCheck,
  X
} from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'

export default function LibraryManager() {
  const { books, borrowings, students, issueBook, returnBook, addBook } = useDashboard()

  const [activeTab, setActiveTab] = useState('catalog')
  const [searchQuery, setSearchQuery] = useState('')
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const [issueForm, setIssueForm] = useState({
    bookId: books[0]?.id || '',
    studentId: students[0]?.id || '',
    dueDate: '2026-10-15'
  })

  const [newBookForm, setNewBookForm] = useState({
    title: '',
    author: '',
    category: 'Physics & Science',
    isbn: '978-019-',
    totalCopies: 10,
    shelf: 'A-1'
  })

  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase()
    return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
  })

  const handleIssueSubmit = (e) => {
    e.preventDefault()
    const success = issueBook(issueForm.bookId, issueForm.studentId, issueForm.dueDate)
    if (success) {
      setIsIssueModalOpen(false)
      setToastMessage('✓ Book issued to student successfully!')
      setTimeout(() => setToastMessage(null), 3000)
    } else {
      alert('Unable to issue book. No copies available in circulation.')
    }
  }

  const handleCreateBook = (e) => {
    e.preventDefault()
    if (!newBookForm.title || !newBookForm.author) {
      alert('Please fill out book title and author.')
      return
    }
    addBook(newBookForm)
    setIsAddBookModalOpen(false)
    setNewBookForm({
      title: '',
      author: '',
      category: 'Physics & Science',
      isbn: '978-019-',
      totalCopies: 10,
      shelf: 'A-1'
    })
    setToastMessage('✓ New book added to library catalog!')
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleReturn = (borrowId, bookTitle) => {
    returnBook(borrowId)
    setToastMessage(`✓ '${bookTitle}' returned to circulation successfully!`)
    setTimeout(() => setToastMessage(null), 3000)
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
          <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Library Information System</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Library Catalog & Circulation
          </h2>
          <p className="text-xs text-slate-400">
            Book repository inventory, lending circulation, and overdue tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="moom-btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>Issue Book</span>
          </button>
          <button
            onClick={() => setIsAddBookModalOpen(true)}
            className="moom-btn-ghost px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Subtabs and Search */}
      <div className="moom-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex bg-[#16161f] p-1 rounded-xl border border-[#1e1e2e]">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'catalog' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Catalog Inventory ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'borrowed' ? 'bg-[#6c63ff] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Borrowed Records ({borrowings.filter((b) => b.status !== 'returned').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search book title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full moom-input pl-9"
          />
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="moom-table-container">
          <table className="moom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Shelf</th>
                <th className="text-center">Total</th>
                <th className="text-center">Available</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono font-bold text-teal-400">{b.id}</td>
                  <td className="font-bold text-white">{b.title}</td>
                  <td className="text-slate-300 text-xs">{b.author}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-semibold text-[10px] border border-white/10">
                      {b.category}
                    </span>
                  </td>
                  <td className="font-mono font-semibold text-slate-400 text-xs">{b.shelf}</td>
                  <td className="text-center font-mono font-bold text-slate-400">{b.totalCopies}</td>
                  <td className="text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs border ${
                        b.availableCopies > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {b.availableCopies} Copies
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => {
                        setIssueForm({ ...issueForm, bookId: b.id })
                        setIsIssueModalOpen(true)
                      }}
                      disabled={b.availableCopies <= 0}
                      className="moom-btn-primary px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40"
                    >
                      Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Borrowed Circulation Tab */
        <div className="moom-table-container">
          <table className="moom-table">
            <thead>
              <tr>
                <th>Borrow ID</th>
                <th>Book Title</th>
                <th>Student</th>
                <th>Issued</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((br) => (
                <tr key={br.id}>
                  <td className="font-mono font-bold text-[#a78bfa]">{br.id}</td>
                  <td className="font-bold text-white">{br.bookTitle}</td>
                  <td>
                    <span className="font-semibold text-slate-200 block">{br.studentName}</span>
                    <span className="text-[10px] text-slate-400">{br.class} (Roll {br.roll})</span>
                  </td>
                  <td className="font-mono text-slate-400 text-xs">{br.issueDate}</td>
                  <td className="font-mono font-bold text-white text-xs">{br.dueDate}</td>
                  <td>
                    {br.status === 'returned' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Returned
                      </span>
                    ) : br.status === 'overdue' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold moom-pulse-dot">
                        Overdue
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold">
                        Active Loan
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    {br.status !== 'returned' && (
                      <button
                        onClick={() => handleReturn(br.id, br.bookTitle)}
                        className="moom-btn-emerald px-3 py-1 rounded-lg font-semibold text-xs shadow-sm"
                      >
                        Accept Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Book Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#111118] text-slate-200 rounded-2xl shadow-2xl overflow-hidden border border-[#1e1e2e]">
            <div className="px-6 py-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Issue Book to Student</h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Select Book</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full moom-select"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} (Available: {b.availableCopies})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Select Student</label>
                <select
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                  className="w-full moom-select"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - {s.className} (Roll {s.roll})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Return Due Date</label>
                <input
                  type="date"
                  required
                  value={issueForm.dueDate}
                  onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                  className="w-full moom-input font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="moom-btn-ghost px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="moom-btn-primary px-6 py-2 rounded-xl font-bold shadow"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#111118] text-slate-200 rounded-2xl shadow-2xl overflow-hidden border border-[#1e1e2e]">
            <div className="px-6 py-4 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Add New Book to Repository</h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  value={newBookForm.title}
                  onChange={(e) => setNewBookForm({ ...newBookForm, title: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Author *</label>
                <input
                  type="text"
                  required
                  value={newBookForm.author}
                  onChange={(e) => setNewBookForm({ ...newBookForm, author: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Category / Discipline</label>
                <input
                  type="text"
                  value={newBookForm.category}
                  onChange={(e) => setNewBookForm({ ...newBookForm, category: e.target.value })}
                  className="w-full moom-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={newBookForm.totalCopies}
                    onChange={(e) => setNewBookForm({ ...newBookForm, totalCopies: Number(e.target.value) })}
                    className="w-full moom-input font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Shelf Number</label>
                  <input
                    type="text"
                    value={newBookForm.shelf}
                    onChange={(e) => setNewBookForm({ ...newBookForm, shelf: e.target.value })}
                    className="w-full moom-input font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="moom-btn-ghost px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="moom-btn-primary px-6 py-2 rounded-xl font-bold shadow"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
