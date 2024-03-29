import fs from "fs";
import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pageNumber = 1;
    let eventResult = []; // Array to store the fighter data

    while (true) {
        const url = `https://www.chessboxing.info/events/?pageno=${pageNumber}`; //Cicle the uris
        await page.goto(url);

        const tableRows = await page.$$('.tbl_events tbody tr:not(:first-child)');

        if (tableRows.length === 0) break; // If there are no table rows, exit the loop

        for (const rowHandle of tableRows) {
            try {
                const tds = await rowHandle.$$('td');

                // Extract text content of specific td elements
                const eventName = await tds[1].$eval('a', el => el.textContent.trim());
                const date = await tds[2].evaluate(td => td.textContent.trim());
                const venue = await tds[4].evaluate(td => td.textContent.trim());
                const fights = await tds[5].$eval('a', el => el.textContent.trim());
              //  console.log(fights)
              
                // Store the extracted data in the final result array
                eventResult.push({
                    eventName: eventName,
                    date: date,
                    venue: venue,
                    fights: fights
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        pageNumber++;
    }

    const dataFolder = 'data';
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }
    fs.writeFileSync(`${ dataFolder }/events.json`, JSON.stringify(eventResult, null, 2));
    console.log('Results saved to data/events.json');
    await browser.close(); 
})();
