interface TopAffiliateData {
  name: string;
  location?: string;
  avatarUrl?: string;
  persons: number;
  totalEarnings: number;
  progressPercent: number;
}

interface TopAffiliateProps {
  affiliate: TopAffiliateData | null;
}

export default function TopAffiliate({ affiliate }: TopAffiliateProps) {
  if (!affiliate) return null;

  return (
    <div className="[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.slate.600/.48))_border-box] rounded-2xl border border-transparent animate-border  p-5 text-white w-full">
      <h4 className="text-lg font-semibold mb-4">Top Sub-Affiliate</h4>
      
      <div className="flex items-center gap-4 ">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-indigo-500">
          <img
            src={affiliate.avatarUrl || "assets/images/users/avatar-6.jpg"}
            alt={affiliate.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h5 className="text-white text-base font-medium">{affiliate.name}</h5>
          {affiliate.location && (
            <p className="flex items-center text-sm text-slate-400">
             {affiliate.location}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-center">
        <div className="bg-slate-700 p-4 rounded-lg">
         
          <p className="text-2xl font-bold text-slate-100">{affiliate.persons}</p>
          <p className="text-xs uppercase text-slate-400">Persons</p>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg">
        
          <p className="text-2xl font-bold text-slate-100">
            ${affiliate.totalEarnings.toLocaleString()}
          </p>
          <p className="text-xs uppercase text-slate-400">Earnings</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Target: 50 users</span>
          <span>{affiliate.progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600"
            style={{ width: `${affiliate.progressPercent}%` }}
          />
        </div>
      </div>

      <button className="mt-5 flex items-center justify-center w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">
        Send Message
      </button>
    </div>
  );
}
