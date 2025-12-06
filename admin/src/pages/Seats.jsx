import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Seats = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInitModal, setShowInitModal] = useState(false);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 10000); // 10초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const fetchSeats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/seats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSeats(response.data.seats);
      setLoading(false);
    } catch (error) {
      console.error('좌석 목록 조회 실패:', error);
      setLoading(false);
    }
  };

  const handleInitSeats = async (totalSeats) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('/api/seats/initialize', 
        { totalSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${totalSeats}개의 좌석이 생성되었습니다.`);
      fetchSeats();
      setShowInitModal(false);
    } catch (error) {
      console.error('좌석 초기화 실패:', error);
      alert('좌석 초기화 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  const availableSeats = seats.filter(s => s.status === 'available').length;
  const occupiedSeats = seats.filter(s => s.status === 'occupied').length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">좌석 관리</h1>
          <p className="text-gray-600 mt-2">
            전체 {seats.length}석 | 사용 중 {occupiedSeats}석 | 이용 가능 {availableSeats}석
          </p>
        </div>
        <button
          onClick={() => setShowInitModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          좌석 초기화
        </button>
      </div>

      {/* 좌석 현황 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all ${
                seat.status === 'available' 
                  ? 'bg-green-100 border-2 border-green-500' 
                  : seat.status === 'occupied'
                  ? 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-100 border-2 border-gray-500'
              }`}
              title={`좌석 ${seat.seat_number}번 | PIN: ${seat.pin} | ${seat.fixed_student_name || '고정 학생 없음'}`}
            >
              <div className="text-2xl font-bold">
                {seat.seat_number}
              </div>
              <div className="text-xs font-mono text-gray-600">
                {seat.pin}
              </div>
              {seat.current_student_name && (
                <div className="text-xs mt-1 text-center truncate w-full font-semibold">
                  {seat.current_student_name}
                </div>
              )}
              {seat.fixed_student_name && !seat.current_student_name && (
                <div className="text-xs mt-1 text-center truncate w-full text-blue-600">
                  {seat.fixed_student_name}
                </div>
              )}
            </div>
          ))}
        </div>

        {seats.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            좌석이 설정되지 않았습니다. 좌석 초기화 버튼을 눌러 좌석을 생성하세요.
          </div>
        )}
      </div>

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
          <span>이용 가능</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-100 border-2 border-red-500 rounded"></div>
          <span>사용 중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 border-2 border-gray-500 rounded"></div>
          <span>점검 중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-100 border-2 border-blue-500 rounded"></div>
          <span>고정 학생 (미사용)</span>
        </div>
      </div>

      {/* 좌석 정보 테이블 */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">좌석 상세 정보</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">좌석 번호</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">PIN</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">고정 학생</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">현재 사용자</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((seat) => (
                <tr key={seat.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{seat.seat_number}번</td>
                  <td className="px-6 py-4 font-mono">{seat.pin}</td>
                  <td className="px-6 py-4">
                    {seat.fixed_student_name ? (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {seat.fixed_student_name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {seat.current_student_name ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {seat.current_student_name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      seat.status === 'available' ? 'bg-green-100 text-green-800' :
                      seat.status === 'occupied' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {seat.status === 'available' ? '이용 가능' :
                       seat.status === 'occupied' ? '사용 중' : '점검 중'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInitModal && (
        <InitSeatsModal
          onConfirm={handleInitSeats}
          onClose={() => setShowInitModal(false)}
        />
      )}
    </div>
  );
};

// 좌석 초기화 모달
const InitSeatsModal = ({ onConfirm, onClose }) => {
  const [totalSeats, setTotalSeats] = useState(30);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-blue-500 text-white px-8 py-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold">좌석 초기화</h2>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              기존 좌석 데이터가 모두 삭제되고 새로운 좌석이 생성됩니다.
            </p>
            <label className="block text-gray-700 font-semibold mb-2">
              총 좌석 수
            </label>
            <input
              type="number"
              value={totalSeats}
              onChange={(e) => setTotalSeats(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => onConfirm(totalSeats)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              생성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seats;
