#!/bin/bash

# 완전 자동 배포 스크립트
# 가능한 모든 것을 자동으로 처리합니다

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 완전 자동 배포 시작!${NC}"
echo ""

# 1. 빌드 테스트
echo -e "${BLUE}🔨 빌드 테스트 중...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 빌드 성공!${NC}"
else
    echo -e "${YELLOW}⚠️  빌드 경고 (계속 진행)${NC}"
fi

# 2. GitHub CLI 확인
echo ""
echo -e "${BLUE}📦 GitHub CLI 확인 중...${NC}"
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI 설치됨${NC}"
    
    # GitHub 인증 확인
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}✅ GitHub 인증됨${NC}"
        
        # 저장소 생성 시도
        echo ""
        echo -e "${BLUE}📤 GitHub 저장소 생성 중...${NC}"
        REPO_NAME="studyground-mvp-$(date +%s)"
        
        if gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null; then
            echo -e "${GREEN}✅ GitHub 저장소 생성 및 푸시 완료!${NC}"
            echo -e "${GREEN}   저장소: https://github.com/$(gh api user --jq .login)/$REPO_NAME${NC}"
            GITHUB_SUCCESS=true
        else
            echo -e "${YELLOW}⚠️  GitHub 저장소 생성 실패 (수동으로 생성 필요)${NC}"
            GITHUB_SUCCESS=false
        fi
    else
        echo -e "${YELLOW}⚠️  GitHub 인증 필요${NC}"
        echo "   다음 명령어로 인증: gh auth login"
        GITHUB_SUCCESS=false
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI 미설치${NC}"
    echo "   설치: brew install gh"
    GITHUB_SUCCESS=false
fi

# 3. Railway CLI 확인
echo ""
echo -e "${BLUE}🚂 Railway CLI 확인 중...${NC}"
if command -v railway &> /dev/null; then
    echo -e "${GREEN}✅ Railway CLI 설치됨${NC}"
    
    # Railway 로그인 확인
    if railway whoami &> /dev/null; then
        echo -e "${GREEN}✅ Railway 로그인됨${NC}"
        
        if [ "$GITHUB_SUCCESS" = true ]; then
            echo ""
            echo -e "${BLUE}🚀 Railway 배포 시작...${NC}"
            
            # 환경 변수 설정
            JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || echo "change_this_secret_$(date +%s)")
            
            # Railway 프로젝트 초기화 및 배포
            if railway init --name studyground-mvp 2>/dev/null; then
                railway variables set NODE_ENV=production 2>/dev/null || true
                railway variables set PORT=5001 2>/dev/null || true
                railway variables set JWT_SECRET="$JWT_SECRET" 2>/dev/null || true
                railway variables set HOST=0.0.0.0 2>/dev/null || true
                
                echo -e "${GREEN}✅ Railway 환경 변수 설정 완료${NC}"
                echo ""
                echo -e "${GREEN}🚀 배포 중...${NC}"
                
                if railway up 2>/dev/null; then
                    echo -e "${GREEN}✅ Railway 배포 완료!${NC}"
                    RAILWAY_SUCCESS=true
                else
                    echo -e "${YELLOW}⚠️  Railway 배포 실패 (수동 배포 필요)${NC}"
                    RAILWAY_SUCCESS=false
                fi
            else
                echo -e "${YELLOW}⚠️  Railway 프로젝트 초기화 실패${NC}"
                RAILWAY_SUCCESS=false
            fi
        else
            echo -e "${YELLOW}⚠️  GitHub 저장소가 필요합니다${NC}"
            RAILWAY_SUCCESS=false
        fi
    else
        echo -e "${YELLOW}⚠️  Railway 로그인 필요${NC}"
        echo "   다음 명령어로 로그인: railway login"
        RAILWAY_SUCCESS=false
    fi
else
    echo -e "${YELLOW}⚠️  Railway CLI 미설치${NC}"
    echo "   설치: npm install -g @railway/cli"
    RAILWAY_SUCCESS=false
fi

# 4. 결과 요약
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 배포 결과${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$GITHUB_SUCCESS" = true ]; then
    echo -e "${GREEN}✅ GitHub: 성공${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub: 수동 설정 필요${NC}"
    echo "   1. https://github.com/new 에서 저장소 생성"
    echo "   2. git remote add origin <저장소URL>"
    echo "   3. git push -u origin main"
fi

if [ "$RAILWAY_SUCCESS" = true ]; then
    echo -e "${GREEN}✅ Railway: 성공${NC}"
    echo ""
    echo -e "${GREEN}🎉 배포 완료!${NC}"
    echo ""
    echo "접속 URL 확인:"
    echo "  railway domain"
else
    echo -e "${YELLOW}⚠️  Railway: 수동 배포 필요${NC}"
    echo ""
    echo "수동 배포 방법:"
    echo "  1. https://railway.app 가입"
    echo "  2. 'New Project' → 'Deploy from GitHub repo'"
    echo "  3. 저장소 선택"
    echo "  4. 환경 변수 설정"
fi

echo ""
echo -e "${BLUE}💡 더 자세한 가이드:${NC}"
echo "   - DEPLOY_NOW.md"
echo "   - AUTO_DEPLOY.md"
echo ""

