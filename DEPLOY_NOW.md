# 🚀 지금 바로 배포하기!

## ⚡ 3분 안에 완료!

### 방법 1: 자동 스크립트 (추천)

```bash
./deploy.sh
```

스크립트가 자동으로 GitHub에 푸시하고 Railway 배포 안내를 제공합니다!

---

### 방법 2: 수동 배포

#### 1. GitHub 저장소 생성

1. https://github.com/new 접속
2. 저장소 이름: `studyground-mvp`
3. "Create repository" 클릭
4. 저장소 URL 복사

#### 2. GitHub에 푸시

```bash
git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git
git branch -M main
git push -u origin main
```

#### 3. Railway 배포

1. **가입**: https://railway.app (GitHub 계정으로)
2. **프로젝트 생성**: "New Project" → "Deploy from GitHub repo"
3. **저장소 선택**: 방금 푸시한 저장소
4. **환경 변수 설정** (Settings → Variables):
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=랜덤문자열
   HOST=0.0.0.0
   ```
   JWT_SECRET 생성:
   ```bash
   openssl rand -hex 32
   ```
5. **완료!** 🎉 자동 배포 시작

#### 4. 접속

Railway가 제공하는 URL로 접속:
- 태블릿: `https://your-url.railway.app/kiosk`
- 관리자: `https://your-url.railway.app/admin`

---

## 📱 앱 설치 (아이패드/휴대폰)

1. Safari/Chrome에서 사이트 접속
2. 공유(⬆️) → "홈 화면에 추가"
3. 완료! 앱처럼 사용 가능

---

## ✅ 확인사항

배포 후:
- [ ] 태블릿 키오스크 접속
- [ ] 관리자 대시보드 로그인 (admin/admin1234)
- [ ] PIN 체크인/체크아웃 테스트
- [ ] PWA 설치 테스트

---

**문제가 있으면?** [AUTO_DEPLOY.md](./AUTO_DEPLOY.md) 참조

