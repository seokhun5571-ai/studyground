# 스터디그라운드 통합 관리 시스템

관리형 독서실을 위한 통합 관리 시스템입니다. 3개의 웹 애플리케이션으로 구성되어 있으며, Google Sheets를 데이터베이스로 사용합니다.

## 시스템 구성

### 1. 입퇴실 키오스크 (아이패드)
- 좌석 번호 선택 방식
- 입실/퇴실/외출/복귀 처리
- 실시간 상태 표시

### 2. 공용 대시보드 (대형 모니터)
- 좌석 배치도 (60%)
- 실시간 현황 (40%)
- TOP 5 학습 현황
- 주간 출석 우수자

### 3. 관리자 대시보드 (PC)
- 학생 관리
- 통계 분석
- 리포트 생성 및 발송
- 시스템 설정

## 빠른 시작

### 1. 사전 요구사항
- Node.js v16 이상
- npm 또는 yarn
- Google 계정 (Google Sheets API 사용)

### 2. 설치

```bash
# 저장소 클론
git clone <repository-url>
cd studyground-mvp

# 의존성 설치
npm install

# Google Sheets 설정 (GOOGLE_SHEETS_SETUP.md 참고)
# .env 파일 생성 및 설정
```

### 3. Google Sheets 설정
자세한 설정 방법은 [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)를 참고하세요.

### 4. 실행

#### 개발 모드
```bash
# 서버 실행
npm run dev

# 클라이언트 실행 (별도 터미널)
cd client && npm run dev

# 관리자 대시보드 실행 (별도 터미널)
cd admin && npm run dev

# 공용 대시보드 실행 (별도 터미널)
cd public-dashboard && npm run dev
```

#### 프로덕션 모드
```bash
# 빌드
npm run build

# 서버 실행
npm start
```

### 5. 접속 URL

- **키오스크**: http://localhost:3000 또는 http://localhost:5001/kiosk
- **관리자 대시보드**: http://localhost:3001 또는 http://localhost:5001/admin
- **공용 대시보드**: http://localhost:3002 또는 http://localhost:5001/public

## 기본 계정

- **관리자 아이디**: `admin`
- **관리자 비밀번호**: `admin1234`

⚠️ 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!

## 배포

### Railway 배포
1. GitHub에 코드 푸시
2. [Railway](https://railway.app)에서 프로젝트 생성
3. GitHub 저장소 연결
4. 환경 변수 설정:
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SERVICE_ACCOUNT` (JSON 전체)
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT=5001`
   - `HOST=0.0.0.0`
5. 자동 배포 완료

### 다른 플랫폼 배포
- Vercel, Heroku, AWS 등에서도 배포 가능
- 환경 변수만 올바르게 설정하면 됩니다

## 주요 기능

### 학생 관리
- 학생 등록/수정/삭제
- 고정 좌석 할당
- 출석 현황 조회
- 학습 시간 통계

### 출석 관리
- 좌석 번호 기반 입퇴실
- 외출/복귀 처리
- 실시간 상태 표시
- 출석 기록 조회

### 통계 및 리포트
- 일별/주별/월별 통계
- 학습 시간 분석
- 출석률 분석
- 학부모 리포트 생성

### 설정
- 좌석 수 설정
- 수강권 관리
- 알림 설정
- 문자 발송 설정

## 기술 스택

### 백엔드
- Node.js
- Express
- Google Sheets API
- JWT 인증

### 프론트엔드
- React
- Vite
- Tailwind CSS
- Axios

## 데이터 구조

모든 데이터는 Google Sheets에 저장됩니다:
- **학생**: 학생 정보, 고정 좌석, 상태
- **좌석**: 좌석 정보, 현재 사용자, 상태
- **출석**: 입퇴실 기록, 학습 시간
- **관리자**: 관리자 계정 정보
- **학습목표**: 학생별 학습 목표
- **공지사항**: 공지사항 관리
- **리포트**: 리포트 발송 이력
- **설정**: 시스템 설정

## 문제 해결

### Google Sheets 연결 오류
- 서비스 계정 권한 확인
- 스프레드시트 ID 확인
- 환경 변수 확인

### 빌드 오류
- Node.js 버전 확인 (v16 이상)
- 의존성 재설치: `rm -rf node_modules && npm install`

### 포트 충돌
- 다른 애플리케이션이 포트를 사용 중인지 확인
- `.env` 파일에서 포트 변경

## 라이선스

MIT License

## 지원

문제가 발생하면 이슈를 등록하거나 문서를 참고하세요.
