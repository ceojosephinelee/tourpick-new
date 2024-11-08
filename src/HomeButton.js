import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/')}>홈으로 가기</button>
  );
};

export default HomeButton;
