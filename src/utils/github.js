const API = 'https://api.github.com'
const RAW = 'https://raw.githubusercontent.com'
const MAX_FILES = 20
const MAX_FILE_SIZE = 100000 // bytes

const LANGUAGES = {
  js: 'JavaScript', jsx: 'JavaScript', ts: 'TypeScript', tsx: 'TypeScript',
  py: 'Python', php: 'PHP', json: 'JSON',
}
const SKIP_PATHS = /(^|\/)(node_modules|dist|build|vendor|\.git)\/|\.min\.js$|package-lock\.json$/

const extensionOf = (path) => path.split('.').pop().toLowerCase()

export function parseRepoUrl(url) {
  const match = url.trim().match(/^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:\/tree\/([^/]+)(?:\/.*)?)?\/?$/)
  if (!match) throw new Error('Enter a link like https://github.com/user/repo')
  return { owner: match[1], repo: match[2], branch: match[3] }
}

async function getJson(url) {
  const res = await fetch(url)
  if (res.status === 404) throw new Error('Repository not found. It may be private, or the link is wrong.')
  if (res.status === 403) throw new Error('GitHub rate limit reached. Wait a few minutes and try again.')
  if (!res.ok) throw new Error(`GitHub error (${res.status}).`)
  return res.json()
}

function isScannable(item) {
  return (
    item.type === 'blob' &&
    item.size <= MAX_FILE_SIZE &&
    LANGUAGES[extensionOf(item.path)] &&
    !SKIP_PATHS.test(item.path)
  )
}

// Returns [{ path, code, language }]
export async function fetchRepoFiles(url, onProgress) {
  const { owner, repo, branch: givenBranch } = parseRepoUrl(url)

  onProgress(`Connecting to ${owner}/${repo}...`)
  const branch = givenBranch || (await getJson(`${API}/repos/${owner}/${repo}`)).default_branch

  onProgress('Reading file list...')
  const tree = await getJson(`${API}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)

  // Shallow files first: they are usually the most important ones.
  const candidates = tree.tree
    .filter(isScannable)
    .sort((a, b) => a.path.split('/').length - b.path.split('/').length)

  if (candidates.length === 0) {
    throw new Error('No scannable files found (.js, .jsx, .ts, .tsx, .py, .php, .json).')
  }

  const selected = candidates.slice(0, MAX_FILES)
  onProgress(`Downloading ${selected.length} of ${candidates.length} files...`)

  const files = await Promise.all(
    selected.map(async (item) => {
      const path = item.path.split('/').map(encodeURIComponent).join('/')
      const res = await fetch(`${RAW}/${owner}/${repo}/${branch}/${path}`)
      if (!res.ok) return null
      return { path: item.path, code: await res.text(), language: LANGUAGES[extensionOf(item.path)] }
    })
  )

  return files.filter(Boolean)
}