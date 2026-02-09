import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { getTeamLogo } from './nfl-assets.js';

const CSV_PATH = path.join(process.cwd(), 'lib/data/topical_map.csv');

// Cache the data in memory for performance
let _cachedData = null;

function getData() {
    if (_cachedData) return _cachedData;

    try {
        const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        });
        _cachedData = records;
        return records;
    } catch (error) {
        console.error("Error reading topical map:", error);
        return [];
    }
}

// Helper to generate deterministic pseudo-random numbers from a string seed
function getSeededRandom(seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

// Helper to enrich raw CSV row with mock data (scores, dates, etc.)
function enrichMatchupData(row) {
    const urlPart = row.url.split('/').pop();
    const slugBase = urlPart.replace('-{date}', '');

    // Extract teams from keyword "Team A vs Team B match player stats"
    const keywordParts = row.keyword.split(' vs ');
    const team1Raw = keywordParts[0] || "Home Team";
    const team2Raw = (keywordParts[1] || "").split(' match')[0] || "Away Team";

    // Deterministic Randomness based on slug
    const seed = getSeededRandom(slugBase);

    // Mock Date: Pick a week between Sept 2024 and Jan 2025
    const startTs = new Date('2024-09-05').getTime();
    const endTs = new Date('2025-01-05').getTime();
    const randomTime = startTs + (seed % (endTs - startTs));
    const matchDate = new Date(randomTime);

    // Ensure it's mostly Sundays (simple adjustment)
    const day = matchDate.getDay();
    if (day !== 0) matchDate.setDate(matchDate.getDate() + (7 - day));

    const formattedDate = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = "1:00 PM EST";

    // Determine Status (Simulate current date as Nov 15, 2024 for "live" feel)
    const simulatedNow = new Date('2024-11-15').getTime();
    const isPast = matchDate.getTime() < simulatedNow;
    const isLive = Math.abs(matchDate.getTime() - simulatedNow) < 3 * 60 * 60 * 1000; // Within 3 hours

    let type = 'upcoming';
    if (isPast) type = 'past';
    if (isLive) type = 'live';

    // Mock Scores
    const homeScore = (seed % 28) + 14; // 14-41
    const awayScore = ((seed >> 2) % 28) + 10; // 10-37

    // Mock Odds
    const spread = (seed % 14) / 2;
    const favorite = homeScore > awayScore ? team1Raw : team2Raw;

    return {
        ...row,
        id: slugBase, // Use slug as ID for easier routing
        slug: slugBase,
        season: '2024',
        date: formattedDate,
        time: formattedTime,
        status: type, // 'past', 'upcoming', 'live'

        // Teams
        home: team1Raw,
        homeLogo: getTeamLogo(team1Raw),
        homeScore: isPast || isLive ? homeScore : 0,

        away: team2Raw,
        awayLogo: getTeamLogo(team2Raw),
        awayScore: isPast || isLive ? awayScore : 0,

        // Meta
        league: "NFL",
        stadium: "NFL Stadium", // Could map this too if needed
        odds: `${favorite} -${spread}`,
        result: isPast ? `Final` : null
    };
}

export function getAllMatchupSlugs() {
    const data = getData();
    return data
        .filter(row => row.keyword.includes(' vs ')) // Strict filter for matchups
        .map(row => {
            const urlPart = row.url.split('/').pop();
            const slugBase = urlPart.replace('-{date}', '');
            return {
                season: '2024',
                slug: slugBase
            };
        });
}

export function getMatchupBySlug(slug) {
    const data = getData();
    const row = data.find(r => {
        const urlPart = r.url.split('/').pop();
        return urlPart.replace('-{date}', '') === slug;
    });

    if (!row) return null;
    return enrichMatchupData(row);
}

export function getMatchupsByTeam(teamName) {
    const data = getData();
    const normalizedTeam = teamName.toLowerCase();

    return data
        .filter(row => row.keyword.includes(' vs ')) // Ensure it's a matchup
        .filter(row => row.keyword.toLowerCase().includes(normalizedTeam))
        .map(enrichMatchupData)
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
}

export function getRelatedMatchups(currentMatchup) {
    if (!currentMatchup) return [];
    const data = getData();

    // Simple semantic linking
    const keywords = currentMatchup.keyword.split(' vs ');
    const team1 = keywords[0];

    return data
        .filter(row => row.keyword.includes(' vs ') && row.id !== currentMatchup.id)
        .filter(row => row.keyword.includes(team1))
        .slice(0, 4)
        .map(enrichMatchupData);
}

// Attempt to find the topical-map slug for a given home/away pairing.
// Returns slug (without season prefix) or null if no match found.
export function findSlugForTeams(teamA, teamB) {
    const data = getData();
    const normVariants = (name) => {
        if (!name) return [];
        const raw = name.toLowerCase().trim();
        const mapped = NFL_TEAMS[raw] || raw;
        const words = mapped.split(/\s+/);
        const last = words.slice(-1).join(" ");
        const lastTwo = words.slice(-2).join(" ");
        return Array.from(new Set([raw, mapped.toLowerCase(), last, lastTwo]));
    };

    const aSyn = normVariants(teamA);
    const bSyn = normVariants(teamB);

    const row = data.find(r => {
        const kw = (r.keyword || "").toLowerCase();
        return r.keyword?.includes(' vs ') &&
            aSyn.some(s => kw.includes(s)) &&
            bSyn.some(s => kw.includes(s));
    });

    if (!row) return null;

    const urlPart = row.url.split('/').pop();
    const slugBase = urlPart.replace('-{date}', '');
    return slugBase;
}

const NFL_TEAMS = {
    "49ers": "San Francisco 49ers",
    "bears": "Chicago Bears",
    "bengals": "Cincinnati Bengals",
    "bills": "Buffalo Bills",
    "broncos": "Denver Broncos",
    "browns": "Cleveland Browns",
    "buccaneers": "Tampa Bay Buccaneers",
    "cardinals": "Arizona Cardinals",
    "chargers": "Los Angeles Chargers",
    "chiefs": "Kansas City Chiefs",
    "colts": "Indianapolis Colts",
    "commanders": "Washington Commanders",
    "cowboys": "Dallas Cowboys",
    "dolphins": "Miami Dolphins",
    "eagles": "Philadelphia Eagles",
    "falcons": "Atlanta Falcons",
    "giants": "New York Giants",
    "jaguars": "Jacksonville Jaguars",
    "jets": "New York Jets",
    "lions": "Detroit Lions",
    "packers": "Green Bay Packers",
    "panthers": "Carolina Panthers",
    "patriots": "New England Patriots",
    "raiders": "Las Vegas Raiders",
    "rams": "Los Angeles Rams",
    "ravens": "Baltimore Ravens",
    "saints": "New Orleans Saints",
    "seahawks": "Seattle Seahawks",
    "steelers": "Pittsburgh Steelers",
    "texans": "Houston Texans",
    "titans": "Tennessee Titans",
    "vikings": "Minnesota Vikings",
    // Full names mapping
    "san francisco 49ers": "San Francisco 49ers",
    "chicago bears": "Chicago Bears",
    "cincinnati bengals": "Cincinnati Bengals",
    "buffalo bills": "Buffalo Bills",
    "denver broncos": "Denver Broncos",
    "cleveland browns": "Cleveland Browns",
    "tampa bay buccaneers": "Tampa Bay Buccaneers",
    "arizona cardinals": "Arizona Cardinals",
    "los angeles chargers": "Los Angeles Chargers",
    "kansas city chiefs": "Kansas City Chiefs",
    "indianapolis colts": "Indianapolis Colts",
    "washington commanders": "Washington Commanders",
    "dallas cowboys": "Dallas Cowboys",
    "miami dolphins": "Miami Dolphins",
    "philadelphia eagles": "Philadelphia Eagles",
    "atlanta falcons": "Atlanta Falcons",
    "new york giants": "New York Giants",
    "jacksonville jaguars": "Jacksonville Jaguars",
    "new york jets": "New York Jets",
    "detroit lions": "Detroit Lions",
    "green bay packers": "Green Bay Packers",
    "carolina panthers": "Carolina Panthers",
    "new england patriots": "New England Patriots",
    "las vegas raiders": "Las Vegas Raiders",
    "los angeles rams": "Los Angeles Rams",
    "baltimore ravens": "Baltimore Ravens",
    "new orleans saints": "New Orleans Saints",
    "seattle seahawks": "Seattle Seahawks",
    "pittsburgh steelers": "Pittsburgh Steelers",
    "houston texans": "Houston Texans",
    "tennessee titans": "Tennessee Titans",
    "minnesota vikings": "Minnesota Vikings"
};

export function getUniqueTeams() {
    const data = getData();
    const teamsSet = new Set();

    data.filter(row => row.keyword.includes(' vs ')).forEach(row => {
        const parts = row.keyword.split(' vs ');
        if (parts.length >= 2) {
            const team1Raw = parts[0].trim().toLowerCase();
            const team2Parts = parts[1].split(' match player stats');
            const team2Raw = team2Parts[0].trim().toLowerCase();

            if (NFL_TEAMS[team1Raw]) teamsSet.add(NFL_TEAMS[team1Raw]);
            if (NFL_TEAMS[team2Raw]) teamsSet.add(NFL_TEAMS[team2Raw]);

            Object.keys(NFL_TEAMS).forEach(key => {
                if (team1Raw.endsWith(key) && !teamsSet.has(NFL_TEAMS[key])) {
                    teamsSet.add(NFL_TEAMS[key]);
                }
                if (team2Raw.endsWith(key) && !teamsSet.has(NFL_TEAMS[key])) {
                    teamsSet.add(NFL_TEAMS[key]);
                }
            });
        }
    });

    return Array.from(teamsSet).sort().map(team => ({
        name: team,
        slug: team.toLowerCase().replace(/\s+/g, '-')
    }));
}

export function getCanonicalTeamSlug(teamName) {
    const normalized = teamName.toLowerCase().trim();
    // Default to strict mapping or fallback to slugifying the input
    const fullName = NFL_TEAMS[normalized] || teamName;
    return fullName.toLowerCase().replace(/[\.\s]+/g, '-');
}
