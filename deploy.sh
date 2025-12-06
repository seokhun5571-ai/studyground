#!/bin/bash

# 스터디그라운드 자동 배포 스크립트

set -e

echo "🚀 스터디그라운드 클라우드 배포 시작!"
echo ""

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Git 상태 확인
echo -e "${BLUE}📦 Git 상태 확인 중...${NC}"
if [ -z "$(git remote -v)" ]; then
    echo -e "${YELLOW}⚠️  Git 원격 저장소가 설정되지 않았습니다.${NC}"
    echo ""
    echo "다음 단계를 따라주세요:"
    echo "1. GitHub에 새 저장소 생성: https://github.com/new"
    echo "2. 저장소 이름 입력 (예: studyground-mvp)"
    echo "3. 아래 명령어 실행:"
    echo ""
    echo "   git remote add origin https://github.com/YOUR_USERNAME/studyground-mvp.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    read -p "GitHub 저장소 URL을 입력하세요 (또는 Enter로 건너뛰기): " REPO_URL
    
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        git branch -M main
        echo -e "${GREEN}✅ 원격 저장소 설정 완료${NC}"
    else
        echo -e "${YELLOW}⚠️  원격 저장소 설정을 건너뜁니다.${NC}"
        echo "나중에 수동으로 설정하세요."
        exit 0
    fi
fi

# 2. 빌드 테스트
echo ""
echo -e "${BLUE}🔨 빌드 테스트 중...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ 빌드 성공!${NC}"
else
    echo -e "${YELLOW}⚠️  빌드 실패. 계속 진행합니다...${NC}"
fi

# 3. Git 푸시
echo ""
echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
git add .
if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Deploy: Update for cloud deployment" || true
fi

if git push origin main; then
    echo -e "${GREEN}✅ GitHub 푸시 완료!${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub 푸시 실패. 수동으로 푸시하세요.${NC}"
    echo "   git push origin main"
fi

# 4. Railway 배포 안내
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
echo "   - NODE_ENV=production"
echo "   - PORT=5001"
echo "   - JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo 'your_random_secret_here')"
echo "   - HOST=0.0.0.0"
echo ""
echo "6. 자동 배포 완료! 🎉"
echo ""
echo "배포된 URL로 접속:"
echo "  - 태블릿: https://your-url.railway.app/kiosk"
echo "  - 관리자: https://your-url.railway.app/admin"
echo ""
echo -e "${BLUE}💡 Railway CLI를 사용하려면:${NC}"
echo "   npm install -g @railway/cli"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""

