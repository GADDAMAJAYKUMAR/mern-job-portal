import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ⬅️ Import useNavigate

const PostJob = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    imageUrl: '',
    postedBy: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ⬅️ Setup navigation

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/user/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const result = await response.json();

    if (response.ok) {
      setMessage('✅ Job posted successfully');

      // Optional: wait 1 second to show message
      setTimeout(() => {
        navigate('/Dashboard'); // ⬅️ Navigate to homepage
      }, 1000);
    } else {
      setMessage(result.message || '❌ Failed to post job');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Post a New Job</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <input
          className="form-control mb-2"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          className="form-control mb-2"
          name="imageUrl"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          name="postedBy"
          placeholder="Posted By (email or user ID)"
          value={form.postedBy}
          onChange={handleChange}
        />
        <button className="btn btn-primary w-100">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
