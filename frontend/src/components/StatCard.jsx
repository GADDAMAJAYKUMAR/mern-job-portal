// src/components/StatCard.jsx
import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value }) => {
  return (
    <Card className="text-center p-3">
      <h6>{title}</h6>
      <h4>{value}</h4>
    </Card>
  );
};

export default StatCard;
