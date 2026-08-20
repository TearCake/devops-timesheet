// Small API helper for the Week 3 skeleton.
// The backend runs on http://localhost:8080 during local development.

export const API_BASE = "http://localhost:8080/api";

export async function getJson(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}
