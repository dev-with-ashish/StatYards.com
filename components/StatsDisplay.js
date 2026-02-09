import React from 'react';

const StatsDisplay = ({ title, stats }) => {
    if (!stats || stats.length === 0) return null;

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-xl mb-6">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
                {title}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10 text-sm uppercase tracking-wider">
                            <th className="p-3 font-medium">Stat</th>
                            <th className="p-3 font-medium text-right">Value</th>
                            <th className="p-3 font-medium text-right hidden sm:table-cell">Per Game</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {stats.map((stat, index) => (
                            <tr key={index} className="hover:bg-white/5 transition-colors duration-200 group">
                                <td className="p-3 text-gray-200 font-medium group-hover:text-white transition-colors">
                                    {stat.displayName}
                                </td>
                                <td className="p-3 text-right text-white font-bold font-mono">
                                    {stat.displayValue}
                                </td>
                                <td className="p-3 text-right text-gray-400 font-mono hidden sm:table-cell">
                                    {stat.perGameDisplayValue || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StatsDisplay;
