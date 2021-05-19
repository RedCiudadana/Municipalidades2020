const fs = require('fs');
const path = require('path');

let folderPath = __dirname + '/public';

let directories = [];

fs.readdirSync(folderPath)
  .filter((_path) => fs.statSync(path.join(folderPath, _path)).isDirectory())
  .forEach(departamento => {
    let currentPath = path.join(folderPath, departamento);

    fs.readdirSync(path.join(folderPath, departamento))
      .filter((municipio) => fs.statSync(path.join(currentPath, municipio)).isDirectory())
      .map(municipio => {
        fs.readdirSync(path.join(currentPath, municipio)).forEach((file) => {
          if (file.match(/pdf.html/) !== null) {
            directories.push(path.join(departamento, municipio, file));
          }
        });
    });
});

const puppeteer = require('puppeteer')

async function printPDF() {

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1024,
    height: 1010,
    deviceScaleFactor: 1
  });

  for (let index = 0; index < directories.length; index++) {
    const file = directories[index];

    let s = file.split('/')
    s = s.slice(0, s.length - 1);
    s.push(s.slice(0, 2).join('-') + '.pdf');

    let output = s.reduce((a, b) => path.join(a, b));
    output = path.join('public', output);

    let url = 'http://localhost:8080/' + file;
    console.log(url);

    try {
      await page.goto(url);

      await page.emulateMediaType('screen');
    } catch (error) {
      console.error('error in go to');
    }
    // await page.screenshot({
    //   fullPage: true,
    //   path: 'screen.png'
    // });

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

    require('fs').writeFile(output, pdf, function (err, data) {
      if (err) {
        console.error(err);
      }
    });
  }

  await browser.close();
}

printPDF();