import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const fighterPage = await browser.newPage();
    await fighterPage.goto("https://www.chessboxing.info/fighter/231220135649");

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

    console.log(fighterData);
    await browser.close();
})();
