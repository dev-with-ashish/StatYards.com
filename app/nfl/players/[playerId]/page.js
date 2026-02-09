
import { getPlayerAnalysis } from "@/lib/nfl-service";
import { PlayerHeader } from "@/components/nfl/player-page/PlayerHeader";
import { PlayerAnalysis } from "@/components/nfl/player-page/PlayerAnalysis";
import { PlayerBio } from "@/components/nfl/player-page/PlayerBio";
import { PlayerAwards } from "@/components/nfl/player-page/PlayerAwards";
import { SimpleCareerStats } from "@/components/nfl/player-page/PlayerCareerStats";

export default async function PlayerPage({ params }) {
    // Await params for Next.js 15+ compatibility
    const { playerId } = await params;

    const analysisData = await getPlayerAnalysis(playerId);

    if (!analysisData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Player Not Found</h1>
                    <p className="text-gray-400">Could not retrieve data for player ID: {playerId}</p>
                </div>
            </div>
        );
    }

    const { bio, wiki, careerStats, recentGames, statLabels, statDisplayName } = analysisData;

    return (
        <main className="min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* 1. Basic Info (Header) */}
                <PlayerHeader bio={bio} />

                {/* 2. Career Overview & Personal Life (Bio) */}
                <PlayerBio wiki={wiki} bio={bio} />

                {/* 3. Career Statistics */}
                <SimpleCareerStats stats={careerStats} />

                {/* 4. Achievements & Awards */}
                <PlayerAwards awards={wiki?.awards} />

                {/* 5. Betting Impact / Recent Form */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    Recent Form & Betting Impact
                </h2>

                <PlayerAnalysis
                    analysis={analysisData} // Pass entire object to handle mock data inside
                />
            </div>
        </main>
    );
}
