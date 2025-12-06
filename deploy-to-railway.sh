#!/bin/bash

# Railway 배포 준비 스크립트

echo "🚀 Railway 배포 준비 중..."
echo ""

# 1. Git 저장소 확인
if [ ! -d ".git" ]; then
  echo "📦 Git 저장소 초기화 중..."
  git init
  echo "✅ Git 저장소 초기화 완료"
  echo ""
  echo "⚠️  다음 단계:"
  echo "   1. git add ."
  echo "   2. git commit -m 'Initial commit'"
  echo "   3. GitHub에 새 저장소 생성"
  echo "   4. git remote add origin <your-repo-url>"
  echo "   5. git push -u origin main"
  echo ""
else
  echo "✅ Git 저장소 확인됨"
fi

# 2. 빌드 테스트
echo ""
echo "🔨 빌드 테스트 중..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ 빌드 성공!"
else
  echo "❌ 빌드 실패! 로그를 확인하세요."
  exit 1
fi

# 3. 환경 변수 확인
echo ""
echo "🔐 환경 변수 확인..."
if [ -f ".env" ]; then
  echo "✅ .env 파일 발견"
  echo "⚠️  Railway에서 다음 환경 변수를 설정하세요:"
  echo "   - NODE_ENV=production"
  echo "   - PORT=5001"
  echo "   - JWT_SECRET=<your-secret-key>"
  echo "   - HOST=0.0.0.0"
else
  echo "⚠️  .env 파일이 없습니다. Railway에서 환경 변수를 설정하세요."
fi

echo ""
echo "📚 다음 단계:"
echo "   1. GitHub에 코드 푸시 (git push)"
echo "   2. Railway.app에 가입"
echo "   3. 'New Project' → 'Deploy from GitHub repo'"
echo "   4. 저장소 선택 및 환경 변수 설정"
echo "   5. 자동 배포 완료!"
echo ""
echo "💡 상세한 가이드: CLOUD_DEPLOYMENT.md 참조"

