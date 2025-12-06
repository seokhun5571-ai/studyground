# 🎉 스터디그라운드 MVP 시스템에 오신 것을 환영합니다!

## ⚡ 5분 만에 시작하기

### 1️⃣ 환경 변수 설정
```bash
cd /Users/ronnie/studyground-mvp
cp .env.example .env
nano .env  # 또는 원하는 에디터로 열기
```

다음 항목을 수정하세요:
```
DB_PASSWORD=your_postgres_password
JWT_SECRET=random_secret_key_here
```

### 2️⃣ 데이터베이스 설정
```bash
./setup-db.sh
```

### 3️⃣ 의존성 설치
```bash
npm install
cd client && npm install && cd ..
cd admin && npm install && cd ..
```

### 4️⃣ 실행!
```bash
./start-all.sh
```

## 🌐 접속하기

### 이 컴퓨터에서 접속

브라우저에서 다음 주소로 접속하세요:

#### 태블릿 키오스크 (학생용)
**http://localhost:3000**
- PIN 입력: `1234`, `5678`, `9012` (테스트용)

#### 관리자 대시보드
**http://localhost:3001**
- 아이디: `admin`
- 비밀번호: `admin1234`

### 다른 기기에서 접속하기 (네트워크 공유)

시스템이 시작되면 터미널에 네트워크 접속 주소가 표시됩니다!

1. **같은 Wi-Fi 네트워크에 연결**
   - 서버 컴퓨터와 접속할 기기가 같은 Wi-Fi에 연결되어 있어야 합니다

2. **표시된 IP 주소 사용**
   - 시작 스크립트가 자동으로 IP 주소를 감지하여 표시합니다
   - 예: `http://192.168.1.100:3000` (태블릿)
   - 예: `http://192.168.1.100:3001` (관리자)

3. **상세한 배포 가이드는 `DEPLOYMENT.md` 참조**

## 📚 문서

- **QUICKSTART.md** - 빠른 시작 가이드
- **INSTALL.md** - 상세 설치 가이드
- **README.md** - 프로젝트 개요 및 API 문서
- **PROJECT_SUMMARY.md** - 프로젝트 전체 요약
- **DEPLOYMENT.md** - 로컬 네트워크 배포 가이드
- **CLOUD_DEPLOYMENT.md** - 클라우드 배포 가이드 (아이패드/휴대폰 접근) ⭐⭐

## 🎯 주요 기능

### 태블릿 키오스크
✅ PIN 번호로 간편 체크인/체크아웃
✅ 자동 좌석 배정
✅ 학습 시간 자동 계산
✅ 공지사항 표시

### 관리자 대시보드
✅ 실시간 출석 현황
✅ 학생 관리 (등록/수정/삭제)
✅ 좌석 현황 시각화
✅ 통계 및 분석

## 🔧 기술 스택

- **백엔드**: Node.js + Express + PostgreSQL
- **프론트엔드**: React + Tailwind CSS + Vite
- **인증**: JWT + bcrypt

## 💡 사용 흐름

1. 학생이 **태블릿 키오스크**에서 PIN 입력
2. 시스템이 자동으로 좌석 배정 및 체크인
3. 관리자는 **대시보드**에서 실시간 현황 확인
4. 학생이 퇴실 시 다시 PIN 입력하여 체크아웃
5. 학습 시간이 자동으로 기록됨

## 🆘 문제 해결

### PostgreSQL 연결 오류
```bash
# PostgreSQL 시작
brew services start postgresql
```

### 포트 충돌
```bash
# 사용 중인 포트 확인
lsof -i :5001
lsof -i :3000
lsof -i :3001
```

### 의존성 오류
```bash
# 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 지원

문제가 발생하면:
1. 터미널 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. 문서 참조 (INSTALL.md, README.md)

## 🎊 다음 단계

1. ✅ 시스템 실행 및 테스트
2. 📝 실제 학생 데이터 등록
3. 🎨 UI 커스터마이징
4. 🚀 **프로덕션 배포** (아이패드/휴대폰 접근)
   - **빠른 가이드**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) ⚡
   - **클라우드 배포**: [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) ☁️
   - **로컬 네트워크**: [DEPLOYMENT.md](./DEPLOYMENT.md) 🏠

---

**즐거운 개발 되세요!** 🚀

문의사항이 있으시면 언제든지 이슈를 등록해주세요.
