import { getTeamSchedule, getTeamStats, getTeamInjuries } from './lib/nfl-service.js';

async function runTest() {
    console.log("Testing getTeamStats...");
    const stats = await getTeamStats("kansas-city-chiefs");
    console.log("Stats categories found:", stats ? stats.length : 0);
    if (stats && stats.length > 0) {
        console.log("First category:", stats[0].displayName);
    } else {
        console.log("No stats found.");
    }

    console.log("\nTesting getTeamInjuries...");
    const injuries = await getTeamInjuries("kansas-city-chiefs");
    console.log("Injuries found:", injuries ? injuries.length : 0);

    console.log("\nTesting getTeamRoster...");
    const { getTeamRoster } = await import('./lib/nfl-service.js');
    const roster = await getTeamRoster("kansas-city-chiefs");
    console.log("Roster size:", roster ? roster.length : 0);
    if (roster && roster.length > 0) {
        console.log("First player:", roster[0].fullName);
    }
}

runTest();
