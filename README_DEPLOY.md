# 🚀 GitHub 배포 - 빠른 시작

## ⚡ 3단계로 완료!

### 1단계: GitHub 저장소 생성 (1분)

1. https://github.com/new 접속
2. 저장소 이름: `studyground-mvp`
3. **"Initialize this repository with a README" 체크 해제**
4. "Create repository" 클릭
5. 저장소 URL 복사 (예: `https://github.com/yourusername/studyground-mvp.git`)

### 2단계: GitHub에 푸시 (1분)

**방법 A: 자동 스크립트 사용**
```bash
./push-to-github.sh
```
스크립트가 저장소 URL을 물어보면 위에서 복사한 URL 입력

**방법 B: 수동 푸시**
```bash
# 원격 저장소 추가 (YOUR_USERNAME을 실제 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git

# 푸시
git branch -M main
git push -u origin main
```

### 3단계: Railway 배포 (2분)

1. **Railway 가입**: https://railway.app
   - "Login with GitHub" 클릭

2. **프로젝트 생성**
   - "New Project" → "Deploy from GitHub repo"
   - 방금 푸시한 `studyground-mvp` 선택

3. **환경 변수 설정** (Settings → Variables):
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=(터미널에서 openssl rand -hex 32 실행한 값)
   HOST=0.0.0.0
   ```

4. **완료!** 🎉 자동 배포 시작

---

## 📱 접속

Railway 대시보드에서 URL 확인:
- 태블릿: `https://your-url.railway.app/kiosk`
- 관리자: `https://your-url.railway.app/admin`

---

## 🔄 자동 재배포

이제 GitHub에 푸시할 때마다 자동으로 재배포됩니다!

```bash
git add .
git commit -m "Update"
git push origin main
```

---

**더 자세한 가이드: [GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md)**

