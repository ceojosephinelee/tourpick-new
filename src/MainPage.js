

import React, { useState } from 'react';
import KeywordSearch from './Components/KeywordSearch.js';
import NearbySearch from './Components/NearbySearch.js';
import MapSearch from './Components/MapSearch';
import { useNavigate } from 'react-router-dom';

const MainPage = ({ addToCourse }) => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('keyword');

  const goToMyCoursePage = () => {
    navigate('/mycourse');
  };
 

  return (
    <div>
      <br></br>
      <h1>TourPick</h1>
      <button onClick={goToMyCoursePage}>Go To My Course</button><br></br>

      <div>
        <br></br>
        
        <KeywordSearch addToCourse={addToCourse} />

        
        <NearbySearch addToCourse={addToCourse} /><br></br>


        <MapSearch addToCourse={addToCourse} />
      </div>

    </div>
  );
};

export default MainPage;
