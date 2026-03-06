import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Tasks from './Tasks';
import './App.css';

function Navigation() {
  const location = useLocation();
  const isTasksPage = location.pathname === '/tasks';

  if (isTasksPage) {
    return (
      <nav className="app-nav">
        <Link to="/" className="nav-link">← Back to Home</Link>
      </nav>
    );
  }

  return null;
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;
