import { useEffect, useState } from "react"

/*
  Automated Timesheet Management Platform — Week 6 MVP Release.
  Features:
  - Create, View, Edit, and Delete timesheet records (Full CRUD)
  - Search by keyword/date and filter by status
  - Role-based workflow (Employee creates/submits, Manager approves/rejects)
  - Dynamic Dashboard statistics
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
type Role = "EMPLOYEE" | "MANAGER"

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

function Timesheets({
  role,
  refreshKey,
  onRefresh,
}: {
  role: Role
  refreshKey: number
  onRefresh: () => void
}) {
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const queryPath = `/timesheets?status=${encodeURIComponent(statusFilter)}&q=${encodeURIComponent(searchQuery)}`
  const { data, conn } = useConnection<{ data: Row[] }>(queryPath, { data: SAMPLE_ROWS }, refreshKey)
  const rows = data.data || []

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    hours: 8,
    projectId: 1,
    description: "",
    status: "DRAFT" as Row["status"],
  })
  const [submitting, setSubmitting] = useState(false)

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      projectId: 1,
      description: "",
      status: "DRAFT",
    })
    setShowModal(true)
  }

  const openEditModal = (r: Row) => {
    setEditingId(r.timesheetId)
    setFormData({
      date: r.date,
      hours: r.hours,
      projectId: r.projectId || 1,
      description: r.description,
      status: r.status,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const url = editingId ? `${API_BASE}/timesheets/${editingId}` : `${API_BASE}/timesheets`
      const method = editingId ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      setShowModal(false)
      onRefresh()
    } catch {
      alert("Failed to save timesheet. Please verify backend is running.")
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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this timesheet entry?")) return
    try {
      await fetch(`${API_BASE}/timesheets/${id}`, {
        method: "DELETE",
      })
      onRefresh()
    } catch {
      alert("Failed to delete timesheet entry.")
    }
  }

  return (
    <>
      <div className="toolbar">
        <div>
          <h1 className="page-title">Timesheets</h1>
          <p className="page-sub" style={{ margin: 0 }}>
            {role === "EMPLOYEE"
              ? "Log hours, edit drafts, and submit timesheets for approval."
              : "Review, approve, or reject employee timesheets."}
          </p>
        </div>
        {role === "EMPLOYEE" && (
          <button className="btn-primary" onClick={openCreateModal}>
            + Log New Entry
          </button>
        )}
      </div>

      <Banner conn={conn} />

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by description or date (YYYY-MM-DD)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                  No matching timesheet entries found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
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
                      {/* Employee Actions */}
                      {role === "EMPLOYEE" && r.status === "DRAFT" && (
                        <>
                          <button
                            className="action-btn edit"
                            title="Edit entry"
                            onClick={() => openEditModal(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn submit"
                            title="Submit for approval"
                            onClick={() => handleStatusChange(r.timesheetId, "submit")}
                          >
                            Submit
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete draft"
                            onClick={() => handleDelete(r.timesheetId)}
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {/* Manager Actions */}
                      {role === "MANAGER" && r.status === "SUBMITTED" && (
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

                      {/* Read-only status for completed or unauthorized states */}
                      {((role === "EMPLOYEE" && r.status !== "DRAFT") ||
                        (role === "MANAGER" && r.status !== "SUBMITTED")) && (
                        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                          {r.status === "APPROVED" || r.status === "REJECTED" ? "Completed" : "In Review"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit Timesheet Entry" : "Log Timesheet Entry"}</h2>
            <form onSubmit={handleSave}>
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
                  {submitting ? "Saving..." : editingId ? "Update Entry" : "Save Draft"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>("EMPLOYEE")

  return (
    <div className="login-wrap">
      <form
        className="login-card"
        onSubmit={(e) => {
          e.preventDefault()
          onLogin(selectedRole)
        }}
      >
        <h1>Timesheet Management</h1>
        <p>Select your persona to explore MVP workflows.</p>

        <label htmlFor="role-select">Select Role Persona</label>
        <select
          id="role-select"
          className="filter-select"
          style={{ width: "100%", marginBottom: "16px" }}
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
        >
          <option value="EMPLOYEE">Employee (Asha Rao - Log & Submit)</option>
          <option value="MANAGER">Manager (Mia - Review & Approve)</option>
        </select>

        <button className="btn" type="submit">
          Sign in as {selectedRole === "EMPLOYEE" ? "Employee" : "Manager"}
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [role, setRole] = useState<Role>("EMPLOYEE")
  const [page, setPage] = useState<"dashboard" | "timesheets">("dashboard")
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1)

  if (!loggedIn)
    return (
      <Login
        onLogin={(r) => {
          setRole(r)
          setLoggedIn(true)
        }}
      />
    )

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          Timesheet
        </div>

        <div className="role-badge">
          <span>●</span> {role === "EMPLOYEE" ? "Employee Persona" : "Manager Persona"}
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
        <button
          className="nav-item"
          onClick={() => setRole(role === "EMPLOYEE" ? "MANAGER" : "EMPLOYEE")}
        >
          Switch to {role === "EMPLOYEE" ? "Manager" : "Employee"}
        </button>
        <button className="nav-item" onClick={() => setLoggedIn(false)}>
          Log out
        </button>
        <div className="sidebar-footer">Timesheet App · Week 6 MVP Release</div>
      </aside>
      <main className="content">
        {page === "dashboard" ? (
          <Dashboard refreshKey={refreshKey} />
        ) : (
          <Timesheets role={role} refreshKey={refreshKey} onRefresh={triggerRefresh} />
        )}
      </main>
    </div>
  )
}
