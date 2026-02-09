
import { getTeamDepthChart } from './lib/nfl-service.js';

// Mock console.error to keep output clean if needed, or just let it print
const teamSlug = 'buffalo-bills';

async function testDepthChart() {
    console.log(`Fetching depth chart for ${teamSlug}...`);
    const data = await getTeamDepthChart(teamSlug);
    console.log("Depth Chart Data Type:", typeof data);
    console.log("Is Array?", Array.isArray(data));
    console.log("Length:", data?.length);

    if (data && data.length > 0) {
        console.log("First Item keys:", Object.keys(data[0]));
        console.log("First Item Sample:", JSON.stringify(data[0], null, 2));
    } else {
        console.log("Data is empty or null");
    }
}

testDepthChart();
