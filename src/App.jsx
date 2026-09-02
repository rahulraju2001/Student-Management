import { useEffect, useState } from "react";
import "./App.css";

const API_URL = `${import.meta.env.VITE_API_URL}/students`;
const emptyStudent = { name: "", age: "", course: "", email: "" };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyStudent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchStudents() {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load students.");
      setStudents(await response.json());
    } catch {
      setError("Unable to reach JSON Server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!response.ok) throw new Error("Could not add student.");
      const newStudent = await response.json();
      setStudents((current) => [...current, newStudent]);
      setForm(emptyStudent);
    } catch {
      setError("Could not add the student.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete student.");
      setStudents((current) => current.filter((student) => student.id !== id));
    } catch {
      setError("Could not delete the student.");
    }
  }

  return (
    <main className="app">
      <section className="intro">
        <h1>Student Management</h1>
      </section>
      <section className="panel form-panel" aria-labelledby="add-student-title">
        <div className="section-heading">
          <div>
            <h2 id="add-student-title">Add a student</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="student-form">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Age
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Course
            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <button className="add-button" type="submit" disabled={saving}>
            {saving ? "Adding…" : "Add Student"}
          </button>
        </form>
      </section>
      <section className="panel table-panel" aria-labelledby="students-title">
        <div className="section-heading">
          <div>
            <h2 id="students-title">All students</h2>
          </div>
        </div>
        {error && (
          <p className="message error-message" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p className="message">Loading students…</p>
        ) : students.length === 0 ? (
          <p className="message">No students yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>#{student.id}</td>
                    <td className="student-name">{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.course}</td>
                    <td>{student.email}</td>
                    <td>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => handleDelete(student.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
