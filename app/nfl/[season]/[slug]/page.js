import { getMatchupBySlug, getAllMatchupSlugs, getRelatedMatchups, getCanonicalTeamSlug } from "@/lib/topical-map";
import { getTeamSchedule } from "@/lib/nfl-service";
import MatchCard from "@/components/MatchCard";
import Link from "next/link";
import { notFound } from "next/navigation";

// SSG: Generate all 800+ pages at build time
export async function generateStaticParams() {
    const matchups = getAllMatchupSlugs();
    return matchups.map((matchup) => ({
        season: matchup.season,
        slug: matchup.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = params;
    const match = getMatchupBySlug(slug);

    if (!match) {
        return {
            title: "Match Not Found",
        };
    }

    return {
        title: `${match.keyword} | StatYards`,
        description: `Detailed player stats, scores, and analysis for ${match.home} vs ${match.away}.`,
    };
}

// Helper: Try to find real game data
async function getRealMatchData(matchMock, slug) {
    if (!slug) return null;

    // Use canonical slug to handle "Steelers" -> "pittsburgh-steelers"
    const homeSlug = getCanonicalTeamSlug(matchMock.home);

    try {
        const schedule = await getTeamSchedule(homeSlug);

        // Find the game vs Away Team
        // normalize away team name for comparison
        const targetAway = matchMock.away.toLowerCase();

        const realGame = schedule.find(g => {
            const oppName = g.opponent.name.toLowerCase();
            return oppName.includes(targetAway) || targetAway.includes(oppName);
        });

        if (realGame) {
            // Merge real data into mock object
            return {
                ...matchMock,
                // Override with real data
                homeScore: realGame.isHome ? realGame.score.split(' - ')[0] : realGame.score.split(' - ')[1],
                awayScore: realGame.isHome ? realGame.score.split(' - ')[1] : realGame.score.split(' - ')[0],
                date: realGame.date,
                status: (realGame.status === 'FINAL' || realGame.status === 'LIVE') ? realGame.status.toLowerCase() : 'upcoming',
                result: realGame.status === 'FINAL' ? realGame.score : null
                // Note: We might get "VS" as score if upcoming
            };
        }
    } catch (e) {
        console.warn("Could not fetch real data for matchup:", slug);
    }

    return matchMock;
}


export default async function MatchupPage({ params }) {
    const { slug, season } = params;

    // 1. Get base Topological/Link data (Mocked fallback)
    let match = getMatchupBySlug(slug);

    if (!match) {
        notFound();
    }

    // 2. Try to hydrate with REAL data
    match = await getRealMatchData(match, slug);

    const relatedMatchups = getRelatedMatchups(match);
    const isPast = match.status === 'past' || match.status === 'final';
    const isLive = match.status === 'live';

    return (
        <main className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Hero Section / Match Header */}
            <div className="relative bg-[#0f172a] text-white pt-24 pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400 font-medium tracking-wide">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/nfl/match-player-stats" className="hover:text-white transition-colors">NFL Stats</Link>
                            <span>/</span>
                            <span className="text-white font-semibold">{season} Season</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8 text-center leading-tight">
                            {match.home} <span className="text-gray-500 font-light mx-2">vs</span> {match.away}
                        </h1>

                        {/* Match Card integrated as Hero Element */}
                        <div className="transform scale-105 md:scale-110 shadow-2xl rounded-3xl">
                            <MatchCard match={match} type={match.status === 'final' ? 'past' : match.status} />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-1 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Main Content Column */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Analysis / Stats Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-1 h-8 bg-orange-500 rounded-full block"></span>
                                Match Analysis
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                <p>
                                    Get the complete player stats and matchup breakdown for the <strong>{match.home}</strong> vs <strong>{match.away}</strong> game.
                                    {isPast ?
                                        ` The match ended with a score of ${match.homeScore}-${match.awayScore}. Analysis confirms key defensive plays and offensive strategies that defined the outcome.` :
                                        ` Scheduled for ${match.date} at ${match.time}, this ${match.league} showdown promises to be a thriller. Check back for live updates and detailed player performance metrics.`
                                    }
                                </p>
                                <p className="mt-4">
                                    Our algorithmic predictions favor <strong>{parseInt(match.homeScore) > parseInt(match.awayScore) ? match.home : match.away}</strong> based on recent team performance and historical head-to-head records.
                                </p>

                                <div className="my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                    <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between border-b border-slate-200 pb-2">
                                            <span>Venue</span>
                                            <span className="font-medium text-slate-800">{match.stadium}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-slate-200 pb-2">
                                            <span>Projected Winner</span>
                                            <span className="font-medium text-slate-800">{parseInt(match.homeScore) > parseInt(match.awayScore) ? match.home : match.away}</span>
                                        </li>
                                        <li className="flex justify-between border-b border-slate-200 pb-2">
                                            <span>Opening Odds</span>
                                            <span className="font-medium text-slate-800">{match.odds}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Kickoff</span>
                                            <span className="font-medium text-slate-800">{match.date} • {match.time}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar / Related */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Related Matchups</h3>
                            <div className="space-y-4">
                                {relatedMatchups.length > 0 ? (
                                    relatedMatchups.map((related) => (
                                        <Link key={related.id} href={`/nfl/${related.season}/${related.slug}`} className="block group">
                                            <div className="p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md transition-all">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{related.date}</span>
                                                    {related.status === 'live' && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                                                </div>
                                                <div className="font-semibold text-slate-800 text-sm group-hover:text-orange-600 transition-colors">
                                                    {related.home} vs {related.away}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-slate-400 text-sm">No related matchups found.</p>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <Link href="/nfl/teams" className="flex items-center justify-between text-slate-600 hover:text-orange-600 font-medium transition-colors">
                                    <span>View All Teams</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
