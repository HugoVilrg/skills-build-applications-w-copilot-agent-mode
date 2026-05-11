import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

const getCodespaceName = () =>
  import.meta.env.REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_REACT_APP_CODESPACE_NAME ||
  import.meta.env.VITE_CODESPACE_NAME ||
  import.meta.env.CODESPACE_NAME ||
  window.REACT_APP_CODESPACE_NAME

function App() {
  const [showInfo, setShowInfo] = useState(false)
  const codespaceName = getCodespaceName()
  const hostLabel = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000'

  const navItems = [
    { path: '/', label: 'Activities' },
    { path: '/workouts', label: 'Workouts' },
    { path: '/teams', label: 'Teams' },
    { path: '/users', label: 'Users' },
    { path: '/leaderboard', label: 'Leaderboard' },
  ]

  return (
    <Router>
      <div className="container py-4 app-shell">
        <header className="mb-4 pb-3 border-bottom border-2" style={{ borderColor: 'var(--octofit-border)' }}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="octofit-logo-icon">
                🏋️
              </div>
              <div>
                <h1 className="mb-0">OctoFit Tracker</h1>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Real-time fitness analytics dashboard</p>
              </div>
            </div>
            <button
              className="btn btn-outline-primary align-self-start align-self-md-center"
              type="button"
              onClick={() => setShowInfo((open) => !open)}
            >
              {showInfo ? '✕ Hide API Info' : 'ⓘ Show API Info'}
            </button>
          </div>
        </header>

        <nav className="navbar navbar-expand-lg navbar-light bg-white border rounded shadow-sm mb-4">
          <div className="container-fluid px-0">
            <div className="collapse navbar-collapse show" id="octofit-nav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 flex-wrap">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `nav-link px-3${isActive ? ' active fw-semibold' : ' text-dark'}`}
                      end={item.path === '/'}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5 mb-2">Backend host</h2>
            <p className="mb-0">
              Current API host:{' '}
              <a href={hostLabel} target="_blank" rel="noreferrer" className="link-primary">
                {hostLabel}
              </a>
            </p>
          </div>
        </div>

        {showInfo && (
          <div className="modal-backdrop show d-block">
            <div className="modal d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content shadow-lg">
                  <div className="modal-header">
                    <h5 className="modal-title">OctoFit API Information</h5>
                    <button type="button" className="btn-close" onClick={() => setShowInfo(false)} aria-label="Close" />
                  </div>
                  <div className="modal-body">
                    <p className="mb-2">The frontend will resolve the Django API host from environment variables.</p>
                    <ul>
                      <li>REACT_APP_CODESPACE_NAME</li>
                      <li>VITE_REACT_APP_CODESPACE_NAME</li>
                      <li>VITE_CODESPACE_NAME</li>
                      <li>CODESPACE_NAME</li>
                    </ul>
                    <p className="mb-0">If no codespace name exists, the app falls back to <code>http://localhost:8000</code>.</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowInfo(false)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card shadow-lg">
          <div className="card-body p-4">
            <Routes>
              <Route path="/" element={<Activities />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/users" element={<Users />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
