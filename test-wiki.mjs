import * as cheerio from 'cheerio';

async function getWikiData(playerName) {
    try {
        // Search for the page first to get the correct title
        const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(playerName)}&limit=1&namespace=0&format=json`);
        const searchData = await searchRes.json();
        const pageTitle = searchData[1][0];

        if (!pageTitle) {
            console.log("No Wikipedia page found.");
            return null;
        }

        console.log(`Found page: ${pageTitle}`);

        // Fetch the page content
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`;
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        // 1. Basic Bio (Summary)
        // Usually the first few paragraphs before the TOC or first heading
        let summary = "";
        $('.mw-parser-output > p').each((i, el) => {
            if (i < 3) { // Grab first 3 paragraphs
                summary += $(el).text() + "\n\n";
            }
        });

        // 2. Awards (Infobox or Section)
        let awards = [];
        // Try to find "Career highlights and awards" in the infobox
        const infoboxAwards = $('th:contains("Career highlights and awards")').next('td').find('ul li');
        if (infoboxAwards.length > 0) {
            infoboxAwards.each((i, el) => {
                awards.push($(el).text().trim());
            });
        }

        // 3. Personal Life
        // Find section with id "Personal_life"
        let personalLife = "";
        const personalHeader = $('#Personal_life').parent();
        if (personalHeader.length > 0) {
            let nextNode = personalHeader.next();
            while (nextNode.length > 0 && !nextNode.is('h2')) {
                if (nextNode.is('p')) {
                    personalLife += nextNode.text() + "\n\n";
                }
                nextNode = nextNode.next();
            }
        }

        return {
            title: pageTitle,
            summary: summary.trim(),
            awards: awards,
            personalLife: personalLife.trim().substring(0, 500) + "..." // Truncate for display in test
        };

    } catch (e) {
        console.error(e);
        return null;
    }
}

async function run() {
    const data = await getWikiData("Patrick Mahomes");
    console.log(JSON.stringify(data, null, 2));
}

run();
