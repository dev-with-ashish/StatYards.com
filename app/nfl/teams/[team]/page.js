
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUniqueTeams } from '@/lib/topical-map';
import { getTeamLogo } from '@/lib/nfl-assets';
import {
    getTeamSchedule,
    getTeamRoster,
    getTeamDepthChart,
    getTeamInjuries,
    getTeamStats,
    getTeamPlayerStats
} from '@/lib/nfl-service';
import { TeamTabs } from '@/components/nfl/team-page/TeamTabs';

export async function generateStaticParams() {
    const teams = getUniqueTeams();
    return teams.map((team) => ({
        team: team.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { team: teamSlug } = await params;
    const teams = getUniqueTeams();
    const team = teams.find(t => t.slug === teamSlug);

    if (!team) {
        return { title: 'Team Not Found' };
    }

    return {
        title: `${team.name} 2024-25 Roster, Schedule & Stats | StatYards`,
        description: `View the confirmed 2024-2025 roster, schedule, depth chart, and injuries for the ${team.name}.`,
    };
}

export default async function TeamPage({ params }) {
    const { team: teamSlug } = await params;
    const teams = getUniqueTeams();
    const team = teams.find(t => t.slug === teamSlug);

    if (!team) {
        notFound();
    }

    // Parallel Data Fetching
    const [schedule, roster, depthChart, injuries, stats, playerStats] = await Promise.all([
        getTeamSchedule(team.slug),
        getTeamRoster(team.slug),
        getTeamDepthChart(team.slug),
        getTeamInjuries(team.slug),
        getTeamStats(team.slug),
        getTeamPlayerStats(team.slug)
    ]);

    return (
        <main className="min-h-screen relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="orb orb-green w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
                <div className="orb orb-orange w-[400px] h-[400px] top-[20%] right-[-100px]"></div>
                <div className="orb orb-blue w-[600px] h-[600px] bottom-[-150px] left-[20%]"></div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
                {/* Breadcrumbs */}
                <nav className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
                    <Link href="/" className="hover:text-orange-600 transition-colors duration-200">Home</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <Link href="/nfl/teams" className="hover:text-orange-600 transition-colors duration-200">Teams</Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-orange-600 border-b-2 border-orange-500 pb-0.5">{team.name}</span>
                </nav>

                {/* Hero */}
                <div className="relative flex flex-col md:flex-row items-center gap-10 p-8 md:p-12 mb-12">
                    {/* Removed glass-card styling and background decorations */}

                    <div className="w-32 h-32 md:w-48 md:h-48 p-8 bg-white rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] flex items-center justify-center shrink-0 border-4 border-white/50">
                        <img
                            src={getTeamLogo(team.name)}
                            alt={team.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="text-center md:text-left space-y-3">
                        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-gray-900 leading-[0.9]">
                            {team.name}
                        </h1>
                        <div className="flex flex-col md:flex-row gap-4 text-sm md:text-lg text-gray-600 font-semibold items-center md:items-start">
                            <span className="flex items-center gap-2 bg-green-100/50 px-3 py-1 rounded-full text-green-700 border border-green-200/50">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                                2024-25 Season Active
                            </span>
                            <span className="hidden md:inline text-gray-300">•</span>
                            <span className="text-gray-500">Official Roster & Schedule</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <TeamTabs
                    team={team}
                    schedule={schedule}
                    roster={roster}
                    depthChart={depthChart}
                    injuries={injuries}
                    stats={stats}
                    playerStats={playerStats}
                />
            </div>
        </main>
    );
}
