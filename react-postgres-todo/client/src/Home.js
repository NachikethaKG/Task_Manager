import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '✅',
      title: 'Easy Task Management',
      description: 'Create, update, and delete tasks with a simple and intuitive interface'
    },
    {
      icon: '💾',
      title: 'Persistent Storage',
      description: 'All your tasks are safely stored in PostgreSQL database'
    },
    {
      icon: '⚡',
      title: 'Real-time Updates',
      description: 'See your changes instantly with our fast React frontend'
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, clean interface that makes task management enjoyable'
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to <span className="gradient-text">TaskMaster</span>
        </h1>
        <p className="hero-subtitle">
          Your simple, powerful, and beautiful task management solution
        </p>
        <button className="cta-button" onClick={() => navigate('/tasks')}>
          Get Started
          <span className="arrow">→</span>
        </button>
      </div>

      <div className="features-section">
        <h2 className="features-title">Why Choose TaskMaster?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-content">
          <div className="demo-text">
            <h2>Built with Modern Technologies</h2>
            <ul className="tech-list">
              <li><strong>React 19</strong> - Fast and responsive UI</li>
              <li><strong>Node.js & Express</strong> - Robust backend API</li>
              <li><strong>PostgreSQL</strong> - Reliable data persistence</li>
              <li><strong>RESTful API</strong> - Clean architecture</li>
            </ul>
          </div>
          <div className="demo-visual">
            <div className="demo-card">
              <div className="demo-card-header">
                <div className="demo-dot red"></div>
                <div className="demo-dot yellow"></div>
                <div className="demo-dot green"></div>
              </div>
              <div className="demo-card-body">
                <div className="demo-task">✓ Design homepage</div>
                <div className="demo-task active">⭘ Build API endpoints</div>
                <div className="demo-task">⭘ Deploy to production</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Get Organized?</h2>
        <p>Start managing your tasks efficiently today</p>
        <button className="cta-button secondary" onClick={() => navigate('/tasks')}>
          Launch App
          <span className="arrow">→</span>
        </button>
      </div>

      <footer className="home-footer">
        <p>Built with ❤️ using React + PostgreSQL</p>
      </footer>
    </div>
  );
}

export default Home;
