export function exportMarkdown(report) {
  const rows = report.issues
    .map((i) => `### [${i.severity.toUpperCase()}] ${i.title}\n- File: \`${i.file}\`, line ${i.line}: \`${i.snippet}\`\n- Fix: ${i.advice}\n\n\`\`\`\n${i.fix}\n\`\`\``)
    .join('\n\n')

  const md = `# DevSec Scan Report\n\n- Source: ${report.source}\n- Language: ${report.language}\n - Files scanned: ${report.fileCount}\n- Date: ${new Date(report.date).toLocaleString()}\n- Score: ${report.score}/100 (Grade ${report.grade})\n\n## Issues (${report.issues.length})\n\n${rows || 'No issues found.'}\n`

  const url = URL.createObjectURL(new Blob([md], { type: 'text/markdown' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'devsec-report.md'
  link.click()
  URL.revokeObjectURL(url)
}


export function exportPdf() {
  const oldTitle = document.title
  document.title = 'devsec-report' 
  window.print()
  document.title = oldTitle
}