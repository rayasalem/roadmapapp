/**
 * Production static server for Render. Serves "dist" from "npm run build".
 * SPA: unknown paths → index.html.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DIST = path.resolve(__dirname, 'dist');

const indexHtml = path.join(DIST, 'index.html');
if (!fs.existsSync(DIST) || !fs.statSync(DIST).isDirectory()) {
  console.error('ERROR: "dist" folder not found. Run: npm run build');
  process.exit(1);
}
if (!fs.existsSync(indexHtml)) {
  console.error('ERROR: dist/index.html not found. Run: npm run build');
  process.exit(1);
}

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  const p = url.parse(req.url).pathname || '/';
  let filePath = path.join(DIST, p === '/' ? 'index.html' : p);
  filePath = path.normalize(filePath);

  if (!filePath.startsWith(DIST)) {
    filePath = path.join(DIST, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(DIST, 'index.html'), (e, html) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(e ? '<h1>Not found</h1>' : html);
        });
        return;
      }
      res.writeHead(500);
      res.end('Error');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving dist on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err && err.message ? err.message : err);
  process.exit(1);
});
