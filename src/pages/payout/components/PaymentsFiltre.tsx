interface PaymentsFilterProps {
  filter: "all" | "paid" | "unpaid";
  setFilter: (value: "all" | "paid" | "unpaid") => void;
}

const filters = [
  { key: "all", label: "All Records" },
  { key: "paid", label: "Paid" },
  { key: "unpaid", label: "Unpaid" },
];

export default function PaymentsFilter({ filter, setFilter }: PaymentsFilterProps) {
  return (
    <div className="inline-flex rounded-xl shadow-sm bg-slate-100 dark:bg-slate-700 p-1 mb-6" role="group">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setFilter(key as "all" | "paid" | "unpaid")}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
            ${filter === key
              ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg"
              : "text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600"}
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
