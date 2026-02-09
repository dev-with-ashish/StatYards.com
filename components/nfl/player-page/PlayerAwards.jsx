"use client";

export function PlayerAwards({ awards }) {
    if (!awards || awards.length === 0) return null;

    return (
        <section className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span> Achievements & Awards
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {awards.map((award, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition duration-200">
                        <span className="text-yellow-500 mt-1">★</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{award}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
