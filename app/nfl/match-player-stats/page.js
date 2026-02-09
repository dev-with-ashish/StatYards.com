import { getSportsData } from "@/lib/api";
import Dashboard from "@/components/Dashboard";

// Refresh data every 120 seconds (aligned with fetch cache)
export const revalidate = 120;

export const metadata = {
    title: "NFL Match Player Stats | StatYards",
    description: "Real-time NFL match player stats, including live scores, upcoming schedules, and historical performance data.",
};

export default async function MatchPlayerStatsPage() {
    const data = await getSportsData();
    return <Dashboard data={data} />;
}
