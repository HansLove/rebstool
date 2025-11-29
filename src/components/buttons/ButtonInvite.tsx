import { useState } from "react";
import { FiLink } from "react-icons/fi";

interface InviteButtonProps {
  name: string;
  userSlug: string | null;
}

export default function InviteButton({ name, userSlug }: InviteButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyInviteLink = async () => {
    // Make sure slug is actually defined before using it
    const campaignParam = userSlug || "default"; // Provide a fallback value
    const inviteUrl = `https://go.puprime.partners/visit/?bta=41047&brand=pu&utm_campaign=${campaignParam}`;

    console.log("Using slug:", userSlug); // Debug: check if slug is coming through
    console.log("Generated URL:", inviteUrl);

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Resets after 2 seconds
    } catch (err) {
      console.error(":x: Failed to copy invite link:", err);
    }
  };

  return (
    <button
      onClick={handleCopyInviteLink}
      className="boton flex items-center relative"
    >
      <FiLink className="w-4 h-4 mr-2" />
      {copied ? "Copied!" : name}
      {copied && (
        <span className="absolute -top-5 right-0 bg-green-500 text-white text-xs rounded px-2 py-1">
          Link copied
        </span>
      )}
    </button>
  );
}
