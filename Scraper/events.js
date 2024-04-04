import puppeteer from 'puppeteer';
import Db from '../Backend/helpers/db.ts';
import "dotenv/config";
import fs from 'fs'
import path from 'path';

const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;

const db = new Db(mongoConnectionString); // You need a connection string for MongoDB

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pageNumber = 1;
    let eventResult = []; // Array to store the event data

    while (true) {
        const url = `https://www.chessboxing.info/events/?pageno=${pageNumber}`; // Cycle through the URIs
        await page.goto(url);

        const tableRows = await page.$$('.tbl_events tbody tr:not(:first-child)');

        if (tableRows.length === 0) break; // If there are no table rows, exit the loop

        for (const rowHandle of tableRows) {
            try {
                const tds = await rowHandle.$$('td');

                // Extract text content of specific td elements
                const eventName = await tds[1].$eval('a', el => el.textContent.trim());
                const eventLink = await tds[1].$eval('a', el => el.href);
                const date = await tds[2].evaluate(td => td.textContent.trim());
                const venue = await tds[4].evaluate(td => td.textContent.trim());
                const fights = await tds[5].$eval('a', el => el.textContent.trim());

                // Open detail page for the event
                const eventPage = await browser.newPage();
                await eventPage.goto(eventLink);

                // Scrape data from the detail page
                const eventData = await eventPage.evaluate(async () => {
                    const tableRows = document.querySelectorAll('.tbl_events .tbl_mid_green01');
                    const resultArray = [];

                    for (const row of tableRows) {
                        const tds = row.querySelectorAll('td');
                        const fighterWhite = tds[1].querySelector('a').textContent.trim();
                        let urlImgWhite = tds[2].querySelector('img').getAttribute('src').replace('thumb', 'big');
                        let urlImgBlack = tds[4].querySelector('img').getAttribute('src').replace('thumb', 'big');
                        const fighterBlack = tds[5].querySelector('a').textContent.trim();
                        let result = tds[6].textContent.trim();
                        const resultDescription = tds[7].textContent.trim();
                        let round = tds[8].textContent.trim()

                        const nestedLink = row.querySelector('.buttondiv a').getAttribute('href');

                        // Check and set result/round to null if it's '?'
                        result = result.includes('?') ? null : result;
                        round = round.includes('?') ? null : round

                        if (urlImgWhite && urlImgWhite.includes('unknown.jpg')) {
                            urlImgWhite = null;
                        }
                        if (urlImgBlack && urlImgBlack.includes('unknown.jpg')) {
                            urlImgBlack = null;
                        }
                        
                        resultArray.push({
                            fighterWhite: fighterWhite,
                            urlImgWhite: urlImgWhite,
                            urlImgBlack: urlImgBlack,
                            fighterBlack: fighterBlack,
                            result: result,
                            resultDescription: resultDescription,
                            round: round,
                            additionalData: additionalData
                        });
                    }

                    return resultArray;
                });

                await eventPage.close();

                // Store the extracted data in the final result array, nesting the eventData inside the event object
                eventResult.push({
                    eventName: eventName,
                    date: date,
                    venue: venue,
                    fights: fights,
                    eventData: eventData // Nesting eventData inside the event object
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        pageNumber++;
    }

    const eventsDetailedPath = path.join('data', 'detailedEvents.json');
    fs.writeFileSync(eventsDetailedPath, JSON.stringify(eventResult, null, 2));
    console.log(`Saved detailed fighters to ${eventsDetailedPath}`);

    // Insert the event data into MongoDB
    // const eventsCollection = db.collection('events');
    // await eventsCollection.insertMany(eventResult);

    // console.log("Events data inserted into MongoDB");
    console.log(eventResult)
    await browser.close();
})();
