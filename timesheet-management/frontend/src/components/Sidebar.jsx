export default function Sidebar({ page, onNavigate, onLogout }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "timesheets", label: "Timesheets" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="dot" />
        Timesheet
      </div>

      {items.map((item) => (
        <button
          key={item.key}
          className={`nav-item ${page === item.key ? "active" : ""}`}
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </button>
      ))}

      <button className="nav-item" onClick={onLogout}>
        Log out
      </button>

      <div className="sidebar-footer">Week 3 skeleton · v0.0.1</div>
    </aside>
  );
}
