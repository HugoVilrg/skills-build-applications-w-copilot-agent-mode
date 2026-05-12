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
  const url = `${baseUrl}workouts/`
  console.log('Workouts endpoint:', url)
  return url
})()

const normalizeData = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (payload.results && Array.isArray(payload.results)) return payload.results
  return [payload]
}

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchWorkouts = () => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((payload) => {
        console.log('Workouts fetched data:', payload)
        setWorkouts(normalizeData(payload))
      })
      .catch((err) => {
        console.error('Workouts fetch error:', err)
        setError(err.message)
      })
  }

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const filteredWorkouts = useMemo(() => {
    if (!query.trim()) return workouts
    return workouts.filter((workout) => JSON.stringify(workout).toLowerCase().includes(query.toLowerCase()))
  }, [workouts, query])

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h5 mb-1">Workouts</h2>
          <p className="text-muted mb-0">Review workout sessions from the backend.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={fetchWorkouts}>
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
            <label htmlFor="workoutsQuery" className="col-form-label">
              Filter
            </label>
          </div>
          <div className="col">
            <input
              id="workoutsQuery"
              type="search"
              className="form-control"
              placeholder="Search workouts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-primary" onClick={fetchWorkouts}>
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
                <th>Title</th>
                <th>Type</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No workouts found.
                  </td>
                </tr>
              ) : (
                filteredWorkouts.map((workout) => (
                  <tr key={workout.id || JSON.stringify(workout)}>
                    <td>{workout.id}</td>
                    <td>{workout.title || workout.name || '-'}</td>
                    <td>{workout.type || '-'}</td>
                    <td>{workout.duration || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="code-block mt-4">
          <strong>Fetched data:</strong>
          <pre className="mb-0">{JSON.stringify(workouts, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Workouts
