import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUniqueTeams } from '@/lib/topical-map';
import { getTeamLogo } from '@/lib/nfl-assets';
import { getTeamSchedule } from '@/lib/nfl-service';

// Standard SSG for Team Pages
export async function generateStaticParams() {
    const teams = getUniqueTeams();
    return teams.map((team) => ({
        team: team.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { team: teamSlug } = await params;
    const teams = getUniqueTeams();
    const team = teams.find(t => t.slug === teamSlug);

    if (!team) {
        return { title: 'Team Not Found' };
    }

    return {
        title: `${team.name} 2024-25 Schedule & Stats | StatYards`,
        description: `View the confirmed 2024-2025 schedule, live results, and past scores for the ${team.name}.`,
    };
}

export default async function TeamHubPage({ params }) {
    const { team: teamSlug } = await params;
    const teams = getUniqueTeams();
    const team = teams.find(t => t.slug === teamSlug);

    if (!team) {
        notFound();
    }

    // Fetch REAL Schedule
    const schedule = await getTeamSchedule(team.slug);

    // Group by Season (API might return pre-season too, usually we just want the current one)
    const gamesBySeason = {};
    if (schedule && schedule.length > 0) {
        schedule.forEach(game => {
            const seasonKey = game.season.toString();
            if (!gamesBySeason[seasonKey]) gamesBySeason[seasonKey] = [];
            gamesBySeason[seasonKey].push(game);
        });
    }

    const seasons = Object.keys(gamesBySeason).sort().reverse(); // 2024, 2023...


    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-orange-500/30">

            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* Breadcrumbs */}
                <nav className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-8">
                    <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
                    <span className="mx-2 text-slate-700">/</span>
                    <Link href="/nfl/match-player-stats" className="hover:text-white transition-colors duration-200">NFL</Link>
                    <span className="mx-2 text-slate-700">/</span>
                    <Link href="/nfl/teams" className="hover:text-white transition-colors duration-200">Teams</Link>
                    <span className="mx-2 text-slate-700">/</span>
                    <span className="text-orange-500">{team.name}</span>
                </nav>

                {/* Hero */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-800 to-black border border-white/5 p-8 md:p-12 mb-16 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[128px] pointer-events-none -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 md:w-40 md:h-40 p-6 bg-white rounded-2xl shadow-lg flex items-center justify-center shrink-0 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img
                                src={getTeamLogo(team.name)}
                                alt={team.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                                {team.name}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-4 text-sm md:text-base text-slate-400 font-medium">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    2024-25 Season Active
                                </span>
                                <span className="hidden md:inline text-slate-700">•</span>
                                <span>Official Schedule & Results</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Output Seasons */}
                {seasons.map(season => (
                    <section key={season} className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                                {season} Season
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent"></div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gamesBySeason[season].map((game) => (
                                <div
                                    key={game.id}
                                    className="group relative bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition duration-300"
                                >
                                    {/* Status Bar */}
                                    <div className="flex justify-between items-center px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{game.date}</span>
                                        <div className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${game.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' :
                                            game.status === 'FINAL' ? (game.result === 'W' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20') :
                                                'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                                            }`}>
                                            {game.status === 'FINAL' ? `${game.result} • FINAL` : game.status}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* Us */}
                                            <div className="flex flex-col items-center gap-3 w-1/3">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/5">
                                                    <img src={getTeamLogo(team.name)} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-wide leading-tight line-clamp-2">{team.name}</span>
                                            </div>

                                            {/* Score */}
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-2xl font-black text-white font-mono tracking-tighter">{game.score}</span>
                                                <span className="text-[10px] text-slate-600 font-bold uppercase">{game.isHome ? 'VS' : '@'}</span>
                                            </div>

                                            {/* Opponent */}
                                            <div className="flex flex-col items-center gap-3 w-1/3">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/5">
                                                    <img src={game.opponent.logo} className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-wide leading-tight line-clamp-2">{game.opponent.name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <Link
                                        href={`/nfl/${game.season}/${team.slug}-vs-${game.opponent.slug?.toLowerCase().replace(/\s/g, '-')}-match-player-stats`}
                                        className="block w-full py-3 bg-white/[0.03] hover:bg-orange-600 hover:text-white transition text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center border-t border-white/5 group-hover:border-transparent"
                                    >
                                        Match Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {seasons.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-white/5">
                        <div className="text-4xl mb-4">🏈</div>
                        <p className="text-slate-400 font-medium">No schedule data available for this team currently.</p>
                        <p className="text-slate-600 text-sm mt-2">Check back later for correct 2024-2025 listings.</p>
                    </div>
                )}

            </div>
        </main>
    );
}
