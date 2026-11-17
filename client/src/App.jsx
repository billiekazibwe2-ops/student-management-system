import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    registrationNumber: "",
    email: "",
    course: "",
    yearOfStudy: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const fetchStudents = async () => {
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Could not load students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage("Unable to connect to the backend. Check that your server is running.");
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
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            yearOfStudy: Number(form.yearOfStudy),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Operation failed");

      setMessage(editingId ? "Student updated successfully!" : "Student added successfully!");
      resetForm();
      fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const editStudent = (student) => {
    setForm({
      fullName: student.fullName,
      registrationNumber: student.registrationNumber,
      email: student.email,
      course: student.course,
      yearOfStudy: student.yearOfStudy,
      phone: student.phone,
    });
    setEditingId(student._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Delete failed");

      setMessage("Student deleted successfully!");
      fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      registrationNumber: "",
      email: "",
      course: "",
      yearOfStudy: "",
      phone: "",
    });
    setEditingId(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage student records easily and efficiently</p>
      </header>

      <main className="container">
        <section className="form-card">
          <h2>{editingId ? "Update Student" : "Register New Student"}</h2>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
              <input name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
              <input name="course" placeholder="Course" value={form.course} onChange={handleChange} required />
              <input name="yearOfStudy" type="number" min="1" placeholder="Year of Study" value={form.yearOfStudy} onChange={handleChange} required />
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="buttons">
              <button type="submit">{editingId ? "Update Student" : "Add Student"}</button>
              {editingId && (
                <button type="button" className="cancel" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="table-card">
          <h2>Registered Students ({students.length})</h2>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Registration No.</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.fullName}</td>
                    <td>{student.registrationNumber}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.yearOfStudy}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button className="edit" onClick={() => editStudent(student)}>Edit</button>
                      <button className="delete" onClick={() => deleteStudent(student._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="7">No students registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;