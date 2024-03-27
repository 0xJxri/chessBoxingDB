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
      const tableRows = document.querySelectorAll('.tbl_events tbody tr:not(:first-child)');
      
      tableRows.forEach(row => {
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
