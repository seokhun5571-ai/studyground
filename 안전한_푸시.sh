#!/bin/bash

# 안전한 GitHub 푸시 스크립트

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 GitHub 안전한 푸시${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd /Users/ronnie/studyground-mvp

# 원격 저장소 확인
if ! git remote -v | grep -q origin; then
    git remote add origin https://github.com/seokhun5571-ai/studyground.git
fi

echo -e "${YELLOW}📝 Personal Access Token이 필요합니다.${NC}"
echo ""
echo "토큰 생성: https://github.com/settings/tokens"
echo "  → 'Generate new token (classic)'"
echo "  → 'repo' 권한 선택"
echo "  → 토큰 생성 및 복사"
echo ""
echo -e "${YELLOW}⚠️  토큰은 'ghp_' 로 시작하는 긴 문자열입니다.${NC}"
echo ""

read -sp "Personal Access Token을 입력하세요: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ 토큰이 입력되지 않았습니다.${NC}"
    exit 1
fi

# 토큰 형식 확인
if [[ ! "$TOKEN" =~ ^ghp_ ]]; then
    echo -e "${YELLOW}⚠️  토큰 형식이 올바르지 않을 수 있습니다.${NC}"
    echo "토큰은 보통 'ghp_' 로 시작합니다."
    read -p "계속하시겠습니까? (y/N): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
echo ""

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
fi

# URL에 토큰 포함하여 푸시
git remote set-url origin https://seokhun5571-ai:${TOKEN}@github.com/seokhun5571-ai/studyground.git

# 푸시 시도
if git push -u origin main 2>&1; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 GitHub 푸시 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "저장소: https://github.com/seokhun5571-ai/studyground"
    echo ""
    echo "✅ 다음 단계: Railway 배포"
    echo "  1. https://railway.app 접속"
    echo "  2. 'New Project' → 'Deploy from GitHub repo'"
    echo "  3. 'studyground' 저장소 선택"
    echo "  4. 환경 변수 설정:"
    echo "     - NODE_ENV=production"
    echo "     - PORT=5001"
    echo "     - JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo 'generate_with_openssl')"
    echo "     - HOST=0.0.0.0"
    echo "  5. 자동 배포 완료! 🎉"
    echo ""
    
    # 보안을 위해 URL에서 토큰 제거
    git remote set-url origin https://github.com/seokhun5571-ai/studyground.git
    echo -e "${GREEN}✅ 보안을 위해 URL에서 토큰 제거 완료${NC}"
else
    echo ""
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ 푸시 실패${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "가능한 원인:"
    echo "  1. 토큰이 올바르지 않음"
    echo "  2. 토큰 권한이 부족함 (repo 권한 필요)"
    echo "  3. 토큰이 만료됨"
    echo ""
    echo "해결 방법:"
    echo "  1. https://github.com/settings/tokens 에서 새 토큰 생성"
    echo "  2. 'repo' 권한 확인"
    echo "  3. 토큰 전체를 정확히 복사했는지 확인"
    echo ""
    
    # 보안을 위해 URL에서 토큰 제거
    git remote set-url origin https://github.com/seokhun5571-ai/studyground.git
    exit 1
fi

