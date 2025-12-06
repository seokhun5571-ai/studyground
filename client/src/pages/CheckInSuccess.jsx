import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckInSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if (!data) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, data]);

  if (!data) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        {/* 체크인 아이콘 */}
        <div className="mb-6">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-green-600 mb-8">체크인 완료!</h1>

        {/* 학생 정보 */}
        <div className="space-y-4 text-2xl">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">이름</span>
            <span className="font-bold">{data.student.name}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">좌석</span>
            <span className="font-bold text-blue-600 text-4xl">{data.seat}번</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">입실 시간</span>
            <span className="font-bold">{new Date(data.checkInTime).toLocaleTimeString('ko-KR')}</span>
          </div>
        </div>

        {/* 학습 목표 정보 */}
        {data.studyGoal && (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">오늘의 학습 목표</h3>
            <div className="text-xl">
              <p>목표 시간: <span className="font-bold text-blue-600">{Math.floor(data.studyGoal.daily_goal_hours / 60)}시간</span></p>
              <p className="mt-2">현재 학습 시간: <span className="font-bold">0시간 0분</span></p>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-8 text-xl text-gray-600">
          <p>좌석으로 이동하여 학습을 시작하세요 📚</p>
          <p className="mt-4 text-lg text-gray-500">(5초 후 자동으로 메인 화면으로 이동합니다)</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInSuccess;
