import { useState } from "react";
// import { FiCheckCircle, FiCopy } from "react-icons/fi";
import { Wand2} from "lucide-react";
// import useAuth from "@/core/hooks/useAuth";
// import { templates } from "./consts";
import HowItWorksNewSubAffiliate from "@/modules/affiliates/components/HowItWorksNewSubAffiliate";


export default function HowItWorksSubAffiliates() {
  // const [copied, setCopied] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  // const [selectedTemplate, setSelectedTemplate] = useState(0);
  // const { getUser } = useAuth();


  return (
    <>
      <div className="">
  
        <div className="relative">
          <button
            onClick={() => {
              console.log('Opening wizard modal...', showWizard);
              setShowWizard(true);
            }}
      
            className="flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-purple-600 hover:scale-105 shadow-lg"
          >
            <Wand2 className="h-4 w-4" />
            How it Works
          </button>
          
        </div>
      
      </div>

      {/* Wizard Modal - Fixed Implementation */}
      {showWizard && (
        <HowItWorksNewSubAffiliate
        onShowFunction={setShowWizard}
        />
      )}
    </>
  );
}
