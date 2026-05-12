import { useEffect, useMemo, useState } from 'react'

const getCodespaceName = () =>
  import.meta.env.REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_CODESPACE_NAME ||
  import.meta.env.CODESPACE_NAME ||
  window.REACT_APP_CODESPACE_NAME

const endpoint = (() => {
  const codespaceName = getCodespaceName()
  const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/`
    : 'http://localhost:8000/api/'
  const url = `${baseUrl}leaderboard/`
  console.log('Leaderboard endpoint:', url)
  return url
})()

const normalizeData = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (payload.results && Array.isArray(payload.results)) return payload.results
  return [payload]
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchLeaderboard = () => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((payload) => {
        console.log('Leaderboard fetched data:', payload)
        setLeaderboard(normalizeData(payload))
      })
      .catch((err) => {
        console.error('Leaderboard fetch error:', err)
        setError(err.message)
      })
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const filteredLeaderboard = useMemo(() => {
    if (!query.trim()) return leaderboard
    return leaderboard.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase()),
    )
  }, [leaderboard, query])

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h5 mb-1">Leaderboard</h2>
          <p className="text-muted mb-0">Track top records and scores from the REST API.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={fetchLeaderboard}>
            Refresh
          </button>
          <a href={endpoint} target="_blank" rel="noreferrer" className="btn btn-link">
            Raw API
          </a>
        </div>
      </div>
      <div className="card-body">
        <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-auto">
            <label htmlFor="leaderboardQuery" className="col-form-label">
              Filter
            </label>
          </div>
          <div className="col">
            <input
              id="leaderboardQuery"
              type="search"
              className="form-control"
              placeholder="Search leaderboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-primary" onClick={fetchLeaderboard}>
              Reload
            </button>
          </div>
        </form>

        <div className="mb-3">
          <span className="badge bg-secondary me-2">Endpoint</span>
          <a href={endpoint} target="_blank" rel="noreferrer" className="link-primary endpoint-link">
            {endpoint}
          </a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive table-card">
          <table className="table table-hover table-striped data-table align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    No leaderboard entries found.
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.id || index + 1}</td>
                    <td>{item.name || item.user?.name || item.team?.name || '-'}</td>
                    <td>{item.score ?? item.points ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="code-block mt-4">
          <strong>Fetched data:</strong>
          <pre className="mb-0">{JSON.stringify(leaderboard, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
