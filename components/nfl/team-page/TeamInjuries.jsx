
export function TeamInjuries({ injuries }) {
    if (!injuries || injuries.length === 0) {
        return (
            <div className="text-center py-20 glass-card">
                <div className="text-4xl mb-4">🚑</div>
                <p className="text-gray-500 font-medium">No injury reports available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {injuries.map((injury, index) => (
                <div key={index} className="glass-card p-5 hover:border-red-500/50 transition duration-300">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-gray-900 font-bold">{injury.athlete.fullName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${injury.status === 'Questionable' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            injury.status === 'Out' || injury.status === 'IR' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                            {injury.status}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1 font-medium">{injury.position?.abbreviation} • #{injury.athlete.jersey}</div>
                    <div className="text-xs text-gray-600 mt-2 p-2 bg-white/50 rounded border border-gray-100 italic">
                        {injury.description || "No detailed status description available."}
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 text-right font-medium">
                        Updated: {new Date(injury.date).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
