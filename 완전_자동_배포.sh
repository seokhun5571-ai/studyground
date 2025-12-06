#!/bin/bash

# 완전 자동 배포 스크립트
# 사용자가 GitHub 저장소만 만들면 나머지는 자동!

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 스터디그라운드 완전 자동 배포${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. 현재 상태 확인
echo -e "${BLUE}📋 현재 상태 확인 중...${NC}"
cd /Users/ronnie/studyground-mvp

# Git 원격 저장소 확인
if git remote -v | grep -q origin; then
    REMOTE_URL=$(git remote get-url origin)
    echo -e "${GREEN}✅ 원격 저장소 설정됨: $REMOTE_URL${NC}"
    
    # 푸시 시도
    echo ""
    echo -e "${BLUE}📤 GitHub에 푸시 중...${NC}"
    if git push -u origin main 2>&1; then
        echo -e "${GREEN}✅ 푸시 완료!${NC}"
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}🎉 GitHub 배포 완료!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "저장소: $REMOTE_URL"
        echo ""
        echo "다음 단계: Railway 배포"
        echo "  1. https://railway.app 접속"
        echo "  2. 'New Project' → 'Deploy from GitHub repo'"
        echo "  3. 저장소 선택"
        echo "  4. 환경 변수 설정"
        exit 0
    else
        echo -e "${YELLOW}⚠️  푸시 실패 (인증 필요할 수 있음)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  원격 저장소가 설정되지 않았습니다.${NC}"
fi

# 2. GitHub 저장소 생성 안내
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 GitHub 저장소 생성 필요${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1️⃣  브라우저에서 GitHub 저장소 생성:"
echo "   → https://github.com/new 접속"
echo "   → 저장소 이름: studyground-mvp"
echo "   → 'Add a README file' 체크 해제 ⚠️"
echo "   → 'Create repository' 클릭"
echo ""
echo "2️⃣  저장소 URL 복사"
echo "   (예: https://github.com/yourusername/studyground-mvp.git)"
echo ""
read -p "저장소 URL을 입력하세요 (또는 Enter로 건너뛰기): " REPO_URL

if [ ! -z "$REPO_URL" ]; then
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
    if git push -u origin main 2>&1; then
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
        echo "  4. 환경 변수 설정:"
        echo "     - NODE_ENV=production"
        echo "     - PORT=5001"
        echo "     - JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo 'generate_with_openssl_rand_hex_32')"
        echo "     - HOST=0.0.0.0"
        echo "  5. 자동 배포 완료! 🎉"
        echo ""
    else
        echo -e "${RED}❌ 푸시 실패${NC}"
        echo ""
        echo "가능한 원인:"
        echo "  1. 인증 필요 (Personal Access Token)"
        echo "  2. 저장소 URL 오류"
        echo ""
        echo "해결 방법:"
        echo "  1. https://github.com/settings/tokens 에서 토큰 생성"
        echo "  2. 푸시 시 비밀번호 대신 토큰 사용"
        echo "  3. 또는 SSH 키 설정"
    fi
else
    echo ""
    echo -e "${YELLOW}⚠️  저장소 URL이 필요합니다.${NC}"
    echo ""
    echo "나중에 실행:"
    echo "  ./완전_자동_배포.sh"
    echo ""
fi

