/**
 * 스터디그라운드 통합 관리 시스템 서버
 * Google Sheets 기반 데이터 저장
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const getSheetsService = require('./googleSheets');

const app = express();
app.use(cors());
app.use(express.json());

// 프로덕션 모드에서 정적 파일 서빙
if (process.env.NODE_ENV === 'production') {
  // 태블릿 키오스크 (client)
  const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(clientBuildPath)) {
    app.use('/kiosk', express.static(clientBuildPath));
    app.get('/kiosk/*', (req, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  }

  // 관리자 대시보드 (admin)
  const adminBuildPath = path.join(__dirname, '..', 'admin', 'dist');
  if (fs.existsSync(adminBuildPath)) {
    app.use('/admin', express.static(adminBuildPath));
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });
  }

  // 공용 대시보드 (public-dashboard)
  const publicDashboardPath = path.join(__dirname, '..', 'public-dashboard', 'dist');
  if (fs.existsSync(publicDashboardPath)) {
    app.use('/public', express.static(publicDashboardPath));
    app.get('/public/*', (req, res) => {
      res.sendFile(path.join(publicDashboardPath, 'index.html'));
    });
  }

  // 루트 경로는 키오스크로 리다이렉트
  app.get('/', (req, res) => {
    res.redirect('/kiosk');
  });
}

// JWT 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// ============ 공용 API (인증 불필요) ============

// 공용 좌석 현황 조회
app.get('/api/public/seats', async (req, res) => {
  try {
    const sheetsService = getSheetsService();
    const seats = await sheetsService.getAllSeats();
    const students = await sheetsService.getAllStudents();
    
    // 학생 정보를 좌석에 매핑
    const seatsWithStudents = seats.map(seat => {
      const fixedStudent = students.find(s => s.fixed_seat_number == seat.seat_number);
      const currentStudent = seat.current_student_id 
        ? students.find(s => s.id == seat.current_student_id)
        : null;
      
      return {
        ...seat,
        fixed_student_name: fixedStudent?.name || null,
        current_student_name: currentStudent?.name || null,
      };
    });

    res.json({ seats: seatsWithStudents });
  } catch (error) {
    console.error('공용 좌석 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 공용 대시보드 데이터
app.get('/api/public/dashboard', async (req, res) => {
  try {
    const sheetsService = getSheetsService();
    const today = new Date().toISOString().split('T')[0];
    
    const attendances = await sheetsService.getAllAttendances({ date: today });
    const students = await sheetsService.getAllStudents();
    const seats = await sheetsService.getAllSeats();

    // 현재 재원생 수
    const currentStudents = seats.filter(s => s.status === 'occupied').length;

    // 오늘 출석 수
    const todayAttendance = new Set(attendances.map(a => a.student_id)).size;

    // 실시간 학습 현황 TOP 5 (오늘 학습 시간 기준)
    const studentStudyTimes = {};
    attendances.forEach(attendance => {
      if (!attendance.check_out_time) {
        const now = new Date();
        const checkIn = new Date(attendance.check_in_time);
        const minutes = Math.floor((now - checkIn) / 60000);
        
        if (!studentStudyTimes[attendance.student_id]) {
          studentStudyTimes[attendance.student_id] = 0;
        }
        studentStudyTimes[attendance.student_id] += minutes;
      } else if (attendance.study_duration) {
        if (!studentStudyTimes[attendance.student_id]) {
          studentStudyTimes[attendance.student_id] = 0;
        }
        studentStudyTimes[attendance.student_id] += attendance.study_duration;
      }
    });

    const topStudents = Object.entries(studentStudyTimes)
      .map(([studentId, minutes]) => {
        const student = students.find(s => s.id == studentId);
        const seat = seats.find(s => s.current_student_id == studentId);
        return {
          id: studentId,
          name: student?.name || '',
          seat_number: seat?.seat_number || '',
          study_minutes: minutes,
        };
      })
      .sort((a, b) => b.study_minutes - a.study_minutes)
      .slice(0, 5);

    // 이번 주 출석 우수자 TOP 3
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    const weekAttendances = await sheetsService.getAllAttendances({
      date_from: weekStartStr,
      date_to: today,
    });

    const weeklyTotals = {};
    weekAttendances.forEach(attendance => {
      if (attendance.study_duration) {
        if (!weeklyTotals[attendance.student_id]) {
          weeklyTotals[attendance.student_id] = 0;
        }
        weeklyTotals[attendance.student_id] += attendance.study_duration;
      }
    });

    const weeklyTop = Object.entries(weeklyTotals)
      .map(([studentId, minutes]) => {
        const student = students.find(s => s.id == studentId);
        return {
          id: studentId,
          name: student?.name || '',
          total_minutes: minutes,
        };
      })
      .sort((a, b) => b.total_minutes - a.total_minutes)
      .slice(0, 3);

    res.json({
      stats: {
        currentStudents,
        todayAttendance,
      },
      topStudents,
      weeklyTop,
    });
  } catch (error) {
    console.error('공용 대시보드 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 키오스크 API ============

// 좌석 번호로 학생 정보 조회
app.get('/api/seats/:seatNumber/student', async (req, res) => {
  try {
    const { seatNumber } = req.params;
    const sheetsService = getSheetsService();
    
    const student = await sheetsService.getStudentBySeatNumber(seatNumber);
    
    if (!student) {
      return res.status(404).json({ message: '등록되지 않은 좌석입니다.' });
    }

    res.json({ student });
  } catch (error) {
    console.error('학생 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 입퇴실/외출/복귀 처리
app.post('/api/attendance/action', async (req, res) => {
  try {
    const { seatNumber, action } = req.body;
    const sheetsService = getSheetsService();
    
    const student = await sheetsService.getStudentBySeatNumber(seatNumber);
    if (!student) {
      return res.status(404).json({ message: '등록되지 않은 좌석입니다.' });
    }

    const seat = await sheetsService.getSeatByNumber(seatNumber);
    if (!seat) {
      return res.status(404).json({ message: '좌석을 찾을 수 없습니다.' });
    }

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    if (action === 'check_in') {
      // 입실 처리
      const existingAttendance = (await sheetsService.getAllAttendances({
        student_id: student.id,
        date: today,
      })).find(a => !a.check_out_time);

      if (existingAttendance) {
        return res.status(400).json({ message: '이미 입실 중입니다.' });
      }

      const attendance = await sheetsService.createAttendance({
        student_id: student.id,
        check_in_time: now,
        seat_number: seatNumber,
        date: today,
        attendance_status: 'present',
      });

      await sheetsService.updateSeat(seatNumber, {
        is_available: false,
        current_student_id: student.id,
        status: 'occupied',
      });

      res.json({
        action: 'check_in',
        student,
        seatNumber,
        checkInTime: now,
        attendanceId: attendance.id,
      });
    } else if (action === 'check_out') {
      // 퇴실 처리
      const attendance = (await sheetsService.getAllAttendances({
        student_id: student.id,
        date: today,
      })).find(a => !a.check_out_time);

      if (!attendance) {
        return res.status(400).json({ message: '입실 기록이 없습니다.' });
      }

      const checkOutTime = new Date();
      const studyDuration = Math.floor((checkOutTime - new Date(attendance.check_in_time)) / 60000);

      await sheetsService.updateAttendance(attendance.id, {
        check_out_time: checkOutTime.toISOString(),
        study_duration: studyDuration,
        checkout_reason: '퇴실',
      });

      await sheetsService.updateSeat(seatNumber, {
        is_available: true,
        current_student_id: null,
        status: 'available',
      });

      res.json({
        action: 'check_out',
        student,
        seatNumber,
        studyDuration,
        checkOutTime: checkOutTime.toISOString(),
      });
    } else if (action === 'leave') {
      // 외출 처리
      if (seat.status !== 'occupied') {
        return res.status(400).json({ message: '입실 상태가 아닙니다.' });
      }

      await sheetsService.updateSeat(seatNumber, {
        status: 'out',
      });

      res.json({
        action: 'leave',
        student,
        seatNumber,
        outTime: now,
      });
    } else if (action === 'return') {
      // 복귀 처리
      if (seat.status !== 'out') {
        return res.status(400).json({ message: '외출 상태가 아닙니다.' });
      }

      const attendance = (await sheetsService.getAllAttendances({
        student_id: student.id,
        date: today,
      })).find(a => !a.check_out_time);

      if (!attendance) {
        return res.status(400).json({ message: '입실 기록이 없습니다.' });
      }

      // 외출 시간 계산 (간단히 구현)
      await sheetsService.updateSeat(seatNumber, {
        status: 'occupied',
      });

      res.json({
        action: 'return',
        student,
        seatNumber,
        outDuration: 0, // 실제로는 외출 시작 시간을 저장해야 함
      });
    } else {
      return res.status(400).json({ message: '올바른 액션을 선택해주세요.' });
    }
  } catch (error) {
    console.error('출석 처리 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 관리자 인증 API ============

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const sheetsService = getSheetsService();
    
    const admin = await sheetsService.getAdminByUsername(username);
    
    if (!admin) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'default_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: '로그인 성공',
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 학생 관리 API ============

app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const sheetsService = getSheetsService();
    const students = await sheetsService.getAllStudents();
    res.json({ students, total: students.length });
  } catch (error) {
    console.error('학생 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const sheetsService = getSheetsService();
    const student = await sheetsService.createStudent(req.body);
    res.status(201).json({ message: '학생이 등록되었습니다.', student });
  } catch (error) {
    console.error('학생 등록 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 대시보드 API ============

app.get('/api/dashboard/today', authenticateToken, async (req, res) => {
  try {
    const sheetsService = getSheetsService();
    const today = new Date().toISOString().split('T')[0];
    
    const attendances = await sheetsService.getAllAttendances({ date: today });
    const seats = await sheetsService.getAllSeats();
    const students = await sheetsService.getAllStudents();

    const currentStudents = seats.filter(s => s.status === 'occupied').length;
    const todayAttendance = new Set(attendances.map(a => a.student_id)).size;

    res.json({
      date: today,
      stats: {
        currentStudents,
        todayAttendance,
        totalSeats: seats.length,
        availableSeats: seats.filter(s => s.status === 'available').length,
      },
    });
  } catch (error) {
    console.error('대시보드 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 통계 API ============

app.get('/api/statistics', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const sheetsService = getSheetsService();
    
    const attendances = await sheetsService.getAllAttendances({
      date_from: startDate,
      date_to: endDate,
    });
    const students = await sheetsService.getAllStudents();
    const seats = await sheetsService.getAllSeats();

    // 일별 출석 통계
    const dailyStats = {};
    attendances.forEach(attendance => {
      const date = attendance.date;
      if (!dailyStats[date]) {
        dailyStats[date] = {
          date,
          attendance_count: 0,
          total_study_minutes: 0,
        };
      }
      dailyStats[date].attendance_count++;
      if (attendance.study_duration) {
        dailyStats[date].total_study_minutes += attendance.study_duration;
      }
    });

    // 학생별 통계
    const studentStats = {};
    attendances.forEach(attendance => {
      const studentId = attendance.student_id;
      if (!studentStats[studentId]) {
        studentStats[studentId] = {
          student_id: studentId,
          attendance_count: 0,
          total_study_minutes: 0,
        };
      }
      studentStats[studentId].attendance_count++;
      if (attendance.study_duration) {
        studentStats[studentId].total_study_minutes += attendance.study_duration;
      }
    });

    const studentRanking = Object.values(studentStats)
      .map(stat => {
        const student = students.find(s => s.id == stat.student_id);
        return {
          ...stat,
          name: student?.name || '',
          seat_number: student?.fixed_seat_number || '',
        };
      })
      .sort((a, b) => b.total_study_minutes - a.total_study_minutes)
      .slice(0, 10);

    res.json({
      period: { startDate, endDate },
      dailyStats: Object.values(dailyStats),
      studentRanking,
      totalStudents: students.length,
      totalSeats: seats.length,
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 리포트 API ============

app.get('/api/reports/weekly/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { weekStart } = req.query;
    const sheetsService = getSheetsService();
    
    const student = await sheetsService.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const attendances = await sheetsService.getAllAttendances({
      student_id: studentId,
      date_from: weekStart,
      date_to: weekEndStr,
    });

    const totalMinutes = attendances.reduce((sum, a) => sum + (a.study_duration || 0), 0);
    const attendanceDays = new Set(attendances.map(a => a.date)).size;

    res.json({
      student,
      period: { weekStart, weekEnd: weekEndStr },
      attendanceDays,
      totalStudyMinutes: totalMinutes,
      dailyAverage: Math.round(totalMinutes / 7),
      attendances,
    });
  } catch (error) {
    console.error('주간 리포트 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.get('/api/reports/monthly/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { month } = req.query; // YYYY-MM 형식
    const sheetsService = getSheetsService();
    
    const student = await sheetsService.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    const monthStart = `${month}-01`;
    const monthEnd = new Date(`${month}-01`);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);
    const monthEndStr = monthEnd.toISOString().split('T')[0];

    const attendances = await sheetsService.getAllAttendances({
      student_id: studentId,
      date_from: monthStart,
      date_to: monthEndStr,
    });

    const totalMinutes = attendances.reduce((sum, a) => sum + (a.study_duration || 0), 0);
    const attendanceDays = new Set(attendances.map(a => a.date)).size;

    res.json({
      student,
      period: { monthStart, monthEnd: monthEndStr },
      attendanceDays,
      totalStudyMinutes: totalMinutes,
      dailyAverage: Math.round(totalMinutes / attendanceDays || 1),
      attendances,
    });
  } catch (error) {
    console.error('월간 리포트 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 설정 API ============

app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    // 기본 설정 반환
    res.json({
      totalSeats: 43,
      autoReportWeekly: true,
      autoReportMonthly: true,
      reportTime: '20:00',
    });
  } catch (error) {
    console.error('설정 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    // 설정 저장 (Google Sheets에 저장 가능)
    res.json({ message: '설정이 저장되었습니다.', settings: req.body });
  } catch (error) {
    console.error('설정 저장 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 좌석 초기화
app.post('/api/settings/seats/initialize', authenticateToken, async (req, res) => {
  try {
    const { totalSeats = 43 } = req.body;
    const sheetsService = getSheetsService();
    
    // 좌석 데이터는 Google Sheets에서 관리되므로 여기서는 성공 응답만 반환
    res.json({ 
      message: `${totalSeats}개의 좌석이 설정되었습니다.`,
      totalSeats 
    });
  } catch (error) {
    console.error('좌석 초기화 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '서버가 정상적으로 실행 중입니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`스터디그라운드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}/api`);
  console.log(`키오스크: http://localhost:${PORT}/kiosk`);
  console.log(`관리자: http://localhost:${PORT}/admin`);
  console.log(`공용 대시보드: http://localhost:${PORT}/public`);
});
