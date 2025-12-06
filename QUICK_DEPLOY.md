# ⚡ 빠른 배포 가이드

## 🎯 목표: 아이패드, 휴대폰, 노트북 어디서나 접근!

### 방법 1: 클라우드 배포 (추천 ⭐)

**5분 안에 완료!**

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # GitHub에 새 저장소 생성 후
   git remote add origin https://github.com/yourusername/studyground-mvp.git
   git push -u origin main
   ```

2. **Railway 배포**
   - [railway.app](https://railway.app) 가입 (GitHub 계정으로)
   - "New Project" → "Deploy from GitHub repo"
   - 저장소 선택
   - 환경 변수 설정:
     ```
     NODE_ENV=production
     PORT=5001
     JWT_SECRET=랜덤_문자열
     HOST=0.0.0.0
     ```
   - 자동 배포 완료! 🎉

3. **접속**
   - Railway가 제공하는 URL로 접속
   - 태블릿: `https://your-url.railway.app/kiosk`
   - 관리자: `https://your-url.railway.app/admin`

4. **PWA 설치 (아이패드/휴대폰)**
   - Safari/Chrome에서 사이트 접속
   - 공유 버튼 → "홈 화면에 추가"
   - 앱처럼 사용 가능! 📱

**👉 상세 가이드: [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)**

---

### 방법 2: 로컬 네트워크 (같은 Wi-Fi)

**즉시 사용 가능!**

```bash
./start-all.sh
```

터미널에 표시된 IP 주소로 다른 기기에서 접속:
- 태블릿: `http://[IP주소]:3000`
- 관리자: `http://[IP주소]:3001`

**👉 상세 가이드: [DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 📱 PWA 앱 설치 방법

### iOS (아이패드/아이폰)
1. Safari에서 사이트 접속
2. 공유(⬆️) → "홈 화면에 추가"
3. 완료! 홈 화면에 앱 아이콘 생성

### Android
1. Chrome에서 사이트 접속
2. 메뉴(⋮) → "홈 화면에 추가"
3. 완료! 홈 화면에 앱 아이콘 생성

---

## ✅ 체크리스트

- [ ] 클라우드 배포 또는 로컬 네트워크 설정
- [ ] 태블릿 키오스크 접속 확인
- [ ] 관리자 대시보드 로그인 확인
- [ ] PWA 설치 테스트 (아이패드/휴대폰)
- [ ] 다른 기기에서 접속 테스트

---

**문제가 있으면?**
- [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) - 클라우드 배포 상세 가이드
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 로컬 네트워크 배포 가이드

