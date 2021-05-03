const puppeteer = require('puppeteer')

async function printPDF() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1024,
    height: 1010,
    deviceScaleFactor: 1
  });

  await page.goto('http://localhost:8080/guatemala/guatemala/pdf.html');

  await page.emulateMediaType('screen');
  await page.screenshot({
    fullPage: true,
    path: 'screen.png'
  });

  const pdf = await page.pdf({
    format: 'A3',
    scale: 1.50,
    margin: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  });

  await browser.close();
  return pdf
}

printPDF().then((pdf) => {
  require('fs').writeFile('pupeter.pdf', pdf, function(err, data) {
    if (err) {
      console.error(err);
    }
  });
});