import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import HomeButton from './HomeButton';
import MapView from './MapView'; // MapView 컴포넌트 추가
import './App.css';

const MyCoursePage = ({ course, onDelete }) => {
  
  const [showMap, setShowMap] = useState(false); // 지도 보기 토글 상태
  

  const toggleMapView = () => {
    setShowMap((prev) => !prev); // showMap 상태 토글
  };

  
  
  

  return (
    <div>
      <BackButton />
      <HomeButton />
      <h1>My Course</h1>
      <ul>
        {course.map((spot, index) => (
          <li key={index}>
            {spot.title}
            <button onClick={() => onDelete(index)}>삭제</button>
          </li>
        ))}
      </ul>
    
      <button onClick={toggleMapView}>{showMap ? '목록 보기' : '지도 보기'}</button>
      {showMap && <MapView places={course} />} {/* showMap이 true일 때만 지도 표시 */}
    </div>
      
  );
};

export default MyCoursePage;
