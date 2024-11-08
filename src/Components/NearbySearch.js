import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';


const NearbySearch = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          fetchNearbyPlaces(latitude, longitude);
        }, (error) => {
          console.error("위치 정보를 가져오지 못했습니다:", error);
        });
      } else {
        console.error("Geolocation API를 지원하지 않습니다.");
      }
    };

    getCurrentLocation(); // 위치 가져오기 함수 호출
  }, []); // 빈 배열로 두면 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  const fetchNearbyPlaces = async (latitude, longitude) => {
    const API_KEY = process.env.REACT_APP_TOUR_API_KEY;
    try {
      const response = await axios.get(`http://apis.data.go.kr/B551011/EngService1/locationBasedList1?ServiceKey=${API_KEY}&numOfRows=30&pageNo=1&MobileOS=ETC&MobileApp=AppTest&listYN=Y&arrange=A&mapX=${longitude}&mapY=${latitude}&radius=3000&_type=json`, {
        params: {
          ServiceKey: API_KEY,
          mapX: longitude,
          mapY: latitude,
          MobileOS: 'ETC',
          MobileApp: 'AppTest',
          contentTypeId: 76,
          
          _type: 'json',
        }
      });
      const filteredLocations = response.data.response.body.items.item.filter(spot => spot.firstimage);
      setLocations(filteredLocations);
    } catch (error) {
      console.error('주변 관광지 조회 실패:', error);
    } finally {
      setLoading(false);
    }
      
  };
  if (loading) {
    return <p>Loading nearby tourist attractions...</p>;
  }


  return (
    <div>
      <h3>Nearby Tourist Attractions (내 위치 주변 관광지)</h3>
      <ul>
        {locations.map((spot, index) => (
          <li key={index}>
            <button onClick={() => navigate(`/detail/${spot.contentid}`)}>
              {spot.title}
              
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbySearch;
