import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from './BackButton';
import HomeButton from './HomeButton';
import './App.css';


    
const SightDetailPage = ({ addToCourse }) => {
  const { contentId } = useParams();
  const [sight, setSight] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const goToMyCoursePage = () => {
    navigate('/mycourse');
  };

  useEffect(() => {
    const fetchDetail = async () => {
      const API_KEY = process.env.REACT_APP_TOUR_API_KEY;
      try {
        const response = await axios.get(`http://apis.data.go.kr/B551011/EngService1/detailCommon1?ServiceKey=${API_KEY}&MobileOS=ETC&MobileApp=TestApp&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&overviewYN=Y&mapinfoYN=Y&addrinfoYN=Y&transGuideYN=Y&_type=json`, {
          params: {
            ServiceKey: API_KEY,
            contentId: contentId,
            MobileOS: 'ETC',
            MobileApp: 'TestApp',
            _type: 'json',
          }
        });

        const item = response.data.response.body.items?.item; // 옵셔널 체이닝 사용
        if (item && item.length > 0) {
          setSight(item[0]); // 관광지 정보가 있을 때만 설정
        } else {
          setError("관광지 정보를 찾을 수 없습니다."); // 에러 상태 업데이트
        }
      } catch (error) {
        console.error('관광지 세부 정보 조회 실패:', error);
        setError("관광지 세부 정보를 불러오는 데 실패했습니다."); // 에러 상태 업데이트
      }
      
      
    };
    fetchDetail();
  }, [contentId]);

  const handleAddToCourse = () => {
    if (sight) {
      const placeData = {
        title: sight.title || '제목 없음',
        mapx: sight.mapx || null, // 좌표가 없을 때 대비
        mapy: sight.mapy || null,
        address: sight.addr1 || '주소 없음',
      };
      addToCourse(placeData); // 관광지를 코스에 추가하는 함수 호출
      navigate('/mycourse'); // 관광지 추가 후 MyCoursePage로 이동
    }
  };
  if (error) {
    return <p>{error}</p>; // 에러 메시지 표시
  }

  return (
    <>
      <div className="container">
        <BackButton />
        <HomeButton />
        <button onClick={goToMyCoursePage}>My Course로 가기</button>
        {sight && (
          <>
            <h1>{sight.title || '제목이 없습니다'}</h1> {/* 제목 표시 */}
        
            {sight.firstimage ? ( // 이미지가 있을 때만 표시
            <img src={sight.firstimage} alt={sight.title || '이미지 없음'} />) : (<p>이미지가 없습니다.</p>)}
           
            <p>{sight.overview || '세부 정보가 없습니다.'}</p> {/* 세부 정보 표시 */}
           
            <button onClick={handleAddToCourse}>My course에 추가</button>
            
          </>
        )}
    
      </div>
    </>
  );
};

export default SightDetailPage;
