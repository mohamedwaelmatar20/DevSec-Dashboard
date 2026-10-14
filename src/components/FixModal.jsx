export default function FixModal({ issue, onClose }) {
  if (!issue) return null

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">{issue.title}</h2>
              <button className="btn-close" aria-label="Close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <p>{issue.advice}</p>
              <p className="mb-1 fw-semibold">Secure version</p>
              <pre className="code-view p-3 m-0">{issue.fix}</pre>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  )
}