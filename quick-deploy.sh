#!/bin/bash

# 빠른 배포 스크립트 - Railway CLI 사용

set -e

echo "🚀 Railway 빠른 배포 시작!"
echo ""

# Railway CLI 설치 확인
if ! command -v railway &> /dev/null; then
    echo "Railway CLI 설치 중..."
    npm install -g @railway/cli
fi

# 로그인 확인
if ! railway whoami &> /dev/null; then
    echo "Railway 로그인이 필요합니다..."
    railway login
fi

# 프로젝트 초기화
echo "Railway 프로젝트 초기화 중..."
railway init

# 환경 변수 설정 안내
echo ""
echo "환경 변수 설정이 필요합니다:"
echo "railway variables set NODE_ENV=production"
echo "railway variables set PORT=5001"
echo "railway variables set HOST=0.0.0.0"
echo "railway variables set JWT_SECRET=$(openssl rand -hex 32)"
echo "railway variables set GOOGLE_SHEETS_ID=<your_sheet_id>"
echo "railway variables set GOOGLE_SERVICE_ACCOUNT='<your_json>'"
echo ""

# 배포
echo "배포 중..."
railway up

echo ""
echo "✅ 배포 완료!"
echo "railway domain 명령어로 도메인을 확인하세요."
