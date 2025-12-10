import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LeaveSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, outTime } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-5xl font-bold mb-8 text-gray-800">
          {student?.name || '학생'}님 외출 등록되었습니다
        </h2>
        {outTime && (
          <p className="text-2xl text-gray-600 mb-8">외출 시간: {outTime}</p>
        )}
        <p className="text-3xl text-gray-700 mb-8">안전하게 다녀오세요!</p>
        <p className="text-xl text-gray-500">3초 후 자동으로 메인 화면으로 돌아갑니다...</p>
      </div>
    </div>
  );
};

export default LeaveSuccess;
