# 🚀 GitHub 배포 가이드

## ✅ GitHub에 배포하기

### 1단계: GitHub 저장소 생성 및 푸시

#### GitHub 저장소 생성

1. https://github.com/new 접속
2. 저장소 이름: `studyground-mvp`
3. "Public" 또는 "Private" 선택
4. **"Initialize this repository with a README" 체크 해제** (이미 코드가 있으므로)
5. "Create repository" 클릭

#### 로컬 코드 푸시

터미널에서 실행:

```bash
cd /Users/ronnie/studyground-mvp

# 원격 저장소 추가 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git

# 또는 SSH 사용 (SSH 키가 설정되어 있다면)
# git remote add origin git@github.com:YOUR_USERNAME/studyground-mvp.git

# 브랜치 이름 확인 및 설정
git branch -M main

# 코드 푸시
git push -u origin main
```

---

### 2단계: Railway에 배포 (GitHub 연동)

#### Railway 가입 및 프로젝트 생성

1. **Railway 가입**
   - https://railway.app 접속
   - "Start a New Project" 클릭
   - "Login with GitHub" 클릭 (GitHub 계정으로 간단히 가입)

2. **GitHub 저장소 연결**
   - "Deploy from GitHub repo" 클릭
   - 방금 푸시한 `studyground-mvp` 저장소 선택
   - "Deploy Now" 클릭

3. **환경 변수 설정** (중요!)
   - 프로젝트 → "Variables" 탭 클릭
   - 다음 4개 변수 추가:
   
     ```
     NODE_ENV = production
     PORT = 5001
     JWT_SECRET = (아래 명령어로 생성)
     HOST = 0.0.0.0
     ```
   
   - JWT_SECRET 생성 (터미널에서):
     ```bash
     openssl rand -hex 32
     ```
     생성된 값을 복사해서 Railway에 입력

4. **자동 배포 완료!** 🎉
   - Railway가 자동으로 배포 시작
   - GitHub에 푸시할 때마다 자동으로 재배포됨!

---

### 3단계: 접속!

Railway 대시보드에서 배포된 URL 확인:
- **태블릿 키오스크**: `https://your-url.railway.app/kiosk`
- **관리자 대시보드**: `https://your-url.railway.app/admin`

---

## 🔄 자동 배포 설정

GitHub에 푸시할 때마다 자동으로 재배포되도록 설정되어 있습니다!

### 코드 수정 후 재배포

```bash
# 코드 수정 후
git add .
git commit -m "Update: 변경사항"
git push origin main
```

Railway가 자동으로 감지하고 재배포합니다!

---

## 📱 PWA 앱 설치

배포 후 아이패드/휴대폰에서:

1. Safari/Chrome으로 배포된 URL 접속
2. 공유 버튼(⬆️) → "홈 화면에 추가"
3. 앱처럼 사용 가능! 📱

---

## 🆘 문제 해결

### Git 푸시 실패

**인증 오류:**
```bash
# GitHub Personal Access Token 사용
# 1. https://github.com/settings/tokens 접속
# 2. "Generate new token" 클릭
# 3. 권한 선택: repo (전체)
# 4. 토큰 복사
# 5. 푸시 시 비밀번호 대신 토큰 사용
```

**또는 SSH 키 사용:**
```bash
# SSH 키 생성 (없는 경우)
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub에 추가
# 1. ~/.ssh/id_ed25519.pub 파일 내용 복사
# 2. https://github.com/settings/keys 접속
# 3. "New SSH key" 클릭하여 추가

# SSH URL로 원격 저장소 변경
git remote set-url origin git@github.com:YOUR_USERNAME/studyground-mvp.git
```

### Railway 배포 실패

1. Railway 대시보드 → "Logs" 탭에서 에러 확인
2. 환경 변수 확인 (모두 설정되었는지)
3. 빌드 로그 확인

---

## ✅ 체크리스트

- [ ] GitHub 저장소 생성
- [ ] 코드 푸시 완료
- [ ] Railway 가입 및 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] 배포 완료 확인
- [ ] 접속 테스트
- [ ] PWA 설치 테스트

---

**준비 완료! GitHub에 푸시하고 Railway에 연결하면 끝입니다!** 🚀

