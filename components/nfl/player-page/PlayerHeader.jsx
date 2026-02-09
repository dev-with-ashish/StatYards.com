
export function PlayerHeader({ bio }) {
    if (!bio) return null;

    // Default colors if team color missing
    const primaryColor = bio.team?.color ? `#${bio.team.color}` : "#3b82f6";
    const secondaryColor = bio.team?.alternateColor ? `#${bio.team.alternateColor}` : "#1e40af";

    return (
        <div className="relative overflow-hidden rounded-3xl glass-card mb-8">
            {/* Background Gradient & Pattern */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    maskImage: "radial-gradient(circle at top right, black, transparent 70%)"
                }}
            />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-8">
                {/* Headshot with Team Halo */}
                <div className="relative group">
                    <div className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition duration-700" style={{ backgroundColor: primaryColor }}></div>
                    <div className="w-40 h-40 md:w-56 md:h-56 relative rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-gray-100 dark:bg-slate-800">
                        <img
                            src={bio.headshot || "https://a.espncdn.com/i/headshots/nfl/players/full/default.png"}
                            alt={bio.fullName}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                        />
                    </div>
                    {/* Jersey Number Badge */}
                    <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 dark:border-slate-900 text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
                        {bio.jersey}
                    </div>
                </div>

                {/* Player Info */}
                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        {bio.team?.logo && (
                            <img src={bio.team.logo} alt={bio.team.name} className="w-8 h-8 object-contain opacity-80" />
                        )}
                        <span className="text-sm font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">{bio.team?.name || "Free Agent"}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{bio.position}</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                        {bio.firstName} <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>{bio.lastName}</span>
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/5">
                            Ht: <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.height}</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/5">
                            Wt: <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.weight} lbs</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/5">
                            Age: <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.age}</span> <span className="text-xs text-gray-500">({bio.dob})</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-white/5">
                            Exp: <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.experience}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        {bio.birthPlace && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">Born:</span>
                                <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.birthPlace}</span>
                            </div>
                        )}
                        {bio.college && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">College:</span>
                                <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.college}</span>
                            </div>
                        )}
                        {bio.draft && (
                            <div className="flex items-center gap-1">
                                <span className="text-gray-400">Draft:</span>
                                <span className="text-gray-900 dark:text-gray-200 font-bold">{bio.draft}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-bold ${bio.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{bio.status}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
