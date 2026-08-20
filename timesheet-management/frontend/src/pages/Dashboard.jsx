import { useEffect, useState } from "react";
import { getJson } from "../api.js";

// Dashboard page. This is where we prove the frontend -> backend API call works:
// on load it fetches GET /api/dashboard and shows the result in a banner + cards.
export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | fail

  useEffect(() => {
    getJson("/dashboard")
      .then((data) => {
        setSummary(data);
        setStatus("ok");
      })
      .catch(() => setStatus("fail"));
  }, []);

  const cards = [
    { label: "Hours this week", value: summary?.totalHoursThisWeek ?? "—" },
    { label: "Pending approval", value: summary?.pendingApproval ?? "—" },
    { label: "Approved", value: summary?.approved ?? "—" },
    { label: "Active projects", value: summary?.activeProjects ?? "—" },
  ];

  return (
    <>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-sub">Overview of your timesheet activity.</p>

      {status === "loading" && (
        <div className="banner">Connecting to backend…</div>
      )}
      {status === "ok" && (
        <div className="banner ok">
          Connected to backend · <span className="mono">{summary.message}</span>
        </div>
      )}
      {status === "fail" && (
        <div className="banner fail">
          Could not reach backend at <span className="mono">localhost:8080</span>.
          Start the Spring Boot app, then reload.
        </div>
      )}

      <div className="card-grid">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <div className="label">{c.label}</div>
            <div className="value mono">{c.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}
