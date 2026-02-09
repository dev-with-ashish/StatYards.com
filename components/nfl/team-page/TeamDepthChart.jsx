import Link from 'next/link';

export function TeamDepthChart({ depthChart }) {
    if (!depthChart || !Array.isArray(depthChart) || depthChart.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <div className="text-4xl mb-4">📋</div>
                <p className="text-slate-400 font-medium">No depth chart data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {depthChart.map((group, index) => (
                <section key={index}>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
                            {group.name}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-orange-500/50 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Handle both Object (old API) and Array (new Scraper) structures if needed, but primarily Array now */}
                        {Array.isArray(group.positions) ?
                            group.positions.map((posData, idx) => (
                                <div key={`depth-group-${index}-pos-${idx}`} className="glass-card overflow-hidden hover:border-orange-500/50 transition-colors">
                                    <div className="bg-white/50 px-4 py-2 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                                        <span className="font-bold text-gray-900 text-sm">{posData.name}</span>
                                        <span className="text-xs font-mono text-orange-600 font-bold">{posData.name}</span>
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {posData.athletes.map((athlete, i) => {
                                            const isLinked = athlete.id && !athlete.id.toString().startsWith('unlinked');
                                            const Content = (
                                                <div key={`athlete-content-${idx}-${i}`} className={`px-4 py-3 flex items-center gap-3 hover:bg-white/40 transition group ${isLinked ? 'cursor-pointer' : ''}`}>
                                                    <span className={`text-xs font-mono w-6 text-center rounded ${i === 0 ? 'bg-orange-100 text-orange-800 font-bold' : 'text-gray-500'}`}>{i + 1}</span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-sm font-medium truncate transition-colors ${isLinked ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-500'}`}>{athlete.fullName}</div>
                                                    </div>
                                                    <span className="text-xs text-gray-400 opacity-70">#{athlete.rank}</span>
                                                </div>
                                            );

                                            return isLinked ? (
                                                <Link key={`athlete-${idx}-${i}`} href={`/nfl/players/${athlete.id}`} className="block">
                                                    {Content}
                                                </Link>
                                            ) : (
                                                <div key={`athlete-${idx}-${i}`}>
                                                    {Content}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                            :
                            Object.entries(group.positions).map(([posKey, posData]) => (
                                <div key={posKey} className="glass-card overflow-hidden">
                                    {/* Fallback for old structure if ever needed */}
                                    <div className="bg-white/50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-sm">{posData.position.name}</span>
                                        <span className="text-xs font-mono text-orange-600">{posKey.toUpperCase()}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>
            ))}
        </div>
    );
}
