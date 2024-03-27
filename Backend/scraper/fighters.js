const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.chessboxing.info/fighters/');

  let pageNumber = 1;
  const allFighters = [];

  while (true) {
    console.log(`Scraping page ${pageNumber}`);

    const fighters = await page.evaluate(() => {
      const fightersArray = [];
      const tableRows = document.querySelectorAll('.tbl_events tbody tr');
      
      tableRows.forEach(row => {
        const name = row.querySelector('td:nth-child(2) a').textContent.trim();
        const fights = row.querySelector('td:nth-child(4)').textContent.trim();
        const record = row.querySelector('td:nth-child(5)').textContent.trim();
        const elo = row.querySelector('td:nth-child(6)').textContent.trim();
        const height = row.querySelector('td:nth-child(7)').textContent.trim();
        const weight = row.querySelector('td:nth-child(8)').textContent.trim();
        const activeYears = row.querySelector('td:nth-child(9)').textContent.trim();
        
        fightersArray.push({
          name,
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

    allFighters.push(...fighters);

    // Check if the next button exists
    const nextPageButton = await page.$('.pagination a.active + a');
    if (!nextPageButton || !(await nextPageButton.evaluate(node => node.getAttribute('href')))) {
      break;
    }

    await nextPageButton.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    pageNumber++;
  }

  // Save results to fighters.json file inside data folder
  const dataFolder = 'data';
  if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
  }
  fs.writeFileSync(`${dataFolder}/fighters.json`, JSON.stringify(allFighters, null, 2));
  console.log('Results saved to data/fighters.json');

  await browser.close();
})();
