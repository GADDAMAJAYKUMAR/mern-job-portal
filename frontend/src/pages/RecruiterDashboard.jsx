import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const fetchAllJobs = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/all`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to load jobs');
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div style={{ width: '250px',height:"100vh" }}>
        <Sidebar role="recruiter" />
      </div>

      {/* Main content */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <TopNavbar role="recruiter" />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">📝 Posted Jobs</h3>
          <Link to="/recruiter/paste-job" className="btn btn-primary">
            ➕ Paste Job Description
          </Link>
        </div>

        {/* Error or No Jobs */}
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && jobs.length === 0 && (
          <div className="alert alert-info">No jobs posted yet.</div>
        )}

        {/* Job Cards */}
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-dark fw-semibold mb-2">{job.title}</h5>
                  <p className="card-text mb-1 fw-medium">{job.company}</p>
                  <p className="card-text text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-1"></i>
                    {job.location}
                  </p>
                  <small className="text-muted">Posted by: {job.postedBy}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
