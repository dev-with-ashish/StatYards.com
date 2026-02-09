import { getSportsData } from "@/lib/api";
import Dashboard from "@/components/Dashboard"; // Next.js resolves .jsx automatically, but good to be aware
import StatsDisplay from "@/components/StatsDisplay";
import Leaderboard from "@/components/Leaderboard";
import playerStatsData from "@/espn_player_stats.json";

export const revalidate = 120; // Keep in sync with API fetch cache

export const metadata = {
  title: 'NFL Live Dashboard',
  description: 'Live NFL scores, player statistics, and game analytics.',
};

export default async function Home() {
  const data = await getSportsData();
  const categories = playerStatsData?.results?.stats?.categories || [];

  const mockLeaders = [
    { label: "Passing Yards", value: "4,624" },
    { label: "Touchdowns", value: "35" },
    { label: "Completion %", value: "68.2%" },
    { label: "Rating", value: "105.3" }
  ];

  return (
    <main className="relative min-h-screen p-4 sm:p-8 bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="orb orb-green w-[500px] h-[500px] top-[-100px] left-[-100px] opacity-20"></div>
        <div className="orb orb-orange w-[400px] h-[400px] top-[20%] right-[-100px] opacity-20"></div>
        <div className="orb orb-blue w-[600px] h-[600px] bottom-[-150px] left-[20%] opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          StatYards Dashboard
        </h1>

        <Dashboard data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Main Stats Area */}
          <section className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-green-500 pl-4">Player Analytics</h2>
            <div className="grid grid-cols-1 gap-6">
              {categories.map((category, index) => (
                <StatsDisplay
                  key={index}
                  title={category.displayName}
                  stats={category.stats}
                />
              ))}
            </div>
          </section>

          {/* Sidebar / Leaderboard Area */}
          <aside className="space-y-8">
            <Leaderboard title="Season Top Performers" leaders={mockLeaders} />

            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-300">Quick Actions</h3>
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors mb-3">
                Full Season Stats
              </button>
              <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-colors">
                Compare Players
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
