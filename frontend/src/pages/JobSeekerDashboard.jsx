import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/Navbar';

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const email = localStorage.getItem('email');

  const fetchAllJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/user/all');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();

      // Initialize applied state as false
      const jobsWithState = data.map(job => ({
        ...job,
        applied: false,
      }));

      setJobs(jobsWithState);
    } catch (err) {
      console.error(err);
      setError('❌ Failed to load jobs');
    }
  };

  const handleApply = async (jobId, index) => {
    try {
      if (!email) return alert('Please log in first.');

      const res = await fetch(`http://localhost:5000/api/user/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Applied successfully!');
        const updatedJobs = [...jobs];
        updatedJobs[index].applied = true;
        setJobs(updatedJobs);
      } else {
        alert(data.message || '❌ Failed to apply');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Server error');
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <div className="d-flex bg-light">
      {/* Sidebar */}
      <Sidebar role="student" />

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <TopNavbar role="student" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold">💼 Available Jobs</h3>
        </div>

        {/* Error or No Jobs */}
        {error && <div className="alert alert-danger">{error}</div>}
        {!error && jobs.length === 0 && (
          <div className="alert alert-info">No jobs available right now.</div>
        )}

        {/* Job Cards */}
        <div className="row">
          {jobs.map((job, index) => (
            <div key={job._id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0 h-100 p-3">
                <h5 className="fw-semibold">{job.title}</h5>
                <p className="mb-1"><strong>{job.company}</strong></p>
                <p className="text-muted mb-2">
                  <i className="bi bi-geo-alt-fill me-1"></i> {job.location}
                </p>

                <div className="d-flex justify-content-between align-items-center">
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Details
                    </a>
                  )}

                  {job.applied ? (
                    <button className="btn btn-success btn-sm" disabled>
                      Applied
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApply(job._id, index)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
