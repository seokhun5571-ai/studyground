import React from 'react';

const SeatLayout = ({ seats }) => {
  const getSeatStatusColor = (seat) => {
    if (seat.status === 'occupied') return 'bg-blue-500';
    if (seat.status === 'out') return 'bg-yellow-400';
    if (seat.status === 'maintenance') return 'bg-red-500';
    if (seat.fixed_student_name && seat.status === 'available') return 'bg-gray-300';
    return 'bg-gray-200';
  };

  const getSeatStatusText = (seat) => {
    if (seat.status === 'occupied') return '입실 중';
    if (seat.status === 'out') return '외출 중';
    if (seat.status === 'maintenance') return '점검 중';
    if (seat.fixed_student_name && seat.status === 'available') return seat.fixed_student_name;
    return '비어있음';
  };

  // 좌석을 그리드로 배치 (실제 독서실 배치에 맞게 조정 가능)
  const totalSeats = 43;
  const seatMap = {};
  seats.forEach(seat => {
    seatMap[seat.seat_number] = seat;
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">좌석 배치도</h2>
      
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-4">
        {Array.from({ length: totalSeats }, (_, i) => {
          const seatNum = (i + 1).toString().padStart(2, '0');
          const seat = seatMap[seatNum] || {
            seat_number: seatNum,
            status: 'available',
            current_student_name: null,
            fixed_student_name: null,
          };

          return (
            <div
              key={seatNum}
              className={`${getSeatStatusColor(seat)} rounded-xl p-4 text-center shadow-md transition-all hover:scale-105`}
            >
              <div className="text-2xl font-bold text-white mb-2">
                {seatNum}
              </div>
              <div className="text-sm text-white font-semibold">
                {seat.current_student_name || getSeatStatusText(seat)}
              </div>
              {seat.status === 'out' && seat.out_time && (
                <div className="text-xs text-white mt-1">
                  {seat.out_time}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded"></div>
          <span>입실 중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
          <span>외출 중</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span>비어있음</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <span>고정석 (미사용)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded"></div>
          <span>점검 중</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
