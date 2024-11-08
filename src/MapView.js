// MapView.js
import React, { useEffect } from 'react';
import './App.css';

const MapView = ({ places }) => {
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return;
    }

    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 임시 초기 중심 좌표
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 모든 마커의 위치를 포함할 수 있도록 지도 범위 객체 생성
      const bounds = new window.kakao.maps.LatLngBounds();

      // 사용자 위치 마커에 사용할 빨간색 마커 이미지 설정
      const redMarkerImageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png"; // 빨간색 마커 이미지 URL
      const redMarkerImageSize = new window.kakao.maps.Size(40, 42); // 마커 이미지 크기
      const redMarkerImageOption = { offset: new window.kakao.maps.Point(20, 42) }; // 마커의 기준 좌표
      const redMarkerImage = new window.kakao.maps.MarkerImage(redMarkerImageSrc, redMarkerImageSize, redMarkerImageOption);

      // 사용자의 현재 위치에 빨간색 마커 추가
      navigator.geolocation.getCurrentPosition((position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;

        const userMarkerPosition = new window.kakao.maps.LatLng(userLatitude, userLongitude);
        const userMarker = new window.kakao.maps.Marker({
          position: userMarkerPosition,
          map: map,
          image: redMarkerImage,
          title: "내 위치",
        });

        // "현위치" 정보창 항상 표시
        const userInfowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px; font-weight:bold; color:red;">현위치</div>`,
          position: userMarkerPosition,
        });
        userInfowindow.open(map, userMarker);

        // 현재 위치를 지도 범위에 추가
        bounds.extend(userMarkerPosition);

        // 모든 관광지 마커 추가
        places.forEach((place) => {
          if (place.mapy && place.mapx) {
            const latitude = parseFloat(place.mapy);
            const longitude = parseFloat(place.mapx);
            const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              map: map,
            });

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="padding:5px;">${place.title || '이름 없음'}<br>${place.address || '주소 없음'}</div>`,
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindow.open(map, marker);
            });

            // 각 관광지 위치를 지도 범위에 추가
            bounds.extend(markerPosition);
          } else {
            console.warn('경도 또는 위도가 없는 항목:', place);
          }
        });

        // 모든 마커가 한눈에 보이도록 지도 범위 설정
        map.setBounds(bounds);
      });
    });
  }, [places]);

  return <div id="map" style={{ width: '100%', height: '500px' }} />;
};

export default MapView;
