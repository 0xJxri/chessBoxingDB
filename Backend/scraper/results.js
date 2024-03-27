import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let pageNumber = 1;
    let finalResult = []; // Array to store the fighter data

    while (true) {
        const url = `https://www.chessboxing.info/results/?pageno=${pageNumber}`; //Cicle the uris
        await page.goto(url);

        const tableRows = await page.$$('.tbl_events .tbl_mid_green01');

        if (tableRows.length === 0) break; // If there are no table rows, exit the loop

        for (const rowHandle of tableRows) {
            try {
                const tds = await rowHandle.$$('td');

                // Extract text content of specific td elements
                const fighterWhite = await tds[0].$eval('a', el => el.textContent.trim());
                const fighterBlack = await tds[4].$eval('a', el => el.textContent.trim());
                const result = await tds[5].evaluate(td => td.textContent.trim());
                const event = await tds[6].$eval('a', el => el.textContent.trim());
                const data = await tds[7].evaluate(td => td.textContent.trim())

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

    const dataFolder = 'data';
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }
    fs.writeFileSync(`${ dataFolder }/results.json`, JSON.stringify(finalResult, null, 2));
    console.log('Results saved to data/fighters.json');
    await browser.close(); 
})();
