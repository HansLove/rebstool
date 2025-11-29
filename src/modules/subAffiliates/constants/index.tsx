import { Users, DollarSign, Target, Rocket, Star } from "lucide-react";
import { FiShare2 } from "react-icons/fi";

export const templates = [
    {
      id: 0,
      name: "Standard Invite",
      keyword: "invite",
      icon: <Users className="h-4 w-4" />,
      description: "Professional invitation for business contacts",
      color: "blue"
    },
    {
      id: 1,
      name: "Premium Partner",
      keyword: "partner",
      icon: <Star className="h-4 w-4" />,
      description: "Exclusive invitation for high-value partners",
      color: "purple"
    },
    {
      id: 2,
      name: "Quick Start",
      keyword: "start",
      icon: <Rocket className="h-4 w-4" />,
      description: "Fast-track invitation for immediate action",
      color: "green"
    }
];

export const steps = [
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      title: "Choose Your Template",
      description: "Select the invitation style that best fits your audience and message."
    },
    {
      icon: <FiShare2 className="h-5 w-5 text-green-500" />,
      title: "Share Your Link",
      description: "Send the personalized invitation link to potential sub-affiliates."
    },
    {
      icon: <Target className="h-5 w-5 text-yellow-500" />,
      title: "They Join Your Network",
      description: "When they click your link, they'll register and become your sub-affiliate."
    },
    {
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      title: "Start Earning Together",
      description: "Both you and your sub-affiliate earn commissions from their activities."
    }
  ];