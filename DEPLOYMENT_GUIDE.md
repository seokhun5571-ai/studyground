# 배포 가이드

## Railway 배포 (권장)

### 1단계: GitHub 저장소 준비

```bash
# Git 저장소 초기화 (이미 되어 있다면 건너뛰기)
git init
git add .
git commit -m "Initial commit"

# GitHub에 새 저장소 생성 후
git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git
git branch -M main
git push -u origin main
```

### 2단계: Railway 프로젝트 생성

1. [Railway](https://railway.app) 접속
2. "Start a New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 방금 푸시한 저장소 선택
5. "Deploy Now" 클릭

### 3단계: 환경 변수 설정

Railway 대시보드에서 "Variables" 탭으로 이동하여 다음 변수들을 추가:

```env
NODE_ENV=production
PORT=5001
HOST=0.0.0.0
JWT_SECRET=<openssl rand -hex 32로 생성한 값>
GOOGLE_SHEETS_ID=<스프레드시트 ID>
GOOGLE_SERVICE_ACCOUNT=<서비스 계정 JSON 전체>
```

**JWT_SECRET 생성 방법:**
```bash
openssl rand -hex 32
```

**GOOGLE_SERVICE_ACCOUNT 설정:**
- 서비스 계정 JSON 파일의 전체 내용을 복사
- 따옴표 안에 넣어서 설정
- 예: `{"type":"service_account",...}`

### 4단계: 배포 확인

1. Railway 대시보드에서 "Settings" > "Domains" 확인
2. 생성된 URL로 접속 테스트:
   - 키오스크: `https://your-app.railway.app/kiosk`
   - 관리자: `https://your-app.railway.app/admin`
   - 공용 대시보드: `https://your-app.railway.app/public`

### 5단계: 커스텀 도메인 설정 (선택사항)

1. Railway 대시보드 > Settings > Domains
2. "Custom Domain" 추가
3. DNS 설정 안내에 따라 도메인 연결

## Vercel 배포

### 1단계: Vercel 프로젝트 생성

```bash
npm install -g vercel
vercel login
vercel
```

### 2단계: 환경 변수 설정

Vercel 대시보드에서 환경 변수 설정:
- Project Settings > Environment Variables

### 3단계: 빌드 설정

`vercel.json` 파일 생성:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/server-new.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server-new.js"
    },
    {
      "src": "/kiosk/(.*)",
      "dest": "client/dist/$1"
    },
    {
      "src": "/admin/(.*)",
      "dest": "admin/dist/$1"
    },
    {
      "src": "/public/(.*)",
      "dest": "public-dashboard/dist/$1"
    }
  ]
}
```

## Heroku 배포

### 1단계: Heroku CLI 설치 및 로그인

```bash
heroku login
heroku create studyground-mvp
```

### 2단계: 환경 변수 설정

```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5001
heroku config:set JWT_SECRET=<생성한 값>
heroku config:set GOOGLE_SHEETS_ID=<스프레드시트 ID>
heroku config:set GOOGLE_SERVICE_ACCOUNT='<JSON 전체>'
```

### 3단계: 배포

```bash
git push heroku main
```

## Docker 배포

### Dockerfile 생성

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]
```

### 빌드 및 실행

```bash
docker build -t studyground-mvp .
docker run -p 5001:5001 --env-file .env studyground-mvp
```

## 로컬 프로덕션 테스트

```bash
# 빌드
npm run build

# 환경 변수 설정
export NODE_ENV=production
export PORT=5001
export JWT_SECRET=<생성한 값>
export GOOGLE_SHEETS_ID=<스프레드시트 ID>
export GOOGLE_SERVICE_ACCOUNT='<JSON 전체>'

# 실행
npm start
```

## 배포 후 확인사항

1. ✅ 모든 환경 변수가 올바르게 설정되었는지 확인
2. ✅ Google Sheets 접근 권한 확인
3. ✅ 관리자 계정 로그인 테스트
4. ✅ 키오스크 입퇴실 기능 테스트
5. ✅ 공용 대시보드 실시간 업데이트 확인
6. ✅ HTTPS 연결 확인 (프로덕션 환경)

## 문제 해결

### 빌드 실패
- Node.js 버전 확인 (v16 이상 필요)
- 의존성 설치 오류 확인
- 빌드 로그 확인

### 런타임 오류
- 환경 변수 확인
- Google Sheets 권한 확인
- 서버 로그 확인

### 접속 불가
- 포트 설정 확인
- 방화벽 설정 확인
- 도메인/DNS 설정 확인

## 성능 최적화

1. **캐싱**: 자주 조회되는 데이터는 메모리 캐싱 고려
2. **배치 처리**: Google Sheets API 호출 최소화
3. **CDN**: 정적 파일은 CDN 사용 고려
4. **모니터링**: 서버 상태 모니터링 도구 사용

## 보안 체크리스트

- [ ] 강력한 JWT_SECRET 사용
- [ ] 관리자 비밀번호 변경
- [ ] HTTPS 사용
- [ ] 환경 변수 보호 (.env 파일 공개 금지)
- [ ] 서비스 계정 키 보호
- [ ] 정기적인 보안 업데이트
- [ ] 로그 모니터링
