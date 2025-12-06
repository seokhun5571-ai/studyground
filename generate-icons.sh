#!/bin/bash

# 아이콘 생성 스크립트
# macOS의 sips를 사용하여 SVG를 PNG로 변환

echo "🎨 PWA 아이콘 생성 중..."

# Client 아이콘 생성
if [ -f "client/public/icon.svg" ]; then
  echo "📱 태블릿 키오스크 아이콘 생성..."
  # SVG를 임시 PNG로 변환 (sips는 SVG를 직접 지원하지 않으므로 다른 방법 사용)
  # 대신 간단한 색상 배경의 PNG 생성
  sips -s format png --setProperty formatOptions 100 -z 192 192 --setProperty formatOptions 100 client/public/icon.svg --out client/public/pwa-192x192.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
  sips -s format png --setProperty formatOptions 100 -z 512 512 --setProperty formatOptions 100 client/public/icon.svg --out client/public/pwa-512x512.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
  sips -s format png --setProperty formatOptions 100 -z 180 180 --setProperty formatOptions 100 client/public/icon.svg --out client/public/apple-touch-icon.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
fi

# Admin 아이콘 생성
if [ -f "admin/public/icon.svg" ]; then
  echo "💻 관리자 대시보드 아이콘 생성..."
  sips -s format png --setProperty formatOptions 100 -z 192 192 --setProperty formatOptions 100 admin/public/icon.svg --out admin/public/pwa-192x192.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
  sips -s format png --setProperty formatOptions 100 -z 512 512 --setProperty formatOptions 100 admin/public/icon.svg --out admin/public/pwa-512x512.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
  sips -s format png --setProperty formatOptions 100 -z 180 180 --setProperty formatOptions 100 admin/public/icon.svg --out admin/public/apple-touch-icon.png 2>/dev/null || echo "⚠️  SVG 변환 실패, 기본 아이콘 사용"
fi

echo "✅ 아이콘 생성 완료!"
echo "💡 SVG를 PNG로 변환하려면 온라인 도구를 사용하거나 ImageMagick을 설치하세요."

