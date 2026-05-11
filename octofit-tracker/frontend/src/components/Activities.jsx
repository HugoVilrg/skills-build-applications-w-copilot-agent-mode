import { useEffect, useState, useMemo } from 'react'

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
  const url = `${baseUrl}activities/`
  console.log('Activities endpoint:', url)
  return url
})()

const normalizeData = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (payload.results && Array.isArray(payload.results)) return payload.results
  return [payload]
}

function Activities() {
  const [activities, setActivities] = useState([])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchActivities = () => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((payload) => {
        console.log('Activities fetched data:', payload)
        setActivities(normalizeData(payload))
      })
      .catch((err) => {
        console.error('Activities fetch error:', err)
        setError(err.message)
      })
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  const filteredActivities = useMemo(() => {
    if (!query.trim()) return activities
    return activities.filter((activity) =>
      JSON.stringify(activity).toLowerCase().includes(query.toLowerCase()),
    )
  }, [activities, query])

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h5 mb-1">Activities</h2>
          <p className="text-muted mb-0">Browse the activity records from the backend API.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={fetchActivities}>
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
            <label htmlFor="activityQuery" className="col-form-label">
              Filter
            </label>
          </div>
          <div className="col">
            <input
              id="activityQuery"
              type="search"
              className="form-control"
              placeholder="Search activities"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-primary" onClick={fetchActivities}>
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
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Duration</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No matching activities found.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <tr key={activity.id || JSON.stringify(activity)}>
                    <td>{activity.id}</td>
                    <td>{activity.user?.name || activity.user?.email || '-'}</td>
                    <td>{activity.type || '-'}</td>
                    <td>{activity.duration || '-'}</td>
                    <td>{activity.date || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="code-block mt-4">
          <strong>Fetched data:</strong>
          <pre className="mb-0">{JSON.stringify(activities, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Activities
