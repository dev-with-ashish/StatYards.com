import { useState } from 'react';
import Link from 'next/link';
import { getTeamLogo } from '@/lib/nfl-assets';
import { getCanonicalTeamSlug } from '@/lib/topical-map';
// Import shared UI components
import MonthDial from '@/components/MonthDial';
import DateStrip from '@/components/DateStrip';

export function TeamMatches({ schedule, team }) {
    const [selectedYear, setSelectedYear] = useState('All');
    const [selectedType, setSelectedType] = useState('All');

    // New State for Time Navigation
    const [activeMonth, setActiveMonth] = useState("all");
    const [activeDate, setActiveDate] = useState("all");
    const [filterByDate, setFilterByDate] = useState(true);

    if (!schedule || schedule.length === 0) {
        return (
            <div className="text-center py-20 glass-card">
                <div className="text-4xl mb-4">🏈</div>
                <p className="text-gray-500 font-medium">No match data available.</p>
            </div>
        );
    }

    const today = new Date();

    // Sort all games by date
    const sortedGames = [...schedule].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Separate into categories
    const liveGames = sortedGames.filter(g => g.status === 'LIVE');
    const upcomingGames = sortedGames.filter(g => new Date(g.date) > today && g.status !== 'LIVE' && g.status !== 'FINAL');

    // Past games (base list) - Sorted Descending (Newest First)
    const allPastGames = sortedGames.filter(g => g.status === 'FINAL' || (new Date(g.date) < today && g.status !== 'LIVE')).sort((a, b) => new Date(b.date) - new Date(a.date));

    // 1. Level 1 Filter: Year & Season Type
    // Derive Filter Options from available data
    const uniqueYears = [...new Set(allPastGames.map(g => g.season))].sort((a, b) => b - a);
    const uniqueTypes = [...new Set(allPastGames.map(g => g.seasonType || "Regular Season"))];

    const basePastGames = allPastGames.filter(game => {
        const yearMatch = selectedYear === 'All' || game.season.toString() === selectedYear.toString();
        const typeMatch = selectedType === 'All' || (game.seasonType || "Regular Season") === selectedType;
        return yearMatch && typeMatch;
    });

    // 2. Level 2 Filter: Month Logic (Similar to Dashboard)
    // Map months to timestamps for sorting
    const monthMap = new Map();
    basePastGames.forEach(m => {
        const d = new Date(m.date);
        // Use UTC to prevent timezone shifts (e.g., Dec 1 midnight becoming Nov 30)
        const monthKey = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
        const dateVal = d.getTime();
        // Keep latest timestamp for sorting
        if (!monthMap.has(monthKey) || dateVal > monthMap.get(monthKey)) {
            monthMap.set(monthKey, dateVal);
        }
    });

    const availableMonths = Array.from(monthMap.keys()).sort((a, b) => monthMap.get(b) - monthMap.get(a));

    // Determine effective active month
    // If "all" is selected, default to the most recent month (first in list) if available
    const effectiveActiveMonth = activeMonth === "all" && availableMonths.length > 0 ? availableMonths[0] : activeMonth;

    const matchesInMonth = basePastGames.filter(m => {
        if (!filterByDate) return true; // If filtering disabled, return all (but we actually use this for DateStrip source)
        // Actually, if !filterByDate, we don't care about matchesInMonth for display, but we need it for DateStrip if enabled.
        // Let's keep logic same but bypass in final step.
        if (effectiveActiveMonth === "all") return true;
        const d = new Date(m.date);
        const mKey = d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }).toUpperCase();
        return mKey === effectiveActiveMonth.toUpperCase();
    });

    // 3. Level 3 Filter: Date Logic
    // Extract unique dates for this month
    const rawDates = matchesInMonth.map(m => {
        const d = new Date(m.date);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    });
    const availableDates = [...new Set(rawDates)];

    // Reset/Sync Active Date
    let effectiveActiveDate = activeDate;
    if (activeDate === "all" || !availableDates.includes(activeDate)) {
        if (availableDates.length > 0) {
            effectiveActiveDate = availableDates[0];
        }
    }

    // Final Displayed Games
    let finalDisplayedGames = matchesInMonth; // Default to filtered by month

    if (filterByDate) {
        // Apply Date Filter
        finalDisplayedGames = finalDisplayedGames.filter(m => {
            if (availableDates.length === 0) return true;
            const d = new Date(m.date);
            const shortDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
            return shortDate === effectiveActiveDate;
        });
    } else {
        // If date filter is OFF, show ALL base past games (Year/Type filtered only)
        finalDisplayedGames = basePastGames;
    }

    // Handlers
    const handleMonthChange = (month) => {
        setActiveMonth(month);
        setActiveDate("all");
    };

    return (
        <div className="space-y-16">

            {/* LIVE MATCHES */}
            {liveGames.length > 0 && (
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-black text-red-600 italic uppercase tracking-tighter flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Live Now
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-red-200 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {liveGames.map(game => <MatchCard key={game.id} game={game} team={team} featured />)}
                    </div>
                </section>
            )}

            {/* UPCOMING MATCHES */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter">
                        Upcoming Matches
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                {upcomingGames.length === 0 ? (
                    <p className="text-gray-500 italic">No upcoming matches scheduled.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingGames.slice(0, 6).map(game => (
                            <MatchCard key={game.id} game={game} team={team} />
                        ))}
                    </div>
                )}
            </section>

            {/* PAST MATCHES */}
            <section>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-900 italic uppercase tracking-tighter whitespace-nowrap">
                        Past Results
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent hidden md:block"></div>

                    {/* Filters (Year/Type) */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setActiveMonth('all'); setActiveDate('all'); }}
                            className="bg-white/50 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full md:w-auto p-2.5 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
                        >
                            <option value="All">All Types</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        <select
                            value={selectedYear}
                            onChange={(e) => { setSelectedYear(e.target.value); setActiveMonth('all'); setActiveDate('all'); }}
                            className="bg-white/50 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full md:w-auto p-2.5 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
                        >
                            <option value="All">All Seasons</option>
                            {uniqueYears.map(year => {
                                const startYY = year.toString().slice(-2);
                                const endYY = (parseInt(year) + 1).toString().slice(-2);
                                return (
                                    <option key={year} value={year}>{startYY}-{endYY}</option>
                                );
                            })}
                        </select>

                        {/* Toggle Checkbox */}
                        <div className="flex items-center gap-2 ml-4">
                            <input
                                type="checkbox"
                                id="dateFilterToggle"
                                checked={filterByDate}
                                onChange={(e) => setFilterByDate(e.target.checked)}
                                className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                            />
                            <label htmlFor="dateFilterToggle" className="text-gray-700 font-bold text-sm cursor-pointer select-none">
                                Filter by Date
                            </label>
                        </div>
                    </div>
                </div>

                {/* Month & Date Navigation (Left/Right Layout) */}
                {basePastGames.length > 0 && (
                    <div className="mb-8">


                        {filterByDate && (
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                                {/* Month Dial - Left */}
                                <div className="w-full lg:w-1/2 relative">
                                    <MonthDial
                                        active={effectiveActiveMonth}
                                        onChange={handleMonthChange}
                                        months={availableMonths}
                                    />
                                </div>

                                {/* Date Strip - Right */}
                                <div className="w-full lg:w-1/2 relative">
                                    {matchesInMonth.length > 0 ? (
                                        <DateStrip
                                            active={effectiveActiveDate}
                                            onChange={setActiveDate}
                                            // Hack: DateStrip expects 'matches' to contain objects with a result property typically
                                            // But here we are passing simplified data. 
                                            // I'll create a fake 'matches' array that DateStrip's internal logic can parse.
                                            // DateStrip Logic: m.result.split("•")[1] OR m.result
                                            // So we just pass the short date string as 'result'
                                            matches={matchesInMonth.map(m => ({
                                                ...m,
                                                result: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
                                            }))}
                                        />
                                    ) : (
                                        <div className="h-16 flex items-center justify-center text-gray-400 text-sm font-bold italic">
                                            No dates available
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {finalDisplayedGames.length === 0 ? (
                    <div className="text-center py-12 glass-card">
                        <p className="text-gray-500 italic font-medium">No past matches found for selected filters.</p>
                        <button
                            onClick={() => { setSelectedYear('All'); setSelectedType('All'); setActiveMonth('all'); setActiveDate('all'); }}
                            className="mt-4 text-orange-600 text-sm font-bold uppercase tracking-wide hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {finalDisplayedGames.map(game => (
                            <MatchCard key={game.id} game={game} team={team} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

// Reusable Card Component for Grid View
function MatchCard({ game, team, featured }) {
    // Determine status color logic
    const isWin = game.result === 'W';
    const isLoss = game.result === 'L';
    const homeSlug = getCanonicalTeamSlug(team.name);
    const oppSlug = getCanonicalTeamSlug(game.opponent.name);
    const matchupSlug = `${homeSlug}-vs-${oppSlug}-match-player-stats`;

    return (
        <Link
            href={`/nfl/${game.season}/${matchupSlug}`}
            className={`group glass-card relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${featured ? 'border-red-200 bg-red-50/30' : ''}`}
        >
            {/* Status Bar */}
            <div className={`flex justify-between items-center px-5 py-3 border-b ${featured ? 'border-red-100 bg-red-50/50' : 'border-gray-100/50 bg-white/40'}`}>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{game.date}</span>
                <span className="text-gray-400 text-[10px] font-bold uppercase">{game.time || "TBD"}</span>
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

                    {/* Vs */}
                    <div className="flex flex-col items-center gap-1">
                        {game.status === 'LIVE' || game.status === 'FINAL' ? (
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-gray-900 font-mono tracking-tighter">{game.score}</span>
                                {game.status === 'FINAL' && (
                                    <span className={`text-[10px] font-bold uppercase px-1.5 rounded mt-1 ${isWin ? 'bg-green-100 text-green-700' : isLoss ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {game.result}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-2xl font-black text-gray-300 font-mono tracking-tighter">VS</span>
                        )}
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">{game.isHome ? 'Home' : 'Away'}</span>
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
            {featured && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 animate-pulse"></div>
            )}
        </Link>
    );
}

