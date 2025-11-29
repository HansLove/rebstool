/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink
} from "lucide-react";
import { ScrollMotionDiv } from "@/components/divs/ScrollMotionDiv";
import { subSteps } from "./subsSteps";
import { ScrollStaggeredText } from "@/core/utils/ScrollStaggeredText";
import { useOutletContext } from "react-router-dom";

const INVITE_LINK = "https://marco15469.wixsite.com/switzyarmy";

const ShareAndEarnGuide = () => {

  const { userSlug} = useOutletContext<any>();

    const [referralLink, setReferralLink] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [copied, setCopied] = useState(false);
  
    // Generate the referral link when the component mounts or when userSlug changes
    useEffect(() => {
      if (userSlug) {
        const inviteUrl = `https://go.puprime.partners/visit/?bta=41047&brand=pu&utm_campaign=${userSlug}`;
        setReferralLink(inviteUrl);
      } 
    }, [userSlug]);


  const nextStep = () => {
    if (currentStep < subSteps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleCopy = async (_value) => {
    try {
      await navigator.clipboard.writeText(_value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const step = subSteps[currentStep];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <ScrollMotionDiv delay={300} className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          💸 How to Share & Earn
        </ScrollMotionDiv>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Step indicators */}
        <div className="flex bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
          {subSteps.map((s, i) => (
            <ScrollMotionDiv
              key={i}
              delay={200 + i * 200}
              className="flex-1 flex flex-col items-center relative"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= i ? "bg-white text-blue-600" : "bg-white/20"
                }`}
              >
                {i + 1}
              </div>
              <div className="text-sm font-medium">{s.label}</div>
              {i < subSteps.length - 1 && (
                <div className="absolute top-5 left-[60%] w-[80%] h-0.5 bg-white/30"></div>
              )}
            </ScrollMotionDiv>
          ))}
        </div>

        {/* Step content */}
        <div className="p-6">
          <ScrollMotionDiv delay={100} className="text-xl sm:text-2xl font-bold flex items-center gap-2 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {step.icon} {step.title}
          </ScrollMotionDiv>

          <ScrollStaggeredText text={step.mainText} />

          {step.details &&
            step.details.map((detail: any, i: number) =>
              detail.isNote ? (
                <ScrollMotionDiv
                  key={i}
                  delay={600 + i * 200}
                  className="mt-4 border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-slate-400"
                >
                  {detail.text}
                </ScrollMotionDiv>
              ) : (
                <ScrollMotionDiv
                  key={i}
                  delay={400 + i * 200}
                  className="mt-6 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-5"
                >
                  <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                    {detail.icon} {detail.heading}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{detail.text}</p>
                </ScrollMotionDiv>
              )
            )}

          {currentStep === 0 && (
            <ScrollMotionDiv delay={600} className="mt-8">
              <div className="bg-blue-50 dark:bg-indigo-900/30 border border-blue-200 dark:border-indigo-700 p-4 rounded-lg text-sm">
                <div className="mb-3 font-semibold text-blue-800 dark:text-blue-300">🎯 Your Website Link</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={INVITE_LINK}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 truncate focus:outline-none"
                  />
                  <button
                    onClick={()=>handleCopy(INVITE_LINK)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition shadow-md"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <a
                    href={INVITE_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    Open <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </ScrollMotionDiv>
          )}

          {currentStep === 1 && (
            <ScrollMotionDiv delay={600} className="mt-8">
              <div className="bg-blue-50 dark:bg-indigo-900/30 border border-blue-200 dark:border-indigo-700 p-4 rounded-lg text-sm">
                <div className="mb-3 font-semibold text-blue-800 dark:text-blue-300">🎯 Your Registration Link</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-800 dark:text-slate-100 truncate focus:outline-none"
                  />
                  <button
                    onClick={()=>handleCopy(referralLink)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition shadow-md"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </ScrollMotionDiv>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-slate-200 dark:border-slate-600">
            {currentStep > 0 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition shadow-md font-medium"
              >
                <ArrowLeft size={16} /> Previous
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition shadow-md font-medium"
            >
              {currentStep === subSteps.length - 1 ? "Finish" : "Next"}
              {currentStep === subSteps.length - 1 ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAndEarnGuide;
