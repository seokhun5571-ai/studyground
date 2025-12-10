import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReturnSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, outDuration } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const formatDuration = (minutes) => {
    if (!minutes) return '0분';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-5xl font-bold mb-8 text-gray-800">
          {student?.name || '학생'}님 복귀되었습니다
        </h2>
        {outDuration && (
          <p className="text-2xl text-gray-600 mb-8">
            외출 시간: {formatDuration(outDuration)}
          </p>
        )}
        <p className="text-3xl text-gray-700 mb-8">다시 열심히 공부하세요!</p>
        <p className="text-xl text-gray-500">3초 후 자동으로 메인 화면으로 돌아갑니다...</p>
      </div>
    </div>
  );
};

export default ReturnSuccess;
