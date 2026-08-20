import { useEffect, useState } from "react";
import { getJson } from "../api.js";

// Timesheet page. Fetches GET /api/timesheets and renders the placeholder rows.
export default function Timesheet() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getJson("/timesheets")
      .then((data) => {
        setRows(data.data || []);
        setStatus("ok");
      })
      .catch(() => setStatus("fail"));
  }, []);

  return (
    <>
      <h1 className="page-title">Timesheets</h1>
      <p className="page-sub">Placeholder entries served by the backend.</p>

      {status === "fail" && (
        <div className="banner fail">
          Could not reach backend at <span className="mono">localhost:8080</span>.
        </div>
      )}

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
            {status === "loading" && (
              <tr>
                <td colSpan={5}>Loading…</td>
              </tr>
            )}
            {status === "ok" && rows.length === 0 && (
              <tr>
                <td colSpan={5}>No timesheets yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
