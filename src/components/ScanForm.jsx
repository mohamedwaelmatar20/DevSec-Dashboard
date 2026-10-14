import { useState } from 'react'

export default function ScanForm({ onSubmit }) {
  const [mode, setMode] = useState('snippet')
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(mode === 'repo' ? { type: 'repo', url } : { type: 'snippet', code })
  }

  const isValid = mode === 'repo' ? url.trim().startsWith('https://github.com/') : code.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <div className="btn-group mb-3">
        <button type="button" className={`btn btn-${mode === 'snippet' ? 'primary' : 'outline-primary'}`} onClick={() => setMode('snippet')}>Paste code</button>
        <button type="button" className={`btn btn-${mode === 'repo' ? 'primary' : 'outline-primary'}`} onClick={() => setMode('repo')}>GitHub URL</button>
      </div>

      {mode === 'snippet' ? (
        <textarea className="form-control code-view" rows="10" placeholder="Paste a code snippet to scan..." value={code} onChange={(e) => setCode(e.target.value)} />
      ) : (
        <>
          <input className="form-control" placeholder="https://github.com/user/repo" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className="form-text">Public repos only. Scans up to 20 files (.js, .jsx, .ts, .tsx, .py, .php, .json).</div>
        </>
      )}

      <button className="btn btn-primary mt-3 align-self-start" disabled={!isValid}>Start scan</button>
    </form>
  )
}