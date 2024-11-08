import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const KeywordSearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  

  const handleSearch = async () => {
    const API_KEY = process.env.REACT_APP_TOUR_API_KEY;
    try {
      const response = await axios.get(`http://apis.data.go.kr/B551011/EngService1/searchKeyword1?ServiceKey=${API_KEY}&MobileOS=ETC&MobileApp=TestApp&listYN=Y&arrange=A&keyword=${keyword}&_type=json`, {
        params: {
          ServiceKey: API_KEY,
          keyword: keyword,
          MobileOS: 'ETC',
          MobileApp: 'TestApp',
          contentTypeId: 76,
          _type: 'json',
        }
      });

      // firstimage가 있는 관광지만 필터링
      const filteredResults = response.data.response.body.items.item.filter(spot => spot.firstimage);
      setResults(filteredResults);
    } catch (error) {
      console.error('키워드 검색 실패:', error);
    }
    
          
  };
  const handleSelect = (contentId) => {
    navigate(`/detail/${contentId}`);
  };

  return (
    <div>
      <h3>Keyword Search (키워드 검색)</h3>
      <input
        type="text"
        placeholder="Enter Tourist Attraction Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((spot, index) => (
          <li key={index}>
            <button onClick={() => handleSelect(spot.contentid)}>
              {spot.title}
              
              
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordSearch;
