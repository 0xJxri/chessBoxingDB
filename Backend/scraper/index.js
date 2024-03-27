import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
    });
    const page = await browser.newPage();

    await page.goto('https://www.chessboxing.info/results/');

    const tableRows = await page.$$('.tbl_events .tbl_mid_green01');

    for (const rowHandle of tableRows) {
        try {
            const fighterWhite = await rowHandle.$eval('td[align="right"] > a', el => el.textContent.trim());
            const fighterBlack = await rowHandle.$eval('td[align="left"] > a', el => el.textContent.trim());
            console.log('Fighter White:', fighterWhite);
            console.log('Fighter Black:', fighterBlack);
        } catch (error) {
            console.error('Error:', error);
        }
    }
})();
