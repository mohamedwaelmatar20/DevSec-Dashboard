import { useState, useEffect } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { scanFiles, detectLanguage } from './utils/scanner'
import { fetchRepoFiles } from './utils/github'
import { exportMarkdown, exportPdf } from './utils/exportReport'
import ScanForm from './components/ScanForm'
import ScanConsole from './components/ScanConsole'
import ScoreCard from './components/ScoreCard'
import IssueList from './components/IssueList'
import FixModal from './components/FixModal'
import History from './components/History'
import PrintReport from './components/PrintReport'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export default function App() {
  const [theme, setTheme] = useLocalStorage('devsec-theme', 'dark')
  const [history, setHistory] = useLocalStorage('devsec-history', [])
  const [view, setView] = useState('input') // input | scanning | report
  const [log, setLog] = useState([])
  const [error, setError] = useState('')
  const [report, setReport] = useState(null)
  const [fixIssue, setFixIssue] = useState(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const addLog = (line) => setLog((prev) => [...prev, line])

  const startScan = async (input) => {
    setLog([])
    setError('')
    setView('scanning')

    try {
      let files, source, language

      if (input.type === 'repo') {
        files = await fetchRepoFiles(input.url, addLog)
        source = input.url.trim()
        language = [...new Set(files.map((f) => f.language))].join(', ')
      } else {
        files = [{ path: 'snippet', code: input.code }]
        source = 'Pasted snippet'
        language = detectLanguage(input.code)
      }

      addLog('Checking for hardcoded secrets...')
      await sleep(400)
      addLog('Reviewing injection patterns...')
      await sleep(400)

      const scan = scanFiles(files, language)
      addLog('Scoring results...')
      await sleep(300)

      const entry = { id: Date.now(), source, date: new Date().toISOString(), ...scan }
      setReport(entry)
      setHistory((prev) => [entry, ...prev].slice(0, 10))
      setView('report')
      setToast('Scan complete')
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? 'Network error. Check your internet connection.' : err.message)
      setView('input')
    }
  }

  return (
    <>
      <nav className="navbar border-bottom mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold">DevSec Dashboard</span>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </nav>

      <main className="container pb-5">
        {view === 'input' && (
          <>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <ScanForm onSubmit={startScan} />
            <History history={history} onOpen={(scan) => { setReport(scan); setView('report') }} onClear={() => { setHistory([]); setToast('History cleared') }} />
          </>
        )}

        {view === 'scanning' && <ScanConsole log={log} />}

        {view === 'report' && report && (
          <>
            <div className="d-grid gap-4 screen-only">
              <div className="d-flex justify-content-between align-items-center no-print">
                <button className="btn btn-outline-primary" onClick={() => setView('input')}>New scan</button>
                <div className="btn-group">
                  <button className="btn btn-outline-secondary" onClick={() => { exportMarkdown(report); setToast('Markdown exported') }}>Export Markdown</button>
                  <button className="btn btn-outline-secondary" onClick={exportPdf}>Export PDF</button>
                </div>
              </div>
              <ScoreCard report={report} />
              <IssueList report={report} onFix={setFixIssue} />
            </div>
            <PrintReport report={report} />
          </>
        )}
      </main>

      <FixModal issue={fixIssue} onClose={() => setFixIssue(null)} />

      {toast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show text-bg-success"><div className="toast-body">{toast}</div></div>
        </div>
      )}
    </>
  )
}