#!/bin/bash

# 즉시 배포 스크립트 - 저장소 URL만 입력하면 자동!

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 즉시 배포 시작!${NC}"
echo ""

cd /Users/ronnie/studyground-mvp

# 저장소 URL 입력
echo "GitHub 저장소 URL을 입력하세요:"
echo "예: https://github.com/yourusername/studyground-mvp.git"
echo ""
read -p "저장소 URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${YELLOW}⚠️  저장소 URL이 필요합니다.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔗 원격 저장소 설정 중...${NC}"

# 기존 원격 저장소 제거
if git remote -v | grep -q origin; then
    git remote remove origin
fi

# 새 원격 저장소 추가
git remote add origin "$REPO_URL"
echo -e "${GREEN}✅ 원격 저장소 설정 완료${NC}"

# 브랜치 이름 확인
git branch -M main

# 푸시
echo ""
echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🎉 GitHub 배포 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "저장소: $REPO_URL"
    echo ""
    echo "✅ 다음 단계: Railway 배포"
    echo "  1. https://railway.app 접속"
    echo "  2. 'New Project' → 'Deploy from GitHub repo'"
    echo "  3. 'studyground-mvp' 저장소 선택"
    echo "  4. 환경 변수 설정 후 자동 배포 완료!"
    echo ""
else
    echo -e "${YELLOW}⚠️  푸시 실패${NC}"
    echo ""
    echo "인증이 필요할 수 있습니다:"
    echo "  1. https://github.com/settings/tokens 에서 토큰 생성"
    echo "  2. 푸시 시 비밀번호 대신 토큰 사용"
fi

