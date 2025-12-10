#!/bin/bash

# GitHub 푸시 스크립트 (토큰 사용)

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 GitHub 푸시${NC}"
echo ""

cd /Users/ronnie/studyground-mvp

# 원격 저장소 확인
if ! git remote -v | grep -q origin; then
    echo -e "${YELLOW}⚠️  원격 저장소가 설정되지 않았습니다.${NC}"
    git remote add origin https://github.com/seokhun5571-ai/studyground.git
    echo -e "${GREEN}✅ 원격 저장소 설정 완료${NC}"
fi

# Personal Access Token 입력
echo -e "${YELLOW}📝 Personal Access Token이 필요합니다.${NC}"
echo ""
echo "토큰 생성 방법:"
echo "  1. https://github.com/settings/tokens 접속"
echo "  2. 'Generate new token (classic)' 클릭"
echo "  3. 'repo' 권한 선택"
echo "  4. 토큰 생성 및 복사"
echo ""
read -sp "Personal Access Token을 입력하세요: " TOKEN
echo ""

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ 토큰이 필요합니다.${NC}"
    exit 1
fi

# URL에 토큰 포함하여 푸시
echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"

# 원격 URL에 토큰 포함
git remote set-url origin https://seokhun5571-ai:${TOKEN}@github.com/seokhun5571-ai/studyground.git

# 푸시
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
    echo "  4. 환경 변수 설정 후 자동 배포 완료!"
    echo ""
    
    # 보안을 위해 URL에서 토큰 제거
    git remote set-url origin https://github.com/seokhun5571-ai/studyground.git
else
    echo -e "${RED}❌ 푸시 실패${NC}"
    echo "토큰이 올바른지 확인하세요."
    # 보안을 위해 URL에서 토큰 제거
    git remote set-url origin https://github.com/seokhun5571-ai/studyground.git
    exit 1
fi

