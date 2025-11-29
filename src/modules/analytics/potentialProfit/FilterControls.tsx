interface FilterControlsProps {
    minDeposit: number;
    setMinDeposit: (v: number) => void;
    minVolume: number;
    setMinVolume: (v: number) => void;
    nameFilter: string;
    setNameFilter: (s: string) => void;
}

export function FilterControls({
    minDeposit,
    setMinDeposit,
    minVolume,
    setMinVolume,
    nameFilter,
    setNameFilter,
}: FilterControlsProps) {
    return (

        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    className="border p-2 rounded w-full text-sm"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                <div className="flex flex-col">
                    <label htmlFor="minDeposit" className="text-sm text-slate-700 dark:text-white mb-1">
                        Min Deposit
                    </label>
                    <input
                        id="minDeposit"
                        type="number"
                        className="border dark:bg-slate-900 dark:text-white bg-slate-50 text-slate-700 p-2 rounded text-sm w-full focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
                        value={minDeposit}
                        onChange={e => setMinDeposit(+e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="minVolume" className="text-sm text-slate-700 dark:text-white mb-1">
                        Min Volume
                    </label>
                    <input
                        id="minVolume"
                        type="number"
                        className="border dark:bg-slate-900 dark:text-white bg-slate-50 text-slate-700 p-2 rounded text-sm w-full focus:border-purple-500 focus:ring-purple-500 focus:outline-none"
                        value={minVolume}
                        onChange={e => setMinVolume(+e.target.value)}
                    />
                </div>
            </div>
        </>
    );
}
