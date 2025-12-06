#!/bin/bash

echo "🚀 스터디그라운드 MVP 시스템 시작..."
echo ""

# 로컬 IP 주소 감지 (macOS/Linux)
get_local_ip() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")
  else
    # Linux
    ip=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "127.0.0.1")
  fi
  echo "$ip"
}

LOCAL_IP=$(get_local_ip)

# 백엔드 서버 시작
echo "📡 백엔드 서버 시작 중..."
cd /Users/ronnie/studyground-mvp
npm run dev &
BACKEND_PID=$!

sleep 3

# 태블릿 키오스크 시작
echo "📱 태블릿 키오스크 시작 중..."
cd /Users/ronnie/studyground-mvp/client
npm run dev &
CLIENT_PID=$!

sleep 2

# 관리자 대시보드 시작
echo "💻 관리자 대시보드 시작 중..."
cd /Users/ronnie/studyground-mvp/admin
npm run dev &
ADMIN_PID=$!

sleep 2

echo ""
echo "✅ 모든 서비스가 시작되었습니다!"
echo ""
echo "📍 로컬 접속 주소 (이 컴퓨터):"
echo "   - 백엔드 API: http://localhost:5001"
echo "   - 태블릿 키오스크: http://localhost:3000"
echo "   - 관리자 대시보드: http://localhost:3001"
echo ""
echo "🌐 네트워크 접속 주소 (다른 기기에서 접근):"
echo "   - 태블릿 키오스크: http://${LOCAL_IP}:3000"
echo "   - 관리자 대시보드: http://${LOCAL_IP}:3001"
echo ""
echo "💡 다른 기기에서 접근하려면:"
echo "   1. 같은 Wi-Fi 네트워크에 연결되어 있는지 확인"
echo "   2. 위의 IP 주소(${LOCAL_IP})를 사용하여 접속"
echo "   3. 방화벽이 포트 3000, 3001, 5001을 차단하지 않는지 확인"
echo ""
echo "⚠️  종료하려면 Ctrl+C를 누르세요"
echo ""

# 종료 시그널 처리
trap "echo ''; echo '🛑 서비스 종료 중...'; kill $BACKEND_PID $CLIENT_PID $ADMIN_PID 2>/dev/null; exit" INT TERM

# 프로세스가 종료될 때까지 대기
wait
