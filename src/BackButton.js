import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>뒤로 가기</button>
  );
};

export default BackButton;
