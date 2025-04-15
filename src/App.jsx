import { useEffect, useState } from "react";

function App() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      const response = await fetch(`http://localhost:4000/edit/${editId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Note updated successfully");
        setForm({ title: "", content: "" });
        setEditId(null);
        fetchAll();
      }
    } else {
      const response = await fetch("http://localhost:4000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Note created successfully");
        setForm({ title: "", content: "" });
        fetchAll();
      }
    }
  };

  const fetchAll = async () => {
    const response = await fetch("http://localhost:4000/show");
    const result = await response.json();
    setData(result);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:4000/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Note deleted");
      fetchAll();
    }
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditId(note._id);
  };

  return (
    <div className="container mt-4">
      <center>
      <h2 className="text-center mb-4">Notes App</h2>
      <div className="card p-4 mb-4 " style={{'background':'teal', 'width':'50%' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{'color':'white'}}>Title:</label>
            <input
              type="text"
              name="title"
              value={form.title}
              placeholder="Enter Title"
              onChange={handleInput}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{'color':'white'}}>Content:</label>
            <textarea
              name="content"
              value={form.content}
              placeholder="Enter Content"
              onChange={handleInput}
              className="form-control"
              rows="4"
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
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d._id}>
                <td>{d.title}</td>
                <td>{d.content}</td>
                <td>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(d._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(d)}
                  >
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

export default App;
