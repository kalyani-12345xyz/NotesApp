import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
    } else {
      fetchAll();
    }
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { ...form, email: userEmail };

    const url = editId
      ? `http://localhost:4000/edit/${editId}`
      : "http://localhost:4000/create";

    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(noteData),
    });

    if (res.ok) {
      alert(editId ? "Note updated" : "Note created");
      setForm({ title: "", content: "" });
      setEditId(null);
      fetchAll();
    }
  };

//   
  const fetchAll = async () => {
    const res = await fetch(`http://localhost:4000/show?email=${userEmail}`);
    const notes = await res.json();
    setData(notes);
  };
  


const handleDelete = async (id) => {
    const res = await fetch(`http://localhost:4000/delete/${id}?email=${userEmail}`, {
      method: "DELETE",
    });
  
    if (res.ok) {
      alert("Note deleted");
      fetchAll();
    } else {
      const error = await res.json();
      alert("Error deleting note: " + error.message);
    }
  };
  

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
    const noteData = { ...form, email: userEmail };

  };

 
  return (
    <div className="container mt-4">
      <center>
        <h2 className="mb-4">Notes App</h2>
       

        <div className="card p-4 mb-4" style={{ background: "teal", width: "50%" }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ color: "white" }}>
                Title:
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleInput}
                className="form-control"
                placeholder="Enter title"
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ color: "white" }}>
                Content:
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInput}
                className="form-control"
                rows="4"
                placeholder="Enter content"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Save"}
            </button>
          </form>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-dark">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d._id}>
                  <td>{d.title}</td>
                  <td>{d.content}</td>
                  <td>
                    <button className="btn btn-danger me-2" onClick={() => handleDelete(d._id)}>
                      Delete
                    </button>
                    <button className="btn btn-warning" onClick={() => handleEdit(d)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </center>
    </div>
  );
}

export default Notes;
