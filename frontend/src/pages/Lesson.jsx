import React from 'react';
import { useParams } from 'react-router-dom';

const Lesson = () => {
  const { id } = useParams();
  return <div className="p-4">Lesson Page - ID: {id}</div>;
};

export default Lesson;
