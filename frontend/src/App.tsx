import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Router>
  );
}

export default App;

