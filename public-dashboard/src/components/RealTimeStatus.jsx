import React from 'react';

const RealTimeStatus = ({ stats, topStudents, weeklyTop }) => {
  const formatTime = (minutes) => {
    if (!minutes) return '0분';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="space-y-6 h-full overflow-auto">
      {/* 현재 현황 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">현재 현황</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-blue-600">{stats.currentStudents || 0}</div>
            <div className="text-sm text-gray-600 mt-1">현재 재원생</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-4xl font-bold text-green-600">{stats.todayAttendance || 0}</div>
            <div className="text-sm text-gray-600 mt-1">오늘 출석 수</div>
          </div>
        </div>
      </div>

      {/* 실시간 학습 현황 TOP 5 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">실시간 학습 현황 TOP 5</h3>
        <div className="space-y-3">
          {topStudents.length > 0 ? (
            topStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-gray-300' :
                    index === 2 ? 'bg-orange-400' :
                    'bg-blue-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-lg">
                      [{student.seat_number}번] {student.name}
                    </div>
                    {index === 0 && <span className="text-red-500">🔥</span>}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-700">
                  {formatTime(student.study_minutes)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">데이터가 없습니다</div>
          )}
        </div>
      </div>

      {/* 이번 주 출석 우수자 TOP 3 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">이번 주 출석 우수자 TOP 3</h3>
        <div className="space-y-3">
          {weeklyTop.length > 0 ? (
            weeklyTop.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-gray-300' :
                    'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="font-bold text-xl">{student.name}</div>
                </div>
                <div className="text-xl font-bold text-gray-700">
                  {formatTime(student.total_minutes)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">데이터가 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeStatus;
