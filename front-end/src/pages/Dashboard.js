import React from 'react';
import { useHistory } from 'react-router-dom';

export const Dashboard = () => {
  const history = useHistory();

  return (
    <div className="dashboard">
      <h1>This is dashboard page. here are your stats:</h1>
    </div>
  );
};
