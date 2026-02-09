import Link from "next/link";
import { ArrowRight, MapPin, Users } from "lucide-react";

export default function MatchCard({ match, type }) {
    // Status Logic
    const isLive = type === "live";
    const isUpcoming = type === "upcoming";
    const isPast = type === "past";

    return (
        <Link href={`/matchup/${match.id}`} className="block h-full transition-transform active:scale-[0.98]">
            <div className="glass-card group h-full flex flex-col relative w-full overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100/20 bg-white/30 backdrop-blur-md">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">
                        {match.league}
                    </span>

                    {isLive && (
                        <span className="badge bg-red-100 text-red-700 border-red-200 shadow-sm">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-red-400" />
                            LIVE • {match.time}
                        </span>
                    )}
                    {isUpcoming && (
                        <span className="badge bg-green-100 text-green-700 border-green-200 shadow-sm">
                            {match.time}
                        </span>
                    )}
                    {isPast && (
                        <span className="badge bg-gray-100 text-gray-600 border-gray-200">
                            {match.result}
                        </span>
                    )}
                </div>

                {/* Body - Switched to Grid to prevent overflow */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-8 gap-4 w-full flex-1">
                    {/* Away Team (Left) */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-4 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] border border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                            <img src={match.awayLogo} alt={match.away} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-bold text-sm text-center leading-tight text-gray-800">{match.away}</h3>
                    </div>

                    {/* Center Logic (Middle) */}
                    <div className="flex flex-col items-center justify-center gap-2 mx-2">
                        {isUpcoming ? (
                            <div className="bg-orange-50/80 border border-orange-100/50 rounded-xl px-4 py-2 text-center min-w-[80px] shadow-sm">
                                <span className="block text-[10px] font-bold text-orange-600 uppercase tracking-wider">Line</span>
                                <span className="font-mono font-bold text-gray-900 text-lg">{match.odds}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-3xl font-black bg-white/70 px-4 py-2 rounded-xl border border-white/60 shadow-sm min-w-[50px] text-center text-gray-900">
                                    {match.awayScore}
                                </span>
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Vs</span>
                                <span className="font-mono text-3xl font-black bg-white/70 px-4 py-2 rounded-xl border border-white/60 shadow-sm min-w-[50px] text-center text-gray-900">
                                    {match.homeScore}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Home Team (Right) */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-4 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)] border border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                            <img src={match.homeLogo} alt={match.home} className="w-full h-full object-contain" />
                        </div>
                        <h3 className="font-bold text-sm text-center leading-tight text-gray-800">{match.home}</h3>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto bg-white/40 border-t border-white/30 px-6 py-3 flex justify-between items-center text-xs text-gray-600 font-semibold group-hover:bg-white/60 transition-colors">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-gray-400" /> {match.stadium}</span>
                    </div>
                    <ArrowRight size={14} className="text-orange-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
            </div>
        </Link>
    );
}
