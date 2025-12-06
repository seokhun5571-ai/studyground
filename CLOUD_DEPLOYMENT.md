# ☁️ 클라우드 배포 가이드 - 어디서나 접근 가능!

이 가이드는 스터디그라운드를 클라우드에 배포하여 **아이패드, 휴대폰, 노트북 등 어떤 기기에서도 인터넷만 있으면 접근**할 수 있도록 하는 방법을 설명합니다.

## 🎯 배포 옵션

### 1. Railway (추천 ⭐ - 가장 간단)
- 무료 플랜 제공
- 자동 HTTPS
- GitHub 연동으로 자동 배포
- 5분 안에 배포 완료

### 2. Render
- 무료 플랜 제공
- 자동 HTTPS
- 간단한 설정

### 3. Heroku
- 무료 플랜 제한적
- 안정적이고 검증된 플랫폼

---

## 🚀 Railway로 배포하기 (추천)

### 1단계: GitHub에 코드 업로드

```bash
# Git 저장소 초기화 (아직 안 했다면)
cd /Users/ronnie/studyground-mvp
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/yourusername/studyground-mvp.git
git push -u origin main
```

### 2단계: Railway 가입 및 프로젝트 생성

1. [Railway](https://railway.app)에 가입 (GitHub 계정으로 간단히 가입)
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 방금 만든 저장소 선택

### 3단계: 환경 변수 설정

Railway 대시보드에서 "Variables" 탭으로 이동하여 다음 환경 변수 추가:

```
NODE_ENV=production
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here_change_this
HOST=0.0.0.0
```

**⚠️ 중요**: `JWT_SECRET`은 반드시 강력한 랜덤 문자열로 변경하세요!

### 4단계: 빌드 및 배포

Railway가 자동으로:
1. 코드를 감지
2. `npm install` 실행
3. `npm run build` 실행 (프론트엔드 빌드)
4. `npm start` 실행 (서버 시작)

### 5단계: 도메인 확인

배포가 완료되면 Railway가 자동으로 HTTPS URL을 제공합니다:
- 예: `https://studyground-mvp-production.up.railway.app`

### 6단계: 접속!

배포된 URL로 접속:
- **태블릿 키오스크**: `https://your-url.railway.app/kiosk`
- **관리자 대시보드**: `https://your-url.railway.app/admin`

---

## 📱 PWA 앱으로 설치하기

### iOS (아이패드/아이폰)

1. Safari 브라우저에서 사이트 접속
2. 공유 버튼(⬆️) 클릭
3. "홈 화면에 추가" 선택
4. 앱 이름 확인 후 "추가" 클릭
5. 홈 화면에 앱 아이콘 생성 완료! 🎉

### Android

1. Chrome 브라우저에서 사이트 접속
2. 메뉴(⋮) 클릭
3. "홈 화면에 추가" 또는 "앱 설치" 선택
4. 홈 화면에 앱 아이콘 생성 완료! 🎉

### 설치 후 사용

- 앱처럼 실행됨 (브라우저 주소창 없음)
- 오프라인에서도 일부 기능 사용 가능
- 자동 업데이트 (새 버전 배포 시)

---

## 🔧 Render로 배포하기

### 1단계: Render 가입

[Render](https://render.com)에 가입

### 2단계: 새 Web Service 생성

1. "New +" 클릭 → "Web Service" 선택
2. GitHub 저장소 연결
3. 설정:
   - **Name**: `studyground-mvp`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3단계: 환경 변수 설정

"Environment" 섹션에서:
```
NODE_ENV=production
PORT=5001
JWT_SECRET=your_secret_key
HOST=0.0.0.0
```

### 4단계: 배포

"Create Web Service" 클릭하면 자동 배포 시작!

---

## 🎨 커스텀 도메인 설정 (선택사항)

### Railway

1. Railway 대시보드 → 프로젝트 선택
2. "Settings" → "Domains"
3. "Custom Domain" 추가
4. DNS 설정 (Railway가 안내)

### Render

1. Render 대시보드 → 서비스 선택
2. "Settings" → "Custom Domains"
3. 도메인 추가 및 DNS 설정

---

## 🔒 보안 설정

### 1. 강력한 JWT_SECRET 사용

```bash
# 랜덤 시크릿 생성 (터미널에서)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. 관리자 비밀번호 변경

배포 후 첫 로그인 시:
- 기본 계정: `admin` / `admin1234`
- **반드시 비밀번호 변경 권장**

### 3. HTTPS 사용

Railway와 Render는 자동으로 HTTPS를 제공합니다.

---

## 📊 배포 후 확인사항

### ✅ 체크리스트

- [ ] 태블릿 키오스크 접속 확인
- [ ] 관리자 대시보드 로그인 확인
- [ ] PIN으로 체크인/체크아웃 테스트
- [ ] PWA 설치 테스트 (아이패드/휴대폰)
- [ ] 다른 기기에서 접속 테스트

---

## 🐛 문제 해결

### 배포 실패

1. **빌드 로그 확인**
   - Railway/Render 대시보드에서 "Logs" 확인
   - 에러 메시지 확인

2. **환경 변수 확인**
   - 모든 필수 환경 변수가 설정되었는지 확인
   - `JWT_SECRET`이 설정되었는지 확인

3. **포트 확인**
   - `PORT` 환경 변수가 설정되었는지 확인
   - Railway/Render는 자동으로 `PORT` 환경 변수를 제공

### 접속이 안 될 때

1. **URL 확인**
   - HTTPS를 사용하는지 확인
   - `/kiosk` 또는 `/admin` 경로 포함 확인

2. **CORS 오류**
   - 서버의 CORS 설정이 모든 출처를 허용하는지 확인

3. **데이터베이스 오류**
   - SQLite 파일이 제대로 포함되었는지 확인
   - Railway/Render는 영구 볼륨이 필요할 수 있음

---

## 💰 비용

### Railway
- **무료 플랜**: 월 $5 크레딧 (소규모 사용 충분)
- **Pro 플랜**: $20/월

### Render
- **무료 플랜**: 제공 (일부 제한)
- **Starter**: $7/월

### 예상 비용
- **소규모 사용**: 무료 플랜으로 충분
- **중규모 사용**: 월 $5-20

---

## 🚀 다음 단계

배포 완료 후:

1. ✅ **PWA 설치 테스트** (아이패드, 휴대폰)
2. ✅ **다른 기기에서 접속 테스트**
3. ✅ **관리자 비밀번호 변경**
4. ✅ **실제 학생 데이터 등록**
5. ✅ **커스텀 도메인 설정** (선택)

---

## 📞 도움말

문제가 발생하면:
1. Railway/Render 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. GitHub Issues에 문의

---

**축하합니다! 이제 어디서나 접근 가능한 스터디그라운드가 준비되었습니다!** 🎉

