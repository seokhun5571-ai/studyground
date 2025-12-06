# 🎯 지금 해야 할 것!

## 현재 상황 확인

GitHub에 들어오셨다면, 다음 중 하나를 선택하세요:

---

## 📋 상황 1: GitHub 저장소를 아직 안 만들었다면

### 1단계: 저장소 생성 (30초)

1. **새 저장소 만들기** 버튼 클릭 (또는 https://github.com/new)
2. 저장소 이름: `studyground-mvp`
3. **"Initialize this repository with a README" 체크 해제** ⚠️
4. "Create repository" 클릭
5. 저장소 URL 복사 (예: `https://github.com/yourusername/studyground-mvp.git`)

### 2단계: 터미널에서 푸시 (1분)

터미널을 열고 아래 명령어 실행:

```bash
cd /Users/ronnie/studyground-mvp

# 저장소 URL을 YOUR_URL로 바꾸세요
git remote add origin YOUR_URL

# 푸시
git branch -M main
git push -u origin main
```

**또는 자동 스크립트 사용:**
```bash
./push-to-github.sh
```
저장소 URL을 물어보면 복사한 URL 입력

---

## 📋 상황 2: 이미 저장소를 만들었다면

### 바로 터미널에서 푸시!

터미널을 열고:

```bash
cd /Users/ronnie/studyground-mvp

# 저장소 URL 확인 (이미 설정되어 있다면)
git remote -v

# 저장소가 없다면 추가
git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git

# 푸시
git branch -M main
git push -u origin main
```

---

## ✅ 푸시 완료 후

GitHub에 코드가 올라갔다면:

### Railway 배포 (2분)

1. **Railway 가입**: https://railway.app
   - "Start a New Project" 클릭
   - "Login with GitHub" 클릭

2. **프로젝트 생성**
   - "Deploy from GitHub repo" 클릭
   - 방금 푸시한 `studyground-mvp` 저장소 선택
   - "Deploy Now" 클릭

3. **환경 변수 설정** (중요!)
   - 프로젝트 → "Variables" 탭
   - 다음 4개 추가:
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

4. **완료!** 🎉 2-3분 후 배포 완료

---

## 🆘 문제 해결

### "remote origin already exists" 오류
```bash
# 기존 원격 저장소 제거 후 다시 추가
git remote remove origin
git remote add origin YOUR_URL
```

### 푸시 인증 오류
- GitHub Personal Access Token 사용 필요
- 또는 SSH 키 설정

### 저장소 URL을 모르겠다면
- GitHub 저장소 페이지에서 초록색 "Code" 버튼 클릭
- URL 복사

---

## 📱 배포 완료 후

Railway에서 제공하는 URL로 접속:
- 태블릿: `https://your-url.railway.app/kiosk`
- 관리자: `https://your-url.railway.app/admin`

아이패드/휴대폰에서 Safari로 접속 → 공유 → "홈 화면에 추가" → 앱 설치 완료! 📱

---

**지금 터미널을 열고 위 명령어를 실행하세요!** 🚀

