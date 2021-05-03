const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');

wkhtmltopdf(
  'file:///home/d3ah/Projects/RedCiudadana/municipalidades2020/public/guatemala/guatemala/pdf.html',
  {
    output: 'out.pdf',
    debugJavascript: true,
    debug: true,
    debugStdOut: true,
    enableLocalFileAccess: true
});