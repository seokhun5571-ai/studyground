#!/bin/bash

# 스터디그라운드 자동 배포 스크립트
# 이 스크립트는 배포를 위한 모든 준비를 자동으로 수행합니다.

set -e

echo "🚀 스터디그라운드 자동 배포 시작!"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 환경 변수 확인
echo -e "${BLUE}📋 환경 변수 확인 중...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. 생성합니다...${NC}"
    
    # JWT_SECRET 생성
    JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change_this_secret_key_$(date +%s)")
    
    cat > .env << EOF
# Google Sheets 설정
GOOGLE_SHEETS_ID=여기에_스프레드시트_ID_입력
GOOGLE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}

# 서버 설정
PORT=5001
HOST=0.0.0.0
NODE_ENV=production

# JWT 설정
JWT_SECRET=${JWT_SECRET}
EOF
    
    echo -e "${GREEN}✅ .env 파일 생성 완료${NC}"
    echo -e "${YELLOW}⚠️  .env 파일을 편집하여 Google Sheets 설정을 완료하세요!${NC}"
    echo ""
    echo "다음 단계:"
    echo "1. GOOGLE_SHEETS_SETUP.md 파일을 참고하여 Google Sheets 설정"
    echo "2. .env 파일에 GOOGLE_SHEETS_ID와 GOOGLE_SERVICE_ACCOUNT 입력"
    echo "3. 이 스크립트를 다시 실행"
    echo ""
    exit 0
fi

# 2. 의존성 설치
echo -e "${BLUE}📦 의존성 설치 중...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✅ 의존성 설치 완료${NC}"
else
    echo -e "${GREEN}✅ 의존성 이미 설치됨${NC}"
fi

# 3. 빌드
echo ""
echo -e "${BLUE}🔨 프로젝트 빌드 중...${NC}"
npm run build
echo -e "${GREEN}✅ 빌드 완료${NC}"

# 4. Git 상태 확인
echo ""
echo -e "${BLUE}📦 Git 상태 확인 중...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Git 저장소가 초기화되지 않았습니다.${NC}"
    git init
    git add .
    git commit -m "Initial commit: StudyGround MVP"
    echo -e "${GREEN}✅ Git 저장소 초기화 완료${NC}"
fi

# 5. GitHub 원격 저장소 확인
if [ -z "$(git remote -v)" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  GitHub 원격 저장소가 설정되지 않았습니다.${NC}"
    echo ""
    echo "다음 중 선택하세요:"
    echo "1) GitHub에 새 저장소 생성 후 URL 입력"
    echo "2) 나중에 수동으로 설정"
    echo ""
    read -p "선택 (1/2): " choice
    
    if [ "$choice" = "1" ]; then
        echo ""
        echo "GitHub에서 새 저장소를 생성하세요:"
        echo "1. https://github.com/new 접속"
        echo "2. 저장소 이름 입력 (예: studyground-mvp)"
        echo "3. 'Create repository' 클릭"
        echo ""
        read -p "GitHub 저장소 URL을 입력하세요: " REPO_URL
        
        if [ ! -z "$REPO_URL" ]; then
            git remote add origin "$REPO_URL"
            git branch -M main
            echo -e "${GREEN}✅ 원격 저장소 설정 완료${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  원격 저장소 설정을 건너뜁니다.${NC}"
    fi
fi

# 6. Git 커밋 및 푸시
if [ -n "$(git remote -v)" ]; then
    echo ""
    echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
    git add .
    
    if [ -n "$(git status --porcelain)" ]; then
        git commit -m "Deploy: Update for production deployment $(date +%Y-%m-%d)" || true
    fi
    
    if git push origin main 2>/dev/null; then
        echo -e "${GREEN}✅ GitHub 푸시 완료${NC}"
    else
        echo -e "${YELLOW}⚠️  GitHub 푸시 실패. 수동으로 푸시하세요:${NC}"
        echo "   git push origin main"
    fi
fi

# 7. Railway 배포 안내
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 배포 준비 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "다음 단계: Railway에 배포"
echo ""
echo "1. Railway 가입: https://railway.app"
echo "   (GitHub 계정으로 간단히 가입 가능)"
echo ""
echo "2. 'New Project' 클릭"
echo ""
echo "3. 'Deploy from GitHub repo' 선택"
echo ""
echo "4. 방금 푸시한 저장소 선택"
echo ""
echo "5. 환경 변수 설정 (Settings → Variables):"
echo ""
echo "   필수 환경 변수:"
echo "   - NODE_ENV=production"
echo "   - PORT=5001"
echo "   - HOST=0.0.0.0"
echo "   - JWT_SECRET=$(grep JWT_SECRET .env | cut -d '=' -f2)"
echo "   - GOOGLE_SHEETS_ID=<.env 파일에서 복사>"
echo "   - GOOGLE_SERVICE_ACCOUNT=<.env 파일에서 복사>"
echo ""
echo "6. 자동 배포 완료! 🎉"
echo ""
echo "배포된 URL로 접속:"
echo "  - 키오스크: https://your-app.railway.app/kiosk"
echo "  - 관리자: https://your-app.railway.app/admin"
echo "  - 공용 대시보드: https://your-app.railway.app/public"
echo ""
echo -e "${BLUE}💡 Railway CLI를 사용하려면:${NC}"
echo "   npm install -g @railway/cli"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
