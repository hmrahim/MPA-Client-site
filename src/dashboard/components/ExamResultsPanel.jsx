import { useMemo, useState } from 'react'
import { Award, BookOpen, Clock, FileText, GraduationCap, Printer, TrendingUp } from 'lucide-react'
import { useDashboard } from '../context/DashboardContext'
import { EXAMS, buildExamResults, gradeColor, barColor } from '../lib/studentData'

/** Exam list, marksheets, GPA trend and subject comparison for one student. */
export default function ExamResultsPanel({ student }) {
  const { examResults, students, setCurrentReportCard } = useDashboard()
  const [selectedExam, setSelectedExam] = useState('Half-Yearly Examination 2026')

  const allResults = useMemo(() => buildExamResults(student, students, examResults), [student, students, examResults])
  const publishedResults = allResults.filter((x) => x.published).map((x) => x.result)
  const studentResult =
    allResults.find((x) => x.exam.name === 'Half-Yearly Examination 2026' && x.published)?.result ||
    publishedResults[publishedResults.length - 1]
  const selectedEntry = allResults.find((x) => x.exam.name === selectedExam)
  const avgGpa = publishedResults.length
    ? (publishedResults.reduce((a, r) => a + parseFloat(r.gpa), 0) / publishedResults.length).toFixed(2)
    : '—'
  const bestResult = publishedResults.reduce((best, r) => (!best || parseFloat(r.gpa) > parseFloat(best.gpa) ? r : best), null)

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Exams Published', value: `${publishedResults.length} / ${EXAMS.length}`, color: 'text-white' },
          { label: 'Average GPA', value: avgGpa, color: 'text-emerald-400' },
          { label: 'Best GPA', value: bestResult ? bestResult.gpa : '—', color: 'text-[#a78bfa]', sub: bestResult ? bestResult.exam.replace(/ (Examination|Assessment) 2026/, '') : '' },
          { label: 'Latest Rank', value: studentResult ? `#${studentResult.meritPosition}` : '—', color: 'text-amber-400', sub: studentResult ? `of ${studentResult.classSize}` : '' }
        ].map((c) => (
          <div key={c.label} className="p-3 bg-[#16161f] rounded-xl border border-[#1e1e2e]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">{c.label}</span>
            <span className={`text-xl font-black font-mono ${c.color}`}>{c.value}</span>
            {c.sub && <span className="text-[10px] text-slate-500 ml-1.5">{c.sub}</span>}
          </div>
        ))}
      </div>

      {/* All exams: pick one to open its marksheet */}
      <div>
        <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-2.5">
          <GraduationCap className="w-4 h-4 text-[#a78bfa]" />
          All Examinations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allResults.map(({ exam, published, result }) => {
            const active = selectedExam === exam.name
            return (
              <div
                key={exam.name}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedExam(exam.name)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedExam(exam.name)}
                className={`text-left p-3.5 rounded-2xl border cursor-pointer transition ${
                  active
                    ? 'bg-gradient-to-br from-[#6c63ff]/20 to-[#16161f] border-[#6c63ff]/60 shadow-[0_0_18px_rgba(108,99,255,0.25)]'
                    : 'bg-[#16161f] border-[#1e1e2e] hover:border-[#6c63ff]/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-white truncate">{exam.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{exam.date}</p>
                  </div>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                      !published
                        ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        : result.passed
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}
                  >
                    {!published ? 'UPCOMING' : result.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                {published ? (
                  <>
                    <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                      {[
                        ['GPA', result.gpa, 'text-emerald-400'],
                        ['Grade', result.grade, gradeColor(result.grade)],
                        ['Marks', result.totalMarks, 'text-white'],
                        ['Rank', `#${result.meritPosition}`, 'text-amber-400']
                      ].map(([l, v, c]) => (
                        <div key={l} className="bg-black/20 rounded-lg py-1.5">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">{l}</span>
                          <span className={`text-sm font-black font-mono ${c}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentReportCard(result)
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg text-[11px] font-bold moom-btn-ghost inline-flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Open Marksheet
                    </button>
                  </>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-3">Result not published yet.</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* GPA trend */}
      {publishedResults.length > 1 && (
        <div className="moom-card p-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
            GPA Progress
          </h4>
          <div className="flex items-end gap-4 h-28">
            {allResults.map(({ exam, published, result }) => (
              <div key={exam.name} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                {published ? (
                  <>
                    <span className="text-[10px] font-mono font-bold text-white">{result.gpa}</span>
                    <div
                      className={`w-full max-w-[44px] rounded-t-lg ${barColor(parseFloat(result.gpa) * 20)}`}
                      style={{ height: `${Math.max(6, (parseFloat(result.gpa) / 5) * 70)}%` }}
                    />
                  </>
                ) : (
                  <div className="w-full max-w-[44px] h-1.5 rounded bg-white/10" />
                )}
                <span className="text-[10px] text-slate-400 font-semibold">{exam.short}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected exam marksheet */}
      {selectedEntry && !selectedEntry.published && (
        <div className="moom-card p-8 text-center">
          <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">{selectedEntry.exam.name}</p>
          <p className="text-xs text-slate-400 mt-1">
            Scheduled for {selectedEntry.exam.date}. The marksheet will appear here once marks are entered in Exams &amp; Results.
          </p>
        </div>
      )}

      {selectedEntry?.published && (() => {
        const r = selectedEntry.result
        return (
          <>
            <div className="moom-card p-4 sm:p-5 bg-gradient-to-r from-[#191533] to-[#111118] border-[#6c63ff]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#a78bfa] tracking-wider block mb-1">Academic Transcript & Grade Sheet</span>
                  <h3 className="text-lg font-black text-white">{r.exam}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Roll <strong className="text-white">{student.roll}</strong> · <strong className="text-white">{student.className} ({student.section})</strong> · Percentage <strong className="text-white">{r.percentage}%</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    ['GPA', r.gpa, 'text-emerald-400'],
                    ['Grade', r.grade, 'text-[#a78bfa]'],
                    ['Rank', `#${r.meritPosition}`, 'text-amber-400']
                  ].map(([l, v, c]) => (
                    <div key={l} className="text-center p-2.5 bg-[#16161f] rounded-xl border border-[#1e1e2e] min-w-[64px]">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{l}</span>
                      <span className={`text-2xl font-black font-mono ${c}`}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="moom-card overflow-hidden">
              <div className="p-3.5 bg-[#16161f] border-b border-[#1e1e2e] flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#a78bfa]" />
                  Subject-wise Marks
                </h4>
                <span className="text-xs font-mono font-bold text-white">
                  Total: <strong className="text-emerald-400">{r.totalMarks}</strong> / {r.fullTotal}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="moom-table">
                  <thead>
                    <tr>
                      <th className="w-16">Code</th>
                      <th>Subject</th>
                      <th className="text-center">Written</th>
                      <th className="text-center">MCQ</th>
                      <th className="text-center">Practical</th>
                      <th className="text-center">Total</th>
                      <th className="min-w-[120px]">Score</th>
                      <th className="text-center">Grade</th>
                      <th className="text-right">GPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.subjects.map((sub) => {
                      const pct = Math.round((sub.total / sub.full) * 100)
                      return (
                        <tr key={sub.code}>
                          <td className="font-mono text-xs text-slate-400">{sub.code}</td>
                          <td className="font-bold text-white text-xs">{sub.name}</td>
                          <td className="text-center font-mono text-xs text-slate-300">{sub.written || '—'}</td>
                          <td className="text-center font-mono text-xs text-slate-300">{sub.mcq || '—'}</td>
                          <td className="text-center font-mono text-xs text-slate-300">{sub.practical || '—'}</td>
                          <td className="text-center font-mono font-bold text-white text-xs">
                            {sub.total}<span className="text-slate-500 font-normal">/{sub.full}</span>
                          </td>
                          <td>
                            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <div className={`h-full rounded-full ${barColor(pct)}`} style={{ width: `${Math.min(100, pct)}%` }} />
                            </div>
                          </td>
                          <td className="text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 ${gradeColor(sub.grade)}`}>
                              {sub.grade}
                            </span>
                          </td>
                          <td className="text-right font-mono font-bold text-emerald-400 text-xs">{Number(sub.gpa).toFixed(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-[#16161f] rounded-2xl border border-[#1e1e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400 block font-bold">Teacher's Remarks:</span>
                <span className="text-slate-200 italic">"{r.remarks}"</span>
              </div>
              <button
                onClick={() => setCurrentReportCard(r)}
                className="px-4 py-2 moom-btn-primary rounded-xl text-xs font-bold inline-flex items-center gap-2 shrink-0 transition"
              >
                <Printer className="w-4 h-4" />
                Open &amp; Print Marksheet
              </button>
            </div>
          </>
        )
      })()}

      {/* Subject × exam comparison */}
      {publishedResults.length > 0 && (
        <div className="moom-card overflow-hidden">
          <div className="p-3.5 bg-[#16161f] border-b border-[#1e1e2e]">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#a78bfa]" />
              Subject Comparison Across Exams
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="moom-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  {publishedResults.map((r) => (
                    <th key={r.exam} className="text-center">{EXAMS.find((e) => e.name === r.exam)?.short}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publishedResults[0].subjects.map((sub) => (
                  <tr key={sub.code}>
                    <td className="text-xs font-bold text-white">{sub.name}</td>
                    {publishedResults.map((r) => {
                      const m = r.subjects.find((x) => x.code === sub.code)
                      return (
                        <td key={r.exam} className="text-center font-mono text-xs">
                          {m ? (
                            <>
                              <span className="text-white font-bold">{m.total}</span>{' '}
                              <span className={`text-[10px] ${gradeColor(m.grade)}`}>{m.grade}</span>
                            </>
                          ) : (
                            '—'
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="bg-white/[0.02]">
                  <td className="text-xs font-extrabold text-slate-300">Total / GPA</td>
                  {publishedResults.map((r) => (
                    <td key={r.exam} className="text-center font-mono text-xs">
                      <span className="text-white font-bold">{r.totalMarks}</span>{' '}
                      <span className="text-emerald-400 text-[10px]">{r.gpa}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
