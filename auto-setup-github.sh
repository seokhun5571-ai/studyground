#!/bin/bash

# GitHub 저장소 자동 생성 및 푸시 스크립트

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 GitHub 저장소 자동 생성 및 푸시${NC}"
echo ""

# 1. GitHub CLI 확인
echo -e "${BLUE}📦 GitHub CLI 확인 중...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI 설치됨${NC}"
    
    # 인증 확인
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✅ GitHub 인증됨${NC}"
        GITHUB_USER=$(gh api user --jq .login 2>/dev/null || echo "")
        echo -e "${GREEN}   사용자: $GITHUB_USER${NC}"
        
        # 저장소 생성
        echo ""
        echo -e "${BLUE}📤 GitHub 저장소 생성 중...${NC}"
        REPO_NAME="studyground-mvp"
        
        # 기존 저장소 확인
        if gh repo view "$GITHUB_USER/$REPO_NAME" &> /dev/null; then
            echo -e "${YELLOW}⚠️  저장소가 이미 존재합니다: $GITHUB_USER/$REPO_NAME${NC}"
            read -p "덮어쓰시겠습니까? (y/N): " OVERWRITE
            if [ "$OVERWRITE" != "y" ]; then
                echo "기존 저장소 사용"
            else
                echo -e "${YELLOW}⚠️  기존 저장소 삭제는 수동으로 해야 합니다.${NC}"
                echo "   https://github.com/$GITHUB_USER/$REPO_NAME/settings"
                exit 1
            fi
        else
            # 새 저장소 생성
            if gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null; then
                echo -e "${GREEN}✅ GitHub 저장소 생성 및 푸시 완료!${NC}"
                echo -e "${GREEN}   저장소: https://github.com/$GITHUB_USER/$REPO_NAME${NC}"
                echo ""
                echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                echo -e "${GREEN}🎉 성공!${NC}"
                echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
                echo ""
                echo "다음 단계: Railway 배포"
                echo "  1. https://railway.app 접속"
                echo "  2. 'New Project' → 'Deploy from GitHub repo'"
                echo "  3. '$REPO_NAME' 저장소 선택"
                echo "  4. 환경 변수 설정"
                echo ""
                exit 0
            else
                echo -e "${RED}❌ 저장소 생성 실패${NC}"
                echo "수동으로 생성해야 합니다."
                GITHUB_CLI_AVAILABLE=false
            fi
        fi
    else
        echo -e "${YELLOW}⚠️  GitHub 인증 필요${NC}"
        echo ""
        echo "인증을 시작합니다..."
        if gh auth login; then
            echo -e "${GREEN}✅ 인증 완료!${NC}"
            # 다시 시도
            exec "$0"
        else
            echo -e "${RED}❌ 인증 실패${NC}"
            GITHUB_CLI_AVAILABLE=false
        fi
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI 미설치${NC}"
    GITHUB_CLI_AVAILABLE=false
fi

# GitHub CLI를 사용할 수 없는 경우
if [ "$GITHUB_CLI_AVAILABLE" = false ]; then
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}수동 설정 필요${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "1. GitHub 저장소 생성:"
    echo "   https://github.com/new"
    echo "   저장소 이름: studyground-mvp"
    echo "   'Add a README file' 체크 해제"
    echo ""
    echo "2. 저장소 URL 복사 후 아래 명령어 실행:"
    echo "   git remote add origin YOUR_URL"
    echo "   git push -u origin main"
    echo ""
    echo "또는 GitHub CLI 설치:"
    echo "   brew install gh"
    echo "   gh auth login"
    echo "   ./auto-setup-github.sh"
    echo ""
fi

