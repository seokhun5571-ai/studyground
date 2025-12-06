# 🌐 스터디그라운드 MVP 배포 가이드

이 가이드는 스터디그라운드 시스템을 다른 컴퓨터나 기기에서 접근할 수 있도록 설정하는 방법을 설명합니다.

## 📋 목차

1. [로컬 네트워크 배포](#로컬-네트워크-배포)
2. [클라우드 배포 옵션](#클라우드-배포-옵션)
3. [방화벽 설정](#방화벽-설정)
4. [문제 해결](#문제-해결)

---

## 🏠 로컬 네트워크 배포

### 1. 기본 설정 (이미 완료됨)

시스템은 이미 네트워크 접근을 허용하도록 설정되어 있습니다:
- ✅ 서버가 `0.0.0.0`에서 수신 (모든 네트워크 인터페이스)
- ✅ Vite 개발 서버가 네트워크 접근 허용
- ✅ IP 주소 자동 감지 기능

### 2. 시스템 시작

```bash
./start-all.sh
```

시작 스크립트가 자동으로:
- 로컬 IP 주소를 감지합니다
- 로컬 및 네트워크 접속 주소를 표시합니다

### 3. 접속 방법

#### 이 컴퓨터에서 접속
- 태블릿 키오스크: `http://localhost:3000`
- 관리자 대시보드: `http://localhost:3001`

#### 다른 기기에서 접속 (같은 Wi-Fi 네트워크)
시작 스크립트가 표시한 IP 주소를 사용하세요:
- 태블릿 키오스크: `http://[IP주소]:3000`
- 관리자 대시보드: `http://[IP주소]:3001`

예시:
- `http://192.168.1.100:3000` (태블릿)
- `http://192.168.1.100:3001` (관리자)

### 4. IP 주소 확인 방법

시작 스크립트가 자동으로 IP를 표시하지만, 수동으로 확인하려면:

**macOS:**
```bash
ipconfig getifaddr en0
# 또는
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Linux:**
```bash
hostname -I
# 또는
ip addr show | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
# IPv4 주소 확인
```

---

## ☁️ 클라우드 배포 옵션

**🎯 아이패드, 휴대폰 등 어디서나 접근하려면 클라우드 배포가 필요합니다!**

**👉 상세한 클라우드 배포 가이드는 [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)를 참조하세요!**

로컬 네트워크 외부에서도 접근하려면 클라우드 서비스에 배포해야 합니다.

### 옵션 1: Railway (추천 - 간단함)

1. [Railway](https://railway.app)에 가입
2. GitHub 저장소 연결
3. 자동 배포 설정
4. 환경 변수 설정:
   - `PORT=5001`
   - `JWT_SECRET=your_secret_key`
   - `HOST=0.0.0.0`

### 옵션 2: Render

1. [Render](https://render.com)에 가입
2. 새 Web Service 생성
3. GitHub 저장소 연결
4. 빌드 명령: `npm install && cd client && npm install && cd ../admin && npm install`
5. 시작 명령: `npm start`

### 옵션 3: Heroku

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) 설치
2. Heroku 앱 생성:
   ```bash
   heroku create studyground-mvp
   ```
3. 환경 변수 설정:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   ```
4. 배포:
   ```bash
   git push heroku main
   ```

### 옵션 4: Vercel (프론트엔드) + Railway (백엔드)

- **프론트엔드**: Vercel에 배포 (무료)
- **백엔드**: Railway에 배포

---

## 🔥 방화벽 설정

### macOS

1. **시스템 설정** > **네트워크** > **방화벽**
2. **방화벽 옵션** 클릭
3. Node.js가 허용되어 있는지 확인
4. 또는 방화벽을 일시적으로 끄기 (개발용)

터미널에서 방화벽 상태 확인:
```bash
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

### Linux (UFW)

```bash
# 포트 열기
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 5001/tcp

# 방화벽 상태 확인
sudo ufw status
```

### Windows

1. **제어판** > **Windows Defender 방화벽**
2. **고급 설정**
3. **인바운드 규칙** > **새 규칙**
4. 포트 3000, 3001, 5001 허용

---

## 🐛 문제 해결

### 다른 기기에서 접속이 안 될 때

1. **같은 네트워크인지 확인**
   - 서버 컴퓨터와 클라이언트 기기가 같은 Wi-Fi에 연결되어 있어야 합니다

2. **IP 주소 확인**
   ```bash
   # 서버 컴퓨터에서 실행
   ./start-all.sh
   # 표시된 IP 주소 확인
   ```

3. **방화벽 확인**
   - 방화벽이 포트를 차단하지 않는지 확인
   - macOS: 시스템 설정 > 보안 및 개인 정보 보호 > 방화벽
   - Windows: Windows Defender 방화벽 설정

4. **포트 사용 중인지 확인**
   ```bash
   # macOS/Linux
   lsof -i :3000
   lsof -i :3001
   lsof -i :5001
   
   # Windows
   netstat -ano | findstr :3000
   ```

5. **서버 로그 확인**
   - 서버가 정상적으로 시작되었는지 확인
   - 에러 메시지가 있는지 확인

### CORS 오류가 발생할 때

서버의 `cors` 설정이 이미 모든 출처를 허용하도록 설정되어 있습니다. 
만약 문제가 발생하면 `server/server.js`의 CORS 설정을 확인하세요.

### 포트 충돌

다른 애플리케이션이 포트를 사용 중일 수 있습니다:
```bash
# 포트 사용 중인 프로세스 확인 및 종료
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

---

## 📱 태블릿/모바일 접속 팁

### 태블릿에서 접속

1. 태블릿을 같은 Wi-Fi 네트워크에 연결
2. 브라우저에서 `http://[서버IP]:3000` 접속
3. 홈 화면에 추가 (iOS: 공유 > 홈 화면에 추가, Android: 메뉴 > 홈 화면에 추가)

### 모바일에서 관리자 대시보드 접속

1. 모바일을 같은 Wi-Fi 네트워크에 연결
2. 브라우저에서 `http://[서버IP]:3001` 접속
3. 로그인 후 사용

---

## 🔒 보안 고려사항

### 개발 환경 (현재)

- 로컬 네트워크에서만 접근 가능
- 기본 관리자 계정 사용 (admin/admin1234)
- **프로덕션 환경에서는 반드시 비밀번호 변경 필요**

### 프로덕션 환경 권장사항

1. **HTTPS 사용** (Let's Encrypt 무료 인증서)
2. **강력한 비밀번호 설정**
3. **방화벽 규칙 설정** (필요한 IP만 허용)
4. **정기적인 백업**
5. **환경 변수 보안 관리**

---

## 📞 추가 도움말

문제가 계속되면:
1. 서버 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. 네트워크 연결 상태 확인
4. 방화벽 설정 재확인

---

**즐거운 배포 되세요!** 🚀

