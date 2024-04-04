import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import "dotenv/config";

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const eventLink = 'https://www.chessboxing.info/event/010424221803';

        await page.goto(eventLink);

        const eventData = await page.evaluate(() => {
            const tableRows = document.querySelectorAll('.tbl_events .tbl_mid_green01');
            const resultArray = [];
            const nestedLinks = [];

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

        for (const event of eventData) {
            const nestedPage = await browser.newPage();
            await nestedPage.goto(event.nestedLink);

            event.fightDetails = await nestedPage.evaluate(() => {
                const detailedData = [];
                const weightCategory = document.querySelector('.tbl_tot_profile').textContent.trim();
                const tableRows = document.querySelectorAll('.tbl_tot tr');

                const [link1, link2] = document.querySelectorAll('h1 img');
                let nationalityWhite = null;
                let nationalityBlack = null
                if (nationalityWhite) {
                    const nationalitySrc = link1.getAttribute('src');
                    if (nationalitySrc.includes('Unknown.png')) {
                        nationalityWhite = null;
                    } else {
                        nationalityWhite = nationalitySrc.split('/').pop().replace('.png', '');
                    }
                }
                if (nationalityBlack) {
                    const nationalitySrc = link2.getAttribute('src');
                    if (nationalitySrc.includes('Unknown.png')) {
                        nationalityBlack = null;
                    } else {
                        nationalityBlack = nationalitySrc.split('/').pop().replace('.png', '');
                    }
                }

                for(const row of tableRows){
                    const tds = row.querySelectorAll('td');
                    const key = tds[1].textContent.trim();
                    let fighterWhite = tds[0].textContent.trim();
                    let fighterBlack = tds[2].textContent.trim();

                    fighterWhite = (fighterWhite === '?' || fighterWhite === '') ? null : fighterWhite;
                    fighterBlack = (fighterBlack === '?' || fighterBlack === '') ? null : fighterBlack;

                    let fighterData = detailedData.find(item => item[key]);
                    if (!fighterData) {
                        fighterData = { [key]: {} };
                        detailedData.push(fighterData);
                    }
                    fighterData[key] = {
                        fighterWhite: fighterWhite,
                        fighterBlack: fighterBlack
                    };
                }

                return {
                    weightCategory: weightCategory,
                    nationalityWhite: nationalityWhite,
                    nationalityBlack: nationalityBlack,
                    detailedData: detailedData
                };
            });

            await nestedPage.close();
        }

        const jsonFilePath = path.join('data', 'trialEvent.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(eventData, null, 2));
        console.log(`Data written to ${jsonFilePath}`);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();
