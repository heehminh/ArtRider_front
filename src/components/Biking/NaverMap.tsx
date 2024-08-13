import { useRef, useEffect, useState } from "react";
import { spotProps } from "../../types/bikingTypes";

type NaverMapProps = {
  location: { lat: number; lng: number };
  coords: spotProps[] | null;
  historyCoords: spotProps[] | null;
};

const NaverMap = ({ location, coords, historyCoords }: NaverMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);
  const [tracking, setTracking] = useState<boolean>(false);

  useEffect(() => {
    const { naver } = window;
    if (mapRef.current && naver) {
      const initialLocation = location || { lat: 37.36681775, lng: 127.10809985 };
      const centerLocation = new naver.maps.LatLng(initialLocation.lat, initialLocation.lng);

      const mapInstance = new naver.maps.Map(mapRef.current, {
        center: centerLocation,
        zoom: 18,
      });

      setMap(mapInstance);
    }
  }, []);

  useEffect(() => {
    const { naver } = window;
    if (map) {
      if (coords) {
        const pathArray = coords.map((coord) => new naver.maps.LatLng(coord.y, coord.x));

        // Polyline을 생성하여 지도에 표시
        // 목표
        if (map && naver) {
          new naver.maps.Polyline({
            map, // 사용할 지도 객체
            path: pathArray, // LatLng 객체 배열
            strokeColor: "#16be5c", //'#16be5c', // 선 색상
            strokeWeight: 5, // 선 두께
            strokeOpacity: 0.2,
            strokeStyle: "dash",
            startIcon: 2,
            startIconSize: 20,
          });
        }
      }

      if (historyCoords) {
        const historyArray = historyCoords.map((coord) => new naver.maps.LatLng(coord.y, coord.x));

        // Polyline을 생성하여 지도에 표시
        // 걸어온
        if (map && naver) {
          new naver.maps.Polyline({
            map, // 사용할 지도 객체
            path: historyArray, // LatLng 객체 배열
            strokeColor: "#16be5c", // 선 색상
            strokeWeight: 5, // 선 두께
          });
        }
      }
    }
  }, [map, historyCoords]);

  // 내 위치에 마커 찍기
  useEffect(() => {
    const { naver } = window;
    if (map && location) {
      const { lat, lng } = location;
      const newLocation = new naver.maps.LatLng(lat, lng);

      // 기존 마커 삭제
      if (marker) {
        marker.setMap(null);
      }

      const markerContent = `
                <div style="back: 2px solid white">
                    <div style="border: 6.5px solid rgb(228, 111, 90); background-color: white;  border-radius: 50%; width: 20px; height: 20px">
                    </div>
                </div>
            `;

      // 새로운 마커 생성
      const newMarker = new naver.maps.Marker({
        position: newLocation,
        map,
        icon: {
          content: markerContent,
          anchor: new naver.maps.Point(10, 10), // 마커의 위치 설정
        },
      });

      // 마커 상태 업데이트
      setMarker(newMarker);
    }
  }, [location, map]);

  return (
    <div>
      <div ref={mapRef} style={{ width: "500px", height: "500px" }} />
      <button className="w-100 h-100">내위치</button>
    </div>
  );
};

export default NaverMap;
