import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CheckOutConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [selectedReason, setSelectedReason] = useState('');

  if (!data) {
    navigate('/');
    return null;
  }

  const checkoutReasons = [
    { value: '집에 가기', label: '집에 가기', icon: '🏠' },
    { value: '학원 가기', label: '학원 가기', icon: '🎓' },
    { value: '잠시 자리 비움', label: '잠시 자리 비움', icon: '⏰' }
  ];

  const handleCheckOut = async () => {
    if (!selectedReason) {
      alert('퇴실 사유를 선택해주세요.');
      return;
    }

    try {
      const response = await axios.post('/api/attendance/checkout', {
        attendanceId: data.attendanceId,
        checkoutReason: selectedReason
      });
      
      navigate('/checkout-success', { state: { ...data, ...response.data } });
    } catch (error) {
      alert('퇴실 처리 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const studyDuration = Math.floor((new Date() - new Date(data.checkInTime)) / 60000);
  const hours = Math.floor(studyDuration / 60);
  const minutes = studyDuration % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-8">{data.student.name}님, 퇴실하시겠습니까?</h1>

        {/* 시간 정보 */}
        <div className="space-y-4 text-2xl mb-8">
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">입실 시간</span>
            <span className="font-bold">{new Date(data.checkInTime).toLocaleTimeString('ko-KR')}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">현재 시간</span>
            <span className="font-bold">{new Date().toLocaleTimeString('ko-KR')}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3">
            <span className="text-gray-600">학습 시간</span>
            <span className="font-bold text-green-600 text-4xl">{hours}시간 {minutes}분</span>
          </div>
        </div>

        {/* 퇴실 사유 선택 */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-6 text-gray-700">퇴실 사유를 선택해주세요</h3>
          <div className="grid grid-cols-1 gap-4">
            {checkoutReasons.map((reason) => (
              <button
                key={reason.value}
                onClick={() => setSelectedReason(reason.value)}
                className={`p-6 text-2xl font-semibold rounded-2xl border-4 transition-all ${
                  selectedReason === reason.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-4xl mr-4">{reason.icon}</span>
                {reason.label}
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-6 text-3xl font-bold bg-gray-200 hover:bg-gray-300 rounded-2xl transition-colors active:scale-95"
          >
            취소
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!selectedReason}
            className={`flex-1 py-6 text-3xl font-bold rounded-2xl transition-colors active:scale-95 ${
              selectedReason
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            퇴실하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutConfirmation;
