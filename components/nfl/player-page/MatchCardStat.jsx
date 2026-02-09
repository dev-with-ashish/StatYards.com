"use client";
import { motion } from "framer-motion";
import { StatRing } from "./StatRing";

// Helper to determine ring color based on result
const getResultColor = (result) => {
    if (result.includes("W")) return "#22c55e"; // Green
    if (result.includes("L")) return "#ef4444"; // Red
    return "#6b7280"; // Gray
};

export function MatchCardStat({ game, statLabels, index }) {
    if (!game) return null;

    // Determine key stats based on available labels
    // We try to find "YDS", "TD", "SACK", or "PTS" to highlight
    const highlightStatIndex = statLabels.findIndex((l) =>
        ["YDS", "PTS", "SACK", "REC"].includes(l)
    );

    const primaryValue = highlightStatIndex !== -1 ? game.stats[highlightStatIndex] : game.stats[0];
    const primaryLabel = highlightStatIndex !== -1 ? statLabels[highlightStatIndex] : statLabels[0];

    // Normalize for ring (assuming roughly max values for visual effect)
    let percent = 0;
    const val = parseFloat(primaryValue);
    if (!isNaN(val)) {
        if (primaryLabel === "YDS") percent = Math.min(val / 350 * 100, 100);
        if (primaryLabel === "PTS") percent = Math.min(val / 20 * 100, 100);
        if (primaryLabel === "REC") percent = Math.min(val / 15 * 100, 100);
        if (primaryLabel === "SACK") percent = Math.min(val / 3 * 100, 100);
    }

    return (
        <motion.div
            className="flex-shrink-0 w-48 glass-card p-4 flex flex-col items-center justify-between mx-3 snap-center border border-white/40 shadow-lg relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
        >
            <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: getResultColor(game.result) }}
            >
                {game.result.split(" ")[0]}
            </div>

            <div className="text-center mb-4 w-full border-b border-gray-100 pb-2">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{game.date}</div>
                <div className="text-lg font-black text-gray-800 flex items-center justify-center gap-1">
                    <span className="text-gray-400 text-sm font-normal">vs</span> {game.opponent}
                </div>
            </div>

            <div className="mb-4">
                <StatRing
                    percentage={percent || 0}
                    value={primaryValue}
                    label={primaryLabel}
                    color={getResultColor(game.result)}
                    size={80}
                    strokeWidth={6}
                />
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-center bg-gray-50/50 rounded-lg p-2">
                {game.stats.slice(0, 4).map((stat, idx) => (
                    <div key={idx} className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">{statLabels[idx]}</span>
                        <span className="text-sm font-bold text-gray-700">{stat}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
