import React, { useEffect, useMemo, useState } from "react";
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaBook, FaClock } from "react-icons/fa";

/**
 * Super-simplified profile page
 * - Plain React (no styled-components / modals)
 * - Reads/writes a single PROFILE_KEY in localStorage
 * - Inline edit form (name, email, avatar initials)
 * - Tiny, mobile-first layout
 */

const PROFILE_KEY = "studentProfile";

const box = {
  card: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,.06)",
  },
  row: { display: "flex", alignItems: "center", gap: 12 },
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "10px 12px",
    borderRadius: 10,
    fontWeight: 700,
    cursor: "pointer",
  },
  primary: {
    background: "#0ea5e9",
    color: "#fff",
    border: "1px solid #0ea5e9",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 14,
  },
};

function initialsFromName(name = "") {
  const [a = "", b = ""] = name.split(" ");
  return (a[0] || "").toUpperCase() + (b[0] || "").toUpperCase();
}

export default function SimpleProfile() {
  const [profile, setProfile] = useState({
    name: "Student Name",
    email: "student@example.com",
    avatar: "SN", // initials
    booksRead: 24,
    hoursSpent: 156,
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile((p) => ({ ...p, ...parsed }));
        setDraft((p) => ({ ...p, ...parsed }));
      }
    } catch {console.log("error")}
  }, []);

  // Keep avatar initials in sync if user clears them
  const computedAvatar = useMemo(() => {
    const val = (editing ? draft.avatar : profile.avatar) || initialsFromName(editing ? draft.name : profile.name);
    return (val || initialsFromName(profile.name)).slice(0, 2).toUpperCase();
  }, [editing, draft.avatar, draft.name, profile.avatar, profile.name]);

  const handleSave = () => {
    const next = {
      ...profile,
      name: draft.name?.trim() || profile.name,
      email: draft.email?.trim() || profile.email,
      avatar: draft.avatar?.trim() || initialsFromName(draft.name || profile.name),
      booksRead: Number.isFinite(draft.booksRead) ? draft.booksRead : profile.booksRead,
      hoursSpent: Number.isFinite(draft.hoursSpent) ? draft.hoursSpent : profile.hoursSpent,
    };
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setEditing(false);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f8fafc",
      padding: 16,
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
        {/* Header card */}
        <section style={box.card}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              aria-label="User avatar"
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#0ea5e9,#22c55e)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 28,
              }}
            >
              {computedAvatar || <FaUser />}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ margin: 0, fontSize: 22 }}>{profile.name}</h1>
              <p style={{ margin: "6px 0 0 0", color: "#64748b" }}>
                <FaEnvelope style={{ marginRight: 6 }} /> {profile.email}
              </p>
            </div>

            {!editing ? (
              <button style={box.button} onClick={() => setEditing(true)}>
                <FaEdit /> Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ ...box.button, ...box.primary }} onClick={handleSave}>
                  <FaSave /> Save
                </button>
                <button
                  style={box.button}
                  onClick={() => {
                    setDraft(profile);
                    setEditing(false);
                  }}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Quick stats */}
        <section style={{ ...box.card, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ ...box.card, padding: 12 }}>
              <div style={box.row}>
                <FaBook />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Books Read</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.booksRead}</div>
                </div>
              </div>
            </div>
            <div style={{ ...box.card, padding: 12 }}>
              <div style={box.row}>
                <FaClock />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Study Hours</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{profile.hoursSpent}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline edit form */}
        {editing && (
          <section style={{ ...box.card, display: "grid", gap: 12 }} aria-label="Edit profile form">
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Name</span>
              <input
                style={box.input}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Your full name"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Email</span>
              <input
                type="email"
                style={box.input}
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                placeholder="you@example.com"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Avatar Initials</span>
              <input
                style={box.input}
                value={draft.avatar}
                onChange={(e) => setDraft((d) => ({ ...d, avatar: e.target.value.toUpperCase().slice(0, 2) }))}
                placeholder="e.g., SN"
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...box.button, ...box.primary }} onClick={handleSave}>
                <FaSave /> Save
              </button>
              <button
                style={box.button}
                onClick={() => {
                  setDraft(profile);
                  setEditing(false);
                }}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
