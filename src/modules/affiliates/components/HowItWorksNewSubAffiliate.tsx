// import React from 'react'
import { Sparkles, Users, Target, DollarSign, CheckCircle, Wand2, X } from "lucide-react";

export default function HowItWorksNewSubAffiliate({onShowFunction}: {onShowFunction: (show: boolean) => void}) {
    const processSteps = [
        {
          icon: <Users className="h-6 w-6 text-blue-500" />,
          title: 'Share Your Link',
          description: 'Copy and share your personalized invitation link with potential sub-affiliates',
          color: 'blue',
        },
        {
          icon: <Target className="h-6 w-6 text-green-500" />,
          title: 'They Register',
          description: 'New affiliates complete a simple registration process using your link',
          color: 'green',
        },
        {
          icon: <DollarSign className="h-6 w-6 text-yellow-500" />,
          title: 'Start Earning',
          description: 'Both you and your sub-affiliates earn commissions from their activities',
          color: 'yellow',
        },
        {
          icon: <Sparkles className="h-6 w-6 text-purple-500" />,
          title: 'Track Growth',
          description: 'Monitor your network performance and earnings in real-time',
          color: 'purple',
        },
      ];

  return (
    <div 
    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)'
    }}
    onClick={() => onShowFunction(false)}
  >
    <div 
      className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl"
      style={{
        backgroundColor: 'var(--modal-bg, #ffffff)',
        border: '1px solid var(--modal-border, #e5e7eb)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div 
        className="p-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Wand2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">How It Works</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>Simple 4-step process to grow your network</p>
            </div>
          </div>
          <button
            onClick={() => onShowFunction(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
        {/* Steps Flow */}
        <div className="space-y-6">
          {processSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              {/* Step Number */}
              <div className="flex-shrink-0">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="p-2 rounded-xl shadow-sm"
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    {step.icon}
                  </div>
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: '#111827' }}
                  >
                    {step.title}
                  </h3>
                </div>
                <p 
                  className="leading-relaxed text-sm pl-12"
                  style={{ color: '#6b7280' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Success Message */}
        <div 
          className="mt-8 rounded-2xl border p-6"
          style={{
            borderColor: '#bbf7d0',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)'
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
              style={{ backgroundColor: '#10b981' }}
            >
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 
                className="font-bold text-lg"
                style={{ color: '#166534' }}
              >
                You're All Set!
              </h4>
              <p 
                className="mt-1"
                style={{ color: '#15803d' }}
              >
                Your network will start growing and earning automatically. Track your progress in the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onShowFunction(false)}
            className="px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'
            }}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}
