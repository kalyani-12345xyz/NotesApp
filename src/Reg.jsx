import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reg() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    if (res.ok) {
      alert("Registered successfully");
      localStorage.setItem("userEmail", form.email);
      navigate("/notes");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
  <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
    <h4 className="mb-3 text-center">Register</h4>
    <form onSubmit={handleRegister}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          className="form-control"
          placeholder="Enter email"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          className="form-control"
          placeholder="Enter password"
          onChange={handleChange}
          required
        />
      </div>
      <div className="d-grid mb-2">
        <button type="submit" className="btn btn-primary">Register</button>
      </div>
      <div className="d-grid">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    </form>
  </div>
</div>

  );
}

export default Reg;
