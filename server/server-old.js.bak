const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

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
    console.log('✅ 태블릿 키오스크 빌드 파일 로드됨:', clientBuildPath);
  } else {
    console.warn('⚠️  태블릿 키오스크 빌드 파일 없음:', clientBuildPath);
  }

  // 관리자 대시보드 (admin)
  const adminBuildPath = path.join(__dirname, '..', 'admin', 'dist');
  if (fs.existsSync(adminBuildPath)) {
    app.use('/admin', express.static(adminBuildPath));
    app.get('/admin/*', (req, res) => {
      res.sendFile(path.join(adminBuildPath, 'index.html'));
    });
    console.log('✅ 관리자 대시보드 빌드 파일 로드됨:', adminBuildPath);
  } else {
    console.warn('⚠️  관리자 대시보드 빌드 파일 없음:', adminBuildPath);
  }

  // 루트 경로는 태블릿 키오스크로 리다이렉트
  app.get('/', (req, res) => {
    if (fs.existsSync(clientBuildPath)) {
      res.redirect('/kiosk');
    } else {
      res.json({ 
        message: '스터디그라운드 서버가 실행 중입니다.',
        status: 'running',
        endpoints: {
          api: '/api',
          kiosk: '/kiosk',
          admin: '/admin'
        },
        note: '빌드 파일이 없습니다. Railway에서 빌드가 완료되었는지 확인하세요.'
      });
    }
  });
} else {
  // 개발 모드에서도 기본 응답 제공
  app.get('/', (req, res) => {
    res.json({ 
      message: '스터디그라운드 개발 서버가 실행 중입니다.',
      status: 'development',
      endpoints: {
        api: '/api',
        kiosk: 'http://localhost:3000',
        admin: 'http://localhost:3001'
      }
    });
  });
}

// SQLite 데이터베이스 연결
const dbPath = path.join(__dirname, '..', 'database', 'studyground.db');
const db = new sqlite3.Database(dbPath);

// 데이터베이스 초기화
const initDatabase = () => {
  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sqlite.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  
  db.exec(schema, (err) => {
    if (err) {
      console.error('스키마 생성 오류:', err);
    } else {
      console.log('데이터베이스 스키마 생성 완료');
      
      // 기본 관리자 계정 생성
      const adminPassword = 'admin1234';
      bcrypt.hash(adminPassword, 10, (err, hash) => {
        if (!err) {
          db.run(
            `INSERT OR IGNORE INTO admins (username, password_hash, name, email) 
             VALUES (?, ?, ?, ?)`,
            ['admin', hash, '관리자', 'admin@studyground.com'],
            (err) => {
              if (err) {
                console.error('기본 관리자 생성 오류:', err);
              } else {
                console.log('기본 관리자 계정 생성 완료 (admin/admin1234)');
              }
            }
          );
        }
      });
      
      // 기본 좌석 생성 (35개, 01~35번)
      for (let i = 1; i <= 35; i++) {
        const seatNumber = i.toString().padStart(2, '0');
        const pin = (1000 + i).toString(); // 1001~1035
        db.run(
          'INSERT OR IGNORE INTO seats (seat_number, seat_type, pin, is_available, status) VALUES (?, ?, ?, ?, ?)',
          [seatNumber, 'standard', pin, 1, 'available']
        );
      }
      
      // 테스트 학생 데이터 생성 (고정 좌석 할당)
      const testStudents = [
        { name: '김철수', student_number: '2024001', phone: '010-1234-5678', grade: '1학년', fixed_seat: 1 },
        { name: '이영희', student_number: '2024002', phone: '010-2345-6789', grade: '2학년', fixed_seat: 2 },
        { name: '박민수', student_number: '2024003', phone: '010-3456-7890', grade: '3학년', fixed_seat: 3 }
      ];
      
      testStudents.forEach(student => {
        db.run(
          'INSERT OR IGNORE INTO students (name, student_number, phone, grade, fixed_seat_number) VALUES (?, ?, ?, ?, ?)',
          [student.name, student.student_number, student.phone, student.grade, student.fixed_seat]
        );
      });
      
      console.log('테스트 데이터 생성 완료');
    }
  });
};

// 데이터베이스 연결 테스트
db.serialize(() => {
  initDatabase();
  console.log('SQLite 데이터베이스 연결 성공');
});

// JWT 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// ============ 출석 관리 API ============

// 1. 좌석 PIN으로 체크인/체크아웃 처리
app.post('/api/attendance/check', (req, res) => {
  const { pin } = req.body;

  // 좌석 PIN으로 좌석과 학생 정보 조회
  db.get(
    `SELECT s.*, st.id as student_id, st.name as student_name, st.student_number, st.grade
     FROM seats s
     LEFT JOIN students st ON s.current_student_id = st.id
     WHERE s.pin = ?`,
    [pin],
    (err, seat) => {
      if (err) {
        console.error('좌석 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!seat) {
        return res.status(404).json({ message: '좌석 PIN 번호가 올바르지 않습니다.' });
      }

      const today = new Date().toISOString().split('T')[0];

      if (!seat.student_id) {
        // 좌석이 비어있음 - 체크인 처리
        // 해당 좌석에 고정된 학생이 있는지 확인
        db.get(
          'SELECT * FROM students WHERE fixed_seat_number = ? AND status = ?',
          [seat.seat_number, 'active'],
          (err, fixedStudent) => {
            if (err) {
              console.error('고정 학생 조회 오류:', err);
              return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            if (!fixedStudent) {
              return res.status(400).json({ message: '이 좌석에 고정된 학생이 없습니다.' });
            }

            const now = new Date().toISOString();

            db.run(
              'INSERT INTO attendance (student_id, check_in_time, seat_number, date, attendance_status) VALUES (?, ?, ?, ?, ?)',
              [fixedStudent.id, now, seat.seat_number, today, 'present'],
              function(err) {
                if (err) {
                  console.error('출석 등록 오류:', err);
                  return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
                }

                const attendanceId = this.lastID;

                db.run(
                  'UPDATE seats SET is_available = 0, current_student_id = ?, status = ? WHERE seat_number = ?',
                  [fixedStudent.id, 'occupied', seat.seat_number]
                );

                db.get(
                  'SELECT * FROM study_goals WHERE student_id = ?',
                  [fixedStudent.id],
                  (err, goal) => {
                    res.json({
                      action: 'check_in',
                      student: {
                        id: fixedStudent.id,
                        name: fixedStudent.name,
                        studentNumber: fixedStudent.student_number,
                        grade: fixedStudent.grade,
                      },
                      seat: seat.seat_number,
                      checkInTime: now,
                      studyGoal: goal || null,
                      attendanceId: attendanceId,
                    });
                  }
                );
              }
            );
          }
        );
      } else {
        // 좌석에 학생이 있음 - 체크아웃 처리
        db.get(
          'SELECT * FROM attendance WHERE student_id = ? AND date = ? AND check_out_time IS NULL ORDER BY check_in_time DESC LIMIT 1',
          [seat.student_id, today],
          (err, attendance) => {
            if (err) {
              console.error('출석 조회 오류:', err);
              return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            if (!attendance) {
              return res.status(400).json({ message: '출석 기록을 찾을 수 없습니다.' });
            }

            res.json({
              action: 'check_out',
              student: {
                id: seat.student_id,
                name: seat.student_name,
                studentNumber: seat.student_number,
                grade: seat.grade,
              },
              checkInTime: attendance.check_in_time,
              attendanceId: attendance.id,
              seat: seat.seat_number,
            });
          }
        );
      }
    }
  );
});

// 2. 체크아웃 처리 (퇴실 사유 포함)
app.post('/api/attendance/checkout', (req, res) => {
  const { attendanceId, checkoutReason } = req.body;

  // 퇴실 사유 검증
  const validReasons = ['집에 가기', '학원 가기', '잠시 자리 비움'];
  if (!checkoutReason || !validReasons.includes(checkoutReason)) {
    return res.status(400).json({ message: '올바른 퇴실 사유를 선택해주세요.' });
  }

  db.get(
    'SELECT * FROM attendance WHERE id = ?',
    [attendanceId],
    (err, attendance) => {
      if (err) {
        console.error('출석 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!attendance) {
        return res.status(404).json({ message: '출석 기록을 찾을 수 없습니다.' });
      }

      const checkOutTime = new Date();
      const studyDuration = Math.floor((checkOutTime - new Date(attendance.check_in_time)) / 60000);

      db.run(
        'UPDATE attendance SET check_out_time = ?, study_duration = ?, checkout_reason = ? WHERE id = ?',
        [checkOutTime.toISOString(), studyDuration, checkoutReason, attendanceId],
        (err) => {
          if (err) {
            console.error('체크아웃 업데이트 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
          }

          db.run(
            'UPDATE seats SET is_available = 1, current_student_id = NULL, status = ? WHERE seat_number = ?',
            ['available', attendance.seat_number]
          );

          res.json({
            message: '체크아웃이 완료되었습니다.',
            studyDuration,
            checkOutTime,
            checkoutReason,
          });
        }
      );
    }
  );
});

// 3. 이용 가능한 좌석 찾기 함수
async function getAvailableSeat() {
  const result = await pool.query(
    'SELECT seat_number FROM seats WHERE status = $1 ORDER BY seat_number LIMIT 1',
    ['available']
  );
  
  return result.rows.length > 0 ? result.rows[0].seat_number : null;
}

// ============ 학생 관리 API ============

// 4. 학생 등록 (고정 좌석 할당)
app.post('/api/students', authenticateToken, (req, res) => {
  const { name, studentNumber, phone, grade, school, fixedSeatNumber } = req.body;

  // 학번 중복 확인
  db.get(
    'SELECT id FROM students WHERE student_number = ?',
    [studentNumber],
    (err, existingStudent) => {
      if (err) {
        console.error('학생 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (existingStudent) {
        return res.status(400).json({ message: '학번이 이미 등록되어 있습니다.' });
      }

      // 고정 좌석이 이미 사용 중인지 확인
      if (fixedSeatNumber) {
        db.get(
          'SELECT id FROM students WHERE fixed_seat_number = ? AND status = ?',
          [fixedSeatNumber, 'active'],
          (err, seatOccupied) => {
            if (err) {
              console.error('좌석 조회 오류:', err);
              return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            if (seatOccupied) {
              return res.status(400).json({ message: '해당 좌석은 이미 사용 중입니다.' });
            }

            // 학생 등록
            db.run(
              'INSERT INTO students (name, student_number, phone, grade, school, fixed_seat_number) VALUES (?, ?, ?, ?, ?, ?)',
              [name, studentNumber, phone, grade, school, fixedSeatNumber],
              function(err) {
                if (err) {
                  console.error('학생 등록 오류:', err);
                  return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
                }

                res.status(201).json({
                  message: '학생이 성공적으로 등록되었습니다.',
                  student: {
                    id: this.lastID,
                    name,
                    studentNumber,
                    phone,
                    grade,
                    school,
                    fixedSeatNumber,
                  },
                });
              }
            );
          }
        );
      } else {
        // 고정 좌석 없이 등록
        db.run(
          'INSERT INTO students (name, student_number, phone, grade, school) VALUES (?, ?, ?, ?, ?)',
          [name, studentNumber, phone, grade, school],
          function(err) {
            if (err) {
              console.error('학생 등록 오류:', err);
              return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
            }

            res.status(201).json({
              message: '학생이 성공적으로 등록되었습니다.',
              student: {
                id: this.lastID,
                name,
                studentNumber,
                phone,
                grade,
                school,
                fixedSeatNumber: null,
              },
            });
          }
        );
      }
    }
  );
});

// 5. 학생 목록 조회
app.get('/api/students', authenticateToken, (req, res) => {
  const { status, search, includeArchived } = req.query;

  let query = 'SELECT * FROM students WHERE 1=1';
  const params = [];

  // 기본적으로 활성 학생만 조회, includeArchived가 true면 모든 학생 조회
  if (includeArchived !== 'true') {
    query += ` AND status != 'archived'`;
  }

  if (status) {
    params.push(status);
    query += ` AND status = ?`;
  }

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (name LIKE ? OR student_number LIKE ?)`;
    params.push(`%${search}%`);
  }

  query += ' ORDER BY name ASC';

  db.all(query, params, (err, students) => {
    if (err) {
      console.error('학생 목록 조회 오류:', err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }

    res.json({
      students: students,
      total: students.length,
    });
  });
});

// 6. 학생 상세 조회
app.get('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const studentResult = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    
    if (studentResult.rows.length === 0) {
      return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    const student = studentResult.rows[0];

    const attendanceResult = await pool.query(
      `SELECT * FROM attendance 
       WHERE student_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY date DESC, check_in_time DESC`,
      [id]
    );

    const goalResult = await pool.query(
      'SELECT * FROM study_goals WHERE student_id = $1',
      [id]
    );

    res.json({
      student,
      recentAttendance: attendanceResult.rows,
      studyGoal: goalResult.rows[0] || null,
    });

  } catch (error) {
    console.error('학생 상세 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 7. 학생 정보 수정
app.put('/api/students/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, phone, grade, pin, status } = req.body;

  try {
    if (pin) {
      const pinCheck = await pool.query(
        'SELECT id FROM students WHERE pin = $1 AND id != $2',
        [pin, id]
      );
      if (pinCheck.rows.length > 0) {
        return res.status(400).json({ message: 'PIN이 이미 사용 중입니다.' });
      }
    }

    const result = await pool.query(
      `UPDATE students 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           grade = COALESCE($3, grade),
           pin = COALESCE($4, pin),
           status = COALESCE($5, status),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, phone, grade, pin, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
    }

    res.json({
      message: '학생 정보가 수정되었습니다.',
      student: result.rows[0],
    });

  } catch (error) {
    console.error('학생 정보 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 8. 학생 아카이빙 (탈퇴 처리)
app.delete('/api/students/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // 학생 정보 조회
  db.get(
    'SELECT * FROM students WHERE id = ? AND status = ?',
    [id, 'active'],
    (err, student) => {
      if (err) {
        console.error('학생 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!student) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
      }

      // 학생이 현재 좌석을 사용 중인지 확인하고 좌석 해제
      if (student.fixed_seat_number) {
        db.run(
          'UPDATE seats SET is_available = 1, current_student_id = NULL, status = ? WHERE seat_number = ?',
          ['available', student.fixed_seat_number]
        );
      }

      // 학생 아카이빙 (상태를 archived로 변경, archived_at 설정)
      db.run(
        'UPDATE students SET status = ?, archived_at = CURRENT_TIMESTAMP, fixed_seat_number = NULL WHERE id = ?',
        ['archived', id],
        function(err) {
          if (err) {
            console.error('학생 아카이빙 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
          }

          res.json({ 
            message: '학생이 탈퇴 처리되었습니다. (아카이빙됨)',
            freedSeat: student.fixed_seat_number
          });
        }
      );
    }
  );
});

// ============ 좌석 관리 API ============

// 9. 좌석 목록 조회 (고정 좌석 정보 포함)
app.get('/api/seats', authenticateToken, (req, res) => {
  db.all(
    `SELECT s.*, 
            st.name as current_student_name, 
            st.student_number as current_student_number,
            fixed_st.name as fixed_student_name,
            fixed_st.student_number as fixed_student_number
    FROM seats s
    LEFT JOIN students st ON s.current_student_id = st.id
    LEFT JOIN students fixed_st ON s.seat_number = fixed_st.fixed_seat_number AND fixed_st.status = 'active'
    ORDER BY s.seat_number ASC`,
    (err, seats) => {
      if (err) {
        console.error('좌석 목록 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      const available = seats.filter(s => s.status === 'available').length;
      const occupied = seats.filter(s => s.status === 'occupied').length;

      res.json({
        seats: seats,
        total: seats.length,
        available: available,
        occupied: occupied,
      });
    }
  );
});

// 10. 좌석 초기화 (고정 좌석 시스템)
app.post('/api/seats/initialize', authenticateToken, (req, res) => {
  const { totalSeats = 35 } = req.body;

  // 기존 좌석 삭제
  db.run('DELETE FROM seats', (err) => {
    if (err) {
      console.error('좌석 삭제 오류:', err);
      return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }

    // 새로운 좌석 생성 (01~35번, PIN 1001~1035)
    let completed = 0;
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = i.toString().padStart(2, '0');
      const pin = (1000 + i).toString();
      
      db.run(
        'INSERT INTO seats (seat_number, seat_type, pin, is_available, status) VALUES (?, ?, ?, ?, ?)',
        [seatNumber, 'standard', pin, 1, 'available'],
        (err) => {
          if (err) {
            console.error('좌석 생성 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
          }
          
          completed++;
          if (completed === totalSeats) {
            res.json({ message: `${totalSeats}개의 좌석이 생성되었습니다. (01~${totalSeats.toString().padStart(2, '0')}번, PIN: 1001~${1000 + totalSeats})` });
          }
        }
      );
    }
  });
});

// ============ 대시보드 API ============

// 11. 오늘 출석 현황
app.get('/api/dashboard/today', authenticateToken, (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  db.get(
    `SELECT 
      COUNT(*) as total_attendance,
      SUM(CASE WHEN check_out_time IS NULL THEN 1 ELSE 0 END) as currently_studying,
      SUM(CASE WHEN check_out_time IS NOT NULL THEN 1 ELSE 0 END) as completed,
      COALESCE(SUM(study_duration), 0) as total_study_minutes,
      COALESCE(AVG(study_duration), 0) as avg_study_minutes
    FROM attendance
    WHERE date = ?`,
    [today],
    (err, attendanceStats) => {
      if (err) {
        console.error('출석 통계 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      db.all(
        `SELECT 
          s.id, s.name, s.student_number, s.assigned_seat,
          a.check_in_time,
          (julianday('now') - julianday(a.check_in_time)) * 24 * 60 as study_minutes
        FROM students s
        JOIN attendance a ON s.id = a.student_id
        WHERE a.date = ? AND a.check_out_time IS NULL
        ORDER BY a.check_in_time ASC`,
        [today],
        (err, currentStudents) => {
          if (err) {
            console.error('현재 학생 조회 오류:', err);
            return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
          }

          db.get(
            `SELECT 
              COUNT(*) as total_seats,
              SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_seats,
              SUM(CASE WHEN status = 'occupied' THEN 1 ELSE 0 END) as occupied_seats
            FROM seats`,
            (err, seatStats) => {
              if (err) {
                console.error('좌석 통계 조회 오류:', err);
                return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
              }

              res.json({
                date: today,
                attendance: attendanceStats,
                currentStudents: currentStudents,
                seats: seatStats,
              });
            }
          );
        }
      );
    }
  );
});

// 12. 기간별 통계
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const dailyStats = await pool.query(`
      SELECT 
        date,
        COUNT(*) as attendance_count,
        COALESCE(SUM(study_duration), 0) as total_study_minutes,
        COALESCE(AVG(study_duration), 0) as avg_study_minutes
      FROM attendance
      WHERE date BETWEEN $1 AND $2
      GROUP BY date
      ORDER BY date ASC
    `, [startDate, endDate]);

    const studentRanking = await pool.query(`
      SELECT 
        s.id, s.name, s.student_number,
        COUNT(a.id) as attendance_count,
        COALESCE(SUM(a.study_duration), 0) as total_study_minutes,
        COALESCE(AVG(a.study_duration), 0) as avg_study_minutes
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id 
        AND a.date BETWEEN $1 AND $2
      WHERE s.status = 'active'
      GROUP BY s.id, s.name, s.student_number
      ORDER BY total_study_minutes DESC
      LIMIT 10
    `, [startDate, endDate]);

    const hourlyStats = await pool.query(`
      SELECT 
        EXTRACT(HOUR FROM check_in_time) as hour,
        COUNT(*) as check_in_count
      FROM attendance
      WHERE date BETWEEN $1 AND $2
      GROUP BY hour
      ORDER BY hour ASC
    `, [startDate, endDate]);

    res.json({
      period: { startDate, endDate },
      dailyStats: dailyStats.rows,
      studentRanking: studentRanking.rows,
      hourlyStats: hourlyStats.rows,
    });

  } catch (error) {
    console.error('기간별 통계 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 관리자 인증 API ============

// 13. 관리자 로그인
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get(
    'SELECT * FROM admins WHERE username = ?',
    [username],
    (err, admin) => {
      if (err) {
        console.error('관리자 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!admin) {
        return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
      }

      bcrypt.compare(password, admin.password_hash, (err, validPassword) => {
        if (err) {
          console.error('비밀번호 비교 오류:', err);
          return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }

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
      });
    }
  );
});

// 14. 관리자 등록
app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, email } = req.body;

  try {
    const existingAdmin = await pool.query(
      'SELECT id FROM admins WHERE username = $1',
      [username]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 사용자명입니다.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO admins (username, password_hash, name, email) 
       VALUES ($1, $2, $3, $4) RETURNING id, username, name, email, role`,
      [username, passwordHash, name, email]
    );

    res.status(201).json({
      message: '관리자가 등록되었습니다.',
      admin: result.rows[0],
    });

  } catch (error) {
    console.error('관리자 등록 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// ============ 공지사항 API ============

// 15. 공지사항 목록 조회 (태블릿용)
app.get('/api/announcements', (req, res) => {
  db.all(
    `SELECT id, title, content, priority, created_at
    FROM announcements
    WHERE is_active = 1 
      AND (expires_at IS NULL OR expires_at > datetime('now'))
    ORDER BY 
      CASE priority 
        WHEN 'high' THEN 1
        WHEN 'normal' THEN 2
        WHEN 'low' THEN 3
      END,
      created_at DESC
    LIMIT 3`,
    (err, announcements) => {
      if (err) {
        console.error('공지사항 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      res.json({ announcements: announcements });
    }
  );
});

// 16. 공지사항 생성
app.post('/api/admin/announcements', authenticateToken, async (req, res) => {
  const { title, content, priority, expiresAt } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO announcements (title, content, priority, expires_at, created_by) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, content, priority, expiresAt, req.user.id]
    );

    res.status(201).json({
      message: '공지사항이 등록되었습니다.',
      announcement: result.rows[0],
    });

  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '서버가 정상적으로 실행 중입니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0'; // 모든 네트워크 인터페이스에서 수신
app.listen(PORT, HOST, () => {
  console.log(`스터디그라운드 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트: http://localhost:${PORT}/api`);
  console.log(`네트워크 접근: http://0.0.0.0:${PORT}/api`);
  console.log(`다른 기기에서 접근하려면 이 컴퓨터의 IP 주소를 사용하세요.`);
});
