// components/WelcomeAfterVerification.tsx

import SuccessAnimation from "@/components/animations/success/SuccessAnimation";

export default function WelcomeAfterVerification() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">
        <div className="bg-white text-gray-900 rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">🎉 Welcome to Affill!</h1>
          <p className="text-gray-700 mb-6">
            Your email has been successfully verified. You can now access your dashboard, invite sub-affiliates, and start earning rewards.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Let’s build the most powerful affiliate network in crypto.
          </p>
          <SuccessAnimation/>

       
        </div>
      </div>
    );
  }
  