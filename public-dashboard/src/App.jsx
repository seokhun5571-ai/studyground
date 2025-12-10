import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeatLayout from './components/SeatLayout';
import RealTimeStatus from './components/RealTimeStatus';

function App() {
  const [seats, setSeats] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [weeklyTop, setWeeklyTop] = useState([]);
  const [stats, setStats] = useState({
    currentStudents: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5초마다 업데이트
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [seatsRes, dashboardRes] = await Promise.all([
        axios.get('/api/public/seats'),
        axios.get('/api/public/dashboard'),
      ]);

      setSeats(seatsRes.data.seats || []);
      setTopStudents(dashboardRes.data.topStudents || []);
      setWeeklyTop(dashboardRes.data.weeklyTop || []);
      setStats(dashboardRes.data.stats || {});
      setLoading(false);
    } catch (error) {
      console.error('데이터 조회 오류:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-4xl font-bold text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-6 h-[calc(100vh-3rem)]">
        {/* 왼쪽 영역 (60%) - 좌석 배치도 */}
        <div className="flex-1" style={{ flex: '0 0 60%' }}>
          <SeatLayout seats={seats} />
        </div>

        {/* 오른쪽 영역 (40%) - 실시간 현황 */}
        <div className="flex-1" style={{ flex: '0 0 40%' }}>
          <RealTimeStatus
            stats={stats}
            topStudents={topStudents}
            weeklyTop={weeklyTop}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
