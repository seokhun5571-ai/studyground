import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [includeArchived]);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, statusFilter]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (includeArchived) {
        params.append('includeArchived', 'true');
      }
      
      const response = await axios.get(`/api/students?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students);
      setLoading(false);
    } catch (error) {
      console.error('학생 목록 조회 실패:', error);
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.student_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('정말 탈퇴 처리하시겠습니까? (아카이빙됩니다)')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('학생이 탈퇴 처리되었습니다. (아카이빙됨)');
      fetchStudents();
    } catch (error) {
      console.error('학생 탈퇴 처리 실패:', error);
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">학생 관리</h1>
          <p className="text-gray-600 mt-2">전체 {students.length}명</p>
        </div>
        <button
          onClick={handleAddStudent}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          학생 등록
        </button>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="이름 또는 학번으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
            <option value="suspended">정지</option>
            <option value="archived">아카이빙됨</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeArchived}
              onChange={(e) => setIncludeArchived(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">아카이빙된 학생 포함</span>
          </label>
        </div>
      </div>

      {/* 학생 목록 테이블 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">이름</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">학번</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">학년</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">학교</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">연락처</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">상태</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">고정 좌석</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">좌석 PIN</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{student.name}</td>
                  <td className="px-6 py-4">{student.student_number}</td>
                  <td className="px-6 py-4">{student.grade || '-'}</td>
                  <td className="px-6 py-4">{student.school || '-'}</td>
                  <td className="px-6 py-4">{student.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      student.status === 'archived' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status === 'active' ? '활성' :
                       student.status === 'inactive' ? '비활성' :
                       student.status === 'archived' ? '아카이빙됨' : '정지'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.fixed_seat_number ? (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                        {student.fixed_seat_number.toString().padStart(2, '0')}번
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {student.fixed_seat_number ? (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-mono font-semibold">
                        {1000 + student.fixed_seat_number}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {student.status !== 'archived' && (
                        <>
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            탈퇴
                          </button>
                        </>
                      )}
                      {student.status === 'archived' && (
                        <span className="text-gray-400 text-sm">아카이빙됨</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? '검색 결과가 없습니다.' 
              : '등록된 학생이 없습니다.'}
          </div>
        )}
      </div>

      {showModal && (
        <StudentModal
          student={selectedStudent}
          onClose={() => {
            setShowModal(false);
            fetchStudents();
          }}
        />
      )}
    </div>
  );
};

// 간단한 학생 등록/수정 모달
const StudentModal = ({ student, onClose }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    studentNumber: student?.student_number || '',
    phone: student?.phone || '',
    grade: student?.grade || '',
    school: student?.school || '',
    status: student?.status || 'active',
    fixedSeatNumber: student?.fixed_seat_number || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);

  useEffect(() => {
    fetchAvailableSeats();
  }, []);

  const fetchAvailableSeats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/seats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // 사용 가능한 좌석만 필터링
      const available = response.data.seats
        .filter(seat => !seat.fixed_student_name || seat.fixed_student_id === student?.id)
        .map(seat => ({
          number: parseInt(seat.seat_number),
          pin: seat.pin,
          currentStudent: seat.current_student_name
        }));
      
      setAvailableSeats(available);
    } catch (error) {
      console.error('좌석 목록 조회 실패:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.studentNumber) {
      setError('필수 항목을 모두 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      if (student) {
        await axios.put(`/api/students/${student.id}`, formData, { headers });
        alert('학생 정보가 수정되었습니다.');
      } else {
        await axios.post('/api/students', formData, { headers });
        alert('학생이 등록되었습니다.');
      }

      onClose();
    } catch (error) {
      setError(error.response?.data?.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 text-white px-8 py-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold">
            {student ? '학생 정보 수정' : '학생 등록'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="홍길동"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                학번 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.studentNumber}
                onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2024001"
                required
                disabled={!!student}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                고정 좌석
              </label>
              <select
                value={formData.fixedSeatNumber}
                onChange={(e) => setFormData({ ...formData, fixedSeatNumber: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">좌석 선택 안 함</option>
                {availableSeats.map((seat) => (
                  <option key={seat.number} value={seat.number}>
                    {seat.number.toString().padStart(2, '0')}번 (PIN: {seat.pin})
                    {seat.currentStudent && ` - 현재: ${seat.currentStudent}`}
                  </option>
                ))}
              </select>
              {formData.fixedSeatNumber && (
                <p className="mt-2 text-sm text-gray-600">
                  좌석 PIN: <span className="font-mono font-semibold">{1000 + formData.fixedSeatNumber}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">연락처</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">학년</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택 안 함</option>
                <option value="고1">고1</option>
                <option value="고2">고2</option>
                <option value="고3">고3</option>
                <option value="재수">재수</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">학교</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 서울고등학교"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="suspended">정지</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? '처리 중...' : student ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Students;
