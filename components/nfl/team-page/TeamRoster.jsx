import Link from 'next/link';

export function TeamRoster({ roster }) {
    if (!roster || roster.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-slate-400 font-medium">No roster data available.</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {roster.map((group, index) => (
                <section key={index}>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
                            {group.position}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {group.items.map((player) => (
                            <Link href={`/nfl/players/${player.id}`} key={player.id} className="relative glass-card p-4 hover:border-orange-500/50 transition duration-300 group block">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                        <img
                                            src={player.headshot?.href || "https://a.espncdn.com/i/headshots/nfl/players/full/default.png"}
                                            alt={player.fullName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = "https://a.espncdn.com/i/headshots/nfl/players/full/default.png"; }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-gray-900 font-bold truncate pr-2 group-hover:text-orange-600 transition">{player.fullName}</h3>
                                            <span className="text-xs font-mono text-gray-400">#{player.jersey}</span>
                                        </div>
                                        <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">{player.position?.abbreviation}</div>
                                        <div className="text-[10px] text-gray-500 flex gap-2 font-medium">
                                            <span>{player.displayHeight}</span>
                                            <span>•</span>
                                            <span>{player.displayWeight}</span>
                                            {player.experience?.years > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>{player.experience.years} yr</span>
                                                </>
                                            )}
                                        </div>
                                        {player.college && (
                                            <div className="text-[10px] text-gray-400 truncate mt-1">{player.college.name}</div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
