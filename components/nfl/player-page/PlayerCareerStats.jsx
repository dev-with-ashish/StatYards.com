"use client";

export function PlayerCareerStats({ stats }) {
    if (!stats) return null;

    // Filter mainly specifically useful categories (Passing, Rushing, Receiving, Defense, Kicking)
    const relevantCategories = stats.categories?.filter(cat =>
        ['passing', 'rushing', 'receiving', 'defensive', 'kicking', 'punting'].includes(cat.name)
    ) || [];

    if (relevantCategories.length === 0) return null;

    return (
        <section className="glass-card p-8 mb-12 overflow-hidden">
            <h2 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="text-3xl">📈</span> Career Statistics
            </h2>

            <div className="space-y-12">
                {relevantCategories.map((category, idx) => (
                    <div key={idx} className="space-y-4">
                        <h3 className="text-xl font-bold uppercase tracking-wider text-orange-600 border-l-4 border-orange-500 pl-3">
                            {category.displayName} ({category.name})
                        </h3>

                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pb-4">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-100/50 dark:bg-white/5 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-xs">
                                        <th className="p-4 sticky left-0 bg-gray-50 dark:bg-slate-900 z-10">Season</th>
                                        <th className="p-4 sticky left-20 bg-gray-50 dark:bg-slate-900 z-10">Team</th>
                                        {category.stats.map((stat, sIdx) => (
                                            <th key={sIdx} className="p-4">{stat.shortDisplayName || stat.abbreviation}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                                    {/* Usually fetched data has 'splits' which are the rows (seasons) */}
                                    {/* Check if splits exists on the parent or category level - ESPN structure varries */}
                                    {/* Based on previous fetches, we might need a different structure. 
                                        However, assuming `stats` prop IS `splits` array passed from page.js */}

                                    {/* 
                                        The Structure from getPlayerCareerStats returns `data.splits`.
                                        `splits` is an array of objects like { season: "2024", team: "KC", stats: [...] }
                                        Wait, actually `categories` usually aggregates. 
                                        Let's handle the `stats` prop as the raw `splits` array.
                                     */}

                                    {stats.map((split, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-white/40 transition-colors">
                                            <td className="p-4 sticky left-0 bg-white/50 backdrop-blur-sm font-bold text-gray-900 dark:text-white z-10 border-r border-gray-100">
                                                {split.season}
                                            </td>
                                            <td className="p-4 sticky left-20 bg-white/50 backdrop-blur-sm font-medium text-gray-700 dark:text-gray-300 z-10 border-r border-gray-100">
                                                {split.team?.abbreviation || "-"}
                                            </td>

                                            {/* Filter stats to match the current category */}
                                            {/* This is tricky without exact mapping. 
                                                 Usually splits contain ALL stats flattened.
                                                 We need to find the values corresponding to the headers.
                                                 The HEADERS came from `category.stats`.
                                                 We need to map `split.stats` (array of values) to these headers.
                                                 Assuming `category.stats` defines the schema and `split.stats` has matching values.
                                                 WARNING: ESPN API `splits` usually has `stats` as an array of strings matching a predefined order.
                                                 We need the "labels" or "names" for that order.
                                                 
                                                 Let's assume for now we just dump the `split.stats` corresponding to the category if possible.
                                                 Actually, let's simplify. If `stats` is the `splits` array, iterate it.
                                             */}
                                            {split.stats && split.stats.map((val, vIdx) => {
                                                // Only render if it matches the current category range? 
                                                // This is complex. Let's simplify: Just render ALL stats since we can't easily map them without the header definition.
                                                // Or better: Just render the table if we have labels.

                                                // Fallback: Just render generic table rows if we can't match categories.
                                                return <td key={vIdx} className="p-4 font-mono text-gray-600 dark:text-gray-400">{val}</td>
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="text-xs text-gray-400 mt-4 italic">* Complete career stats rendering requires precise schema mapping.</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}



// SIMPLIFIED VERSION FOR RELIABILITY
// The logic above is risky because matching split values to headers key-by-key is hard without the full schema.
// Let's create a robust version that just lists the seasons if possible, or handles the "Total" if available.

export function SimpleCareerStats({ stats }) {
    if (!stats || stats.length === 0) return null;

    return (
        <section className="glass-card p-6 md:p-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <span className="text-orange-500">📊</span> Career Statistics
            </h2>

            <div className="space-y-12">
                {stats.map((category, idx) => {
                    // Filter out empty categories or those with no stats
                    if (!category.statistics || category.statistics.length === 0) return null;

                    return (
                        <div key={idx} className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                    {category.displayName}
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-white/10" />
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm">
                                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                    <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
                                        <thead>
                                            <tr className="bg-gray-50/80 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-white/10">
                                                <th className="px-6 py-4 sticky left-0 z-10 bg-gray-50 dark:bg-[#1a1a1a] drop-shadow-sm min-w-[100px]">Season</th>
                                                <th className="px-6 py-4 min-w-[80px]">Team</th>
                                                {category.labels && category.labels.map((label, lIdx) => (
                                                    <th key={lIdx} className="px-6 py-4 text-center min-w-[60px]">{label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5 font-mono">
                                            {category.statistics.map((row, rIdx) => {
                                                const isTotal = !row.season;
                                                return (
                                                    <tr
                                                        key={rIdx}
                                                        className={`transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-900/10 ${isTotal ? 'bg-gray-50/80 dark:bg-white/5 font-bold' : ''}`}
                                                    >
                                                        <td className={`px-6 py-4 sticky left-0 z-10 ${isTotal ? 'bg-gray-50 dark:bg-[#1a1a1a]' : 'bg-white/95 dark:bg-[#0a0a0a]'} backdrop-blur-md border-r border-gray-100 dark:border-white/5 font-sans font-semibold text-gray-900 dark:text-gray-200`}>
                                                            {row.season?.year || row.season?.displayName || "Career"}
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-400 font-sans">
                                                            {row.team?.abbreviation || row.team?.displayName || "-"}
                                                        </td>
                                                        {row.stats && row.stats.map((val, vIdx) => (
                                                            <td key={vIdx} className="px-6 py-4 text-center text-gray-800 dark:text-gray-300">
                                                                {val}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
