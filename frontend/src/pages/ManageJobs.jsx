import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
     fetch(`${process.env.REACT_APP_API_BASE}/api/user/all`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('Could not load jobs');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setLocation('');
    setEditingJob(null);
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;

    // Clear old alerts
    setMessage('');
    setError('');

    try {
      fetch(`${process.env.REACT_APP_API_BASE}/api/user/delete/${id}`);
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Delete failed');

      setMessage(data.message || 'Deleted successfully');
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Delete failed');
    }
  };

  const startEdit = (job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
  };

  const submitEdit = async (e) => {
    e.preventDefault();

    // Clear old alerts
    setMessage('');
    setError('');

    try {
      fetch(`${process.env.REACT_APP_API_BASE}/api/user/edit/${editingJob._id}`);
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, company, location }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      setMessage('Updated successfully');
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2>All Jobs</h2>

      {message && !error && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {editingJob && (
        <form onSubmit={submitEdit} className="mb-4">
          <h5>Edit Job</h5>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="form-control mb-2"
          />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="form-control mb-2"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="form-control mb-2"
          />
          <button className="btn btn-primary me-2" type="submit">
            Update
          </button>
          <button className="btn btn-secondary" onClick={resetForm} type="button">
            Cancel
          </button>
        </form>
      )}

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-4 mb-3" key={job._id}>
              <div className="card h-100">
                <img
                  src={job.imageUrl || 'https://via.placeholder.com/120'}
                  className="card-img-top"
                  alt="Job"
                />
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">
                    <strong>{job.company}</strong>
                    <br />
                    {job.location}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-warning" onClick={() => startEdit(job)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
