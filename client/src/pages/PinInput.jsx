import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PinInput = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data.announcements);
    } catch (error) {
      console.error('공지사항 조회 실패:', error);
    }
  };

  const handleNumberClick = (num) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setMessage('PIN은 최소 4자리여야 합니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/attendance/check', { pin });
      
      if (response.data.action === 'check_in') {
        navigate('/checkin-success', { state: response.data });
      } else if (response.data.action === 'check_out') {
        navigate('/checkout-confirmation', { state: response.data });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '오류가 발생했습니다.');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } finally {
      setLoading(false);
      setPin('');
    }
  };

  useEffect(() => {
    if (pin.length === 4 || pin.length === 6) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      {/* 상단 헤더 */}
      <div className="text-white text-center mb-12">
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

      {/* PIN 입력 영역 */}
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-center mb-8">PIN 번호를 입력하세요</h2>
        
        {/* PIN 디스플레이 */}
        <div className="flex justify-center gap-4 mb-8">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className="w-16 h-16 border-4 border-gray-300 rounded-lg flex items-center justify-center text-4xl font-bold"
            >
              {pin[index] ? '●' : ''}
            </div>
          ))}
        </div>

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-20 text-4xl font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-95"
              disabled={loading}
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-20 text-3xl font-bold bg-red-100 hover:bg-red-200 rounded-xl transition-colors active:scale-95"
            disabled={loading}
          >
            ⌫
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-20 text-4xl font-bold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors active:scale-95"
            disabled={loading}
          >
            0
          </button>
          <button
            onClick={handleSubmit}
            className="h-20 text-3xl font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors active:scale-95 disabled:bg-gray-400"
            disabled={loading || pin.length < 4}
          >
            확인
          </button>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div className="text-center text-red-500 text-xl font-semibold animate-pulse">
            {message}
          </div>
        )}

        {loading && (
          <div className="text-center text-gray-500 text-xl">
            처리 중...
          </div>
        )}
      </div>

      {/* 하단 공지사항 */}
      {announcements.length > 0 && (
        <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-2xl p-6 w-full max-w-2xl text-white">
          <h3 className="text-2xl font-bold mb-3">💡 오늘의 공지</h3>
          {announcements.map((announcement) => (
            <div key={announcement.id} className="mb-2">
              <p className="text-xl">
                {announcement.priority === 'high' && '🔴 '}
                {announcement.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PinInput;
