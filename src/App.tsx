import { useEffect, useState } from "react"

/*
  Automated Timesheet Management Platform — Week 5 Feature Implementation.
  - Timesheet Creation & Logging
  - Status Workflow Transitions (DRAFT -> SUBMITTED -> APPROVED / REJECTED)
  - Live persistence with Spring Boot REST API & MySQL
*/

const API_BASE = "http://localhost:8080/api"

type Row = {
  timesheetId: number
  userId?: number
  projectId?: number
  date: string
  hours: number
  description: string
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
}

const SAMPLE_ROWS: Row[] = [
  { timesheetId: 1, date: "2026-08-17", hours: 8.0, description: "Homepage layout", status: "APPROVED" },
  { timesheetId: 2, date: "2026-08-18", hours: 6.5, description: "API integration", status: "SUBMITTED" },
  { timesheetId: 3, date: "2026-08-18", hours: 2.0, description: "Bug fixes", status: "DRAFT" },
]

const SAMPLE_SUMMARY = { totalHoursThisWeek: 32.5, pendingApproval: 3, approved: 5, activeProjects: 2 }

type Conn = "loading" | "ok" | "fallback"

function useConnection<T>(path: string, fallback: T, refreshKey: number = 0) {
  const [data, setData] = useState<T>(fallback)
  const [conn, setConn] = useState<Conn>("loading")

  useEffect(() => {
    let alive = true
    setConn("loading")
    fetch(`${API_BASE}${path}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return
        setData(d)
        setConn("ok")
      })
      .catch(() => {
        if (alive) setConn("fallback")
      })
    return () => {
      alive = false
    }
  }, [path, refreshKey])

  return { data, conn }
}

function Banner({ conn }: { conn: Conn }) {
  if (conn === "loading") return <div className="banner">Connecting to backend…</div>
  if (conn === "ok")
    return <div className="banner ok">Connected to backend at <span className="mono">localhost:8080</span>.</div>
  return (
    <div className="banner">
      Preview mode — showing sample data. Run the Spring Boot backend on{" "}
      <span className="mono">localhost:8080</span> to see live API responses.
    </div>
  )
}

function Dashboard({ refreshKey }: { refreshKey: number }) {
  const { data, conn } = useConnection<typeof SAMPLE_SUMMARY>("/dashboard", SAMPLE_SUMMARY, refreshKey)
  const cards = [
    { label: "Hours logged", value: data.totalHoursThisWeek },
    { label: "Pending approval", value: data.pendingApproval },
    { label: "Approved", value: data.approved },
    { label: "Active projects", value: data.activeProjects },
  ]
  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Overview of your timesheet activity and team approvals.</p>
      <Banner conn={conn} />
      <div className="card-grid">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <div className="label">{c.label}</div>
            <div className="value mono">{c.value}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function Timesheets({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  const { data, conn } = useConnection<{ data: Row[] }>("/timesheets", { data: SAMPLE_ROWS }, refreshKey)
  const rows = data.data || []
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: 8,
    projectId: 1,
    description: "",
    status: "DRAFT",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch(`${API_BASE}/timesheets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setShowModal(false)
      setFormData({
        date: new Date().toISOString().split("T")[0],
        hours: 8,
        projectId: 1,
        description: "",
        status: "DRAFT",
      })
      onRefresh()
    } catch {
      alert("Failed to submit timesheet. Please ensure backend is running.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: number, action: "submit" | "approve" | "reject") => {
    try {
      await fetch(`${API_BASE}/timesheets/${id}/${action}`, {
        method: "PATCH",
      })
      onRefresh()
    } catch {
      alert(`Failed to ${action} timesheet.`)
    }
  }

  return (
    <>
      <div className="toolbar">
        <div>
          <h1 className="page-title">Timesheets</h1>
          <p className="page-sub" style={{ margin: 0 }}>Create, track, and approve work hour entries.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Log New Entry
        </button>
      </div>

      <Banner conn={conn} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Hours</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.timesheetId}>
                <td className="mono">#{r.timesheetId}</td>
                <td className="mono">{r.date}</td>
                <td className="mono">{r.hours} hrs</td>
                <td>{r.description || "—"}</td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                </td>
                <td>
                  <div className="action-group">
                    {r.status === "DRAFT" && (
                      <button
                        className="action-btn submit"
                        title="Submit timesheet for manager review"
                        onClick={() => handleStatusChange(r.timesheetId, "submit")}
                      >
                        Submit
                      </button>
                    )}
                    {r.status === "SUBMITTED" && (
                      <>
                        <button
                          className="action-btn approve"
                          title="Approve timesheet"
                          onClick={() => handleStatusChange(r.timesheetId, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className="action-btn reject"
                          title="Reject timesheet"
                          onClick={() => handleStatusChange(r.timesheetId, "reject")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(r.status === "APPROVED" || r.status === "REJECTED") && (
                      <span style={{ fontSize: "12px", color: "var(--muted)" }}>Completed</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Log Timesheet Entry</h2>
            <form onSubmit={handleCreate}>
              <div className="form-grid">
                <div>
                  <label htmlFor="entry-date">Date</label>
                  <input
                    id="entry-date"
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="entry-hours">Hours</label>
                  <input
                    id="entry-hours"
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    required
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <label htmlFor="entry-desc">Description</label>
              <input
                id="entry-desc"
                type="text"
                placeholder="What did you work on today?"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function Login({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="login-wrap">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault()
          onLogin()
        }}
      >
        <h1>Timesheet Management</h1>
        <p>Sign in to continue (demo account).</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" defaultValue="asha@example.com" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" defaultValue="placeholder" />
        <button className="btn" type="submit">
          Sign in
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState<"dashboard" | "timesheets">("dashboard")
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1)

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          Timesheet
        </div>
        <button
          className={`nav-item ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`nav-item ${page === "timesheets" ? "active" : ""}`}
          onClick={() => setPage("timesheets")}
        >
          Timesheets
        </button>
        <button className="nav-item" onClick={() => setLoggedIn(false)}>
          Log out
        </button>
        <div className="sidebar-footer">Week 5 · Feature Branch</div>
      </aside>
      <main className="content">
        {page === "dashboard" ? (
          <Dashboard refreshKey={refreshKey} />
        ) : (
          <Timesheets refreshKey={refreshKey} onRefresh={triggerRefresh} />
        )}
      </main>
    </div>
  )
}
