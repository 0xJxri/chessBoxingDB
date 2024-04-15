import puppeteer from 'puppeteer';
import Db from '../Backend/helpers/db.ts';
import "dotenv/config";
import fs from 'fs'
import path from 'path';


init(){}
const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;

const db = new Db(mongoConnectionString); // You need a connection string for MongoDB

function formatDateString(dateString) {
    // Create a new Date object directly from the date string
    let dateObject = new Date(dateString);

    // Format the date components and store in a variable
    let formattedDate = ('0' + dateObject.getDate()).slice(-2) + '/' +
                        ('0' + (dateObject.getMonth() + 1)).slice(-2) + '/' +
                        dateObject.getFullYear();

    return formattedDate;
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pageNumber = 1;
    let finalResult = []; // Array to store the fighter data

    while (true) {
        const url = `https://www.chessboxing.info/results/?pageno=${pageNumber}`; // Cycle the URIs
        await page.goto(url);

        const tableRows = await page.$$('.tbl_events .tbl_mid_green01');

        if (tableRows.length === 0) break; // If there are no table rows, exit the loop

        for (const rowHandle of tableRows) {
            try {
                const tds = await rowHandle.$$('td');

                // Extract text content of specific td elements
                const fighterWhite = await tds[0].$eval('a', el => el.textContent.trim());
                const urlImgWhiteHandle = await tds[1].evaluateHandle(td => td.querySelector('img').getAttribute('src'));
                const urlImgBlackHandle = await tds[3].evaluateHandle(td => td.querySelector('img').getAttribute('src'));

                let urlImgWhite = await urlImgWhiteHandle.jsonValue();
                let urlImgBlack = await urlImgBlackHandle.jsonValue();

                const fighterBlack = await tds[4].$eval('a', el => el.textContent.trim());
                let result = await tds[5].evaluate(td => td.textContent.trim());
                const event = await tds[6].$eval('a', el => el.textContent.trim());
                const data = await tds[7].evaluate(td => td.textContent.trim());

                const dateFormat = formatDateString(data)

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
                

                // Truncate the URLs
                urlImgWhite = truncateUrl(urlImgWhite);
                urlImgBlack = truncateUrl(urlImgBlack);
                // Check and set result to null if it's '?'
                result = result.includes('?') ? null : result;

                // Store the extracted data in the final result array
                finalResult.push({
                    fighterWhite: fighterWhite,
                    urlImgWhite: urlImgWhite,
                    urlImgBlack: urlImgBlack,
                    fighterBlack: fighterBlack,
                    result: result,
                    event: event,
                    data: data,
                    dataFormatted: dateFormat
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        pageNumber++;
    }

    // // Insert the final result array into the database
    const result = await db.getDb().then(async db => {
        const results = db.collection('results');
        return await results.insertMany(finalResult);
    });

    console.log(result);
    await browser.close();
})();
