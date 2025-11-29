
import WhatsappConversationExample from "@/components/examples/WhatsappConversationExample";
import ShareAndEarnGuide from "./ShareAndEarnGuide";

export default function MarketingLab() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-7xl mx-auto py-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Marketing Tools</h1>
        <p className="text-indigo-100">Learn how to share your invitation and maximize your earnings</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: WhatsApp Conversation Example */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl border border-indigo-700 shadow-lg overflow-hidden p-6 lg:p-8 flex items-center justify-center min-h-[600px]">
          <WhatsappConversationExample />
        </div>

        {/* Right: Share and Earn Guide */}
        <div className="flex items-start">
          <ShareAndEarnGuide />
        </div>
      </div>
    </div>
  );
}
