import { useState } from "react";
import {
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    Navbar,
    NavbarButton,
    NavbarLogo,
    NavBody,
    // NavItems,
  } from "@/components/ui/resizable-navbar";
import { FiHelpCircle, FiMail, FiPlayCircle, FiShield, FiCheckCircle, FiBookOpen } from "react-icons/fi";


export default function PartnersNavbar() {


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);



  return (
    <Navbar>
    {/* Desktop Navigation */}
    <NavBody>
      <NavbarLogo />

      {/* <NavItems
        items={navItems}
        onItemClick={() => setIsMobileMenuOpen(false)}
      /> */}

      <div className="flex items-center gap-3">
        {/* <NavbarButton
          as="a"
          href="#register"
          variant="secondary"
        >
          <FiPlayCircle className="mr-2 h-5 w-5" /> Start registration
        </NavbarButton> */}

        <NavbarButton
          as="button"
          onClick={() => setIsHelpOpen(true)}
          variant="secondary"
        >
          <FiHelpCircle className="mr-2 h-5 w-5" /> Help
        </NavbarButton>

        {/* <NavbarButton
          as="button"
          onClick={handleToggle}
          variant="secondary"
        >
          {isDark ? <FiSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </NavbarButton> */}
      </div>
    </NavBody>

    {/* Mobile Navigation */}
    <MobileNav>
      <MobileNavHeader>
        <NavbarLogo />
        <MobileNavToggle
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
        />
      </MobileNavHeader>

      <MobileNavMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      >
        {/* {navItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.link}
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {item.name}
          </Link>
        ))} */}

        <div className="flex w-full flex-col gap-3 mt-4">
          <NavbarButton
            as="a"
            href="#register"
            variant="primary"
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiPlayCircle className="mr-2 h-5 w-5" /> Start registration
          </NavbarButton>

          <NavbarButton
            as="button"
            variant="primary"
            className="w-full"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsHelpOpen(true);
            }}
          >
            <FiHelpCircle className="mr-2 h-5 w-5" /> Help & FAQ
          </NavbarButton>
        </div>
      </MobileNavMenu>
    </MobileNav>
  
    {/* Help Drawer */}
    {isHelpOpen && (
      <div className="fixed inset-0 z-[60]">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsHelpOpen(false)}
        />
        <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl transition-all dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Need help?</h3>
            <button
              className="rounded-md px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              onClick={() => setIsHelpOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">What are the steps?</h4>
              <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" /> Create your account</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" /> Choose wallet type (custodial or self‑managed)</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" /> Verify ownership (signature) or review custodial details</li>
                <li className="flex items-start gap-2"><FiCheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" /> Access your dashboard</li>
              </ol>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">FAQs</h4>
              <div className="space-y-3">
                <details className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <summary className="cursor-pointer text-sm font-medium">Which wallet should I pick?</summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Self‑managed gives you full control with a signature step. Custodial is faster and we keep your keys encrypted—ideal if you want simplicity.</p>
                </details>
                <details className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <summary className="cursor-pointer text-sm font-medium">Is my data secure?</summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Yes. We use encryption in transit and at rest. Sensitive wallet data is encrypted client‑side before sending.</p>
                </details>
                <details className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                  <summary className="cursor-pointer text-sm font-medium">Can I invite sub‑affiliates later?</summary>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Absolutely. Once onboarded, you’ll get an invite link and tools to manage your network.</p>
                </details>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><FiShield className="h-4 w-4" /> Security practices</li>
                <li className="flex items-center gap-2"><FiBookOpen className="h-4 w-4" /> How it works</li>
              </ul>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-700 dark:text-slate-200">Still stuck? We’re here to help.</p>
              <a href="mailto:support@affil.com" className="mt-2 inline-flex items-center text-sm text-violet-600 hover:underline">
                <FiMail className="mr-2 h-4 w-4" /> support@affil.com
              </a>
            </div>

            <a
              href="#register"
              onClick={() => setIsHelpOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
            >
              <FiPlayCircle className="mr-2 h-5 w-5" /> Start registration
            </a>
          </div>
        </aside>
      </div>
    )}
  </Navbar>
  )
}
