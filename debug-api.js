
const ENDPOINTS = {
    NBA: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard",
    NFL: "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard",
    MLB: "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard",
};

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

    const state = competition.status.type.state;
    let statusText = competition.status.type.detail;

    if (state === "pre") {
        statusText = timeStr;
    } else if (state === "in") {
        statusText = competition.status.type.shortDetail;
    }

    return {
        id: event.id,
        league: league,
        status: state,
        result: `${statusText} • ${dateStr}`,
        time: state === "in" ? statusText : timeStr,
        date: dateStr,
        rawDate: competition.date,
        stadium: competition.venue?.fullName || "Unknown Venue",
        home: home.team.shortDisplayName || home.team.name,
        homeScore: home.score || "0",
        away: away.team.shortDisplayName || away.team.name,
        awayScore: away.score || "0",
    };
};

async function getSportsData() {
    try {
        const urls = [];
        // Just fetch a few weeks to be fast/safe
        for (let i = 1; i <= 18; i++) {
            urls.push(`${ENDPOINTS.NFL}?seasontype=2&week=${i}`);
        }
        for (let i = 1; i <= 5; i++) {
            urls.push(`${ENDPOINTS.NFL}?seasontype=3&week=${i}`);
        }

        console.log("Fetching...");
        const responses = await Promise.all(
            urls.map(url => fetch(url))
        );
        const jsonResults = await Promise.all(responses.map(r => r.json()));
        const allEvents = jsonResults.flatMap(r => r.events || []);

        console.log("Total events:", allEvents.length);

        const uniqueEvents = Array.from(new Map(allEvents.map(item => [item.id, item])).values());
        uniqueEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        const matches = uniqueEvents.map((e) => transformEvent(e, "NFL"));

        const past = matches.filter((m) => m.status === "post");
        console.log("Past matches:", past.length);

        if (past.length > 0) {
            console.log("First past match:", JSON.stringify(past[0], null, 2));
            console.log("Raw Date:", past[0].rawDate);
            console.log("Result string:", past[0].result);

            // Check parsing
            const d = new Date(past[0].rawDate);
            const mKey = d.toLocaleDateString("en-US", { month: "short", timeZone: "America/New_York" }).toUpperCase();
            console.log("Parsed Month Key:", mKey);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

getSportsData();
