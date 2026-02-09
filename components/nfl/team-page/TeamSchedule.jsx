
import Link from 'next/link';
import { getTeamLogo } from '@/lib/nfl-assets';

export function TeamSchedule({ schedule, team }) {
    if (!schedule || schedule.length === 0) {
        return (
            <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                <div className="text-4xl mb-4">🏈</div>
                <p className="text-slate-400 font-medium">No schedule data available for this team currently.</p>
                <p className="text-slate-600 text-sm mt-2">Check back later for confirmed listings.</p>
            </div>
        );
    }

    // Group by Season
    const gamesBySeason = {};
    schedule.forEach(game => {
        const seasonKey = game.season.toString();
        if (!gamesBySeason[seasonKey]) gamesBySeason[seasonKey] = [];
        gamesBySeason[seasonKey].push(game);
    });

    const seasons = Object.keys(gamesBySeason).sort().reverse();

    return (
        <div className="space-y-12">
            {seasons.map(season => (
                <section key={season}>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
                            {season} Season
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gamesBySeason[season].map((game) => (
                            <div
                                key={game.id}
                                className="glass-card group relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
                            >
                                {/* Status Bar */}
                                <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100/50 bg-white/40">
                                    <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{game.date}</span>
                                    <div className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${game.status === 'LIVE' ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' :
                                        game.status === 'FINAL' ? (game.result === 'W' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-100') :
                                            'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                        {game.status === 'FINAL' ? `${game.result} • FINAL` : game.status}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        {/* Us */}
                                        <div className="flex flex-col items-center gap-3 w-1/3">
                                            <div className="w-16 h-16 bg-white rounded-full p-3 flex items-center justify-center border border-gray-100 shadow-sm">
                                                <img src={getTeamLogo(team.name)} className="w-full h-full object-contain" alt={team.name} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-800 text-center uppercase tracking-wide leading-tight line-clamp-2">{team.name}</span>
                                        </div>

                                        {/* Score */}
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-2xl font-black text-gray-900 font-mono tracking-tighter">{game.score}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">{game.isHome ? 'VS' : '@'}</span>
                                        </div>

                                        {/* Opponent */}
                                        <div className="flex flex-col items-center gap-3 w-1/3">
                                            <div className="w-16 h-16 bg-white rounded-full p-3 flex items-center justify-center border border-gray-100 shadow-sm">
                                                <img src={game.opponent.logo} className="w-full h-full object-contain" alt={game.opponent.name} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-800 text-center uppercase tracking-wide leading-tight line-clamp-2">{game.opponent.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <Link
                                    href={`/nfl/${game.season}/${team.slug}-vs-${game.opponent.slug?.toLowerCase().replace(/\s/g, '-')}-match-player-stats`}
                                    className="block w-full py-3 bg-white/40 hover:bg-orange-600 hover:text-white transition text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center border-t border-white/20 group-hover:border-transparent"
                                >
                                    Match Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
