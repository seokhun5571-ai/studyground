# 빠른 시작 가이드

## 5분 안에 시작하기

### 1단계: 저장소 클론 및 설치 (1분)

```bash
git clone <repository-url>
cd studyground-mvp
npm install
```

### 2단계: Google Sheets 설정 (2분)

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. "Google Sheets API" 활성화
4. 서비스 계정 생성 및 JSON 키 다운로드
5. Google Sheets 새 스프레드시트 생성
6. 서비스 계정 이메일에 편집 권한 부여

### 3단계: 환경 변수 설정 (1분)

`.env` 파일 생성:

```env
GOOGLE_SHEETS_ID=스프레드시트_ID
GOOGLE_SERVICE_ACCOUNT={"type":"service_account",...}
JWT_SECRET=$(openssl rand -hex 32)
PORT=5001
NODE_ENV=development
```

### 4단계: 실행 (1분)

```bash
# 개발 모드
npm run dev

# 또는 프로덕션 모드
npm run build
npm start
```

### 5단계: 접속

- 키오스크: http://localhost:5001/kiosk
- 관리자: http://localhost:5001/admin (admin/admin1234)
- 공용 대시보드: http://localhost:5001/public

## 다음 단계

1. 관리자 대시보드에서 학생 등록
2. 좌석에 학생 할당
3. 키오스크에서 입퇴실 테스트
4. 공용 대시보드 확인

## 문제 해결

### Google Sheets 연결 오류
- 서비스 계정 권한 확인
- 스프레드시트 ID 확인
- 환경 변수 형식 확인

### 포트 충돌
- 다른 포트 사용: `PORT=5002 npm start`
- 또는 다른 애플리케이션 종료

## 상세 가이드

- [Google Sheets 설정 가이드](./GOOGLE_SHEETS_SETUP.md)
- [배포 가이드](./DEPLOYMENT_GUIDE.md)
- [전체 문서](./README_KO.md)
