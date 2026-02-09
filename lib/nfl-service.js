import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { findSlugForTeams, getCanonicalTeamSlug } from './topical-map.js';

const BASE_URL = "https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes";
const TEAM_BASE_URL = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
};

const TEAM_IDS = {
    "atlanta-falcons": "1", "buffalo-bills": "2", "chicago-bears": "3",
    "cincinnati-bengals": "4", "cleveland-browns": "5", "dallas-cowboys": "6",
    "denver-broncos": "7", "detroit-lions": "8", "green-bay-packers": "9",
    "tennessee-titans": "10", "indianapolis-colts": "11", "kansas-city-chiefs": "12",
    "las-vegas-raiders": "13", "los-angeles-rams": "14", "miami-dolphins": "15",
    "minnesota-vikings": "16", "new-england-patriots": "17", "new-orleans-saints": "18",
    "new-york-giants": "19", "new-york-jets": "20", "philadelphia-eagles": "21",
    "arizona-cardinals": "22", "pittsburgh-steelers": "23", "los-angeles-chargers": "24",
    "san-francisco-49ers": "25", "seattle-seahawks": "26", "tampa-bay-buccaneers": "27",
    "washington-commanders": "28", "carolina-panthers": "29", "jacksonville-jaguars": "30",
    "baltimore-ravens": "33", "houston-texans": "34"
};

function getTeamId(slug) {
    return TEAM_IDS[slug.toLowerCase()] || null;
}

export async function getTeamSchedule(slug) {
    const id = getTeamId(slug);
    if (!id) return [];
    try {
        const res = await fetch(`${TEAM_BASE_URL}/${id}/schedule`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();
        const events = data.events || [];

        return events.map(event => {
            const competition = event.competitions?.[0];
            if (!competition) return null;

            const us = competition.competitors?.find(c => c.team.id === id);
            const them = competition.competitors?.find(c => c.team.id !== id);

            if (!us || !them) return null;

            const isFinal = event.status?.type?.state === 'post';
            const isLive = event.status?.type?.state === 'in';

            let status = 'UPCOMING';
            if (isFinal) status = 'FINAL';
            if (isLive) status = 'LIVE';

            const result = isFinal ? (us.winner ? 'W' : 'L') : null;
            const score = isFinal || isLive ? `${us.score?.value || us.score || 0} - ${them.score?.value || them.score || 0}` : null;
            const matchupSlug = findSlugForTeams(us.team?.displayName, them.team?.displayName) ||
                `${getCanonicalTeamSlug(us.team?.displayName)}-vs-${getCanonicalTeamSlug(them.team?.displayName)}-match-player-stats`;

            return {
                id: event.id,
                date: event.date,
                time: isFinal ? 'FINAL' : new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                season: event.season?.year || new Date().getFullYear(),
                seasonType: event.season?.type === 3 ? "Post Season" : (event.season?.type === 2 ? "Regular Season" : "Pre Season"),
                status: status,
                result: result,
                score: score,
                isHome: us.homeAway === 'home',
                opponent: {
                    name: them.team.displayName,
                    slug: them.team.name || them.team.slug, // Use name as slug usually works for assets
                    logo: them.team.logos?.[0]?.href
                },
                matchupSlug,
            };
        }).filter(Boolean);

    } catch (e) { console.error(e); return []; }
}

export async function getTeamRoster(slug) {
    const id = getTeamId(slug);
    if (!id) return [];
    try {
        const res = await fetch(`${TEAM_BASE_URL}/${id}/roster`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();
        return data.athletes || [];
    } catch (e) { console.error(e); return []; }
}

export async function getTeamDepthChart(slug) {
    const id = getTeamId(slug);
    if (!id) return [];
    try {
        const res = await fetch(`${TEAM_BASE_URL}/${id}/depthcharts`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();
        return data.depthchart || [];
    } catch (e) { console.error(e); return []; }
}

export async function getTeamInjuries(slug) {
    const id = getTeamId(slug);
    if (!id) return [];
    try {
        const res = await fetch(`${TEAM_BASE_URL}/${id}/injuries`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();
        return data.injuries || [];
    } catch (e) {
        // Injuries endpoint might be flaky or empty in off-season
        console.log("Error fetching injuries:", e);
        return [];
    }
}

export async function getTeamStats(slug) {
    const id = getTeamId(slug);
    if (!id) return null;
    try {
        const res = await fetch(`${TEAM_BASE_URL}/${id}/statistics`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();
        // Return categories array which matches the 'stats' prop structure in TeamStats.jsx
        return data.results?.stats?.categories || [];
    } catch (e) { console.error(e); return []; }
}

export async function getTeamPlayerStats(slug) {
    return [];
}

// Import cheerio for scraping
import * as cheerio from 'cheerio';

export async function getPlayerWikiData(name) {
    if (!name) return null;
    try {
        // Search for the page first
        const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}&limit=1&namespace=0&format=json`);
        const searchData = await searchRes.json();
        const pageTitle = searchData[1][0];

        if (!pageTitle) return null;

        // Fetch the page HTML
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        // 1. Bio Summary (First 3 paragraphs)
        let summary = "";
        $('.mw-parser-output > p').each((i, el) => {
            if (i < 3) {
                // Remove citations like [1]
                summary += $(el).text().replace(/\[\d+\]/g, '') + "\n\n";
            }
        });

        // 2. Awards (Improved Strategy)
        let awards = [];
        // Strategy A: Infobox parameter
        $('.infobox th').each((i, el) => {
            const header = $(el).text().toLowerCase();
            if (header.includes('award') || header.includes('highlight') || header.includes('honors')) {
                $(el).next('td').find('li').each((j, li) => {
                    awards.push($(li).text().replace(/\[\d+\]/g, '').trim());
                });
            }
        });

        // Strategy B: "Career highlights and awards" section in Infobox
        if (awards.length === 0) {
            const infoboxRows = $('.infobox tr');
            infoboxRows.each((i, row) => {
                const header = $(row).find('th').text();
                if (header && (header.toLowerCase().includes("career highlights") || header.toLowerCase().includes("awards"))) {
                    $(row).find('td ul li').each((j, li) => {
                        awards.push($(li).text().replace(/\[\d+\]/g, '').trim());
                    });
                }
            });
        }

        // 3. Personal Life
        let personalLife = "";
        // Find ID, then get parent h2, then next siblings
        const personalHeader = $('#Personal_life').parent();
        if (personalHeader.length > 0) {
            let nextNode = personalHeader.next();
            let count = 0;
            while (nextNode.length > 0 && !nextNode.is('h2') && count < 5) { // Limit to 5 paragraphs
                if (nextNode.is('p')) {
                    personalLife += nextNode.text().replace(/\[\d+\]/g, '') + "\n\n";
                    count++;
                }
                nextNode = nextNode.next();
            }
        }

        // 4. Playing Style / Professional Career (Summary)
        let playingStyle = "";
        const styleHeader = $('#Professional_career').parent().length ? $('#Professional_career').parent() : $('#NFL_career').parent();
        if (styleHeader.length > 0) {
            let nextNode = styleHeader.next();
            let count = 0;
            while (nextNode.length > 0 && !nextNode.is('h2') && count < 3) {
                if (nextNode.is('p')) {
                    playingStyle += nextNode.text().replace(/\[\d+\]/g, '') + "\n\n";
                    count++;
                }
                nextNode = nextNode.next();
            }
        }

        // 5. Social Links (External Links)
        let socials = [];
        const externalLinksParams = ['Twitter', 'Instagram', 'X (social network)'];
        $('a.external.text').each((i, el) => {
            const text = $(el).text();
            const href = $(el).attr('href');
            if (href && (href.includes('twitter.com') || href.includes('x.com'))) {
                if (!socials.some(s => s.platform === 'X')) socials.push({ platform: 'X', url: href });
            }
            if (href && href.includes('instagram.com')) {
                if (!socials.some(s => s.platform === 'Instagram')) socials.push({ platform: 'Instagram', url: href });
            }
        });

        return {
            summary: summary.trim(),
            awards: awards,
            personalLife: personalLife.trim(),
            playingStyle: playingStyle.trim(),
            socials: socials
        };

    } catch (e) {
        console.error("Wiki Fetch Error:", e);
        return null;
    }
}

export async function getPlayerCareerStats(playerId) {
    try {
        // Use the /stats endpoint which groups by season/career
        const res = await fetch(`${BASE_URL}/${playerId}/stats`, { headers: HEADERS, next: { revalidate: 3600 } });
        const data = await res.json();

        // This endpoint returns 'categories' array (Passing, Rushing, etc.)
        // Each category has 'statistics' array with splits (years + total)
        // This structure matches what PlayerCareerStats.jsx needs if we map it correctly.
        return data.categories || [];
    } catch (e) {
        console.error("Career Stats Error:", e);
        return null;
    }
}

export async function getPlayerAnalysis(playerId) {
    try {
        // Fetch Bio, Gamelog, and Career Stats
        const [overviewRes, gamelogRes] = await Promise.all([
            fetch(`${BASE_URL}/${playerId}`, { headers: HEADERS, next: { revalidate: 3600 } }),
            fetch(`${BASE_URL}/${playerId}/gamelog`, { headers: HEADERS, next: { revalidate: 3600 } })
        ]);

        if (!overviewRes.ok || !gamelogRes.ok) {
            console.error(`Failed to fetch data for player ${playerId}`);
            return null;
        }

        const overview = await overviewRes.json();
        const gamelog = await gamelogRes.json();

        if (!overview.athlete) return null;

        // Fetch Wiki Data & Career Stats in parallel after confirming athlete exists
        const ath = overview.athlete;
        const [wikiData, careerStats] = await Promise.all([
            getPlayerWikiData(ath.fullName),
            getPlayerCareerStats(playerId)
        ]);

        console.log(`[DEBUG] Wiki Data for ${ath.fullName}:`, wikiData ? "Found" : "Null", "Awards:", wikiData?.awards?.length);
        console.log(`[DEBUG] Career Stats for ${playerId}:`, careerStats ? `Found (${careerStats.length} items)` : "Null");

        // Parse Bio
        const bio = {
            id: playerId,
            firstName: ath.firstName,
            lastName: ath.lastName,
            fullName: ath.fullName, // Use fullName for consistency
            displayName: ath.displayName,
            jersey: ath.jersey,
            position: ath.position?.displayName,
            height: ath.displayHeight,
            weight: ath.displayWeight,
            age: ath.age,
            dob: ath.displayDOB,
            birthPlace: ath.displayBirthPlace,
            status: ath.status?.name || (ath.active ? "Active" : "Inactive"),
            experience: ath.displayExperience,
            draft: ath.displayDraft,
            college: ath.college?.name, // Added College
            headshot: ath.headshot?.href,
            team: {
                name: ath.team?.displayName,
                logo: ath.team?.logos?.[0]?.href,
                color: ath.team?.color,
                alternateColor: ath.team?.alternateColor
            }
        };

        // Parse Stats
        const labels = gamelog.labels || [];
        const displayNames = gamelog.displayNames || [];

        // Aggregate events from ALL season types (Pre, Reg, Post)
        let allStatsEvents = [];
        if (gamelog.seasonTypes) {
            gamelog.seasonTypes.forEach(st => {
                if (st.categories) {
                    st.categories.forEach(cat => {
                        if (cat.events) {
                            allStatsEvents.push(...cat.events);
                        }
                    });
                }
            });
        }

        const recentGames = allStatsEvents.map(eventStat => {
            const gameId = eventStat.eventId;
            const gameInfo = gamelog.events?.[gameId];
            if (!gameInfo) return null;
            return {
                gameId,
                date: new Date(gameInfo.gameDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                fullDate: new Date(gameInfo.gameDate), // Keep full date for sorting
                opponent: gameInfo.opponent?.abbreviation || "OPP",
                result: gameInfo.gameResult === "W" ? "W" : "L",
                score: gameInfo.score,
                stats: eventStat.stats
            };
        }).filter(Boolean);

        // Sort by date descending (newest first)
        recentGames.sort((a, b) => b.fullDate - a.fullDate);

        return {
            bio,
            wiki: wikiData,
            careerStats,
            recentGames: recentGames, // Return ALL games, no slice
            statLabels: labels,
            statDisplayName: displayNames?.[0] || "Stats"
        };

    } catch (error) {
        console.log("Error in getPlayerAnalysis:", error);
        return null;
    }
}
