import { load } from "https://deno.land/std@0.221.0/dotenv/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import Db from "../Backend/helpers/db.ts";

const env = await load()
const mongoConnectionString = env.MONGO_CONNECTIONSTRING

const db = new Db(mongoConnectionString); // mi serve una connection string per mongo

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
                const fighterBlack = await tds[4].$eval('a', el => el.textContent.trim());
                let result = await tds[5].evaluate(td => td.textContent.trim());
                const event = await tds[6].$eval('a', el => el.textContent.trim());
                const data = await tds[7].evaluate(td => td.textContent.trim());

                // Check and set result to null if it's '?'
                result = result.includes('?') ? null : result;

                // Store the extracted data in the final result array
                finalResult.push({
                    fighterWhite: fighterWhite,
                    fighterBlack: fighterBlack,
                    result: result,
                    event: event,
                    data: data
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        pageNumber++;
    }

    // Insert the final result array into the database
    const result = await db.getDb().then(async db => {
        const results = db.collection('results');
        return await results.insertMany(finalResult);
    });

    console.log(result);
    await browser.close(); 
})();
