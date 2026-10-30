import { useEffect, useState } from "react"

/*
  Automated Timesheet Management Platform — Full MVP + Project Management & CSV Export.
  Features:
  - Create, View, Edit, and Delete timesheet records (Full CRUD)
  - Search by keyword/date and filter by status
  - Dynamic Project Management & Selection
  - Role-based workflow (Employee creates/submits, Manager approves/rejects)
  - Sign-up request workflow (Employee registration creates pending request; Manager reviews and approves/rejects)
  - Dynamic Dashboard statistics
  - Live persistence with Spring Boot REST API & MySQL
*/

let detectedPort = "8085"

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(`http://localhost:${detectedPort}/api${path}`, options)
    if (res.ok || res.status < 500) {
      return res
    }
  } catch {}

  const fallbackPort = detectedPort === "8085" ? "8080" : "8085"
  try {
    const res = await fetch(`http://localhost:${fallbackPort}/api${path}`, options)
    if (res.ok || res.status < 500) {
      detectedPort = fallbackPort
      return res
    }
  } catch {}

  return fetch(`http://localhost:${detectedPort}/api${path}`, options)
}

type Row = {
  timesheetId: number
  userId?: number
  projectId?: number
  date: string
  hours: number
  description: string
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED"
}

type Project = {
  projectId: number
  projectName: string
  description?: string
}

const SAMPLE_PROJECTS: Project[] = [
  { projectId: 1, projectName: "Website Revamp", description: "Company marketing website rebuild" },
  { projectId: 2, projectName: "Mobile App", description: "Internal timesheet mobile client" },
  { projectId: 3, projectName: "Cloud Migration", description: "Infrastructure migration to AWS" },
]

const SAMPLE_ROWS: Row[] = [
  { timesheetId: 1, projectId: 1, date: "2026-08-17", hours: 8.0, description: "Homepage layout", status: "APPROVED" },
  { timesheetId: 2, projectId: 2, date: "2026-08-18", hours: 6.5, description: "API integration", status: "SUBMITTED" },
  { timesheetId: 3, projectId: 1, date: "2026-08-18", hours: 2.0, description: "Bug fixes", status: "DRAFT" },
]

const SAMPLE_SUMMARY = { totalHoursThisWeek: 32.5, pendingApproval: 3, approved: 5, activeProjects: 3 }

type Conn = "loading" | "ok" | "fallback"
type Role = "EMPLOYEE" | "MANAGER"

type SignUpRequest = {
  requestId: number
  name: string
  email: string
  role: Role
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt?: string
}

type AuthUser = {
  userId?: number
  name: string
  email: string
  role: Role
  status: "APPROVED" | "PENDING" | "REJECTED"
}

const INITIAL_REQUESTS: SignUpRequest[] = [
  {
    requestId: 1,
    name: "Rahul Sharma",
    email: "rahul@timesheet.local",
    role: "EMPLOYEE",
    status: "PENDING",
    createdAt: "2026-08-20 10:30:00",
  },
  {
    requestId: 2,
    name: "Pooja Patel",
    email: "pooja@timesheet.local",
    role: "EMPLOYEE",
    status: "APPROVED",
    createdAt: "2026-08-19 14:15:00",
  },
]

const INITIAL_USERS: AuthUser[] = [
  { userId: 1, name: "Asha Rao", email: "asha@timesheet.local", role: "EMPLOYEE", status: "APPROVED" },
  { userId: 2, name: "Mia", email: "mia@timesheet.local", role: "MANAGER", status: "APPROVED" },
  { userId: 3, name: "Pooja Patel", email: "pooja@timesheet.local", role: "EMPLOYEE", status: "APPROVED" },
]

const fallbackRequests: SignUpRequest[] = [...INITIAL_REQUESTS]
const fallbackUsers: AuthUser[] = [...INITIAL_USERS]

function useConnection<T>(path: string, fallback: T, refreshKey: number = 0) {
  const [data, setData] = useState<T>(fallback)
  const [conn, setConn] = useState<Conn>("loading")
  const [activePort, setActivePort] = useState<string>(detectedPort)

  useEffect(() => {
    let alive = true
    setConn("loading")
    apiFetch(path)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return
        setData(d)
        setConn("ok")
        setActivePort(detectedPort)
      })
      .catch(() => {
        if (alive) setConn("fallback")
      })
    return () => {
      alive = false
    }
  }, [path, refreshKey])

  return { data, conn, activePort }
}

function Banner({ conn, activePort }: { conn: Conn; activePort?: string }) {
  if (conn === "loading") return <div className="banner">Connecting to backend…</div>
  if (conn === "ok")
    return (
      <div className="banner ok">
        Connected to {activePort === "8085" ? "Docker container" : "backend"} at{" "}
        <span className="mono">localhost:{activePort || detectedPort}</span>.
      </div>
    )
  return (
    <div className="banner">
      Preview mode — showing sample data. Run the Spring Boot backend on{" "}
      <span className="mono">localhost:8080</span> or Docker on <span className="mono">localhost:8085</span>.
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

function ProjectsView({ refreshKey, onRefresh }: { refreshKey: number; onRefresh: () => void }) {
  const { data, conn } = useConnection<{ data: Project[] }>("/projects", { data: SAMPLE_PROJECTS }, refreshKey)
  const projects = data.data || []
  const [showModal, setShowModal] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiFetch("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, description }),
      })
      setShowModal(false)
      setProjectName("")
      setDescription("")
      onRefresh()
    } catch {
      alert("Failed to create project.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="toolbar">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-sub" style={{ margin: 0 }}>Active client and internal projects.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + New Project
        </button>
      </div>

      <Banner conn={conn} />

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.projectId}>
                <td className="mono">#{p.projectId}</td>
                <td><strong>{p.projectName}</strong></td>
                <td>{p.description || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreate}>
              <label htmlFor="proj-name">Project Name</label>
              <input
                id="proj-name"
                type="text"
                placeholder="e.g., Mobile App Redesign"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />

              <label htmlFor="proj-desc">Description</label>
              <input
                id="proj-desc"
                type="text"
                placeholder="Project objectives..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button type="button" className="action-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  const { data: projData } = useConnection<{ data: Project[] }>("/projects", { data: SAMPLE_PROJECTS }, refreshKey)
  const projects = projData.data || SAMPLE_PROJECTS

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

  const getProjectName = (projId?: number) => {
    const p = projects.find((item) => item.projectId === projId)
    return p ? p.projectName : `Project #${projId || 1}`
  }

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      projectId: projects[0]?.projectId || 1,
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
      const path = editingId ? `/timesheets/${editingId}` : "/timesheets"
      const method = editingId ? "PUT" : "POST"

      const res = await apiFetch(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      setShowModal(false)
      onRefresh()
    } catch (err) {
      console.warn("Backend save failed or in preview mode:", err)
      setShowModal(false)
      onRefresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id: number, action: "submit" | "approve" | "reject") => {
    try {
      const res = await apiFetch(`/timesheets/${id}/${action}`, {
        method: "PATCH",
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      onRefresh()
    } catch (err) {
      console.warn(`Backend ${action} failed:`, err)
      onRefresh()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this timesheet entry?")) return
    try {
      await apiFetch(`/timesheets/${id}`, {
        method: "DELETE",
      })
      onRefresh()
    } catch {
      alert("Failed to delete timesheet entry.")
    }
  }

  const exportToCSV = () => {
    if (rows.length === 0) {
      alert("No timesheet entries to export.")
      return
    }
    const headers = ["Timesheet ID", "Date", "Project", "Hours", "Description", "Status"]
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.timesheetId,
          `"${r.date}"`,
          `"${getProjectName(r.projectId).replace(/"/g, '""')}"`,
          r.hours,
          `"${(r.description || "").replace(/"/g, '""')}"`,
          r.status,
        ].join(",")
      ),
    ]
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `timesheet_export_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-secondary" onClick={exportToCSV} title="Export filtered records as CSV">
            📥 Export CSV
          </button>
          {role === "EMPLOYEE" && (
            <button className="btn-primary" onClick={openCreateModal}>
              + Log New Entry
            </button>
          )}
        </div>
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
              <th>Project</th>
              <th>Hours</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                  No matching timesheet entries found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.timesheetId}>
                  <td className="mono">#{r.timesheetId}</td>
                  <td className="mono">{r.date}</td>
                  <td><strong>{getProjectName(r.projectId)}</strong></td>
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

              <label htmlFor="entry-proj">Project</label>
              <select
                id="entry-proj"
                className="filter-select"
                style={{ width: "100%", marginBottom: "16px" }}
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: parseInt(e.target.value) || 1 })}
              >
                {projects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectName}
                  </option>
                ))}
              </select>

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

function AccountRequestsView({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number
  onRefresh: () => void
}) {
  const [filter, setFilter] = useState<string>("ALL")
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "info" } | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const { data, conn } = useConnection<{ data: SignUpRequest[] }>(
    "/auth/signup-requests",
    { data: fallbackRequests },
    refreshKey
  )

  const currentList = data.data || fallbackRequests
  const requests = currentList.filter((req) => {
    if (filter === "ALL") return true
    return req.status === filter
  })

  const handleAction = async (id: number, action: "approve" | "reject") => {
    setActionLoading(id)
    try {
      const res = await apiFetch(`/auth/signup-requests/${id}/${action}`, {
        method: "PATCH",
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      setFeedback({
        message:
          action === "approve"
            ? `Successfully approved sign-up request #${id}. The employee account is now activated and can log in.`
            : `Sign-up request #${id} has been rejected.`,
        type: action === "approve" ? "success" : "info",
      })
      onRefresh()
    } catch {
      // Fallback preview mode handling
      const target = fallbackRequests.find((r) => r.requestId === id)
      if (target) {
        target.status = action === "approve" ? "APPROVED" : "REJECTED"
        if (action === "approve") {
          fallbackUsers.push({
            userId: Date.now(),
            name: target.name,
            email: target.email,
            role: target.role,
            status: "APPROVED",
          })
        }
        setFeedback({
          message:
            action === "approve"
              ? `Approved sign-up request for ${target.name}! Account activated for ${target.email}.`
              : `Sign-up request for ${target.name} has been rejected.`,
          type: action === "approve" ? "success" : "info",
        })
      }
      onRefresh()
    } finally {
      setActionLoading(null)
    }
  }

  const pendingCount = currentList.filter((r) => r.status === "PENDING").length

  return (
    <>
      <div className="toolbar">
        <div>
          <h1 className="page-title">Account Sign-Up Requests</h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Review employee registration requests. Approved accounts can immediately log into the platform.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {pendingCount > 0 && (
            <span className="badge PENDING" style={{ fontSize: "13px", padding: "6px 12px" }}>
              {pendingCount} Pending Approval
            </span>
          )}
        </div>
      </div>

      <Banner conn={conn} />

      {feedback && (
        <div
          className={`auth-alert ${feedback.type}`}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Requests ({currentList.length})</option>
          <option value="PENDING">Pending Approval ({pendingCount})</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Applicant Name</th>
              <th>Work Email</th>
              <th>Role</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Review Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                  No sign-up requests match the selected filter.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.requestId}>
                  <td className="mono">#{r.requestId}</td>
                  <td><strong>{r.name}</strong></td>
                  <td className="mono">{r.email}</td>
                  <td>
                    <span style={{ textTransform: "capitalize", fontSize: "13px" }}>
                      {r.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="mono" style={{ fontSize: "12px", color: "var(--muted)" }}>
                    {r.createdAt ? r.createdAt.replace("T", " ").substring(0, 19) : "Recently"}
                  </td>
                  <td>
                    <span className={`badge ${r.status}`}>{r.status}</span>
                  </td>
                  <td>
                    <div className="action-group">
                      {r.status === "PENDING" ? (
                        <>
                          <button
                            className="action-btn approve"
                            disabled={actionLoading === r.requestId}
                            title="Accept and activate this employee account"
                            onClick={() => handleAction(r.requestId, "approve")}
                          >
                            {actionLoading === r.requestId ? "..." : "✓ Accept"}
                          </button>
                          <button
                            className="action-btn reject"
                            disabled={actionLoading === r.requestId}
                            title="Reject this registration request"
                            onClick={() => handleAction(r.requestId, "reject")}
                          >
                            {actionLoading === r.requestId ? "..." : "✕ Reject"}
                          </button>
                        </>
                      ) : r.status === "APPROVED" ? (
                        <span style={{ color: "var(--approved)", fontSize: "12px", fontWeight: 500 }}>
                          ✓ Account Active
                        </span>
                      ) : (
                        <span style={{ color: "var(--rejected)", fontSize: "12px", fontWeight: 500 }}>
                          ✕ Request Denied
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
    </>
  )
}

function Login({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")

  // Sign In form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginAlert, setLoginAlert] = useState<{ message: string; type: "error" | "warning" | "success" } | null>(null)
  const [loading, setLoading] = useState(false)

  // Sign Up form fields
  const [name, setName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupRole, setSignupRole] = useState<Role>("EMPLOYEE")
  const [signupAlert, setSignupAlert] = useState<{ message: string; type: "error" | "warning" | "success" } | null>(null)

  const handleQuickLogin = (role: Role, customEmail?: string) => {
    if (customEmail === "rahul@timesheet.local") {
      setLoginAlert({
        message: "⚠️ Your sign-up request for Rahul Sharma is pending approval by a manager. Please wait until a manager accepts your request before logging in.",
        type: "warning",
      })
      return
    }
    const user = fallbackUsers.find((u) => u.role === role) || {
      userId: role === "EMPLOYEE" ? 1 : 2,
      name: role === "EMPLOYEE" ? "Asha Rao" : "Mia",
      email: role === "EMPLOYEE" ? "asha@timesheet.local" : "mia@timesheet.local",
      role,
      status: "APPROVED",
    }
    onLogin(user)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginAlert(null)
    setLoading(true)

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        onLogin(data.user || { name: email.split("@")[0], email, role: data.user?.role || "EMPLOYEE", status: "APPROVED" })
        return
      }

      if (res.status === 403) {
        setLoginAlert({
          message: data.message || "Your sign-up request is pending approval by a manager.",
          type: data.message && data.message.toLowerCase().includes("rejected") ? "error" : "warning",
        })
        return
      }

      throw new Error(data.message || "Invalid credentials")
    } catch (err: any) {
      // Check fallback mock store if server is offline or returned error
      const pendingReq = fallbackRequests.find(
        (r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "PENDING"
      )
      if (pendingReq) {
        setLoginAlert({
          message: `⚠️ Your sign-up request for ${pendingReq.name} is pending approval by a manager. You will be able to log in once approved.`,
          type: "warning",
        })
        return
      }

      const rejectedReq = fallbackRequests.find(
        (r) => r.email.toLowerCase() === email.toLowerCase() && r.status === "REJECTED"
      )
      if (rejectedReq) {
        setLoginAlert({
          message: `❌ Your sign-up request for ${rejectedReq.name} was rejected by a manager.`,
          type: "error",
        })
        return
      }

      const matchedUser = fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (matchedUser) {
        onLogin(matchedUser)
        return
      }

      setLoginAlert({
        message: err.message || "Invalid email or password.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignupAlert(null)
    setLoading(true)

    try {
      const res = await apiFetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: signupEmail, password: signupPassword, role: signupRole }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        if (signupRole === "EMPLOYEE") {
          setSignupAlert({
            message: "✅ Sign-up request submitted! As an Employee, your account is now PENDING approval from a manager. Once approved, you can log in.",
            type: "success",
          })
          fallbackRequests.unshift({
            requestId: Date.now(),
            name,
            email: signupEmail,
            role: "EMPLOYEE",
            status: "PENDING",
            createdAt: new Date().toISOString(),
          })
        } else {
          setSignupAlert({
            message: "✅ Manager account registered successfully! You can now switch to Sign In.",
            type: "success",
          })
          fallbackUsers.push({
            userId: Date.now(),
            name,
            email: signupEmail,
            role: "MANAGER",
            status: "APPROVED",
          })
        }
        setName("")
        setSignupEmail("")
        setSignupPassword("")
        return
      }

      throw new Error(data.message || "Failed to register")
    } catch (err: any) {
      if (signupRole === "EMPLOYEE") {
        fallbackRequests.unshift({
          requestId: fallbackRequests.length + 1,
          name,
          email: signupEmail,
          role: "EMPLOYEE",
          status: "PENDING",
          createdAt: new Date().toISOString(),
        })
        setSignupAlert({
          message: `✅ Sign-up request submitted for ${name}! As an Employee, your account is PENDING manager approval. A manager must accept it before you can log in.`,
          type: "success",
        })
      } else {
        fallbackUsers.push({
          userId: Date.now(),
          name,
          email: signupEmail,
          role: "MANAGER",
          status: "APPROVED",
        })
        setSignupAlert({
          message: `✅ Manager account registered for ${name}! You can now switch to Sign In.`,
          type: "success",
        })
      }
      setName("")
      setSignupEmail("")
      setSignupPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Timesheet Management</h1>
        <p>Enterprise Timesheet Tracking & Approval Platform</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "signin" ? "active" : ""}`}
            onClick={() => {
              setMode("signin")
              setLoginAlert(null)
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup")
              setSignupAlert(null)
            }}
          >
            Create Account
          </button>
        </div>

        {mode === "signin" ? (
          <div>
            {loginAlert && (
              <div className={`auth-alert ${loginAlert.type}`}>
                {loginAlert.message}
              </div>
            )}

            <form onSubmit={handleSignIn}>
              <label htmlFor="login-email">Work Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button className="btn" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In with Credentials"}
              </button>
            </form>

            <div className="quick-login-divider">Quick Demo Login</div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
                onClick={() => handleQuickLogin("EMPLOYEE")}
              >
                <span>👤 <strong>Asha Rao</strong> (Active Employee)</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--approved)" }}>Approved</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
                onClick={() => handleQuickLogin("MANAGER")}
              >
                <span>👔 <strong>Mia</strong> (Timesheet Manager)</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--primary)" }}>Manager</span>
              </button>

              <button
                type="button"
                className="btn-secondary"
                style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between", borderColor: "rgba(244, 183, 64, 0.4)" }}
                onClick={() => handleQuickLogin("EMPLOYEE", "rahul@timesheet.local")}
                title="Click to test what happens when a pending employee attempts to log in"
              >
                <span>⏳ <strong>Rahul Sharma</strong> (Pending Request)</span>
                <span className="mono" style={{ fontSize: "11px", color: "var(--submitted)" }}>Pending Demo</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {signupAlert && (
              <div className={`auth-alert ${signupAlert.type}`}>
                {signupAlert.message}
              </div>
            )}

            <form onSubmit={handleSignUp}>
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g., Rahul Sharma"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label htmlFor="signup-email">Work Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="e.g., rahul@timesheet.local"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                required
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />

              <label htmlFor="signup-role">Account Role</label>
              <select
                id="signup-role"
                className="filter-select"
                style={{ width: "100%", marginBottom: "12px" }}
                value={signupRole}
                onChange={(e) => setSignupRole(e.target.value as Role)}
              >
                <option value="EMPLOYEE">Employee (Requires Manager Approval)</option>
                <option value="MANAGER">Manager (Instant Activation)</option>
              </select>

              <div
                className="auth-alert info"
                style={{ fontSize: "12px", marginBottom: "16px", padding: "8px 12px" }}
              >
                {signupRole === "EMPLOYEE"
                  ? "ℹ Note: Signing up as an Employee creates a pending request. A manager must accept your request before you can log in."
                  : "ℹ Note: Manager accounts can review and approve employee registration requests."}
              </div>

              <button className="btn" type="submit" disabled={loading}>
                {loading
                  ? "Submitting..."
                  : signupRole === "EMPLOYEE"
                  ? "Submit Sign-Up Request"
                  : "Register Manager Account"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [role, setRole] = useState<Role>("EMPLOYEE")
  const [page, setPage] = useState<"dashboard" | "timesheets" | "projects" | "requests">("dashboard")
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1)

  const { data: reqData } = useConnection<{ data: SignUpRequest[] }>(
    "/auth/signup-requests",
    { data: fallbackRequests },
    refreshKey
  )

  const pendingRequestsCount = (reqData.data || fallbackRequests).filter(
    (r) => r.status === "PENDING"
  ).length

  if (!loggedIn) {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user)
          setRole(user.role)
          setLoggedIn(true)
        }}
      />
    )
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          Timesheet
        </div>

        <div className="role-badge">
          <span>●</span> {currentUser ? currentUser.name : (role === "EMPLOYEE" ? "Asha Rao" : "Mia")} ({role})
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
          className={`nav-item ${page === "projects" ? "active" : ""}`}
          onClick={() => setPage("projects")}
        >
          Projects
        </button>

        {role === "MANAGER" && (
          <button
            className={`nav-item ${page === "requests" ? "active" : ""}`}
            onClick={() => setPage("requests")}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span>Account Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="nav-badge">{pendingRequestsCount}</span>
            )}
          </button>
        )}

        <button
          className="nav-item"
          onClick={() => {
            const newRole = role === "EMPLOYEE" ? "MANAGER" : "EMPLOYEE"
            setRole(newRole)
            if (currentUser) {
              setCurrentUser({ ...currentUser, role: newRole })
            }
          }}
        >
          Switch to {role === "EMPLOYEE" ? "Manager" : "Employee"}
        </button>
        <button
          className="nav-item"
          onClick={() => {
            setLoggedIn(false)
            setCurrentUser(null)
          }}
        >
          Log out
        </button>
        <div className="sidebar-footer">Timesheet App · Full MVP</div>
      </aside>

      <main className="content">
        {page === "dashboard" ? (
          <Dashboard refreshKey={refreshKey} />
        ) : page === "timesheets" ? (
          <Timesheets role={role} refreshKey={refreshKey} onRefresh={triggerRefresh} />
        ) : page === "projects" ? (
          <ProjectsView refreshKey={refreshKey} onRefresh={triggerRefresh} />
        ) : (
          <AccountRequestsView refreshKey={refreshKey} onRefresh={triggerRefresh} />
        )}
      </main>
    </div>
  )
}
