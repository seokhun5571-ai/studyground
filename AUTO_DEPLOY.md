# 🚀 자동 배포 가이드

## ⚡ 빠른 배포 (3단계)

### 1단계: GitHub 저장소 생성

1. https://github.com/new 접속
2. 저장소 이름 입력: `studyground-mvp`
3. "Create repository" 클릭
4. 저장소 URL 복사 (예: `https://github.com/yourusername/studyground-mvp.git`)

### 2단계: 자동 배포 스크립트 실행

```bash
./deploy.sh
```

스크립트가 자동으로:
- ✅ Git 원격 저장소 설정
- ✅ 코드 빌드 테스트
- ✅ GitHub에 푸시

### 3단계: Railway 배포

1. **Railway 가입**: https://railway.app
   - GitHub 계정으로 간단히 가입

2. **프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 방금 푸시한 저장소 선택

3. **환경 변수 설정**
   - Settings → Variables 탭
   - 다음 변수 추가:
     ```
     NODE_ENV=production
     PORT=5001
     JWT_SECRET=랜덤_문자열_생성
     HOST=0.0.0.0
     ```
   - JWT_SECRET 생성:
     ```bash
     openssl rand -hex 32
     ```

4. **자동 배포 완료!** 🎉

5. **접속**
   - Railway가 제공하는 URL 확인
   - 태블릿: `https://your-url.railway.app/kiosk`
   - 관리자: `https://your-url.railway.app/admin`

---

## 📱 PWA 앱 설치

배포 후 아이패드/휴대폰에서:

1. Safari/Chrome으로 사이트 접속
2. 공유 버튼(⬆️) → "홈 화면에 추가"
3. 앱처럼 사용 가능! 📱

---

## 🔧 Railway CLI로 배포 (고급)

```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인
railway login

# 프로젝트 초기화
railway init

# 환경 변수 설정
railway variables set NODE_ENV=production
railway variables set PORT=5001
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set HOST=0.0.0.0

# 배포
railway up
```

---

## ✅ 배포 확인

배포 후 다음을 확인하세요:

- [ ] 태블릿 키오스크 접속 확인
- [ ] 관리자 대시보드 로그인 확인
- [ ] PIN으로 체크인/체크아웃 테스트
- [ ] PWA 설치 테스트 (아이패드/휴대폰)
- [ ] 다른 기기에서 접속 테스트

---

## 🐛 문제 해결

### 배포 실패

1. Railway 대시보드 → Logs 확인
2. 환경 변수 확인
3. 빌드 로그 확인

### 접속 안 됨

1. HTTPS URL 사용 확인
2. `/kiosk` 또는 `/admin` 경로 포함 확인
3. CORS 설정 확인

---

**더 자세한 가이드: [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)**

