
export default function InvitationWelcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            You're in 🎉
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome to the community. We'll be in touch soon with your
            onboarding steps.
          </p>
        </div>
      </div>
  )
}
