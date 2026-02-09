
import { motion } from 'framer-motion';

export function TeamStats({ team, stats, playerStats }) {
    if ((!stats || stats.length === 0) && (!playerStats || playerStats.length === 0)) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-slate-400 font-medium">Stats data temporarily unavailable.</p>
            </div>
        );
    }

    // Prefer Player Stats Tables if available (Matches ESPN exact page)
    if (playerStats && playerStats.length > 0) {
        return (
            <div className="space-y-12">
                <h2 className="text-2xl font-black italic uppercase text-gray-900 mb-6">Team Statistics</h2>

                {playerStats.map((section, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-bold uppercase tracking-wider text-orange-600 border-l-4 border-orange-500 pl-3">
                            {section.title}
                        </h3>

                        <div className="overflow-x-auto glass-card shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-white/60 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-xs backdrop-blur-sm">
                                        {section.headers.map((h, i) => (
                                            <th key={i} className={`p-4 whitespace-nowrap ${i === 0 ? 'sticky left-0 bg-white/95 backdrop-blur-md z-10 border-r border-gray-100' : ''}`}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {section.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-white/40 transition-colors group">
                                            {row.map((cell, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    className={`p-4 whitespace-nowrap ${cIdx === 0
                                                        ? 'sticky left-0 bg-white/80 backdrop-blur-md font-bold text-gray-900 z-10 border-r border-gray-100 group-hover:bg-white/90'
                                                        : 'text-gray-700 font-mono'
                                                        }`}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Fallback to Team Aggregate Stats (Cards)
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black italic uppercase text-gray-900 mb-6">Team Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((category, idx) => (
                    <motion.div
                        key={category.name || idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 hover:border-orange-500/30 transition-colors"
                    >
                        <h3 className="text-lg font-bold uppercase tracking-wider text-orange-600 mb-4 border-b border-gray-100 pb-2">
                            {category.displayName || category.name}
                        </h3>

                        <div className="space-y-3">
                            {category.stats && category.stats.map((statItem, sIdx) => (
                                <div key={sIdx} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-medium">{statItem.displayName || statItem.name}</span>
                                    <span className="text-gray-900 font-mono font-bold">{statItem.displayValue || statItem.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
