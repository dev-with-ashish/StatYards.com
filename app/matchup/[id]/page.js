"use client";

import { MATCHUP_DATA, LIVE_MATCHES, UPCOMING_MATCHES, PAST_MATCHES } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Helper to find match in any list
const findMatch = (id) => {
    const allGroups = [MATCHUP_DATA, LIVE_MATCHES, UPCOMING_MATCHES, PAST_MATCHES];
    for (const group of allGroups) {
        const found = group.find((m) => m.id === id);
        if (found) return found;
    }
    return null;
};

export default function MatchupPage({ params }) {
    const match = findMatch(params.id);

    if (!match) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Matchup Not Found</h1>
                <Link href="/" className="text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        )
    }

    // Calculate Mock Stats if history exists
    const hasHistory = match.history && match.history.length > 0;
    const average = hasHistory
        ? (match.history.reduce((a, b) => a + b.value, 0) / match.history.length).toFixed(1)
        : "N/A";

    const diff = average - match.statLine;
    const trend = diff > 0 ? "Above" : "Below";

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors">
                <ArrowLeft size={18} /> Back to Dashboard
            </Link>

            {/* Hero Card */}
            <article className="glass-card p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-orange-400 to-green-400" />

                <header className="text-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{match.league}</span>
                    <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{match.player || match.home} vs {match.opponent || match.away}</h1>
                </header>

                <section className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <span className="block text-sm font-semibold text-gray-500 mb-1">{match.statLabel || "Team Stat"}</span>
                        <div className="text-6xl font-mono font-bold text-gray-900 tracking-tighter">
                            {average}
                        </div>
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide mt-2 block">
                            Avg Last 5 Games
                        </span>
                    </div>

                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <div className="flex items-center justify-between w-full md:w-auto gap-4 text-sm font-medium text-gray-600">
                            <span>Line</span>
                            <span className="font-mono font-bold text-gray-900">{match.statLine || match.odds || "--"}</span>
                        </div>
                        <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95">
                            Bet {trend === 'Above' ? 'OVER' : 'UNDER'} {match.statLine}
                        </button>
                        <span className="text-[10px] text-gray-400">Odds via DraftKings. 21+.</span>
                    </div>
                </section>
            </article>

            {/* AI Analysis */}
            <section className="glass-card p-6 mb-8 bg-blue-50/50 border-blue-100">
                <h2 className="text-lg font-bold text-blue-900 mb-2">AI Analysis</h2>
                <p className="text-blue-800/80 leading-relaxed">
                    {match.player || "This team"} has averaged <strong>{average}</strong> {match.statLabel} in the last 5 matchups.
                    This is <strong>{Math.abs(diff).toFixed(1)}</strong> points {trend} the current line.
                    The trend suggests a high-value play on the {trend === 'Above' ? 'OVER' : 'UNDER'}.
                </p>
            </section>

            {/* History Table */}
            {hasHistory && (
                <section className="glass-card p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Historical Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-500 border-b border-gray-100">
                                <tr>
                                    <th className="py-2 font-semibold">Date</th>
                                    <th className="py-2 font-semibold">Opponent</th>
                                    <th className="py-2 font-semibold">Result</th>
                                    <th className="py-2 font-semibold text-right">Stat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {match.history.map((game, i) => (
                                    <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 font-medium text-gray-900">{game.date}</td>
                                        <td className="py-3 text-gray-500">{game.loc} {match.opponent}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${game.result.startsWith('W') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {game.result}
                                            </span>
                                        </td>
                                        <td className="py-3 font-mono font-bold text-gray-900 text-right">{game.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}
