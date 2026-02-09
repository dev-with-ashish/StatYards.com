import Link from 'next/link';
import { getUniqueTeams } from '@/lib/topical-map';
import { getTeamLogo } from '@/lib/nfl-assets';

export const metadata = {
    title: 'NFL Teams | StatYards',
    description: 'Browse detailed player stats and matchups for all 32 NFL teams.',
};

export default function TeamsIndexPage() {
    const teams = getUniqueTeams();

    return (
        <main className="container mx-auto px-4 py-12 max-w-7xl min-h-screen relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="orb orb-green w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
                <div className="orb orb-orange w-[400px] h-[400px] top-[20%] right-[-100px]"></div>
                <div className="orb orb-blue w-[600px] h-[600px] bottom-[-150px] left-[20%]"></div>
            </div>

            <div className="text-center mb-16 relative z-10">
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-gray-900">
                    NFL Teams
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                    Select a team to view their detailed player stats, schedule, and matchup history.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
                {teams.map((team) => (
                    <Link
                        key={team.slug}
                        href={`/nfl/teams/${team.slug}`}
                        className="group glass-card p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300"
                    >
                        <div className="w-24 h-24 mb-6 rounded-full bg-white flex items-center justify-center p-4 shadow-[0_8px_16px_-4px_rgba(0,0,0,0.05)] border border-gray-100 group-hover:shadow-md transition-shadow duration-300">
                            <img
                                src={getTeamLogo(team.name)}
                                alt={`${team.name} Logo`}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter text-center leading-tight group-hover:text-orange-600 transition-colors">
                            {team.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-2 group-hover:translate-y-0 transform">
                            View Stats &rarr;
                        </p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
