import { getSportsData } from "@/lib/api";
import Dashboard from "@/components/Dashboard";

export const revalidate = 60; // Refresh data every 60 seconds

export default async function Home() {
  const data = await getSportsData();
  return (
    <main className="relative min-h-screen p-4 sm:p-8">
      {/* Decorative Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="orb orb-green w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
        <div className="orb orb-orange w-[400px] h-[400px] top-[20%] right-[-100px]"></div>
        <div className="orb orb-blue w-[600px] h-[600px] bottom-[-150px] left-[20%]"></div>
      </div>

      <Dashboard data={data} />
    </main>
  );
}
