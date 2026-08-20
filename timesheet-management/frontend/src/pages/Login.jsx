import { useState } from "react";

// Placeholder login. Week 3: no real authentication yet — any submit "logs in".
export default function Login({ onLogin }) {
  const [email, setEmail] = useState("asha@example.com");
  const [password, setPassword] = useState("placeholder");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Timesheet Management</h1>
        <p>Sign in to continue (placeholder — no real auth yet).</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" type="submit">
          Sign in
        </button>

        <div className="hint">Week 3 skeleton — authentication arrives later.</div>
      </form>
    </div>
  );
}
