import React from 'react';
import { Card } from 'react-bootstrap';

const ApplicationsChart = () => {
  return (
    <Card className="p-3">
      <h6>Applications Over Time</h6>
      <p className="text-success">+15%</p>
      <p className="text-muted">Last 30 Days +15%</p>
      <div className="d-flex justify-content-between text-muted">
        <span>Week 1</span>
        <span>Week 2</span>
        <span>Week 3</span>
        <span>Week 4</span>
      </div>
    </Card>
  );
};

export default ApplicationsChart;
