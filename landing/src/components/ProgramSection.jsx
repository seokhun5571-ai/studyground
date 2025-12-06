import { FileText, Users, Clock, Target, Award, BookOpen, CheckCircle, BarChart3 } from 'lucide-react'

export default function ProgramSection() {
  const features = [
    {
      icon: FileText,
      title: '체계적인 생기부 관리',
      description: '학생의 모든 활동과 성과를 전문적으로 기록하고 관리하여 완벽한 생활기록부를 완성합니다.'
    },
    {
      icon: Users,
      title: '1:1 전담 관리',
      description: '전문 관리사가 각 학생을 1:1로 담당하여 철저한 맞춤형 관리를 제공합니다.'
    },
    {
      icon: Clock,
      title: '실시간 업데이트',
      description: '학생의 활동과 성과를 실시간으로 업데이트하여 항상 최신 상태의 생기부를 유지합니다.'
    },
    {
      icon: Target,
      title: '목표 지향적 관리',
      description: '입시 목표에 맞춘 전략적인 생기부 작성으로 대학 입시 경쟁력을 강화합니다.'
    },
    {
      icon: Award,
      title: '입시 전문 컨설팅',
      description: '대학 입시 전문가의 컨설팅을 통해 생기부 최적화 전략을 수립합니다.'
    },
    {
      icon: BookOpen,
      title: '다양한 활동 기록',
      description: '교내외 활동, 자율활동, 동아리, 봉사활동 등 모든 활동을 체계적으로 기록합니다.'
    },
    {
      icon: CheckCircle,
      title: '철저한 검토와 피드백',
      description: '기록된 내용을 전문적으로 검토하고 피드백을 제공하여 완성도를 높입니다.'
    },
    {
      icon: BarChart3,
      title: '성장 기록 분석',
      description: '학생의 성장 과정을 데이터로 분석하여 더 나은 관리를 위한 인사이트를 제공합니다.'
    }
  ]

  const programHighlights = [
    {
      title: '전문성',
      description: '입시 전문가와 생기부 전문가가 직접 관리',
      value: '100%'
    },
    {
      title: '맞춤형',
      description: '학생별 특성과 목표에 맞춘 개별 관리',
      value: '1:1'
    },
    {
      title: '신뢰도',
      description: '체계적인 기록과 검토 시스템',
      value: '99%'
    },
    {
      title: '만족도',
      description: '프리미엄 서비스로 높은 고객 만족도',
      value: '98%'
    }
  ]

  return (
    <section id="program" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            프리미엄 프로그램 소개
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            유니브클래스 1:1 생기부 밀착관리반은 학생생활기록부 관리를 위한
            <br className="hidden sm:block" />
            최고 수준의 전문 서비스를 제공합니다.
          </p>
        </div>

        {/* 주요 특징 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* 프로그램 하이라이트 */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-12 mb-24">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              프로그램 주요 지표
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {programHighlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="text-5xl font-bold text-primary-600 mb-3">
                    {highlight.value}
                  </div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </div>
                  <div className="text-gray-600">
                    {highlight.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 프로그램 프로세스 */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-16">
            관리 프로세스
          </h3>
          <div className="relative">
            {/* 연결선 */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 transform -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: '상담 및 분석',
                  description: '학생 현황 분석 및 목표 수립'
                },
                {
                  step: '02',
                  title: '전담 관리자 배정',
                  description: '1:1 전담 관리자 배정 및 맞춤 계획 수립'
                },
                {
                  step: '03',
                  title: '체계적 기록 관리',
                  description: '모든 활동과 성과를 전문적으로 기록'
                },
                {
                  step: '04',
                  title: '검토 및 최적화',
                  description: '정기 검토와 피드백을 통한 지속적 개선'
                }
              ].map((process, index) => (
                <div key={index} className="relative">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-primary-500 hover:shadow-lg transition-all duration-300 text-center">
                    <div className="text-4xl font-bold text-primary-600 mb-4">
                      {process.step}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">
                      {process.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


