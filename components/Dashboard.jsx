"use client";

import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import MonthDial from "@/components/MonthDial";
import DateStrip from "@/components/DateStrip";

export default function Dashboard({ data }) {
    const [activeMonth, setActiveMonth] = useState("all");
    const [activeDate, setActiveDate] = useState("all");

    const { live, upcoming, past } = data;

    // Extract unique months from past matches
    // Sort logic: We need to sort by YEAR-MONTH descending
    // 1. Create a map of MonthName -> LatestDateISO
    const monthMap = new Map();
    past.forEach(m => {
        const d = new Date(m.rawDate);
        const monthKey = d.toLocaleDateString("en-US", { month: "short", timeZone: "America/New_York" }).toUpperCase();
        const dateVal = d.getTime();

        // Keep the latest timestamp for this month key to help sorting
        if (!monthMap.has(monthKey) || dateVal > monthMap.get(monthKey)) {
            monthMap.set(monthKey, dateVal);
        }
    });

    // 2. Sort keys based on their date values descending
    const availableMonths = Array.from(monthMap.keys()).sort((a, b) => {
        return monthMap.get(b) - monthMap.get(a);
    });

    // Month Logic: Defaults to first available key (e.g. "JAN") if "all" logic hits, 
    // or just let the Dial pick the first valid index. 
    // If activeMonth is "all", we essentially want the *latest* month behavior visually.
    const effectiveActiveMonth = activeMonth === "all" && availableMonths.length > 0 ? availableMonths[0] : activeMonth;

    const matchesInMonth = past.filter(m => {
        if (effectiveActiveMonth === "all") return true;
        const d = new Date(m.rawDate);
        const mKey = d.toLocaleDateString("en-US", { month: "short", timeZone: "America/New_York" }).toUpperCase();
        return mKey === effectiveActiveMonth.toUpperCase();
    });

    // Extract unique dates for this month
    // "Final • Jan 12" -> "Jan 12"
    const rawDates = matchesInMonth.map(m => {
        const parts = m.result.split("•");
        return parts.length > 1 ? parts[1].trim() : m.result;
    });
    // Deduplicate and keep order (likely assuming input is sorted by API)
    const availableDates = [...new Set(rawDates)];

    // Reset/Sync Active Date Logic
    // If the currently selected date is NOT in the new month's available dates, reset to the first one.
    // This runs on every render but State updates only happen if value changes, preventing loops
    // Ideally we use effectiveActiveDate for rendering
    let effectiveActiveDate = activeDate;
    if (activeDate === "all" || !availableDates.includes(activeDate)) {
        if (availableDates.length > 0) {
            effectiveActiveDate = availableDates[0];
            // We don't call setActiveDate during render to avoid warning, 
            // but we use this computed value for filtering
        }
    }

    // Final Filter: Matches for the specific date
    const filteredPast = matchesInMonth.filter(m => m.result.includes(effectiveActiveDate));

    // Handler to switch month and auto-reset date
    const handleMonthChange = (month) => {
        setActiveMonth(month);
        setActiveDate("all"); // Reset date so next render picks the first valid one
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Dashboard Header - Light Theme */}
            <header className="glass-card p-8 mb-12 flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
                    StatYards Dashboard
                </h1>
                <p className="text-lg text-gray-600 font-medium">Real-time data for smart betting.</p>
            </header>

            {/* LIVE SECTION */}
            {live.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-tight">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        Live Match Player Stats
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {live.map(match => (
                            <MatchCard key={match.id} match={match} type="live" />
                        ))}
                    </div>
                </section>
            )}

            {/* UPCOMING SECTION */}
            <section className="mb-16">
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">
                    Upcoming Matches Player Stats
                </h2>
                {upcoming.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {upcoming.map(match => (
                            <MatchCard key={match.id} match={match} type="upcoming" />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card py-12 text-center text-gray-400 italic">
                        No upcoming matches found.
                    </div>
                )}
            </section>

            {/* PAST SECTION (With Dial) */}
            <section className="mb-16">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        Past Matches Player Stats
                    </h2>

                    <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end">
                        <MonthDial
                            active={effectiveActiveMonth}
                            onChange={handleMonthChange}
                            months={availableMonths}
                        />
                    </div>
                </div>

                {/* Date Dial - Only if matches exist in this month */}
                {matchesInMonth.length > 0 && (
                    <div className="mb-8">
                        <DateStrip
                            matches={matchesInMonth}
                            active={effectiveActiveDate}
                            onChange={setActiveDate}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredPast.length > 0 ? (
                        filteredPast.map(match => (
                            <MatchCard key={match.id} match={match} type="past" />
                        ))
                    ) : (
                        <div className="glass-card py-12 text-center text-gray-400 italic">
                            No matches found for {activeMonth.toUpperCase()}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
