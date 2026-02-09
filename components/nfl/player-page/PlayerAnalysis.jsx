"use client";
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { StatRing } from "./StatRing";
import { MatchCardStat } from "./MatchCardStat";

export function PlayerAnalysis({ analysis }) {
    if (!analysis) {
        return (
            <div className="p-8 text-center text-gray-500 glass-card">
                No recent game data available.
            </div>
        );
    }

    const { recentGames, statLabels, statDisplayName } = analysis;

    // Calculate Consistency Score (mock logic for demo: 70-95%)
    const consistencyScore = 82;

    // Prepare chart data
    // Use the first stat (usually YDS or completion) for the trendline
    // Limit chart to last 10 games for readability
    const chartData = recentGames.slice(0, 10).reverse().map((g) => ({
        name: g.opponent,
        value: parseFloat(g.stats[0]) || 0
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50"></div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Consistency Score</h3>
                    <StatRing
                        percentage={consistencyScore}
                        value={`${consistencyScore}%`}
                        label="Elite"
                        color="#10b981"
                        size={120}
                        strokeWidth={10}
                    />
                </div>

                <div className="glass-card p-6 md:col-span-2 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            Trend: {statDisplayName} ({statLabels[0]})
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Trending Up
                        </div>
                    </div>

                    <div className="h-40 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{
                                        color: '#1e293b',
                                        fontWeight: 'bold'
                                    }}
                                    cursor={{
                                        stroke: '#cbd5e1',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 4'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="absolute -left-10 bottom-0 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                        <span className="w-1 h-6 bg-orange-500 rounded-full block"></span>
                        Recent Matchups
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">Swipe for more →</span>
                </div>

                <div className="flex overflow-x-auto pb-8 pt-4 px-2 snap-x snap-mandatory scrollbar-hide -mx-4 md:mx-0 mask-gradient-right">
                    {recentGames.map((game, index) => (
                        <MatchCardStat key={index} game={game} statLabels={statLabels} index={index} />
                    ))}
                    <div className="w-4 flex-shrink-0"></div>
                </div>
            </div>
        </div>
    );
}
