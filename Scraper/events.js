import puppeteer from 'puppeteer';
import { MongoClient } from 'mongodb';
import "dotenv/config";
import fs from 'fs'
import path from 'path';
import * as countryCodeJSON from './data/countryCode.json';



(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pageNumber = 1;
    let eventResult = []; // Array to store the event data
    let fightDetails = []

    while (true) {
        const url = `https://www.chessboxing.info/events/?pageno=${pageNumber}`; // Cycle through the URIs
        await page.goto(url);

        const tableRows = await page.$$('.tbl_events tbody tr:not(:first-child)');

        if (tableRows.length === 0) break; // If there are no table rows, exit the loop

        for (const rowHandle of tableRows) {
            try {
                const tds = await rowHandle.$$('td');

                // Extract text content of specific td elements
                let eventImg = null;
                try {
                    const imgElement = await tds[0].$eval('img', el => el.src)// Default value
                    console.log(imgElement);
                    if (imgElement) {
                        const lastIndex = imgElement.lastIndexOf('_');
                        eventImg = lastIndex !== -1 ? imgElement.substring(0, lastIndex) : imgElement;
                    }
                } catch (error) {
                    eventImg = null
                }

                console.log("Event image without .jpg", eventImg)


                const eventName = await tds[1].$eval('a', el => el.textContent.trim());
                const eventLink = await tds[1].$eval('a', el => el.href);
                const date = await tds[2].evaluate(td => td.textContent.trim());
                // Default value
                let imgFlag = null
                try {
                    let flag = await tds[3].$eval('img', el => el.src) // Default value
                    console.log(flag);
                    if (flag) {
                        const lastIndex = flag.lastIndexOf('_');
                        imgFlag = lastIndex !== -1 ? flag.substring(0, lastIndex) : flag;
                    }
                } catch (error) {
                    imgFlag = null
                }

                const venue = await tds[4].evaluate(td => td.textContent.trim());
                const fights = await tds[5].$eval('a', el => el.textContent.trim());
                let countryCode = null;
                if (imgFlag) {
                    if (imgFlag.includes('Unknown.png')) {
                        countryCode = null;
                    } else {
                        countryCode = imgFlag.split('/').pop().replace('.png', '');
                    }
                }

                // Open detail page for the event
                const eventPage = await browser.newPage();
                await eventPage.goto(eventLink);


                // Scrape data from the detail page
                const eventData = await eventPage.evaluate(async () => {
                    const tableRows = document.querySelectorAll('.tbl_events .tbl_mid_green01');
                    const resultArray = [];

                    for (const row of tableRows) {
                        const tds = row.querySelectorAll('td');
                        const resultId = parseInt(tds[0].textContent.trim().replace(')', ''))
                        const fighterWhite = tds[1].querySelector('a').textContent.trim();
                        let urlImgWhite = tds[2].querySelector('img').getAttribute('src');
                        let urlImgBlack = tds[4].querySelector('img').getAttribute('src');
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

                        const truncateUrl = (url) => {
                            if (url && url.length > 0) {
                                const lastIndex = url.lastIndexOf('_');
                                return lastIndex !== -1 ? url.substring(0, lastIndex) : url;
                            } else {
                                return url; // Return the original URL if it's empty
                            }
                        };

                        urlImgBlack = truncateUrl(urlImgBlack)
                        urlImgWhite = truncateUrl(urlImgWhite)

                        resultArray.push({
                            resultId: resultId,
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

                    const fightDetailsPage = await nestedPage.evaluate((event) => {

                        function formatDateString(dateString) {
                            // Create a new Date object directly from the date string
                            let dateObject = new Date(dateString);

                            // Format the date components and store in a variable
                            let formattedDate = ('0' + dateObject.getDate()).slice(-2) + '/' +
                                ('0' + (dateObject.getMonth() + 1)).slice(-2) + '/' +
                                dateObject.getFullYear();

                            return formattedDate;
                        }


                        const fighterWhite = {};
                        const fighterBlack = {};
                        let fightWinDetail = document.querySelector('.tbl_tot_profile h3').textContent.trim();
                        if (!fightWinDetail) {
                            fightWinDetail = null;
                        }

                        const carouselImgs = document.querySelectorAll(".mySlides");
                        let imgSrcArray = null;

                        if (carouselImgs && carouselImgs.length > 0) {
                            imgSrcArray = []
                            carouselImgs.forEach(img => {
                                let src = img.getAttribute('src');
                                const truncateUrl = (url) => {
                                    if (url && url.length > 0) {
                                        const lastIndex = url.lastIndexOf('_');
                                        return lastIndex !== -1 ? url.substring(0, lastIndex) : url;
                                    } else {
                                        return url; // Return the original URL if it's empty
                                    }
                                };
                                src = truncateUrl(src)
                                imgSrcArray.push(src);
                            });
                        }

                        const tableRows = document.querySelectorAll('.tbl_tot tr');
                        const imgRows = document.querySelectorAll('h1');

                        const wrapperH2 = document.querySelector('h2')
                        const eventName = document.querySelector('h2 a').textContent.trim() || null;
                        const venue = document.querySelector('h2 a:nth-child(4)').textContent.trim() || null;

                        let date = '';

                        // Iterate over the child nodes of the h2 element
                        wrapperH2.childNodes.forEach(node => {
                            // Check if the node is not an anchor tag (a)
                            if (node.nodeType === Node.TEXT_NODE) {
                                // Append the text content of non-anchor nodes to h2Text
                                date += node.textContent.trim() + ' ';
                            }
                        });

                        // Trim any trailing whitespace
                        date = date.trim().replace(/^- /, '');

                        const dateFormat = formatDateString(date)

                        console.log(date)
                        // const date = wrapperH2[1].textContent.trim() || null
                        // const dateFormat = formatDateString(date)
                        console.log("eventNameee = ", eventName)
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
                            fighterWhite[key] = fighterWhiteData;
                            fighterBlack[key] = fighterBlackData;

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
                                resultId: event.resultId,
                                gallery: imgSrcArray,
                                eventName: eventName,
                                venue: venue,
                                date: date,
                                dateFormat: dateFormat,
                                fightWinDetail: fightWinDetail,
                                nationalityWhite: nationalityWhite,
                                nationalityBlack: nationalityBlack,
                                fighterWhite: fighterWhite,
                                fighterBlack: fighterBlack,
                                chessMoves: chessMoves
                            };
                        } else {
                            return {
                                resultId: event.resultId,
                                gallery: imgSrcArray,
                                eventName: eventName,
                                venue: venue,
                                date: date,
                                dateFormat: dateFormat,
                                fightWinDetail: fightWinDetail,
                                nationalityWhite: nationalityWhite,
                                nationalityBlack: nationalityBlack,
                                fighterWhite: fighterWhite,
                                fighterBlack: fighterBlack,
                                chessMoves: null
                            };
                        }
                    }, event);

                    fightDetails.push(fightDetailsPage)

                    await nestedPage.close();
                }

                eventData.forEach(event => {
                    delete event.nestedLink;
                });


                // Store the extracted data in the final result array, nesting the eventData inside the event object
                eventResult.push({
                    eventImg: eventImg,
                    eventName: eventName,
                    date: date,
                    countryCode: countryCode,
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

    for (let i = 0; i < eventResult.length; i++) {
        const event = eventResult[i];
        let countryCode = event.countryCode;
        for (const key in countryCodeJSON) {
            if (Object.prototype.hasOwnProperty.call(countryCodeJSON, key)) {
                if (key === countryCode) {
                    eventResult[i].countryCode = countryCodeJSON[key]; // Update countryCode to the matched value
                    break; // Exit the loop once a match is found
                }
            }
        }
    }

    for (let i = 0; i < fightDetails.length; i++) {
        const fight = fightDetails[i];
        let countryCodeWhite = fight.nationalityWhite;
        let countryCodeBlack = fight.nationalityBlack;

        for (const key in countryCodeJSON) {
            if (Object.prototype.hasOwnProperty.call(countryCodeJSON, key)) {
                if (key === countryCodeWhite) {
                    fightDetails[i].nationalityWhite = countryCodeJSON[key]; // Update countryCode to the matched value
                }
                if (key === countryCodeBlack) {
                    fightDetails[i].nationalityBlack = countryCodeJSON[key]; // Update countryCode to the matched value
                }
            }
        }
    }


    // const eventsDetailedPath = path.join('data', 'detailedEvents.json');
    // fs.writeFileSync(eventsDetailedPath, JSON.stringify(eventResult, null, 2));
    // console.log(`Saved detailed fighters to ${eventsDetailedPath}`);

    // const fightDetailsPath = path.join('data', 'fightDetails.json');
    // fs.writeFileSync(fightDetailsPath, JSON.stringify(fightDetails, null, 2));
    // console.log(`Saved detailed fighters to ${fightDetailsPath}`);


    // Insert the event data into MongoDB
    // const eventsCollection = await db.getDb().then(async db => {
    //     const eventsCollection = db.collection('events');
    //     return await eventsCollection.insertMany(eventResult);
    // });
    // console.log(eventsCollection)

    // const fightsDetailsCollection = await db.getDb().then(async db => {
    //     const fightsDetailsCollection = db.collection('fightdetails');
    //     return await fightsDetailsCollection.insertMany(fightDetails);
    // });

    async function insertFightDetails(fightDetails) {
        const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;
        const client = new MongoClient(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        if (client) {
            console.log("Connected to db!")
        }
        try {
            const db = client.db(); // Get the database from the client
            const fightsDetailsCollection = db.collection("fightdetails"); // replace "test" with your database name
            const result = await fightsDetailsCollection.insertMany(fightDetails);
            console.log(result)
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }

    insertFightDetails(fightDetails); // call the function with your fightDetails


    await browser.close();
})(); 
