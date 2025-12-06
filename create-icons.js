// 간단한 PWA 아이콘 생성 스크립트
// Node.js로 기본 아이콘 생성

const fs = require('fs');
const path = require('path');

// 간단한 Base64 인코딩된 PNG 아이콘 (192x192, 파란색 배경)
// 실제로는 sharp나 canvas 라이브러리를 사용하는 것이 좋지만,
// 여기서는 기본 아이콘을 위한 플레이스홀더를 만듭니다

function createPlaceholderIcon(size, outputPath) {
  // 실제로는 이미지 라이브러리를 사용해야 하지만,
  // 여기서는 SVG를 복사하고 나중에 변환하도록 안내
  console.log(`아이콘 생성: ${outputPath} (${size}x${size})`);
  // 실제 구현은 사용자가 이미지 편집 도구를 사용하거나
  // 온라인 SVG to PNG 변환기를 사용하도록 안내
}

// Client 아이콘
const clientIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="24" fill="#3b82f6"/>
  <text x="96" y="120" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">S</text>
</svg>`;

// Admin 아이콘
const adminIconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="24" fill="#1e40af"/>
  <text x="96" y="120" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">A</text>
</svg>`;

// 아이콘 생성 (SVG는 이미 있으므로, 사용자에게 PNG 변환 안내)
console.log('📱 PWA 아이콘 설정');
console.log('');
console.log('💡 아이콘 파일이 필요합니다:');
console.log('   1. client/public/pwa-192x192.png');
console.log('   2. client/public/pwa-512x512.png');
console.log('   3. client/public/apple-touch-icon.png');
console.log('   4. admin/public/pwa-192x192.png');
console.log('   5. admin/public/pwa-512x512.png');
console.log('   6. admin/public/apple-touch-icon.png');
console.log('');
console.log('🔧 SVG 아이콘은 이미 생성되어 있습니다:');
console.log('   - client/public/icon.svg');
console.log('   - admin/public/icon.svg');
console.log('');
console.log('📝 PNG로 변환하는 방법:');
console.log('   1. 온라인 변환기 사용: https://cloudconvert.com/svg-to-png');
console.log('   2. 또는 ImageMagick 설치: brew install imagemagick');
console.log('   3. 또는 수동으로 디자인 도구 사용');
console.log('');
console.log('⚠️  아이콘 없이도 PWA는 작동하지만, 설치 시 기본 아이콘이 표시됩니다.');

