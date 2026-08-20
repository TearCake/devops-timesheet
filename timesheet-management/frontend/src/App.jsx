import { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Timesheet from "./pages/Timesheet.jsx";

// Simple state-based navigation (no router yet — kept minimal for Week 3).
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="layout">
      <Sidebar
        page={page}
        onNavigate={setPage}
        onLogout={() => setLoggedIn(false)}
      />
      <main className="content">
        {page === "dashboard" ? <Dashboard /> : <Timesheet />}
      </main>
    </div>
  );
}
