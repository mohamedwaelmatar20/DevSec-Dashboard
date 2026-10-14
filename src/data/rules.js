export const SEVERITIES = ['critical', 'high', 'medium', 'low']

export const SEVERITY_STYLE = {
  critical: { badge: 'danger', color: '#dc3545', weight: 25 },
  high: { badge: 'warning', color: '#fd7e14', weight: 15 },
  medium: { badge: 'info', color: '#ffc107', weight: 7 },
  low: { badge: 'secondary', color: '#6c9bd1', weight: 3 },
}

export const RULES = [
  {
    id: 'aws-key', title: 'Leaked AWS access key', severity: 'critical',
    pattern: /AKIA[0-9A-Z]{16}/,
    advice: 'Revoke the key in AWS IAM now, then load credentials from environment variables.',
    fix: "const key = process.env.AWS_ACCESS_KEY_ID // never commit keys",
  },
  {
    id: 'hardcoded-secret', title: 'Hardcoded secret or password', severity: 'high',
    pattern: /(api[_-]?key|secret|password|token)\s*[:=]\s*['"][^'"]{6,}['"]/i,
    advice: 'Move secrets to a .env file (git-ignored) or a secrets manager.',
    fix: "const apiKey = import.meta.env.VITE_API_KEY",
  },
  {
    id: 'eval-use', title: 'Use of eval()', severity: 'high',
    pattern: /\beval\s*\(/,
    advice: 'eval runs any string as code. Parse data with JSON.parse or use a lookup table.',
    fix: "const data = JSON.parse(userInput)",
  },
  {
    id: 'sql-injection', title: 'SQL built with string concatenation', severity: 'high',
    pattern: /(SELECT|INSERT|UPDATE|DELETE)\b.*(\+\s*\w+|\$\{|%s)/i,
    advice: 'Use parameterized queries so user input is never treated as SQL.',
    fix: "db.query('SELECT * FROM users WHERE id = ?', [userId])",
  },
  {
    id: 'unsafe-pickle', title: 'Unsafe deserialization (pickle)', severity: 'high',
    pattern: /pickle\.loads?\(/,
    advice: 'Never unpickle untrusted data. Use JSON for data exchange.',
    fix: "data = json.loads(payload)",
  },
  {
    id: 'inner-html', title: 'Possible XSS via innerHTML', severity: 'medium',
    pattern: /\.innerHTML\s*=|dangerouslySetInnerHTML/,
    advice: 'Insert text with textContent, or sanitize HTML with DOMPurify first.',
    fix: "element.textContent = userInput",
  },
  {
    id: 'open-cors', title: 'CORS open to every origin', severity: 'medium',
    pattern: /Access-Control-Allow-Origin.*\*|\bcors\(\s*\)/,
    advice: 'Allow only the origins that need access.',
    fix: "app.use(cors({ origin: 'https://myapp.com' }))",
  },
  {
    id: 'tls-off', title: 'TLS verification disabled', severity: 'medium',
    pattern: /verify\s*=\s*False|rejectUnauthorized\s*:\s*false/,
    advice: 'Keep certificate verification on. Fix the certificate instead.',
    fix: "requests.get(url)  # verify=True is the default",
  },
  {
    id: 'plain-http', title: 'Insecure http:// URL', severity: 'low',
    pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/,
    advice: 'Use https:// so traffic is encrypted.',
    fix: "fetch('https://api.example.com/data')",
  },
]