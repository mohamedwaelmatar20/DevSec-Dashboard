import { useState, useEffect } from 'react'

const STEPS = [
  'Parsing AST...',
  'Checking for hardcoded secrets...',
  'Reviewing injection patterns...',
  'Reviewing dependency trees...',
  'Scoring results...',
]

export default function ScanConsole({ onDone }) {
  const [done, setDone] = useState(0)

  useEffect(() => {
    const timer = setTimeout(done < STEPS.length ? () => setDone(done + 1) : onDone, 700)
    return () => clearTimeout(timer)
  }, [done, onDone])

  const percent = Math.round((done / STEPS.length) * 100)

  return (
    <div className="card card-body">
      <div className="progress mb-3" role="progressbar" aria-valuenow={percent}>
        <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${percent}%` }}>{percent}%</div>
      </div>
      <div className="console p-3">
        {STEPS.slice(0, done).map((step) => <div key={step}>$ {step} done</div>)}
        {done < STEPS.length && <div>$ {STEPS[done]}</div>}
      </div>
    </div>
  )
}