import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    fullName: "",
    registrationNumber: "",
    email: "",
    course: "",
    yearOfStudy: "",
    phone: ""
  };

  const [form, setForm] = useState(emptyForm);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(API);
      setStudents(response.data);
    } catch (error) {
      setMessage("Could not load students. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const studentData = {
        ...form,
        yearOfStudy: Number(form.yearOfStudy)
      };

      if (editingId) {
        await axios.put(`${API}/${editingId}`, studentData);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API, studentData);
        setMessage("Student added successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchStudents();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed. Check your details.");
    }
  };

  const editStudent = (student) => {
    setForm({
      fullName: student.fullName || "",
      registrationNumber: student.registrationNumber || "",
      email: student.email || "",
      course: student.course || "",
      yearOfStudy: student.yearOfStudy || "",
      phone: student.phone || ""
    });

    setEditingId(student._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      setMessage("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      setMessage("Could not delete student.");
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.fullName} ${student.registrationNumber} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Student Management System</h1>
          <p>Manage student information in one place</p>
        </div>
        <span className="header-icon">SMS</span>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
          <div className="stat-card">
            <h3>Registered Courses</h3>
            <p>{new Set(students.map((s) => s.course)).size}</p>
          </div>
          <div className="stat-card">
            <h3>Academic Years</h3>
            <p>{new Set(students.map((s) => s.yearOfStudy)).size}</p>
          </div>
        </section>

        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="form-card">
          <h2>{editingId ? "Edit Student" : "Register New Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                required
              />

              <input
                name="registrationNumber"
                placeholder="Registration Number"
                value={form.registrationNumber}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                name="course"
                placeholder="Course"
                value={form.course}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="yearOfStudy"
                placeholder="Year of Study"
                min="1"
                value={form.yearOfStudy}
                onChange={handleChange}
                required
              />

              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Student" : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-card">
          <div className="table-heading">
            <h2>Student Records</h2>
            <input
              className="search"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Registration No.</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td>{student.fullName}</td>
                      <td>{student.registrationNumber}</td>
                      <td>{student.email}</td>
                      <td>{student.course}</td>
                      <td>{student.yearOfStudy}</td>
                      <td>{student.phone}</td>
                      <td className="actions">
                        <button
                          className="edit-btn"
                          onClick={() => editStudent(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteStudent(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty">
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        Student Management System © 2026
      </footer>
    </div>
  );
}

export default App;
