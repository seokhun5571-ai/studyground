# 스터디그라운드 통합 관리 시스템

관리형 독서실을 위한 통합 관리 시스템입니다. 3개의 웹 애플리케이션으로 구성되어 있으며, Google Sheets를 데이터베이스로 사용합니다.

## 🚀 빠른 시작

### 자동 배포 (권장)

```bash
./deploy-now.sh
```

이 스크립트가 모든 것을 자동으로 처리합니다!

### 수동 배포

1. **Google Sheets 설정** - [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) 참고
2. **환경 변수 설정** - `.env` 파일 생성
3. **배포** - [자동배포가이드.md](./자동배포가이드.md) 참고

## 📱 시스템 구성

### 1. 입퇴실 키오스크 (아이패드)
- 좌석 번호 선택 방식
- 입실/퇴실/외출/복귀 처리
- URL: `/kiosk`

### 2. 공용 대시보드 (대형 모니터)
- 실시간 좌석 현황
- TOP 5 학습 현황
- 주간 출석 우수자
- URL: `/public`

### 3. 관리자 대시보드 (PC)
- 학생 관리
- 통계 분석
- 리포트 생성
- URL: `/admin`

## 🛠️ 기술 스택

- **백엔드**: Node.js, Express, Google Sheets API
- **프론트엔드**: React, Vite, Tailwind CSS
- **배포**: Railway (권장)

## 📚 문서

- [시작하기.md](./시작하기.md) - 빠른 시작 가이드
- [자동배포가이드.md](./자동배포가이드.md) - 배포 가이드
- [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Google Sheets 설정
- [README_KO.md](./README_KO.md) - 전체 문서 (한국어)

## 🔧 개발

```bash
# 의존성 설치
npm install

# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 📝 라이선스

MIT License

## 🆘 지원

문제가 발생하면 문서를 참고하거나 이슈를 등록하세요.
