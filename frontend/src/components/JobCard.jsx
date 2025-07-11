import React, { useState } from 'react';

const JobCard = ({ jobId, title, company, location, imageUrl, showApplyButton, applyUrl }) => {
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    try {
      const email = localStorage.getItem('email');
      if (!email) return alert("⚠️ Please login first");

      const res = await fetch(`http://localhost:5000/api/user/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setApplied(true);
        alert("✅ Applied successfully!");
        if (applyUrl) {
          window.open(applyUrl, '_blank'); // ⬅️ Redirects to job site
        }
      } else {
        alert(data.message || "❌ Failed to apply");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="card shadow-sm h-100">
      {imageUrl && (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={title}
          style={{ height: '160px', objectFit: 'cover' }}
        />
      )}
      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title">{title}</h5>
          <p className="card-text"><strong>{company}</strong></p>
          <p className="card-text text-muted">
            <i className="bi bi-geo-alt-fill me-1"></i>{location}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          {applyUrl && (
            <a
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary btn-sm"
            >
              Details
            </a>
          )}

          {showApplyButton && (
            applied ? (
              <button className="btn btn-success btn-sm" disabled>Applied</button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleApply}>
                Apply
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
