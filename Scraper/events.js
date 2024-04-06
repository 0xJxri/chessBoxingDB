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
                            nestedLink: nestedLink
                        });
                    }

                    return resultArray;
                });

                await eventPage.close();

                for (const event of eventData) {
                    const nestedPage = await browser.newPage();
                    await nestedPage.goto(event.nestedLink);
        
                    event.fightDetails = await nestedPage.evaluate(() => {
                        const fighterWhite = []
                        const fighterBlack = []
                        let fightWinDetail = document.querySelector('.tbl_tot_profile h3').textContent.trim();
                        if (!fightWinDetail) {
                            fightWinDetail = null;
                        }
                        const tableRows = document.querySelectorAll('.tbl_tot tr');
                        const imgRows = document.querySelectorAll('h1');
        
        
                        let nationalityWhite = null;
                        let nationalityBlack = null
                        imgRows.forEach(img => {
                            const imgs = img.querySelectorAll('img');
                            const src1 = imgs[0].getAttribute('src');
                            const src2 = imgs[1].getAttribute('src');
                            if (src1) {
                                if (src1.includes('Unknown.png')) {
                                    nationalityWhite = null;
                                } else {
                                    nationalityWhite = src1.split('/').pop().replace('.png', '');
                                }
                            }
                            if (src2) {
                                if (src2.includes('Unknown.png')) {
                                    nationalityBlack = null;
                                } else {
                                    nationalityBlack = src2.split('/').pop().replace('.png', '');
                                }
                            }
                        });
        
        
                        for (const row of tableRows) {
                            const tds = row.querySelectorAll('td');
                            const key = tds[1].textContent.trim();
                            let fighterWhiteData = tds[0].textContent.trim();
                            let fighterBlackData = tds[2].textContent.trim();
        
                            fighterWhiteData = (fighterWhiteData === '?' || fighterWhiteData === '') ? null : fighterWhiteData;
                            fighterBlackData = (fighterBlackData === '?' || fighterBlackData === '') ? null : fighterBlackData;
        
                            // Push fighterWhiteData and fighterBlackData into their respective arrays
                            fighterWhite.push({ [key]: fighterWhiteData });
                            fighterBlack.push({ [key]: fighterBlackData });
        
                        }
        
                        const notaGameDiv = document.querySelector('.nota-game');
                        if (notaGameDiv) {
                            const cbLines = notaGameDiv.querySelectorAll('.cbline');
                            const chessMoves = [];
        
                            // Iterate over cbLines to get the moves
                            cbLines.forEach(cbLine => {
                                const cbMoves = cbLine.querySelectorAll('.cbmove');
                                const movesInLine = [];
        
                                // Iterate over cbMoves to get individual moves
                                cbMoves.forEach(cbMove => {
                                    movesInLine.push(cbMove.textContent.trim());
                                });
        
                                chessMoves.push(movesInLine);
                            });
        
                            const cbGameResult = notaGameDiv.querySelector('.cbgame-result');
                            if (cbGameResult) {
                                chessMoves[chessMoves.length - 1].push(cbGameResult.textContent.trim());
                            }
        
                            return {
                                fightWinDetail: fightWinDetail,
                                nationalityWhite: nationalityWhite,
                                nationalityBlack: nationalityBlack,
                                fighterWhite: fighterWhite,
                                fighterBlack: fighterBlack,
                                chessMoves: chessMoves
                            };
                        } else {
                            return {
                                fightWinDetail: fightWinDetail,
                                nationalityWhite: nationalityWhite,
                                nationalityBlack: nationalityBlack,
                                fighterWhite: fighterWhite,
                                fighterBlack: fighterBlack,
                                chessMoves: null
                            };
                        }
                    });
        
                    await nestedPage.close();
                }

                eventData.forEach(event => {
                    delete event.nestedLink;
                });
        

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

    // const eventsDetailedPath = path.join('data', 'detailedEvents.json');
    // fs.writeFileSync(eventsDetailedPath, JSON.stringify(eventResult, null, 2));
    // console.log(`Saved detailed fighters to ${eventsDetailedPath}`);

    // Insert the event data into MongoDB
    const eventsCollection = await db.getDb().then(async db => {
        const eventsCollection = db.collection('events');
        return await eventsCollection.insertMany(eventResult);
    });

    console.log("Events data inserted into MongoDB", eventsCollection);
    await browser.close();
})();
