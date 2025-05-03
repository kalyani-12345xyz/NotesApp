import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Reg from "./Reg";
import Notes from "./Notes";

function App() {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/reg" />} />
        <Route path="/reg" element={<Reg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={userEmail ? <Notes /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
