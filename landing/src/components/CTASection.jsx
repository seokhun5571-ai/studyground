import { useState } from 'react'
import { Phone, Mail, Calendar, Send, CheckCircle } from 'lucide-react'

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    studentGrade: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // 실제 폼 제출 로직은 백엔드와 연동 필요
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        phone: '',
        email: '',
        studentGrade: '',
        message: ''
      })
    }, 3000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* 좌측: 문의 정보 */}
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                상담 신청
              </h2>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                프리미엄 생기부 관리 서비스에 대해 더 자세히 알고 싶으신가요?
                <br />
                전문 상담사를 통해 맞춤형 상담을 받아보세요.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      전화 상담
                    </h3>
                    <p className="text-gray-600">
                      평일 09:00 - 18:00
                    </p>
                    <a href="tel:02-1234-5678" className="text-primary-600 font-medium hover:text-primary-700">
                      02-1234-5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      이메일 문의
                    </h3>
                    <p className="text-gray-600 mb-1">
                      언제든지 문의사항을 남겨주세요
                    </p>
                    <a href="mailto:info@univclass.co.kr" className="text-primary-600 font-medium hover:text-primary-700">
                      info@univclass.co.kr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      방문 상담
                    </h3>
                    <p className="text-gray-600">
                      사전 예약 후 방문 상담 가능
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 상담 신청 폼 */}
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                상담 신청서
              </h3>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    상담 신청이 완료되었습니다
                  </h4>
                  <p className="text-gray-600">
                    담당자가 연락드리겠습니다.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="이름을 입력하세요"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="010-1234-5678"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="studentGrade" className="block text-sm font-medium text-gray-700 mb-2">
                      학생 학년
                    </label>
                    <select
                      id="studentGrade"
                      name="studentGrade"
                      value={formData.studentGrade}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="중1">중학교 1학년</option>
                      <option value="중2">중학교 2학년</option>
                      <option value="중3">중학교 3학년</option>
                      <option value="고1">고등학교 1학년</option>
                      <option value="고2">고등학교 2학년</option>
                      <option value="고3">고등학교 3학년</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      문의 내용
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                      placeholder="상담을 원하시는 내용을 작성해주세요"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-300 hover:shadow-xl"
                  >
                    상담 신청하기
                    <Send className="ml-2 w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


