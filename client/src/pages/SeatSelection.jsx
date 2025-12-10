import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeatSelection = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSeatClick = async (seatNumber) => {
    setSelectedSeat(seatNumber);
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.get(`/api/seats/${seatNumber}/student`);
      if (response.data.student) {
        setStudent(response.data.student);
      } else {
        setMessage('등록되지 않은 좌석입니다.');
        setTimeout(() => {
          setSelectedSeat(null);
          setMessage('');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '오류가 발생했습니다.');
      setTimeout(() => {
        setSelectedSeat(null);
        setMessage('');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    if (!selectedSeat || !student) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/attendance/action', {
        seatNumber: selectedSeat,
        action: action,
      });

      if (action === 'check_in') {
        navigate('/checkin-success', { state: { ...response.data, student } });
      } else if (action === 'check_out') {
        navigate('/checkout-success', { state: { ...response.data, student } });
      } else if (action === 'leave') {
        navigate('/leave-success', { state: { ...response.data, student } });
      } else if (action === 'return') {
        navigate('/return-success', { state: { ...response.data, student } });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '오류가 발생했습니다.');
      setTimeout(() => {
        setMessage('');
        setSelectedSeat(null);
        setStudent(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedSeat(null);
    setStudent(null);
    setMessage('');
  };

  // 좌석 그리드 생성 (43개 좌석)
  const totalSeats = 43;
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  if (selectedSeat && student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl">
          <h2 className="text-5xl font-bold text-center mb-8">
            {student.name}님 맞으시나요?
          </h2>
          
          <div className="text-center mb-8">
            <p className="text-3xl text-gray-600 mb-4">좌석: {selectedSeat}번</p>
            <p className="text-2xl text-gray-500">{student.grade || ''}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleAction('check_in')}
              className="h-24 text-3xl font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors active:scale-95 disabled:bg-gray-400"
              disabled={loading}
            >
              입실
            </button>
            <button
              onClick={() => handleAction('check_out')}
              className="h-24 text-3xl font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors active:scale-95 disabled:bg-gray-400"
              disabled={loading}
            >
              퇴실
            </button>
            <button
              onClick={() => handleAction('leave')}
              className="h-24 text-3xl font-bold bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors active:scale-95 disabled:bg-gray-400"
              disabled={loading}
            >
              외출
            </button>
            <button
              onClick={() => handleAction('return')}
              className="h-24 text-3xl font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors active:scale-95 disabled:bg-gray-400"
              disabled={loading}
            >
              복귀
            </button>
          </div>

          <button
            onClick={handleCancel}
            className="w-full h-16 text-2xl font-bold bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl transition-colors"
            disabled={loading}
          >
            취소
          </button>

          {message && (
            <div className="mt-6 text-center text-red-500 text-xl font-semibold">
              {message}
            </div>
          )}

          {loading && (
            <div className="mt-6 text-center text-gray-500 text-xl">
              처리 중...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      {/* 상단 헤더 */}
      <div className="text-white text-center mb-8">
        <h1 className="text-6xl font-bold mb-4">스터디그라운드</h1>
        <p className="text-3xl">
          {currentTime.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
        <p className="text-2xl mt-2">
          {currentTime.toLocaleTimeString('ko-KR')}
        </p>
      </div>

      {/* 좌석 선택 안내 */}
      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">좌석 번호를 눌러주세요</h2>
      </div>

      {/* 좌석 그리드 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-4 max-w-6xl mx-auto">
          {seats.map((seatNum) => (
            <button
              key={seatNum}
              onClick={() => handleSeatClick(seatNum.toString().padStart(2, '0'))}
              className="h-20 text-3xl font-bold bg-white hover:bg-blue-100 rounded-xl transition-all active:scale-95 shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {seatNum.toString().padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className="mt-6 text-center text-white text-2xl font-semibold bg-red-500/80 rounded-xl p-4">
          {message}
        </div>
      )}

      {loading && (
        <div className="mt-6 text-center text-white text-2xl">
          처리 중...
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
