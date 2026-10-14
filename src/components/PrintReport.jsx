import { SEVERITIES, SEVERITY_STYLE } from '../data/rules'

// Only visible when printing / saving as PDF (see App.css).
export default function PrintReport({ report }) {
  return (
    <div className="print-only">
      <h1 className="h3">DevSec Scan Report</h1>
      <p>
        Source: {report.source}<br />
        Language: {report.language}<br />
        Date: {new Date(report.date).toLocaleString()}
      </p>

      <h2 className="h4">Security score: {report.score}/100 (Grade {report.grade})</h2>
      <p>
        {SEVERITIES.map((s) => (
          <span key={s} className="print-badge" style={{ background: SEVERITY_STYLE[s].color }}>
            {s}: {report.counts[s]}
          </span>
        ))}
      </p>

      <h2 className="h4 mt-4">Issues ({report.issues.length})</h2>
      {report.issues.length === 0 && <p>No issues found.</p>}

      {report.issues.map((issue) => (
        <div key={`${issue.id}-${issue.line}`} className="print-issue">
          <h3 className="h6">
            <span className="print-badge" style={{ background: SEVERITY_STYLE[issue.severity].color }}>
              {issue.severity}
            </span>
           {issue.title} ({issue.file}, line {issue.line})
          </h3>
          <pre className="print-code">{issue.snippet}</pre>
          <p className="mb-1"><strong>Fix:</strong> {issue.advice}</p>
          <pre className="print-code">{issue.fix}</pre>
        </div>
      ))}
    </div>
  )
}