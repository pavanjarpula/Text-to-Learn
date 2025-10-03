import React from 'react';
import { useParams } from 'react-router-dom';

const Course = () => {
  const { id } = useParams();
  return <div className="p-4">Course Page - ID: {id}</div>;
};

export default Course;
