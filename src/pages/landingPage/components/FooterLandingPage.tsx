import { RebToolsLogo } from "@/components/RebToolsLogo";

export default function FooterLandingPage() {
  return (
    <footer className="dark:bg-slate-900 bg-slate-200 text-slate-700 dark:text-slate-100  py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="font-bold text-xl mb-3">
                <RebToolsLogo
                  width={180}
                  height={54}
                  className="mb-2"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                The future of affiliate marketing powered by blockchain
                technology.
              </p>
            </div>

            {/* <div>
              <h3 className="font-semibold text-base mb-3">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-600 hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#tiers"
                    className="text-gray-600 hover:text-white transition"
                  >
                    Tiers
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    className="text-gray-600 hover:text-white transition"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-base mb-3">Resources</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-white transition"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
             */}
            {/* <div>
              <h3 className="font-semibold text-base mb-3">Connect</h3>
              <div className="flex space-x-3 mb-3">
                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 rounded-full text-white  flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 rounded-full text-white  flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="bg-gray-700 w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
              <p className="text-gray-600 text-sm">
                Subscribe to our newsletter for updates
              </p>
            </div> */}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 RebTools. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="/TERMSANDCONDITIONS.pdf"
                className="text-gray-500 text-sm hover:text-white transition"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 text-sm hover:text-white transition"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>

  )
}
