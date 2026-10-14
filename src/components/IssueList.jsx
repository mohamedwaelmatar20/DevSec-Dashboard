import { useState } from 'react'
import { SEVERITIES, SEVERITY_STYLE } from '../data/rules'

function CodeViewer({ context, flaggedLine }) {
  if (!context) return null // old history entries have no context

  return (
    <div className="code-view py-2">
      {context.lines.map((text, i) => {
        const number = context.start + i
        return (
          <div key={number} className={`code-line ${number === flaggedLine ? 'flagged' : ''}`}>
            <span className="num">{number}</span>{text}
          </div>
        )
      })}
    </div>
  )
}

export default function IssueList({ report, onFix }) {
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)

  const shown = report.issues.filter((i) => filter === 'all' || i.severity === filter)

  return (
    <div className="card card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 m-0">Issues ({shown.length})</h2>
        <select className="form-select w-auto no-print" value={filter} onChange={(e) => { setFilter(e.target.value); setOpenIndex(null) }}>
          <option value="all">All severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {shown.length === 0 && <p className="text-secondary m-0">Nothing to show for this filter.</p>}

      <div className="accordion">
        {shown.map((issue, index) => (
          <div className="accordion-item" key={`${issue.file}-${issue.id}-${issue.line}`}>
            <h3 className="accordion-header">
              <button className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                <span className={`badge text-bg-${SEVERITY_STYLE[issue.severity].badge} me-2`}>{issue.severity}</span>
                {issue.title}
                <span className="text-secondary ms-2">{issue.file}:{issue.line}</span>
              </button>
            </h3>
            <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
              <div className="accordion-body">
                <CodeViewer context={issue.context} flaggedLine={issue.line} />
                <button className="btn btn-sm btn-outline-primary mt-3" onClick={() => onFix(issue)}>How to fix</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}