export const MATCHUP_DATA = [
    {
        id: "mahomes-raiders",
        league: "NFL • Week 12",
        player: "Patrick Mahomes",
        opponent: "Las Vegas Raiders",
        statLabel: "Passing Yards",
        statLine: 275.5,
        history: [
            { date: "12/25/23", loc: "vs", result: "L 14-20", value: 235 },
            { date: "11/26/23", loc: "@", result: "W 31-17", value: 298 },
            { date: "01/07/23", loc: "@", result: "W 31-13", value: 202 },
            { date: "10/10/22", loc: "vs", result: "W 30-29", value: 292 },
            { date: "12/12/21", loc: "vs", result: "W 48-9", value: 258 }
        ]
    },
    {
        id: "lbj-celtics",
        league: "NBA • Reg. Season",
        player: "LeBron James",
        opponent: "Boston Celtics",
        statLabel: "Points",
        statLine: 26.5,
        history: [
            { date: "02/01/24", loc: "@", result: "W 114-105", value: 32 },
            { date: "12/25/23", loc: "vs", result: "L 115-126", value: 16 },
            { date: "01/28/23", loc: "@", result: "L 121-125", value: 41 },
            { date: "12/13/22", loc: "vs", result: "L 118-122", value: 33 },
            { date: "11/19/21", loc: "@", result: "L 108-130", value: 23 }
        ]
    },
    {
        id: "judge-redsox",
        league: "MLB • Series Opener",
        player: "Aaron Judge",
        opponent: "Boston Red Sox",
        statLabel: "Total Bases",
        statLine: 1.5,
        history: [
            { date: "09/14/23", loc: "@", result: "W 8-5", value: 5 },
            { date: "09/13/23", loc: "@", result: "W 4-1", value: 0 },
            { date: "09/12/23", loc: "vs", result: "W 3-2", value: 4 },
            { date: "08/20/23", loc: "vs", result: "L 5-6", value: 2 },
            { date: "08/19/23", loc: "vs", result: "L 1-8", value: 1 }
        ]
    }
];

export const LIVE_MATCHES = [
    {
        id: "mahomes-raiders",
        home: "Chiefs", homeAbbr: "KC",
        homeLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
        away: "Raiders", awayAbbr: "LV",
        awayLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png",
        homeScore: "24", awayScore: "17",
        time: "4th Qtr • 2:30 ET",
        league: "NFL • Week 12",
        stadium: "Allegiant Stadium",
        attendance: "65,000"
    },
    {
        id: "lbj-celtics",
        home: "Lakers", homeAbbr: "LAL",
        homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
        away: "Celtics", awayAbbr: "BOS",
        awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png",
        homeScore: "89", awayScore: "92",
        time: "3rd Qtr • 5:12 ET",
        league: "NBA • Reg. Season",
        stadium: "TD Garden",
        attendance: "19,156"
    }
];

export const UPCOMING_MATCHES = [
    {
        id: "judge-redsox",
        home: "Yankees", homeAbbr: "NYY",
        homeLogo: "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
        away: "Red Sox", awayAbbr: "BOS",
        awayLogo: "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png",
        time: "Today • 7:05 PM ET",
        odds: "NYY -1.5",
        league: "MLB • Series Opener",
        stadium: "Yankee Stadium",
        attendance: "Expected: 42,000"
    },
    {
        id: "mahomes-raiders",
        home: "Bills", homeAbbr: "BUF",
        homeLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
        away: "Dolphins", awayAbbr: "MIA",
        awayLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
        time: "Sun • 1:00 PM ET",
        odds: "BUF -3.0",
        league: "NFL • Week 14",
        stadium: "Highmark Stadium",
        attendance: "Expected: 71,000"
    }
];

export const PAST_MATCHES = [
    {
        id: "lbj-celtics",
        home: "Warriors", homeAbbr: "GSW",
        homeLogo: "https://a.espncdn.com/i/teamlogos/nba/500/gsw.png",
        away: "Suns", awayAbbr: "PHX",
        awayLogo: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png",
        homeScore: "113", awayScore: "110",
        result: "Final • Jan 12",
        month: "jan",
        league: "NBA",
        stadium: "Chase Center",
        attendance: "18,064"
    },
    {
        id: "judge-redsox",
        home: "Dodgers", homeAbbr: "LAD",
        homeLogo: "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png",
        away: "Padres", awayAbbr: "SD",
        awayLogo: "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png",
        homeScore: "5", awayScore: "2",
        result: "Final • Oct 05",
        month: "oct",
        league: "MLB",
        stadium: "Dodger Stadium",
        attendance: "52,300"
    },
    {
        id: "mahomes-raiders",
        home: "Chiefs", homeAbbr: "KC",
        homeLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
        away: "Raiders", awayAbbr: "LV",
        awayLogo: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png",
        homeScore: "31", awayScore: "17",
        result: "Final • Nov 26",
        month: "nov",
        league: "NFL",
        stadium: "Allegiant Stadium",
        attendance: "62,500"
    }
];
