# 스터디그라운드 MVP 시스템

태블릿 1대로 모든 학생의 출결을 관리하는 독서실/스터디카페 관리 시스템입니다.

## 주요 기능

- **고정 좌석 시스템**: 35개 고정 좌석으로 운영 (PIN: 1001~1035)
- **PIN 기반 출석 체크**: 학생들이 개인 PIN으로 간편하게 체크인/체크아웃
- **실시간 좌석 관리**: 고정 좌석 배정 및 현황 파악
- **관리자 대시보드**: 출석 통계, 평균 학습 시간 분석, 학생 관리
- **학습 시간 추적**: 자동으로 학습 시간 계산 및 통계 제공
- **학생 아카이빙**: 탈퇴 학생 정보 보존 및 검색 가능

## 기술 스택

### 백엔드
- Node.js + Express.js
- SQLite (경량 데이터베이스)
- JWT 인증
- bcrypt (비밀번호 암호화)

### 프론트엔드
- React.js
- Tailwind CSS
- Chart.js (데이터 시각화)
- Axios

## 설치 방법

### 1. 사전 요구사항
- Node.js (v16 이상)
- npm 또는 yarn

### 2. 프로젝트 클론 및 의존성 설치

```bash
cd studyground-mvp
npm install
```

### 3. 데이터베이스 설정

SQLite 데이터베이스는 자동으로 생성됩니다. 서버 실행 시 자동으로 스키마가 생성되고 초기 데이터가 입력됩니다.

### 4. 서버 실행

개발 모드:
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

서버가 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 출석 관리
- `POST /api/attendance/check` - PIN으로 체크인/체크아웃 확인
- `POST /api/attendance/checkout` - 체크아웃 처리

### 학생 관리
- `GET /api/students` - 학생 목록 조회 (includeArchived 파라미터로 아카이빙된 학생 포함)
- `POST /api/students` - 학생 등록 (이름, 학번, 전화번호, 학년, 학교, 고정좌석)
- `GET /api/students/:id` - 학생 상세 조회
- `PUT /api/students/:id` - 학생 정보 수정
- `DELETE /api/students/:id` - 학생 탈퇴 처리 (아카이빙)

### 좌석 관리
- `GET /api/seats` - 좌석 목록 조회 (35개 고정 좌석)
- `POST /api/seats/initialize` - 좌석 초기화 (35개 좌석 생성)

### 대시보드
- `GET /api/dashboard/today` - 오늘 출석 현황 (평균 학습시간 포함)
- `GET /api/dashboard/stats` - 기간별 통계

### 인증
- `POST /api/auth/login` - 관리자 로그인
- `POST /api/auth/register` - 관리자 등록

### 공지사항
- `GET /api/announcements` - 공지사항 조회
- `POST /api/admin/announcements` - 공지사항 생성

## 기본 계정 정보

### 관리자 계정
- 아이디: `admin`
- 비밀번호: `admin1234`

### 테스트 학생 계정 (고정 좌석)
- 김철수: 좌석 01번, PIN `1001`
- 이영희: 좌석 02번, PIN `1002`
- 박민수: 좌석 03번, PIN `1003`

## 프로젝트 구조

```
studyground-mvp/
├── server/
│   └── server.js          # 백엔드 메인 서버
├── client/                # 태블릿 키오스크 프론트엔드
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
├── admin/                 # 관리자 대시보드 프론트엔드
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
├── database/
│   ├── schema.sqlite.sql  # SQLite 데이터베이스 스키마
│   ├── migrations/        # 데이터베이스 마이그레이션
│   └── studyground.db     # SQLite 데이터베이스 파일
├── .env.example           # 환경 변수 예제
├── package.json
└── README.md
```

## 개발 로드맵

### Phase 1: 기본 인프라 ✅
- [x] 데이터베이스 설계 (SQLite)
- [x] 백엔드 API 서버
- [x] 인증 시스템
- [x] 고정 좌석 시스템 (35개)
- [x] 학생 아카이빙 시스템

### Phase 2: 태블릿 키오스크 ✅
- [x] PIN 입력 화면
- [x] 체크인/체크아웃 화면
- [x] 공지사항 표시

### Phase 3: 관리자 대시보드 ✅
- [x] 메인 대시보드 (평균 학습시간 표시)
- [x] 학생 관리 (학교 정보, 아카이빙 검색)
- [x] 좌석 관리 (35개 고정 좌석)
- [x] 통계 및 분석

### Phase 4: 배포 및 최적화 (계획 중)
- [ ] 프로덕션 배포
- [ ] 성능 최적화
- [ ] 보안 강화

## 라이선스

MIT License

## 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.
