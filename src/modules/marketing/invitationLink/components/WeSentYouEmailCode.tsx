/* eslint-disable @typescript-eslint/no-explicit-any */

export default function WeSentYouEmailCode({ submittedData }:any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600 text-white p-6">
    <div className="bg-white text-gray-800 rounded-lg shadow-md p-8 max-w-md w-full text-center">
      <h2 className="text-2xl font-bold mb-4">
        ✉️ Check your inbox, {submittedData?.name}!
      </h2>
      <p className="mb-2">You're just one step away from completing your registration.</p>
      <p className="text-sm text-gray-600 mb-6">
        We've sent a verification link to your email. Please confirm your account to get started.
      </p>
      <div className="text-left text-sm space-y-2">
        <p><strong>Email:</strong> {submittedData?.email}</p>
      </div>
  
    </div>
  </div>
  
  )
}
