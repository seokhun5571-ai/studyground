import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 브랜드 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              유니브클래스
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              1:1 생기부 밀착관리반을 통해 학생생활기록부 관리를 완벽하게 지원하는
              프리미엄 교육 서비스를 제공합니다.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>02-1234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span>info@univclass.co.kr</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>서울특별시 강남구 테헤란로 123</span>
              </div>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="text-white font-semibold mb-4">서비스</h4>
            <ul className="space-y-2">
              <li>
                <a href="#program" className="hover:text-primary-400 transition-colors">
                  1:1 생기부 관리
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-primary-400 transition-colors">
                  입시 컨설팅
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-primary-400 transition-colors">
                  활동 기록 관리
                </a>
              </li>
              <li>
                <a href="#program" className="hover:text-primary-400 transition-colors">
                  성장 분석
                </a>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="text-white font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="hover:text-primary-400 transition-colors">
                  상담 신청
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  자주 묻는 질문
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 유니브클래스. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary-400 transition-colors">
                이용약관
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                개인정보처리방침
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


