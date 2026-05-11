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
  const url = `${baseUrl}users/`
  console.log('Users endpoint:', url)
  return url
})()

const normalizeData = (payload) => {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (payload.results && Array.isArray(payload.results)) return payload.results
  return [payload]
}

function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchUsers = () => {
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return res.json()
      })
      .then((payload) => {
        console.log('Users fetched data:', payload)
        setUsers(normalizeData(payload))
      })
      .catch((err) => {
        console.error('Users fetch error:', err)
        setError(err.message)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users
    return users.filter((user) => JSON.stringify(user).toLowerCase().includes(query.toLowerCase()))
  }, [users, query])

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h5 mb-1">Users</h2>
          <p className="text-muted mb-0">View the users list from the API.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={fetchUsers}>
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
            <label htmlFor="usersQuery" className="col-form-label">
              Filter
            </label>
          </div>
          <div className="col">
            <input
              id="usersQuery"
              type="search"
              className="form-control"
              placeholder="Search users"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-primary" onClick={fetchUsers}>
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
                <th>Name</th>
                <th>Email</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id || JSON.stringify(user)}>
                    <td>{user.id}</td>
                    <td>{user.name || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td>{user.team?.name || user.team || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="code-block mt-4">
          <strong>Fetched data:</strong>
          <pre className="mb-0">{JSON.stringify(users, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default Users
