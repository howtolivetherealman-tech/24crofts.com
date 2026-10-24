/**
 * 24crofts.com — Hostinger Node.js Production Startup File (server.js)
 *
 * In Hostinger hPanel -> Advanced -> Node.js:
 * - Node.js version: 20.x or 22.x
 * - Application mode: Production
 * - Application root: public_html (or your app directory)
 * - Application startup file: server.js
 */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request on 24crofts.com:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> 24crofts.com production server ready on http://${hostname}:${port}`);
    });
});
