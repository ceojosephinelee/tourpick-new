
import React, { useState ,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import SightDetailPage from './SightDetailPage';
import MyCoursePage from './MyCoursePage';

import './App.css';

const App = () => {
  const [course, setCourse] = useState([]);
  useEffect(() => {
    const storedCourse = JSON.parse(localStorage.getItem('myCourse')) || [];
    setCourse(storedCourse);
  }, []);

  // Save the course to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('myCourse', JSON.stringify(course));
  }, [course]);

  const addToCourse = (sight) => {
    const isAlreadyAdded = course.some((item) => item.title === sight.title && item.mapx === sight.mapx && item.mapy === sight.mapy);
    if (isAlreadyAdded) {
      alert('이미 My Course에 추가된 관광지입니다.');
      return;
    }
    setCourse((prevCourse) => {
      const updatedCourse = [...prevCourse, sight];
      localStorage.setItem('myCourse', JSON.stringify(updatedCourse)); // 즉시 localStorage에 반영
      return updatedCourse;
    });
  };

  const deleteFromCourse = (index) => {
    setCourse((prevCourse) => prevCourse.filter((_, i) => i !== index));
  };

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        
        <Route path="/detail/:contentId" element={<SightDetailPage addToCourse={addToCourse} />} />
       
        <Route path="/mycourse" element={<MyCoursePage course={course} onDelete={deleteFromCourse}/>} />
        
      </Routes>
    </Router>
  );
};

export default App;
