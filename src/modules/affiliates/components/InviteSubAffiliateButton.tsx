// import React from 'react'
import { useState } from "react";
import { FiCheckCircle, FiCopy } from "react-icons/fi";
import useAuth from "@/core/hooks/useAuth";
// import { templates } from "./consts";
import { templates } from "@/modules/subAffiliates/constants";

export default function InviteSubAffiliateButton() {

    const [copied, setCopied] = useState(false);
    const [selectedTemplate, ] = useState(0);
    const { getUser } = useAuth();
  
    const getCurrentInviteUrl = () => {
      const baseUrl = window.location.origin;
      const template = templates[selectedTemplate];
      return `${baseUrl}/${template.keyword}/${getUser().slug}`;
    };
  
    const handleCopyInviteLink = async () => {
      const inviteUrl = getCurrentInviteUrl();
  
      try {
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('❌ Failed to copy invite link:', err);
      }
    };


    return (
      <div className="w-fit overflow-hidden ">
   
        {/* Action Buttons */}
        <div className="p-6">
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyInviteLink}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-green-600 hover:scale-105 shadow-lg"
            >
              {copied ? (
                <>
                  <FiCheckCircle className="h-4 w-4" />
                  Link Copied!
                </>
              ) : (
                <>
                  <FiCopy className="h-4 w-4" />
                  Copy Invite Link
                </>
              )}
            </button>
            
        
          </div>
        </div>
      </div>
  );
}




