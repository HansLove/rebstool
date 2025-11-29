import { Globe, Link as LinkIcon, ClipboardCheck, DollarSign } from "lucide-react";

export const subSteps = [
  {
    title: "Share the Exclusive Invitation",
    label: "Create Interest",
    icon: <Globe className="text-purple-400" size={24} />,
    mainText: "Send your VIP link — worth $200/month, free through you.",
    details: [
      {
        icon: <LinkIcon size={18} />,
        heading: "VIP Link",
        text: `Share: ${'"https://marco15469.wixsite.com/switzyarmy"'}`,
      },
      {
        heading: "Highlight the Value",
        text: "Only your link unlocks instant access.",
      },
    ],
  },
  {
    title: "They Register & Deposit",
    label: "Earn Commission",
    icon: <ClipboardCheck className="text-sky-400" size={24} />,
    mainText: "Registration + $300+ deposit through your broker link = your commission.",
    details: [
      {
        heading: "Broker Link",
        text: "Earn commission on signup + deposit.",
      },
      {
        heading: "$300 Minimum",
        text: "Unlocks your crypto reward.",
      },
    ],
  },
  {
    title: "Get Verified & Paid",
    label: "Claim Reward",
    icon: <DollarSign className="text-green-400" size={24} />,
    mainText: "Collect their info, we verify, you get paid in USDT.",
    details: [
      {
        heading: "Verification Form",
        text: "Telegram handle + email only.",
      },
      {
        heading: "We Onboard",
        text: "Add them to private channels.",
      },
      {
        heading: "Instant Payout",
        text: "USDT credited to your wallet.",
      },
    ],
  },
];
