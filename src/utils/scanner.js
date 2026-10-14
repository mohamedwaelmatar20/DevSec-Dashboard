import { RULES, SEVERITY_STYLE, SEVERITIES } from '../data/rules'

const MAX_LINE_LENGTH = 500 // skip minified lines

export function detectLanguage(code) {
  const text = code.trim()
  if (/^[{[]/.test(text)) return 'JSON'
  if (/\bdef \w+\(|^import \w+$|print\(/m.test(code)) return 'Python'
  if (/<\?php/.test(code)) return 'PHP'
  return 'JavaScript'
}

export function gradeFor(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 65) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

// Keep a few lines around the problem, so we don't store whole files.
function getContext(lines, index) {
  const start = Math.max(0, index - 2)
  return { start: start + 1, lines: lines.slice(start, index + 3).map((l) => l.slice(0, 200)) }
}

// files = [{ path, code }]
export function scanFiles(files, language) {
  const issues = []

  files.forEach(({ path, code }) => {
    const lines = code.split('\n')
    lines.forEach((text, index) => {
      if (text.length > MAX_LINE_LENGTH) return
      RULES.forEach((rule) => {
        if (rule.pattern.test(text)) {
          issues.push({
            id: rule.id,
            title: rule.title,
            severity: rule.severity,
            advice: rule.advice,
            fix: rule.fix,
            file: path,
            line: index + 1,
            snippet: text.trim(),
            context: getContext(lines, index),
          })
        }
      })
    })
  })

  const penalty = issues.reduce((sum, i) => sum + SEVERITY_STYLE[i.severity].weight, 0)
  const score = Math.max(0, 100 - penalty)
  const counts = Object.fromEntries(SEVERITIES.map((s) => [s, issues.filter((i) => i.severity === s).length]))

  return { fileCount: files.length, language, issues, counts, score, grade: gradeFor(score) }
}