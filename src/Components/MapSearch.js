// MapSearch.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const MapSearch = ({ addToCourse }) => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return;
    }

    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map-search');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 임시 중심 좌표 (서울)
        level: 5,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      const bounds = new window.kakao.maps.LatLngBounds();

      // 사용자의 현재 위치 가져오기
      navigator.geolocation.getCurrentPosition((position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        const userPosition = new window.kakao.maps.LatLng(userLatitude, userLongitude);

        // 사용자 위치에 마커 추가
        const userMarker = new window.kakao.maps.Marker({
          position: userPosition,
          map: map,
        });

        const userInfowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px; font-weight:bold; color:red;">현위치</div>`,
        });
        userInfowindow.open(map, userMarker);
        bounds.extend(userPosition);

        // Tour API로 주변 관광지 가져오기
        fetchNearbyPlaces(userLatitude, userLongitude);
      });

      // Tour API로 주변 관광지 데이터 가져오기
      const fetchNearbyPlaces = async (latitude, longitude) => {
        const API_KEY = process.env.REACT_APP_TOUR_API_KEY; // 환경 변수에 저장된 API 키 사용
        try {
          const response = await axios.get(`http://apis.data.go.kr/B551011/EngService1/locationBasedList1?ServiceKey=${API_KEY}&numOfRows=200&pageNo=1&MobileOS=ETC&MobileApp=AppTest&listYN=Y&arrange=A&mapX=${longitude}&mapY=${latitude}&radius=5000&_type=json`, {
            params: {
              ServiceKey: API_KEY,
              mapX: longitude,
              mapY: latitude,
              radius: 5000,
              contentTypeId: 76,
              MobileOS: 'ETC',
              MobileApp: 'AppTest',
              _type: 'json',
            },
          });

          const items = response.data.response.body.items.item;
          setPlaces(items); // 관광지 목록 상태에 저장
          displayMarkers(items); // 마커 표시 함수 호출
        } catch (error) {
          console.error("주변 관광지 데이터를 가져오는 데 실패했습니다.", error);
        }
      };

      // 관광지 마커 표시
      const displayMarkers = (places) => {
        places.forEach((place) => {
          const markerPosition = new window.kakao.maps.LatLng(place.mapy, place.mapx);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });

          const thumbnailUrl = place.firstimage || ''; // 첫 번째 이미지가 있으면 썸네일로 사용
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding:10px; text-align:center;">
                <strong>${place.title}</strong><br>
                ${thumbnailUrl ? `<img src="${thumbnailUrl}" alt="${place.title}" style="width:100px; height:auto; margin-top:5px;" />` : ''}
              </div>
            `,
          });

          window.kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
          window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());
          
          // 마커 클릭 시 SightDetailPage로 이동
          window.kakao.maps.event.addListener(marker, 'click', () => {
            navigate(`/detail/${place.contentid}`);
          });

          bounds.extend(markerPosition);
        });

        // 모든 마커가 보이도록 지도 범위 설정
        map.setBounds(bounds);
      };
    });
  }, [addToCourse, navigate]);

  return (
    <>
      <h3>MapSearch (지도 검색)</h3>
      <div id="map-search" style={{ width: '100%', height: '500px' }} />
    </>
    
  );
};

export default MapSearch;
