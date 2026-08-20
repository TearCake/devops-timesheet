import { useEffect, useState } from "react"

/*
  Automated Timesheet Management Platform — Week 3 skeleton.
  This is the Figma-preview mirror of timesheet-management/frontend so the UI
  renders here. It tries the real backend (http://localhost:8080/api) and falls
  back to sample data when the backend isn't running (as in this preview).
*/

const API_BASE = "http://localhost:8080/api"

type Row = {
  timesheetId: number
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

function useConnection<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [conn, setConn] = useState<Conn>("loading")
  useEffect(() => {
    let alive = true
    fetch(`${API_BASE}${path}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!alive) return
        setData(d)
        setConn("ok")
      })
      .catch(() => alive && setConn("fallback"))
    return () => {
      alive = false
    }
  }, [path])
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

function Dashboard() {
  const { data, conn } = useConnection<typeof SAMPLE_SUMMARY>("/dashboard", SAMPLE_SUMMARY)
  const cards = [
    { label: "Hours this week", value: data.totalHoursThisWeek },
    { label: "Pending approval", value: data.pendingApproval },
    { label: "Approved", value: data.approved },
    { label: "Active projects", value: data.activeProjects },
  ]
  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Overview of your timesheet activity.</p>
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

function Timesheets() {
  const { data, conn } = useConnection<{ data: Row[] }>("/timesheets", { data: SAMPLE_ROWS })
  const rows = data.data || []
  return (
    <>
      <h1 className="page-title">Timesheets</h1>
      <p className="page-sub">Placeholder entries served by the backend.</p>
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
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.timesheetId}>
                <td className="mono">#{r.timesheetId}</td>
                <td className="mono">{r.date}</td>
                <td className="mono">{r.hours}</td>
                <td>{r.description}</td>
                <td>
                  <span className={`badge ${r.status}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
        <p>Sign in to continue (placeholder — no real auth yet).</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" defaultValue="asha@example.com" />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" defaultValue="placeholder" />
        <button className="btn" type="submit">
          Sign in
        </button>
        <div className="hint">Week 3 skeleton — authentication arrives later.</div>
      </form>
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [page, setPage] = useState<"dashboard" | "timesheets">("dashboard")

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
        <div className="sidebar-footer">Week 3 skeleton · v0.0.1</div>
      </aside>
      <main className="content">{page === "dashboard" ? <Dashboard /> : <Timesheets />}</main>
    </div>
  )
}
