 # 스터디그라운드 MVP 설치 가이드

## 1. 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js** (v16 이상): https://nodejs.org/
- **PostgreSQL** (v12 이상): https://www.postgresql.org/download/
- **npm** 또는 **yarn**

## 2. 설치 단계

### 2.1 PostgreSQL 데이터베이스 생성

터미널을 열고 다음 명령어를 실행하세요:

```bash
# PostgreSQL에 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE studyground;

# 종료
\q
```

### 2.2 데이터베이스 스키마 생성

```bash
cd /Users/ronnie/studyground-mvp
psql -U postgres -d studyground -f database/schema.sql
```

### 2.3 초기 데이터 입력

```bash
psql -U postgres -d studyground -f database/seed.sql
```

### 2.4 환경 변수 설정

`.env` 파일을 생성하고 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일을 편집하여 데이터베이스 비밀번호를 설정하세요:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=studyground
DB_USER=postgres
DB_PASSWORD=여기에_실제_비밀번호_입력
JWT_SECRET=랜덤한_긴_문자열_입력
PORT=5000
```

### 2.5 백엔드 의존성 설치

```bash
npm install
```

### 2.6 클라이언트 (태블릿 키오스크) 의존성 설치

```bash
cd client
npm install
cd ..
```

### 2.7 관리자 대시보드 의존성 설치

```bash
cd admin
npm install
cd ..
```

## 3. 실행

### 3.1 백엔드 서버 실행

터미널 1:
```bash
npm run dev
```

서버가 http://localhost:5000 에서 실행됩니다.

### 3.2 태블릿 키오스크 실행

터미널 2:
```bash
cd client
npm run dev
```

키오스크가 http://localhost:3000 에서 실행됩니다.

### 3.3 관리자 대시보드 실행

터미널 3:
```bash
cd admin
npm run dev
```

관리자 대시보드가 http://localhost:3001 에서 실행됩니다.

## 4. 기본 계정 정보

### 관리자 로그인
- URL: http://localhost:3001
- 아이디: `admin`
- 비밀번호: `admin1234`

### 테스트 학생 PIN
- 김철수: `1234`
- 이영희: `5678`
- 박민수: `9012`

## 5. 사용 방법

### 5.1 태블릿 키오스크 (학생용)
1.  접속
2. PIN 번호 입력
3. 체크인/체크아웃 자동 처리

### 5.2 관리자 대시보드
1. http://localhost:3001 접속
2. 관리자 계정으로 로그인
3. 대시보드에서 실시간 현황 확인
4. 학생 관리 메뉴에서 학생 등록/수정/삭제
5. 좌석 관리 메뉴에서 좌석 현황 확인

## 6. 문제 해결

### 데이터베이스 연결 오류
- PostgreSQL이 실행 중인지 확인
- `.env` 파일의 데이터베이스 설정 확인
- 데이터베이스 이름과 사용자 권한 확인

### 포트 충돌
- 다른 애플리케이션이 5000, 3000, 3001 포트를 사용 중인지 확인
- 필요시 `.env` 파일과 vite.config.js에서 포트 변경

### 의존성 설치 오류
```bash
# npm 캐시 삭제 후 재설치
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 7. 프로덕션 배포

### 7.1 프론트엔드 빌드

```bash
# 클라이언트 빌드
cd client
npm run build

# 관리자 대시보드 빌드
cd ../admin
npm run build
```

### 7.2 백엔드 실행

```bash
cd ..
NODE_ENV=production npm start
```

## 8. 보안 주의사항

프로덕션 환경에서는 반드시:
1. `.env` 파일의 `JWT_SECRET`을 강력한 랜덤 문자열로 변경
2. 관리자 비밀번호 변경
3. HTTPS 사용
4. 데이터베이스 백업 설정
5. 방화벽 설정

## 9. 지원

문제가 발생하면 다음을 확인하세요:
- README.md 파일
- 서버 로그 (터미널 출력)
- 브라우저 개발자 도구 콘솔

