import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  let navLinks;
  let panelTitle;

  if (role === 'recruiter') {
    panelTitle = 'Recruiter Panel';
    navLinks = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            📊 Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/managejobs">
            📝 Manage Jobs
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/recruiter/paste-job">
            📋 Paste Job
          </Link>
        </li>
      </>
    );
  } else if (role === 'student') {
    panelTitle = 'Job Seeker Panel';
    navLinks = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/jobseeker">
            📊 Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/jobseeker/myprofile">
            🙍‍♂️ My Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/jobseeker/appliedJobs">
            📌 Applied Jobs
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/jobseeker/savedJobs">
            ⭐ Saved Jobs
          </Link>
        </li>
      </>
    );
  } else {
    panelTitle = 'Unknown Panel';
    navLinks = <li className="nav-item">Please select a valid role</li>;
  }

  return (
    <div
      className="d-flex flex-column justify-content-between bg-light border-end"
      style={{ minHeight: '100vh', width: '250px' }}
    >
      <div className="p-3">
        <h5 className="mb-4 text-primary">{panelTitle}</h5>
        <ul className="nav flex-column gap-2">{navLinks}</ul>
      </div>

      {/* 🔒 Logout at the bottom */}
      <div className="p-3 border-top">
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
