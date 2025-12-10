# Google Sheets 연동 설정 가이드

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 1.2 Google Sheets API 활성화
1. "API 및 서비스" > "라이브러리" 메뉴로 이동
2. "Google Sheets API" 검색 후 활성화

### 1.3 서비스 계정 생성
1. "API 및 서비스" > "사용자 인증 정보" 메뉴로 이동
2. "사용자 인증 정보 만들기" > "서비스 계정" 선택
3. 서비스 계정 이름 입력 (예: `studyground-service`)
4. "만들기" 클릭
5. 역할은 선택하지 않고 "완료" 클릭

### 1.4 서비스 계정 키 생성
1. 생성된 서비스 계정 클릭
2. "키" 탭으로 이동
3. "키 추가" > "새 키 만들기" 선택
4. JSON 형식 선택 후 "만들기" 클릭
5. 다운로드된 JSON 파일을 안전하게 보관

## 2. Google Sheets 스프레드시트 생성

### 2.1 새 스프레드시트 생성
1. [Google Sheets](https://sheets.google.com/) 접속
2. 새 스프레드시트 생성
3. 스프레드시트 이름 설정 (예: "스터디그라운드 데이터")

### 2.2 스프레드시트 ID 확인
- URL에서 스프레드시트 ID 복사
- 예: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
- `SPREADSHEET_ID` 부분이 스프레드시트 ID입니다

### 2.3 서비스 계정에 편집 권한 부여
1. 스프레드시트에서 "공유" 버튼 클릭
2. 서비스 계정 이메일 주소 입력 (JSON 파일의 `client_email` 값)
3. "편집자" 권한 부여
4. "완료" 클릭

## 3. 환경 변수 설정

### 3.1 .env 파일 생성
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용 추가:

```env
# Google Sheets 설정
GOOGLE_SHEETS_ID=여기에_스프레드시트_ID_입력
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# 서버 설정
PORT=5001
HOST=0.0.0.0
NODE_ENV=production

# JWT 설정
JWT_SECRET=여기에_랜덤_문자열_입력
```

### 3.2 GOOGLE_SERVICE_ACCOUNT 설정
1. 다운로드한 JSON 파일을 열기
2. 전체 내용을 복사
3. `.env` 파일의 `GOOGLE_SERVICE_ACCOUNT` 값에 붙여넣기
4. 따옴표 안에 JSON 전체를 넣어야 합니다

### 3.3 JWT_SECRET 생성
터미널에서 다음 명령어 실행:
```bash
openssl rand -hex 32
```
생성된 값을 `JWT_SECRET`에 입력

## 4. 시트 자동 생성

서버를 처음 실행하면 다음 시트가 자동으로 생성됩니다:
- 학생
- 좌석
- 출석
- 관리자
- 학습목표
- 공지사항
- 리포트
- 설정

각 시트의 헤더도 자동으로 생성됩니다.

## 5. 초기 데이터 설정

### 5.1 관리자 계정 생성
서버 실행 후 관리자 계정은 기본적으로 생성됩니다:
- 사용자명: `admin`
- 비밀번호: `admin1234`

프로덕션 환경에서는 반드시 비밀번호를 변경하세요.

### 5.2 좌석 초기화
관리자 대시보드의 "설정" 탭에서 좌석을 초기화할 수 있습니다.

### 5.3 학생 등록
관리자 대시보드의 "학생관리" 탭에서 학생을 등록할 수 있습니다.

## 6. 문제 해결

### 인증 오류
- 서비스 계정 JSON 파일이 올바른지 확인
- 서비스 계정에 스프레드시트 편집 권한이 있는지 확인
- `GOOGLE_SERVICE_ACCOUNT` 환경 변수가 올바르게 설정되었는지 확인

### 시트를 찾을 수 없음
- `GOOGLE_SHEETS_ID`가 올바른지 확인
- 스프레드시트가 삭제되지 않았는지 확인
- 서비스 계정이 스프레드시트에 접근 권한이 있는지 확인

### 데이터가 저장되지 않음
- Google Sheets API가 활성화되었는지 확인
- 서비스 계정에 편집 권한이 있는지 확인
- 서버 로그에서 오류 메시지 확인

## 7. 보안 주의사항

1. **서비스 계정 JSON 파일을 절대 공개 저장소에 업로드하지 마세요**
2. `.env` 파일을 `.gitignore`에 추가하세요
3. 프로덕션 환경에서는 강력한 `JWT_SECRET`을 사용하세요
4. 정기적으로 서비스 계정 키를 갱신하세요
