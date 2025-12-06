#!/bin/bash

# GitHub에 푸시하는 스크립트

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📤 GitHub 푸시 준비${NC}"
echo ""

# 원격 저장소 확인
if [ -z "$(git remote -v)" ]; then
    echo -e "${YELLOW}⚠️  원격 저장소가 설정되지 않았습니다.${NC}"
    echo ""
    echo "GitHub 저장소를 먼저 생성하세요:"
    echo "  1. https://github.com/new 접속"
    echo "  2. 저장소 이름: studyground-mvp"
    echo "  3. 'Create repository' 클릭"
    echo ""
    read -p "GitHub 저장소 URL을 입력하세요: " REPO_URL
    
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo -e "${GREEN}✅ 원격 저장소 설정 완료${NC}"
    else
        echo -e "${YELLOW}⚠️  저장소 URL이 필요합니다.${NC}"
        exit 1
    fi
fi

# 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${BLUE}🔄 브랜치를 main으로 변경 중...${NC}"
    git branch -M main
fi

# 변경사항 커밋
echo ""
echo -e "${BLUE}📝 변경사항 확인 중...${NC}"
git add .

if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Update: Prepare for deployment"
    echo -e "${GREEN}✅ 커밋 완료${NC}"
else
    echo -e "${YELLOW}⚠️  커밋할 변경사항이 없습니다.${NC}"
fi

# 푸시
echo ""
echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ GitHub 푸시 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "다음 단계:"
    echo "  1. https://railway.app 접속"
    echo "  2. 'New Project' → 'Deploy from GitHub repo'"
    echo "  3. 방금 푸시한 저장소 선택"
    echo "  4. 환경 변수 설정"
    echo "  5. 배포 완료! 🎉"
    echo ""
else
    echo -e "${YELLOW}⚠️  푸시 실패${NC}"
    echo ""
    echo "가능한 해결 방법:"
    echo "  1. GitHub 인증 확인"
    echo "  2. Personal Access Token 사용"
    echo "  3. SSH 키 설정"
    echo ""
    echo "자세한 가이드: GITHUB_DEPLOY.md 참조"
fi

