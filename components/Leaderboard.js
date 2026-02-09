import React from 'react';

const Leaderboard = ({ title, leaders }) => {
    if (!leaders || leaders.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/10 p-6 shadow-xl h-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                {title}
            </h3>
            <div className="space-y-4">
                {leaders.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 uppercase tracking-wider text-xs">{item.label}</span>
                            <span className="text-white font-bold">{item.value}</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400 font-mono">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
