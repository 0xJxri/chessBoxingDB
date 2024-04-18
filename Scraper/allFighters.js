import puppeteer from 'puppeteer'
import { MongoClient } from 'mongodb'
import "dotenv/config"
import fs from 'fs'
import path from 'path'
import * as countryCodeJSON from './data/countryCode.json';


(async () => {
    const browser = await puppeteer.launch({headless: false});
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
                let urlImg = row.querySelector('td:nth-child(1) img').getAttribute('src');
                console.log(urlImg)
                if (urlImg && urlImg.includes('unknown.jpg')) {
                    urlImg = null;
                }
                else {
                    const truncateUrl = (url) => {
                        if (url && url.length > 0) {
                            const lastIndex = url.lastIndexOf('_');
                            return lastIndex !== -1 ? url.substring(0, lastIndex) : url;
                        } else {
                            return url; // Return the original URL if it's empty
                        }
                    };
                    urlImg = truncateUrl(urlImg)
                }

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


                const fights = parseInt(row.querySelector('td:nth-child(4)').textContent.trim());
                const record = row.querySelector('td:nth-child(5)').textContent.trim();
                const eloElement = row.querySelector('td:nth-child(6)');
                let elo = null;
                if (eloElement) {
                    const eloText = parseInt(eloElement.textContent.trim());
                    elo = eloText === '?' ? null : eloText;
                }
                const heightElement = row.querySelector('td:nth-child(7)');
                let height = null;
                if (heightElement) {
                    const heightText = heightElement.textContent.trim();
                    const heightMatch = heightText.match(/\d+/);
                    height = heightMatch ? parseInt(heightMatch[0]) : null; // Convert to integer
                }
                const weightElement = row.querySelector('td:nth-child(8)');
                let weight = null;
                if (weightElement) {
                    const weightText = weightElement.textContent.trim();
                    const weightMatch = weightText.match(/\d+/);
                    weight = weightMatch ? parseInt(weightMatch[0]) : null; //Converting to integer
                }
                const activeYears = row.querySelector('td:nth-child(9)').textContent.trim() || null;

                fightersArray.push({
                    urlImg,
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

            const truncateUrl = (url) => {
                if (url && url.length > 0) {
                    const lastIndex = url.lastIndexOf('_');
                    return lastIndex !== -1 ? url.substring(0, lastIndex) : url;
                } else {
                    return url; // Return the original URL if it's empty
                }
            };

            function formatDateString(dateString) {
                // Create a new Date object directly from the date string
                let dateObject = new Date(dateString);

                // Format the date components and store in a variable
                let formattedDate = ('0' + dateObject.getDate()).slice(-2) + '/' +
                    ('0' + (dateObject.getMonth() + 1)).slice(-2) + '/' +
                    dateObject.getFullYear();

                return formattedDate;
            }

            const fighterInfo = document.querySelector(".tbl_addbtn02 > tbody");
            const name = fighterInfo.querySelector("h1").textContent.trim();
            let flag = fighterInfo.querySelector("h1 img").getAttribute('src')
            if (flag) {
                if (flag.includes('Unknown.png')) {
                    flag = null;
                } else {
                    flag = flag.split('/').pop().replace('.png', '');
                }

                console.log(flag)
                const results = fighterInfo
                    .querySelector("h2")
                    .textContent.replaceAll(" ", "")
                    .split("-");

                let pfp_link = fighterInfo.querySelector(".profile_mid").src;
                if (pfp_link.includes('unknown.jpg')) {
                    pfp_link = null;
                } else {
                    pfp_link = truncateUrl(pfp_link)
                }


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
                        let opponentImg = fight[0].querySelector("img").getAttribute('src')
                        if (opponentImg.includes('unknown.jpg')) {
                            opponentImg = null;
                        } else {
                            opponentImg = truncateUrl(opponentImg);
                        }
                        const opponentName = fight[1].textContent;
                        const eventName = fight[2].textContent;
                        const date = fight[3].textContent;
                        const dateFormat = formatDateString(date)
                        const result = fight[4].textContent;
                        const description = fight[5].textContent;
                        const round = fight[6].textContent;

                        let winBy;
                        if (description.includes('chess')) {
                            winBy = 'chess';
                        } else if (description.includes('boxing')) {
                            winBy = 'boxing';
                        } else if (description.includes('UNKNOWN')) {
                            winBy = 'UNKNOWN';
                        } else {
                            winBy = null;
                        }

                        fights.push({
                            opponentImg,
                            opponentChessColor,
                            opponentName,
                            eventName,
                            date,
                            dateFormat,
                            result,
                            description,
                            winBy,
                            round,
                        });
                    });

                return {
                    name,
                    flag,
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
            }
        });

        detailedFighters.push(fighterData);

        await fighterPage.close();
    }

    for (let i = 0; i < listFighters.length; i++) {
        const nation = listFighters[i]
        let nationality = nation.nationality
        for (const key in countryCodeJSON) {
            if (Object.prototype.hasOwnProperty.call(countryCodeJSON, key)) {
                console.log(key)
                if (key === nationality) {
                    listFighters[i].countryCode = countryCodeJSON[key]; // Set nationality to the matched key
                    break; // Exit the loop once a match is found
                }
            }
        }
    }

    for (let i = 0; i < detailedFighters.length; i++) {
        const flagsFighters = detailedFighters[i]
        let flag = flagsFighters.flag
        for (const key in countryCodeJSON) {
            if (Object.prototype.hasOwnProperty.call(countryCodeJSON, key)) {
                console.log(key)
                if (key === flag) {
                    detailedFighters[i].flag = countryCodeJSON[key]; // Set nationality to the matched key
                    break; // Exit the loop once a match is found
                }
            }
        }
    }


    // const listFightersFilePath = path.join('data', 'listFightersNew.json');
    // fs.writeFileSync(listFightersFilePath, JSON.stringify(listFighters, null, 2));
    // console.log(`Saved list of fighters to ${listFightersFilePath}`);

    // const detailedFightersFilePath = path.join('data', 'detailedFighters.json');
    // fs.writeFileSync(detailedFightersFilePath, JSON.stringify(detailedFighters, null, 2));
    // console.log(`Saved detailed fighters to ${detailedFightersFilePath}`);

    //  const fighterList = await db.getDb().then(async db => {
    //         const fighterList = db.collection('listfighters');
    //         return await fighterList.insertMany(listFighters);
    //     });
    //     console.log(fighterList)
    // const detailedListFighters = await db.getDb().then(async db => {
    //     const detailedListFighters = db.collection('detailedfighters');
    //     return await detailedListFighters.insertMany(detailedFighters);
    // });
    // console.log(detailedListFighters)

    async function insertFightDetails(detailedFighters) {
        const mongoConnectionString = process.env.MONGO_CONNECTIONSTRING;
        const client = new MongoClient(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        if (client) {
            console.log("Connected to db!")
        }
        try {
            const db = client.db(); // Get the database from the client
            const detailedFightersCollection = db.collection("detailedfighters"); // replace "test" with your database name
            const result = await detailedFightersCollection.insertMany(detailedFighters);
            console.log(result)
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }

    insertFightDetails(detailedFighters);

    await browser.close();

})();
