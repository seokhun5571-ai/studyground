/**
 * Google Sheets API 연동 서비스
 * 모든 데이터를 Google Sheets에 저장하고 조회합니다.
 */

const { google } = require('googleapis');
require('dotenv').config();

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    // 시트 이름 정의
    this.SHEETS = {
      STUDENTS: '학생',
      SEATS: '좌석',
      ATTENDANCE: '출석',
      ADMINS: '관리자',
      STUDY_GOALS: '학습목표',
      ANNOUNCEMENTS: '공지사항',
      REPORTS: '리포트',
      SETTINGS: '설정'
    };
    
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // 서비스 계정 인증
      const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || '{}'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.auth = await auth.getClient();
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      console.log('✅ Google Sheets 인증 완료');
      
      // 시트 초기화 확인
      await this.ensureSheetsExist();
    } catch (error) {
      console.error('Google Sheets 인증 오류:', error);
      // 개발 모드에서는 환경 변수가 없을 수 있으므로 경고만 출력
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async ensureSheetsExist() {
    if (!this.sheets || !this.spreadsheetId) return;

    try {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);
      
      // 필요한 시트가 없으면 생성
      const sheetsToCreate = Object.values(this.SHEETS).filter(
        name => !existingSheets.includes(name)
      );

      if (sheetsToCreate.length > 0) {
        const requests = sheetsToCreate.map(name => ({
          addSheet: {
            properties: {
              title: name,
            },
          },
        }));

        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests,
          },
        });

        // 각 시트에 헤더 추가
        for (const sheetName of sheetsToCreate) {
          await this.initializeSheetHeaders(sheetName);
        }

        console.log(`✅ ${sheetsToCreate.length}개의 시트 생성 완료`);
      }
    } catch (error) {
      console.error('시트 확인 오류:', error);
    }
  }

  async initializeSheetHeaders(sheetName) {
    const headers = this.getSheetHeaders(sheetName);
    if (!headers) return;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${sheetName}!A1:${String.fromCharCode(64 + headers.length)}1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });
  }

  getSheetHeaders(sheetName) {
    const headers = {
      [this.SHEETS.STUDENTS]: [
        'ID', '이름', '학번', '전화번호', '학년', '학교', '고정좌석번호', 
        '등록일', '상태', '아카이브일시', '생성일시', '수정일시'
      ],
      [this.SHEETS.SEATS]: [
        'ID', '좌석번호', '좌석타입', 'PIN', '사용가능', '현재학생ID', 
        '상태', '생성일시'
      ],
      [this.SHEETS.ATTENDANCE]: [
        'ID', '학생ID', '입실시간', '퇴실시간', '학습시간(분)', '좌석번호', 
        '출석상태', '퇴실사유', '날짜', '생성일시'
      ],
      [this.SHEETS.ADMINS]: [
        'ID', '사용자명', '비밀번호해시', '이름', '이메일', '역할', '생성일시'
      ],
      [this.SHEETS.STUDY_GOALS]: [
        'ID', '학생ID', '주간목표시간', '월간목표시간', '일간목표시간', '생성일시'
      ],
      [this.SHEETS.ANNOUNCEMENTS]: [
        'ID', '제목', '내용', '우선순위', '활성', '작성자ID', '생성일시', '만료일시'
      ],
    };

    return headers[sheetName];
  }

  // ============ 학생 관리 ============
  
  async getAllStudents() {
    if (!this.sheets) return [];
    
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.STUDENTS}!A2:Z`,
      });

      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        id: row[0] || index + 1,
        name: row[1] || '',
        student_number: row[2] || '',
        phone: row[3] || '',
        grade: row[4] || '',
        school: row[5] || '',
        fixed_seat_number: row[6] ? parseInt(row[6]) : null,
        enrollment_date: row[7] || '',
        status: row[8] || 'active',
        archived_at: row[9] || null,
        created_at: row[10] || new Date().toISOString(),
        updated_at: row[11] || new Date().toISOString(),
      })).filter(s => s.status !== 'archived' || !s.status);
    } catch (error) {
      console.error('학생 목록 조회 오류:', error);
      return [];
    }
  }

  async getStudentById(id) {
    const students = await this.getAllStudents();
    return students.find(s => s.id == id);
  }

  async getStudentBySeatNumber(seatNumber) {
    const students = await this.getAllStudents();
    return students.find(s => s.fixed_seat_number == seatNumber && s.status === 'active');
  }

  async createStudent(studentData) {
    if (!this.sheets) {
      // 개발 모드: 더미 ID 반환
      return { id: Date.now(), ...studentData };
    }

    try {
      const students = await this.getAllStudents();
      const newId = students.length > 0 
        ? Math.max(...students.map(s => parseInt(s.id) || 0)) + 1 
        : 1;

      const row = [
        newId,
        studentData.name,
        studentData.student_number,
        studentData.phone || '',
        studentData.grade || '',
        studentData.school || '',
        studentData.fixed_seat_number || '',
        new Date().toISOString().split('T')[0],
        'active',
        '',
        new Date().toISOString(),
        new Date().toISOString(),
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.STUDENTS}!A:Z`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      return { id: newId, ...studentData };
    } catch (error) {
      console.error('학생 등록 오류:', error);
      throw error;
    }
  }

  async updateStudent(id, updates) {
    if (!this.sheets) return { id, ...updates };

    try {
      const students = await this.getAllStudents();
      const studentIndex = students.findIndex(s => s.id == id);
      
      if (studentIndex === -1) {
        throw new Error('학생을 찾을 수 없습니다.');
      }

      const updated = { ...students[studentIndex], ...updates, updated_at: new Date().toISOString() };
      const row = [
        updated.id,
        updated.name,
        updated.student_number,
        updated.phone,
        updated.grade,
        updated.school,
        updated.fixed_seat_number || '',
        updated.enrollment_date,
        updated.status,
        updated.archived_at || '',
        updated.created_at,
        updated.updated_at,
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.STUDENTS}!A${studentIndex + 2}:L${studentIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      return updated;
    } catch (error) {
      console.error('학생 정보 수정 오류:', error);
      throw error;
    }
  }

  // ============ 좌석 관리 ============

  async getAllSeats() {
    if (!this.sheets) {
      // 개발 모드: 더미 좌석 반환
      const seats = [];
      for (let i = 1; i <= 43; i++) {
        seats.push({
          id: i,
          seat_number: i.toString().padStart(2, '0'),
          seat_type: 'standard',
          pin: (1000 + i).toString(),
          is_available: true,
          current_student_id: null,
          status: 'available',
        });
      }
      return seats;
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.SEATS}!A2:H`,
      });

      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        id: row[0] || index + 1,
        seat_number: row[1] || '',
        seat_type: row[2] || 'standard',
        pin: row[3] || '',
        is_available: row[4] === 'TRUE' || row[4] === true,
        current_student_id: row[5] ? parseInt(row[5]) : null,
        status: row[6] || 'available',
        created_at: row[7] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('좌석 목록 조회 오류:', error);
      return [];
    }
  }

  async getSeatByNumber(seatNumber) {
    const seats = await this.getAllSeats();
    return seats.find(s => s.seat_number == seatNumber);
  }

  async updateSeat(seatNumber, updates) {
    if (!this.sheets) return { seat_number: seatNumber, ...updates };

    try {
      const seats = await this.getAllSeats();
      const seatIndex = seats.findIndex(s => s.seat_number == seatNumber);
      
      if (seatIndex === -1) {
        throw new Error('좌석을 찾을 수 없습니다.');
      }

      const updated = { ...seats[seatIndex], ...updates };
      const row = [
        updated.id,
        updated.seat_number,
        updated.seat_type,
        updated.pin,
        updated.is_available,
        updated.current_student_id || '',
        updated.status,
        updated.created_at,
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.SEATS}!A${seatIndex + 2}:H${seatIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      return updated;
    } catch (error) {
      console.error('좌석 정보 수정 오류:', error);
      throw error;
    }
  }

  // ============ 출석 관리 ============

  async createAttendance(attendanceData) {
    if (!this.sheets) {
      return { id: Date.now(), ...attendanceData };
    }

    try {
      const attendances = await this.getAllAttendances();
      const newId = attendances.length > 0 
        ? Math.max(...attendances.map(a => parseInt(a.id) || 0)) + 1 
        : 1;

      const row = [
        newId,
        attendanceData.student_id,
        attendanceData.check_in_time,
        attendanceData.check_out_time || '',
        attendanceData.study_duration || '',
        attendanceData.seat_number,
        attendanceData.attendance_status || 'present',
        attendanceData.checkout_reason || '',
        attendanceData.date,
        new Date().toISOString(),
      ];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.ATTENDANCE}!A:J`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      return { id: newId, ...attendanceData };
    } catch (error) {
      console.error('출석 등록 오류:', error);
      throw error;
    }
  }

  async getAllAttendances(filters = {}) {
    if (!this.sheets) return [];

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.ATTENDANCE}!A2:J`,
      });

      let rows = response.data.values || [];
      
      // 필터 적용
      if (filters.student_id) {
        rows = rows.filter(row => row[1] == filters.student_id);
      }
      if (filters.date) {
        rows = rows.filter(row => row[8] === filters.date);
      }
      if (filters.date_from) {
        rows = rows.filter(row => row[8] >= filters.date_from);
      }
      if (filters.date_to) {
        rows = rows.filter(row => row[8] <= filters.date_to);
      }

      return rows.map((row, index) => ({
        id: row[0] || index + 1,
        student_id: parseInt(row[1]) || 0,
        check_in_time: row[2] || '',
        check_out_time: row[3] || '',
        study_duration: row[4] ? parseInt(row[4]) : null,
        seat_number: row[5] || '',
        attendance_status: row[6] || 'present',
        checkout_reason: row[7] || '',
        date: row[8] || '',
        created_at: row[9] || new Date().toISOString(),
      }));
    } catch (error) {
      console.error('출석 목록 조회 오류:', error);
      return [];
    }
  }

  async updateAttendance(id, updates) {
    if (!this.sheets) return { id, ...updates };

    try {
      const attendances = await this.getAllAttendances();
      const attendanceIndex = attendances.findIndex(a => a.id == id);
      
      if (attendanceIndex === -1) {
        throw new Error('출석 기록을 찾을 수 없습니다.');
      }

      const updated = { ...attendances[attendanceIndex], ...updates };
      const row = [
        updated.id,
        updated.student_id,
        updated.check_in_time,
        updated.check_out_time || '',
        updated.study_duration || '',
        updated.seat_number,
        updated.attendance_status,
        updated.checkout_reason || '',
        updated.date,
        updated.created_at,
      ];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.ATTENDANCE}!A${attendanceIndex + 2}:J${attendanceIndex + 2}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [row],
        },
      });

      return updated;
    } catch (error) {
      console.error('출석 정보 수정 오류:', error);
      throw error;
    }
  }

  // ============ 관리자 인증 ============

  async getAdminByUsername(username) {
    if (!this.sheets) {
      // 개발 모드: 기본 관리자 반환
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('admin1234', 10);
      return {
        id: 1,
        username: 'admin',
        password_hash: passwordHash,
        name: '관리자',
        email: 'admin@studyground.com',
        role: 'admin',
      };
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${this.SHEETS.ADMINS}!A2:G`,
      });

      const rows = response.data.values || [];
      const admin = rows.find(row => row[1] === username);
      
      if (!admin) return null;

      return {
        id: admin[0],
        username: admin[1],
        password_hash: admin[2],
        name: admin[3],
        email: admin[4],
        role: admin[5] || 'admin',
        created_at: admin[6] || new Date().toISOString(),
      };
    } catch (error) {
      console.error('관리자 조회 오류:', error);
      return null;
    }
  }
}

// 싱글톤 인스턴스
let sheetsService = null;

function getSheetsService() {
  if (!sheetsService) {
    sheetsService = new GoogleSheetsService();
  }
  return sheetsService;
}

module.exports = getSheetsService;
