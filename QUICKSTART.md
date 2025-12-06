# 🚀 빠른 시작 가이드

## 5분 안에 시작하기

### 1단계: 환경 변수 설정 (1분)

```bash
cd /Users/ronnie/studyground-mvp
cp .env.example .env
```

`.env` 파일을 열어서 PostgreSQL 비밀번호를 설정하세요:
```
DB_PASSWORD=your_postgres_password
JWT_SECRET=my_secret_key_12345
```

### 2단계: 데이터베이스 설정 (2분)

```bash
./setup-db.sh
```

### 3단계: 의존성 설치 (2분)

```bash
# 백엔드
npm install

# 클라이언트
cd client && npm install && cd ..

# 관리자
cd admin && npm install && cd ..
```

### 4단계: 실행! (즉시)

```bash
./start-all.sh
```

## 접속 주소

- **태블릿 키오스크**: http://localhost:3000
- **관리자 대시보드**: http://localhost:3001
- **백엔드 API**: http://localhost:5000

## 기본 계정

### 관리자
- 아이디: `admin`
- 비밀번호: `admin1234`

### 테스트 학생 PIN
- `1234` (김철수)
- `5678` (이영희)
- `9012` (박민수)

## 사용 흐름

1. **태블릿 키오스크**에서 PIN 입력 → 체크인
2. **관리자 대시보드**에서 실시간 현황 확인
3. 다시 **태블릿 키오스크**에서 같은 PIN 입력 → 체크아웃

## 문제 해결

### PostgreSQL 연결 오류
```bash
# PostgreSQL 서비스 시작
brew services start postgresql
# 또는
pg_ctl -D /usr/local/var/postgres start
```

### 포트 이미 사용 중
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :5000
lsof -i :3000
lsof -i :3001

# 프로세스 종료
kill -9 [PID]
```

### 의존성 설치 오류
```bash
# 캐시 정리 후 재설치
rm -rf node_modules package-lock.json
npm install
```

## 다음 단계

- 📖 자세한 내용은 `INSTALL.md` 참조
- 📚 API 문서는 `README.md` 참조
- 🔧 커스터마이징은 각 디렉토리의 소스 코드 참조

## 지원

문제가 발생하면:
1. 터미널 로그 확인
2. 브라우저 개발자 도구 콘솔 확인
3. PostgreSQL 상태 확인

즐거운 개발 되세요! 🎉
