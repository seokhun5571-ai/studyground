import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckOutSuccess = () => {
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

  const hours = Math.floor(data.studyDuration / 60);
  const minutes = data.studyDuration % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        {/* 체크아웃 아이콘 */}
        <div className="mb-6">
          <div className="w-32 h-32 bg-purple-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-purple-600 mb-8">
          {data.student?.name || '학생'}님 퇴실되었습니다
        </h1>

        {/* 학생 정보 */}
        <div className="space-y-4 text-2xl mb-8">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">오늘 학습 시간</span>
            <span className="font-bold text-green-600 text-4xl">
              {hours}시간 {minutes}분
            </span>
          </div>
          {data.checkoutReason && (
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-gray-600">퇴실 사유</span>
              <span className="font-bold text-blue-600">{data.checkoutReason}</span>
            </div>
          )}
        </div>

        {/* 격려 메시지 */}
        <div className="mt-8 text-3xl text-gray-700 font-bold">
          <p>수고하셨습니다! 🎉</p>
          <p className="mt-4 text-xl text-gray-500">3초 후 자동으로 메인 화면으로 돌아갑니다...</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOutSuccess;
