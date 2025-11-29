import { FC } from "react";

const DashboardVideo: FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-blue-600 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Dashboard Preview
      </h2>

      <div className="relative w-full overflow-hidden rounded-xl shadow-lg border-2 border-gray-200">
        <video className="w-full h-auto rounded-xl" autoPlay muted loop playsInline>
          <source src="assets/video/video-1.mov" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default DashboardVideo;
