import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [todayData, setTodayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/dashboard/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodayData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl">로딩 중...</div>
      </div>
    );
  }

  const seatUsageRate = todayData?.seats.total_seats > 0
    ? Math.round((todayData.seats.occupied_seats / todayData.seats.total_seats) * 100)
    : 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">관리자 대시보드</h1>
        <p className="text-gray-600 mt-2">{todayData?.date} 현황</p>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="오늘 총 출석"
          value={todayData?.attendance.total_attendance || 0}
          unit="명"
          color="blue"
          icon="👥"
        />
        <StatCard
          title="현재 학습 중"
          value={todayData?.attendance.currently_studying || 0}
          unit="명"
          color="green"
          icon="📚"
        />
        <StatCard
          title="학생별 평균 학습 시간"
          value={Math.floor((todayData?.attendance.avg_study_minutes || 0) / 60)}
          unit="시간"
          color="purple"
          icon="⏱️"
        />
        <StatCard
          title="좌석 이용률"
          value={seatUsageRate}
          unit="%"
          color="orange"
          icon="💺"
        />
      </div>

      {/* 현재 학습 중인 학생 목록 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">현재 학습 중인 학생</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">이름</th>
                <th className="px-4 py-3 text-left">학번</th>
                <th className="px-4 py-3 text-left">좌석</th>
                <th className="px-4 py-3 text-left">입실 시간</th>
                <th className="px-4 py-3 text-left">학습 시간</th>
              </tr>
            </thead>
            <tbody>
              {todayData?.currentStudents.map((student) => {
                const hours = Math.floor(student.study_minutes / 60);
                const minutes = Math.floor(student.study_minutes % 60);
                return (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{student.name}</td>
                    <td className="px-4 py-3">{student.student_number}</td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {student.assigned_seat}번
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(student.check_in_time).toLocaleTimeString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {hours}시간 {minutes}분
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {todayData?.currentStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              현재 학습 중인 학생이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 통계 카드 컴포넌트
const StatCard = ({ title, value, unit, color, icon }) => {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-semibold">{title}</h3>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-4xl font-bold ${colorClasses[color]}`}>
          {value}
        </span>
        <span className="text-xl text-gray-500 mb-1">{unit}</span>
      </div>
    </div>
  );
};

export default Dashboard;
