import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';

const root = resolve('game');
const host = '127.0.0.1';
const port = Number(process.env.PORT || 8080);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp'
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url || '/', `http://${host}`).pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = resolve(root, relativePath);
  const fromRoot = relative(root, filePath);
  if (fromRoot.startsWith(`..${sep}`) || fromRoot === '..' || filePath === root) {
    throw new Error('Path outside the game directory');
  }
  return filePath;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  try {
    const filePath = resolveRequestPath(request.url);
    const information = await stat(filePath);
    if (!information.isFile()) throw new Error('Not a file');
    const headers = {
      'content-type': types[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'content-length': information.size,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    };
    response.writeHead(200, headers);
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    response.end(await readFile(filePath));
  } catch (error) {
    const missing = error?.code === 'ENOENT' || error?.message === 'Not a file';
    response.writeHead(missing ? 404 : 400, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(missing ? 'Not found' : 'Invalid path');
  }
});

server.listen(port, host, () => {
  process.stdout.write(`Sunward Bay at http://${host}:${port}\n`);
});

server.on('error', error => {
  process.stderr.write(`Could not start the Sunward Bay server: ${error.message}\n`);
  process.exitCode = 1;
});
