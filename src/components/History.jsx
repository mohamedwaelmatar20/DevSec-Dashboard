export default function History({ history, onOpen, onClear }) {
  if (history.length === 0) return null

  return (
    <div className="card card-body mt-4 no-print">
      <div className="d-flex justify-content-between mb-2">
        <h2 className="h6 m-0">Past scans</h2>
        <button className="btn btn-sm btn-link text-danger p-0" onClick={onClear}>Clear history</button>
      </div>
      <ul className="list-group list-group-flush">
        {history.map((scan) => (
          <li key={scan.id} className="list-group-item history-item d-flex justify-content-between" onClick={() => onOpen(scan)}>
            <span>{scan.source} <small className="text-secondary">{new Date(scan.date).toLocaleString()}</small></span>
            <strong>{scan.grade}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}