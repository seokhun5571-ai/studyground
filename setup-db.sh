#!/bin/bash

echo "🗄️  스터디그라운드 데이터베이스 설정..."
echo ""

# 데이터베이스 생성
echo "1️⃣  데이터베이스 생성 중..."
createdb studyground 2>/dev/null
if [ $? -eq 0 ]; then
    echo "   ✅ 데이터베이스 'studyground' 생성 완료"
else
    echo "   ⚠️  데이터베이스가 이미 존재하거나 생성 실패"
fi

echo ""

# 스키마 생성
echo "2️⃣  테이블 생성 중..."
psql -U postgres -d studyground -f /Users/ronnie/studyground-mvp/database/schema.sql
if [ $? -eq 0 ]; then
    echo "   ✅ 테이블 생성 완료"
else
    echo "   ❌ 테이블 생성 실패"
    exit 1
fi

echo ""

# 초기 데이터 입력
echo "3️⃣  초기 데이터 입력 중..."
psql -U postgres -d studyground -f /Users/ronnie/studyground-mvp/database/seed.sql
if [ $? -eq 0 ]; then
    echo "   ✅ 초기 데이터 입력 완료"
else
    echo "   ❌ 초기 데이터 입력 실패"
    exit 1
fi

echo ""
echo "✅ 데이터베이스 설정이 완료되었습니다!"
echo ""
echo "📝 기본 계정 정보:"
echo "   관리자: admin / admin1234"
echo "   학생 PIN: 1234, 5678, 9012"
echo ""
