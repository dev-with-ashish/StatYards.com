
import * as cheerio from 'cheerio';

const TEAM_ABBRS = {
    "buffalo-bills": "buf"
};

async function getTeamPlayerStats(teamSlug) {
    const abbr = TEAM_ABBRS[teamSlug];
    if (!abbr) {
        console.error(`No abbreviation found for team: ${teamSlug}`);
        return null;
    }

    try {
        const url = `https://www.espn.in/nfl/team/stats/_/name/${abbr}`;
        console.log(`Fetching ${url}...`);
        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch player stats page");

        const html = await res.text();
        const $ = cheerio.load(html);
        const statsData = [];

        const content = $('.ResponsiveTable');
        console.log(`Found ${content.length} tables.`);

        content.each((i, el) => {
            const title = $(el).find('.Table__Title').text().trim();
            console.log(`Processing table: ${title}`);
            if (!title) return;

            const headers = [];
            const tables = $(el).find('table');

            if (tables.length === 2) {
                console.log("  - Found split table (Fixed + Scroller)");
                const fixedTable = $(tables[0]);
                const scrollTable = $(tables[1]);

                fixedTable.find('thead th').each((j, th) => {
                    headers.push($(th).text().trim());
                });
                scrollTable.find('thead th').each((j, th) => {
                    headers.push($(th).text().trim());
                });

                const rows = [];
                const fixedRows = fixedTable.find('tbody tr');
                const scrollRows = scrollTable.find('tbody tr');

                console.log(`  - Rows: ${fixedRows.length}`);

                fixedRows.each((rowIndex, row) => {
                    const rowData = [];
                    $(row).find('td').each((colIndex, cell) => {
                        rowData.push($(cell).text().trim());
                    });

                    const scrollRow = scrollRows.eq(rowIndex);
                    scrollRow.find('td').each((colIndex, cell) => {
                        rowData.push($(cell).text().trim());
                    });

                    rows.push(rowData);
                });

                statsData.push({ title, headers, rows });

            } else if (tables.length === 1) {
                console.log("  - Found single table");
                const table = $(tables[0]);
                table.find('thead th').each((j, th) => {
                    headers.push($(th).text().trim());
                });

                const rows = [];
                table.find('tbody tr').each((rowIndex, row) => {
                    const rowData = [];
                    $(row).find('td').each((colIndex, cell) => {
                        rowData.push($(cell).text().trim());
                    });
                    rows.push(rowData);
                });

                statsData.push({ title, headers, rows });
            }
        });

        return statsData;

    } catch (error) {
        console.error("Error scraping player stats:", error);
        return null;
    }
}

// Run
getTeamPlayerStats('buffalo-bills').then(data => {
    console.log("Result:", JSON.stringify(data, null, 2));
});
