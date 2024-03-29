import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.chessboxing.info/fighters/');

    let pageNumber = 1;
    const listFighters = [];
    const detailedFighters = [];

    while (true) {
        console.log(`Scraping page ${pageNumber}`);

        const fighters = await page.evaluate(() => {
            const fightersArray = [];
            const tableRows = document.querySelectorAll('.tbl_events tbody tr:not(:first-child)');
            
            tableRows.forEach(row => {
                const profileLink = row.querySelector('td:nth-child(2) a').href.trim();
                const name = row.querySelector('td:nth-child(2) a').textContent.trim();
                const nationalityImg = row.querySelector('td:nth-child(3) img.flag');
                let nationality = null;
                if (nationalityImg) {
                    const nationalitySrc = nationalityImg.getAttribute('src');
                    if (nationalitySrc.includes('Unknown.png')) {
                        nationality = null;
                    } else {
                        nationality = nationalitySrc.split('/').pop().replace('.png', '');
                    }
                }
                const fights = row.querySelector('td:nth-child(4)').textContent.trim();
                const record = row.querySelector('td:nth-child(5)').textContent.trim();
                const eloElement = row.querySelector('td:nth-child(6)');
                let elo = null;
                if (eloElement) {
                    const eloText = eloElement.textContent.trim();
                    elo = eloText === '?' ? null : eloText;
                }
                const heightElement = row.querySelector('td:nth-child(7)');
                let height = null;
                if (heightElement) {
                    const heightText = heightElement.textContent.trim();
                    height = heightText === '?' ? null : heightText;
                }
                const weightElement = row.querySelector('td:nth-child(8)');
                let weight = null;
                if (weightElement) {
                    const weightText = weightElement.textContent.trim();
                    weight = weightText === '?' ? null : weightText;
                }
                const activeYears = row.querySelector('td:nth-child(9)').textContent.trim() || null;
                
                fightersArray.push({
                    profileLink,
                    name,
                    nationality,
                    fights,
                    record,
                    elo,
                    height,
                    weight,
                    activeYears
                });
            });
            
            return fightersArray;
        });

        listFighters.push(...fighters);

        // Check if the next button exists
        const nextPageButton = await page.$('.pagination a.active + a');
        if (!nextPageButton || !(await nextPageButton.evaluate(node => node.getAttribute('href')))) {
            break;
        }

        await nextPageButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        pageNumber++;
    }

    for (const fighter of listFighters) {
        const fighterPage = await browser.newPage();
        await fighterPage.goto(fighter.profileLink);

        const fighterData = await fighterPage.evaluate(() => {
            function checkNull(value) {
                if (value === "?" || value === "" || value === undefined) {
                    return null;
                }
                return value;
            }

            const fighterInfo = document.querySelector(".tbl_addbtn02 > tbody");
            const name = fighterInfo.querySelector("h1").textContent;
            const results = fighterInfo
                .querySelector("h2")
                .textContent.replaceAll(" ", "")
                .split("-");
            const pfp_link = fighterInfo.querySelector(".profile_mid").src;

            const tbl_tot = fighterInfo.querySelectorAll(
                '.tbl_tot tr > td[align="left"]'
            );

            const age = checkNull(tbl_tot[0].innerText);
            const height = checkNull(tbl_tot[1].innerText);
            const weight = checkNull(tbl_tot[2].innerText);
            const reach = checkNull(tbl_tot[3].innerText);
            const elo = checkNull(tbl_tot[4].innerText);
            const country = checkNull(tbl_tot[5].innerText);
            const hometown = checkNull(tbl_tot[6].innerText);
            const gym = checkNull(tbl_tot[7].innerText);
            const job = checkNull(tbl_tot[8].innerText);

            let description =
                fighterInfo.querySelector(".tbl_tot_profile").textContent;

            let fights = [];
            document
                .querySelectorAll(".tbl_events tbody tr:not(:nth-child(-n+2))")
                .forEach((row) => {
                    const fight = row.querySelectorAll("td");
                    const opponentChessColor = fight[0]
                        .querySelector("img")
                        .classList[1].replace("border_", "");
                    const opponentName = fight[1].textContent;
                    const eventName = fight[2].textContent;
                    const date = fight[3].textContent;
                    const result = fight[4].textContent;
                    const description = fight[5].textContent;
                    const round = fight[6].textContent;
                    fights.push({
                        opponentChessColor,
                        opponentName,
                        eventName,
                        date,
                        result,
                        description,
                        round,
                    });
                });

            return {
                name,
                results,
                pfp_link,
                age,
                height,
                weight,
                reach,
                elo,
                country,
                hometown,
                gym,
                job,
                description,
                fights,
            };
        });

        detailedFighters.push(fighterData);

        await fighterPage.close();
    }

    const listFightersFilePath = path.join('data', 'listFighters.json');
    fs.writeFileSync(listFightersFilePath, JSON.stringify(listFighters, null, 2));
    console.log(`Saved list of fighters to ${listFightersFilePath}`);

    const detailedFightersFilePath = path.join('data', 'detailedFighters.json');
    fs.writeFileSync(detailedFightersFilePath, JSON.stringify(detailedFighters, null, 2));
    console.log(`Saved detailed fighters to ${detailedFightersFilePath}`);

    await browser.close();
})();
