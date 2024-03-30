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

    const event = await db.getDb().then(async db => {
        const event = db.collection('events');
        return await event.insertMany(eventResult);
    });

    console.log(event);
    // const dataFolder = 'data';
    // if (!fs.existsSync(dataFolder)) {
    //     fs.mkdirSync(dataFolder);
    // }
    // fs.writeFileSync(`${ dataFolder }/events.json`, JSON.stringify(eventResult, null, 2));
    // console.log('Results saved to data/events.json');
    await browser.close(); 
})();
