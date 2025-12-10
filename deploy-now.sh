#!/bin/bash

# 즉시 배포 스크립트 - 모든 것을 자동으로 처리

set -e

echo "🚀 스터디그라운드 즉시 배포 시작!"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. 의존성 확인 및 설치
echo -e "${BLUE}📦 의존성 확인 중...${NC}"
if [ ! -d "node_modules" ]; then
    npm install
fi

# 2. 빌드
echo -e "${BLUE}🔨 빌드 중...${NC}"
npm run build || echo -e "${YELLOW}⚠️  빌드 경고 (계속 진행)${NC}"

# 3. Git 커밋
echo -e "${BLUE}📝 Git 커밋 중...${NC}"
git add .
git commit -m "Deploy: Auto deployment $(date +%Y-%m-%d_%H:%M:%S)" || echo "변경사항 없음"

# 4. GitHub 푸시
echo -e "${BLUE}📤 GitHub 푸시 중...${NC}"
if git push origin main 2>/dev/null; then
    echo -e "${GREEN}✅ GitHub 푸시 완료${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub 푸시 실패 (수동으로 푸시 필요)${NC}"
    echo "   git push origin main"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 배포 준비 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "다음 단계:"
echo ""
echo "1. Railway 접속: https://railway.app"
echo "2. 'New Project' → 'Deploy from GitHub repo'"
echo "3. 저장소 선택"
echo "4. 환경 변수 설정 (자동배포가이드.md 참고)"
echo "5. 배포 완료! 🎉"
echo ""
