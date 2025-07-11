import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const TopNavbar = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/search?term=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Search failed", err);
      alert("Failed to fetch search results");
    }
  };

  // Just open the URL in a new tab on apply
  const handleApply = (applyUrl) => {
    if (applyUrl) {
      window.open(applyUrl, '_blank');
    } else {
      alert("❌ No apply link available");
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="px-3">
        <Navbar.Brand href="#">Job Portal</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#">Dashboard</Nav.Link>
        </Nav>

        <Form className="d-flex" onSubmit={handleSearch}>
          <FormControl
            type="search"
            placeholder="Search jobs"
            className="me-2"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <Button variant="outline-success" type="submit">Search</Button>
        </Form>
      </Navbar>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="container mt-3">
          <h5>🔍 Results:</h5>
          {results.map((job) => (
            <div key={job._id} className="border p-3 mb-3 rounded shadow-sm">
              <h6>{job.title}</h6>
              <p><strong>{job.company}</strong> - {job.location}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleApply(job.applyUrl)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TopNavbar;
