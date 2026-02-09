export const ENDPOINTS = {
    NBA: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    NFL: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    MLB: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
};

/**
 * Transforms raw ESPN event data into our app's Match format.
 */
const transformEvent = (event, league) => {
    const competition = event.competitions[0];
    const home = competition.competitors.find((c) => c.homeAway === "home");
    const away = competition.competitors.find((c) => c.homeAway === "away");

    // Timezone & Locale Config
    const dateObj = new Date(competition.date);

    // Date: "SUN 26"
    const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short", timeZone: "America/New_York" }).toUpperCase();
    const dayNum = dateObj.toLocaleDateString("en-US", { day: "2-digit", timeZone: "America/New_York" });
    const dateStr = `${weekday} ${dayNum}`;

    // Time: "7:00 PM"
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York"
    });

    // Status Logic
    const state = competition.status.type.state; // 'pre', 'in', 'post'
    let statusText = competition.status?.type?.detail; // Default (e.g. "Final")

    // For upcoming games, use the formatted US time
    if (state === "pre") {
        statusText = timeStr;
    }
    // For live games, use the short clock detail (e.g. "Q4 5:00")
    else if (state === "in") {
        statusText = competition.status.type.shortDetail;
    }

    return {
        id: event.id,
        league: league,
        status: state,
        result: `${statusText} • ${dateStr}`, // "Final • Jan 12" or "7:00 PM • Oct 05"
        time: state === "in" ? statusText : timeStr, // Live shows clock, others show start time
        date: dateStr,
        rawDate: competition.date,
        stadium: competition.venue?.fullName || "Unknown Venue",

        // Flattened structure for MatchCard
        home: home.team.shortDisplayName || home.team.name,
        homeScore: home.score || "0",
        homeLogo: home.team.logo,

        away: away.team.shortDisplayName || away.team.name,
        awayScore: away.score || "0",
        awayLogo: away.team.logo,

        odds: competition.odds?.[0]?.details || "N/A",
    };
};

export async function getSportsData() {
    try {
        // One scoreboard call gives current week slate (live + upcoming + recent finals)
        const urls = [`${ENDPOINTS.NFL}`];

        const responses = await Promise.all(
            urls.map(url => fetch(url, { next: { revalidate: 120 } }))
        );

        const jsonResults = await Promise.all(responses.map(r => r.json()));

        const allEvents = jsonResults.flatMap(r => r.events || []);

        // Deduplicate by ID just in case
        const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());

        // Sort by date descending (Newest first)
        uniqueEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        const matches = uniqueEvents.map((e) => transformEvent(e, "NFL"));

        return {
            live: matches.filter((m) => m.status === "in"),
            upcoming: matches.filter((m) => m.status === "pre"),
            past: matches.filter((m) => m.status === "post"),
        };
    } catch (error) {
        console.error("Failed to fetch sports data:", error);
        return { live: [], upcoming: [], past: [] };
    }
}
