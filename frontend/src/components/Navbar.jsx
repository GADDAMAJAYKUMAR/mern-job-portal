import React, { useState } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';

const TopNavbar = () => {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!term.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/user/search?term=${encodeURIComponent(term)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("❌ Search failed", err);
      alert("Failed to fetch search results");
    }
  };

  const handleApply = (applyUrl) => {
    if (applyUrl && applyUrl.startsWith("http")) {
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

      {results.length > 0 && (
        <div className="container mt-3">
          <h5>🔍 Search Results:</h5>
          {results.map((job) => (
            <div key={job._id} className="border p-3 mb-3 rounded shadow-sm">
              <h6>{job.title}</h6>
              <p><strong>{job.company}</strong> - {job.location}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApply(job.applyUrl)}
              >
                Apply Now
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TopNavbar;
