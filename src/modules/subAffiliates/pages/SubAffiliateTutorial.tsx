import { useState } from "react";
import {
  Rocket,
  Link,
  Wallet2,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Shield,
  Clock,
  Target,
  Users,
  DollarSign,
  Share2,
  MessageSquare,
  Globe,
  Smartphone,
  Monitor,
  Copy,
  ExternalLink,
  Info,
} from "lucide-react";

// Tab configuration
const tabs = [
  {
    id: "start",
    label: "Getting Started",
    icon: <Rocket className="w-5 h-5" />,
  },
  {
    id: "invite",
    label: "Invite & Share",
    icon: <Link className="w-5 h-5" />,
  },
  {
    id: "payment",
    label: "Setup Payments",
    icon: <Wallet2 className="w-5 h-5" />,
  },
  {
    id: "marketing",
    label: "Marketing Tools",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    id: "earnings",
    label: "Track Earnings",
    icon: <TrendingUp className="w-5 h-5" />,
  },
];

const SubAffiliateTutorial = () => {
  const [activeTab, setActiveTab] = useState("start");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "start":
        return <GettingStartedContent />;
      case "invite":
        return <InviteShareContent />;
      case "payment":
        return <SetupPaymentsContent />;
      case "marketing":
        return <MarketingToolsContent />;
      case "earnings":
        return <TrackEarningsContent />;
      default:
        return <GettingStartedContent />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Affill Quick Start Guide
        </h1>
        <p className="text-indigo-100 text-sm sm:text-base">
          Everything you need to know to start earning commissions with your
          affiliate network
        </p>
      </div>

      {/* Mobile: Horizontal Scrollable Tabs */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap snap-start transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tab.icon}
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop & Mobile: Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop: Vertical Sidebar Tabs */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <nav className="sticky top-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                {tab.icon}
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 lg:p-8 min-h-[600px]">
          {renderActiveTabContent()}
        </div>
      </div>
    </div>
  );
};

// ========== TAB CONTENT COMPONENTS ==========

const GettingStartedContent = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome to Affill
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Your journey to earning commissions begins here
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Affill is a powerful affiliate management platform that helps you
          build and manage your referral network. Earn commissions by inviting
          new users, sharing your unique referral link, and building a
          sustainable income stream through blockchain-powered smart contracts.
        </p>
      </div>

      {/* Quick Start Checklist */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Quick Start Checklist
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Get your unique invite link
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Access your personalized referral link from the dashboard
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Configure your payment address
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Add your USDT-MATIC wallet to receive commissions
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Share your link
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Start inviting users through social media, communities, or
                direct outreach
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Track your earnings
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Monitor commissions, network growth, and claim rewards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline to First Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
            Day 1-3
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Set up account, get invite link, configure payment address
          </p>
        </div>
        <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
            Week 1-2
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Share your link, invite first users, build initial network
          </p>
        </div>
        <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
            Week 2+
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            First commissions arrive, scale network, claim earnings
          </p>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Pro Tips for Success
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Focus on quality over quantity - engaged users generate better
                  long-term earnings
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Personalize your outreach message to resonate with your target
                  audience
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Use marketing tools (banners, QR codes) to increase conversion
                  rates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Track which channels perform best and double down on what
                  works
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/30 dark:to-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
        <div>
          <p className="font-semibold text-slate-800 dark:text-white mb-1">
            Ready to get your invite link?
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Continue to the next section to learn how
          </p>
        </div>
        <ArrowRight className="w-6 h-6 text-indigo-500" />
      </div>
    </div>
  );
};

const InviteShareContent = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <Link className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Invite & Share
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Build your network and start earning commissions
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Your unique referral link is the key to building your affiliate
          network. Every person who signs up through your link becomes part of
          your network, and you earn commissions on their activity.
        </p>
      </div>

      {/* How to Access Your Link */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Accessing Your Invite Link
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Navigate to your dashboard
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Look for the "Invite" button in the top navigation bar of your
                dashboard
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Click "Invite" to open the invitation modal
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                A modal will appear showing your personalized referral link and
                QR code
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Copy your link and start sharing
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Click the copy button to instantly copy your link to clipboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Your Link Format Example */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Your link will look like this:
          </p>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 flex items-center justify-between">
          <code>https://affill.com/signup?ref=YOUR_CODE</code>
          <Copy className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </div>
      </div>

      {/* Best Places to Share */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-500" />
          Best Places to Share Your Link
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Social Media
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Share on Twitter, LinkedIn, Facebook, Instagram, or TikTok to
              reach your existing audience
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                Twitter
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                LinkedIn
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                Facebook
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Communities & Forums
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Engage in relevant Discord servers, Telegram groups, Reddit
              communities, or niche forums
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Discord
              </span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Telegram
              </span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Reddit
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Direct Messaging
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Reach out to your network through WhatsApp, email, or direct
              messages with personalized context
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                WhatsApp
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                Email
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                SMS
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3">
              <Monitor className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Content Creation
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Create blog posts, YouTube videos, podcasts, or newsletters
              featuring your affiliate link
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                Blog
              </span>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                YouTube
              </span>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                Newsletter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Example Message Templates */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-fuchsia-500" />
          Example Message Templates
        </h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Social Media Post
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm italic">
              "I've been using Affill to earn passive income through my
              referral network. If you're interested in affiliate marketing with
              blockchain-powered commissions, check it out: [YOUR_LINK]"
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              Direct Message
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm italic">
              "Hey [Name], I thought you might be interested in this affiliate
              platform I'm using. It has transparent commission tracking and
              crypto payouts. Here's my invite link if you want to check it
              out: [YOUR_LINK]"
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Sharing Best Practices
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Always provide context - explain why you're sharing and what
                  value it offers
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Be transparent that it's a referral link - authenticity builds
                  trust
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Target audiences interested in affiliate marketing, passive
                  income, or crypto
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Use marketing tools (next section) to create professional
                  promotional materials
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const SetupPaymentsContent = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
          <Wallet2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Setup Payments
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Configure your wallet to receive commission payouts
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          To receive your earned commissions, you need to configure a
          USDT-MATIC compatible wallet address. All commission payouts are
          processed through blockchain smart contracts for transparency and
          security.
        </p>
      </div>

      {/* What is USDT-MATIC */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            About USDT on Polygon (MATIC)
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
          USDT (Tether) is a stablecoin pegged to the US Dollar, providing
          stable value for your earnings. We use the Polygon network (MATIC)
          for fast, low-cost transactions compared to Ethereum mainnet.
        </p>
        <div className="bg-white dark:bg-slate-700/50 rounded-lg p-4 border border-blue-200 dark:border-blue-600/50">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mb-2">
            Why Polygon?
          </p>
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Near-instant transaction confirmations (2-3 seconds)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Extremely low gas fees (fractions of a cent)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>
                Fully compatible with Ethereum wallets (MetaMask, etc.)
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* How to Set Up Your Wallet Address */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          Setting Up Your Payment Address
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Navigate to your account settings
              </p>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 border-l-4 border-green-500 mt-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>Where to find it:</strong> Click your profile icon →
                  Settings → Payment Address
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Get your Polygon wallet address
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                If you don't have a wallet yet, create one using MetaMask,
                Trust Wallet, or any Polygon-compatible wallet. Make sure you
                select the Polygon network.
              </p>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-3 border-l-4 border-green-500 mt-2">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <strong>Example wallet address format:</strong>
                </p>
                <div className="bg-slate-900 rounded p-2 font-mono text-xs text-green-400 mt-2 break-all">
                  0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Enter and save your wallet address
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Copy your wallet address from your wallet app and paste it into
                the Payment Address field. Double-check for accuracy before
                saving.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Verify your address is saved
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                You should see a confirmation message. Your address will be
                displayed in your settings and used for all future commission
                payouts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Security Best Practices
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>
                  <strong>Never share your private key or seed phrase</strong> -
                  Only your public wallet address is needed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>
                  <strong>Double-check the address before saving</strong> -
                  Incorrect addresses can't be recovered
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>
                  <strong>Use a secure wallet</strong> - Prefer hardware wallets
                  or reputable software wallets
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <span>
                  <strong>Test with a small amount first</strong> - Verify your
                  setup works before larger payouts
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recommended Wallets */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Wallet2 className="w-5 h-5 text-purple-500" />
          Recommended Wallets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600 group hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mb-3">
              <Wallet2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center justify-between">
              MetaMask
              <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Most popular browser extension wallet with full Polygon support.
              Great for beginners.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                Browser
              </span>
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">
                Mobile
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600 group hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center justify-between">
              Trust Wallet
              <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Popular mobile wallet with built-in dApp browser and multi-chain
              support.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                Mobile
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600 group hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center justify-between">
              Ledger
              <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Hardware wallet for maximum security. Best for large balances and
              long-term storage.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Hardware
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600 group hover:border-green-300 dark:hover:border-green-600 transition-colors">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
              <Wallet2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center justify-between">
              Rainbow Wallet
              <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Modern, user-friendly wallet with beautiful interface and advanced
              features.
            </p>
            <div className="flex gap-2">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                Mobile
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                Browser
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Payment Setup Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  You can update your payment address anytime, but it's best to
                  set it up before earning commissions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Make sure you control the wallet - exchanges and custodial
                  services may not work
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Keep a backup of your wallet's seed phrase in a secure,
                  offline location
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketingToolsContent = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Marketing Tools
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Boost your conversions with professional marketing assets
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Affill provides a comprehensive suite of marketing tools to help you
          promote your referral link effectively. From customizable banners to
          QR codes, these assets are designed to maximize your conversion rates
          across different channels.
        </p>
      </div>

      {/* How to Access */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Accessing Marketing Tools
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-700/50 rounded-lg p-4 border border-purple-200 dark:border-purple-600/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <strong>Where to find it:</strong> Navigate to{" "}
            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-purple-600 dark:text-purple-400">
              Marketing Tools
            </span>{" "}
            in your dashboard sidebar
          </p>
        </div>
      </div>

      {/* Available Tools */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          Available Marketing Assets
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Banners */}
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-full h-24 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center mb-4">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Custom Banners
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Pre-designed banner ads in various sizes (728x90, 300x250,
              160x600) ready to embed on websites or social media.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Multiple Sizes
              </span>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                Download
              </span>
            </div>
          </div>

          {/* QR Codes */}
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-full h-24 bg-slate-100 dark:bg-slate-600 rounded-lg flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-slate-800 dark:bg-slate-200 rounded grid grid-cols-4 gap-0.5 p-1">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-800 rounded-sm"
                  ></div>
                ))}
              </div>
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              QR Codes
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Scannable QR codes linked to your referral URL, perfect for
              print materials, events, or offline promotion.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                High Resolution
              </span>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                SVG/PNG
              </span>
            </div>
          </div>

          {/* Tracking Links */}
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-full h-24 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Link className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Custom Tracking Links
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Create unique tracking links with custom parameters to identify
              which campaigns perform best.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                Analytics
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                Customizable
              </span>
            </div>
          </div>

          {/* Social Media Graphics */}
          <div className="bg-white dark:bg-slate-700/50 rounded-xl p-5 border border-slate-200 dark:border-slate-600">
            <div className="w-full h-24 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Social Media Graphics
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Optimized images for Instagram, Twitter, Facebook posts with your
              referral link embedded.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                Platform Ready
              </span>
              <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-2 py-1 rounded">
                Editable
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Use Cases */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-fuchsia-500" />
          When to Use Each Tool
        </h3>
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <Monitor className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white mb-1">
                  Banners
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Best for website sidebars, blog posts, email newsletters, or
                  partner sites where visual ads work well.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white mb-1">
                  QR Codes
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Perfect for physical flyers, business cards, presentations, or
                  in-person events where quick mobile access is needed.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white mb-1">
                  Tracking Links
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Use when running multiple campaigns simultaneously to identify
                  which sources (email, social, forums) perform best.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-white mb-1">
                  Social Media Graphics
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Ideal for Instagram stories, Twitter posts, Facebook updates,
                  or LinkedIn articles to catch attention in feeds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Marketing Tool Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  A/B test different banner designs to see which generates more
                  clicks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Use tracking links with unique parameters for each campaign to
                  measure ROI
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Customize social graphics with your own branding for better
                  engagement
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Combine multiple tools - use QR codes on banners or track
                  social media performance
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Link to Marketing Tools Page */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-700/50">
        <div>
          <p className="font-semibold text-slate-800 dark:text-white mb-1">
            Ready to create your marketing materials?
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Visit the Marketing Tools page to download and customize your assets
          </p>
        </div>
        <ExternalLink className="w-6 h-6 text-purple-500 flex-shrink-0" />
      </div>
    </div>
  );
};

const TrackEarningsContent = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Track Your Earnings
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Monitor commissions, network growth, and claim rewards
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Your dashboard provides real-time insights into your affiliate
          performance. Track earnings, monitor network growth, and manage
          commission claims all in one place with transparent blockchain-powered
          smart contracts.
        </p>
      </div>

      {/* Understanding Your Dashboard */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-500" />
          Understanding Your Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Ready to Pay
              </div>
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              $427.50
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Commissions available for immediate claim. These funds are ready
              to be withdrawn to your wallet.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border-2 border-dashed border-green-500">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                Smart Contract Balance
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Live
                </span>
              </div>
              <Wallet2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              $2,850.00
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Total funds in your sponsor's smart contract vault, including
              future scheduled payments.
            </p>
          </div>
        </div>
      </div>

      {/* How Commissions Work */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            How Commissions Are Calculated
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                User Signs Up via Your Link
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                When someone registers using your unique referral link, they're
                automatically tracked as part of your network.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                User Makes a Deposit
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                When your referred user deposits funds into the platform, a
                commission is calculated based on the deposit amount.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Smart Contract Processes Payment
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                The blockchain smart contract automatically allocates your
                commission percentage and adds it to your available balance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              4
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
                Claim Your Earnings
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Once commissions are available, you can claim them anytime
                directly to your configured wallet address.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Example Commission Breakdown */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          Example Commission Breakdown
        </h3>
        <div className="bg-white dark:bg-slate-700/50 rounded-xl p-6 border border-slate-200 dark:border-slate-600">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-600">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  User Deposit Amount
                </p>
                <p className="text-lg font-semibold text-slate-800 dark:text-white">
                  $1,000.00 USDT
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Commission Rate
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  5%
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-600">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Commission
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $50.00 USDT
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                If you refer 10 users who each deposit $1,000:
              </p>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Total Potential Earnings
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $500.00 USDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Contract Transparency */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-slate-800 dark:text-white">
            Blockchain Smart Contract Transparency
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          All commission payments are processed through auditable smart
          contracts on the Polygon blockchain. This ensures:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                Transparent Tracking
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                View all transactions on the blockchain
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                Automated Payments
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                No manual intervention required
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                Immutable Records
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Permanent, tamper-proof history
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                Instant Updates
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">
                Real-time balance synchronization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* When to Claim */}
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          When and How to Claim Earnings
        </h3>
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-700/50 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <p className="font-medium text-slate-800 dark:text-white mb-2">
              Claiming Process
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  1.
                </span>
                <span>
                  Navigate to your dashboard and check your "Ready to Pay"
                  balance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  2.
                </span>
                <span>
                  Click the "Claim" button when you have an available balance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  3.
                </span>
                <span>
                  Confirm the blockchain transaction in your wallet (small gas
                  fee required)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  4.
                </span>
                <span>
                  Funds arrive in your configured wallet within 1-3 minutes
                </span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
            <p className="font-medium text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Claim Frequency
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You can claim earnings anytime, but it's recommended to accumulate
              a larger balance before claiming to optimize gas fee efficiency
              (gas fees are typically less than $0.01 on Polygon).
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-2">
              Earnings Tracking Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Check your dashboard daily to monitor network growth and new
                  commissions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Use analytics to identify which referral sources generate the
                  most revenue
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Set earnings goals and track progress to stay motivated
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-600 dark:text-yellow-400" />
                <span>
                  Keep your wallet secure - never share your private keys or
                  seed phrase
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Final Note */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700/50 text-center">
        <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
          Questions about your earnings?
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Contact support or check our Help Center for detailed information
          about commission structures and payment processing
        </p>
      </div>
    </div>
  );
};

export default SubAffiliateTutorial;
