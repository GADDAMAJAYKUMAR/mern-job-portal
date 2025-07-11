import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const ApplicantsTable = ({ jobs }) => {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Applicants</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job, idx) => (
          <tr key={idx}>
            <td>{job.title}</td>
            <td>{job.applicants}</td>
            <td>
              <Badge bg={job.status === 'Open' ? 'success' : 'secondary'}>
                {job.status}
              </Badge>
            </td>
            <td>
              <Button variant="link" size="sm">View Details</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ApplicantsTable;
