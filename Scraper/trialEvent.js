import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import "dotenv/config";

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const eventLink = 'https://www.chessboxing.info/event/130923225113';

        await page.goto(eventLink);

        const eventData = await page.evaluate(() => {
            const tableRows = document.querySelectorAll('.tbl_events .tbl_mid_green01');
            const resultArray = [];

            for (const row of tableRows) {
                const tds = row.querySelectorAll('td');
                const fighterWhite = tds[1].querySelector('a').textContent.trim();
                let urlImgWhite = tds[2].querySelector('img').getAttribute('src').replace('thumb', 'big');
                let urlImgBlack = tds[4].querySelector('img').getAttribute('src').replace('thumb', 'big');
                const fighterBlack = tds[5].querySelector('a').textContent.trim();
                let result = tds[6].textContent.trim();
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

        const jsonFilePath = path.join('data', 'trialEvent.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(eventData, null, 2));
        console.log(`Data written to ${jsonFilePath}`);

        await browser.close();
    } catch (error) {
        console.error('Error:', error);
    }
})();
