import React, { useState } from 'react';

const JobParser = () => {
  const [rawText, setRawText] = useState('');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');

  const extractJobs = () => {
    const blocks = rawText.split(/\n\s*\n/); // Split by double line breaks
    const parsedJobs = [];

    blocks.forEach((block) => {
      const lines = block.trim().split('\n');

      let job = {
        title: '',
        company: '',
        location: '',
        skills: '',
        stipend: '',
        applyUrl: '',
        applied: false,
      };

      lines.forEach((line) => {
        const l = line.trim();

        if (/Role|Title/i.test(l)) job.title = l.split(/[:-]/)[1]?.trim() || '';
        else if (/Company|Company name|Organization/i.test(l)) job.company = l.split(/[:-]/)[1]?.trim() || '';
        else if (/Location|Mode/i.test(l)) job.location = l.split(/[:-]/)[1]?.trim() || '';
        else if (/Skills/i.test(l)) job.skills = l.split(/[:-]/)[1]?.trim() || '';
        else if (/Stipend|Salary/i.test(l)) job.stipend = l.split(/[:-]/)[1]?.trim() || '';
        else if (/Apply|https?:\/\/\S+/i.test(l)) {
          const match = l.match(/https?:\/\/\S+/);
          if (match) job.applyUrl = match[0];
        }
      });

      if (job.title || job.company || job.applyUrl) parsedJobs.push(job);
    });

    setJobs(parsedJobs);
    setMessage(`✅ Extracted ${parsedJobs.length} job(s)`);
  };

  const postAllJobs = async () => {
    const postedBy = localStorage.getItem('email') || 'recruiter@example.com';

    const jobsToPost = jobs.map((job) => ({
      title: job.title,
      company: job.company,
      location: job.location,
      postedBy,
    }));

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/bulk-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobs: jobsToPost }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.data?.length || jobs.length} jobs posted!`);
        setRawText('');
        setJobs([]);
      } else {
        setMessage(data.message || '❌ Failed to post jobs');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    }
  };

  const toggleApplied = (index) => {
    const updatedJobs = [...jobs];
    updatedJobs[index].applied = !updatedJobs[index].applied;
    setJobs(updatedJobs);
  };

  return (
    <div className="container mt-4">
      <h4>📋 Paste Multiple Job Descriptions</h4>
      <textarea
        className="form-control mb-3"
        rows="10"
        placeholder="Paste LinkedIn / WhatsApp job text with line breaks between jobs"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
      />
      <button className="btn btn-info mb-3 me-2" onClick={extractJobs}>
        Extract All
      </button>
      {jobs.length > 0 && (
        <button className="btn btn-success mb-3" onClick={postAllJobs}>
          Post All Jobs
        </button>
      )}

      {message && <div className="alert alert-info">{message}</div>}

      {/* Preview Cards */}
      {jobs.map((job, i) => (
        <div key={i} className="card mb-2 p-3">
          <h5>{job.title}</h5>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Skills:</strong> {job.skills}</p>
          <p><strong>Stipend:</strong> {job.stipend}</p>
          {job.applyUrl && (
            <div className="d-flex align-items-center justify-content-between">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Apply
              </a>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`applied-${i}`}
                  checked={job.applied}
                  onChange={() => toggleApplied(i)}
                />
                <label className="form-check-label" htmlFor={`applied-${i}`}>
                  Applied
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobParser;
