import { createServer as createHttpServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getWorkspaceSnapshot } from '../data/state.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const contentTypes = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.html': 'text/html; charset=utf-8' };

export function createServer() {
  return createHttpServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost');
    if (request.method !== 'GET' && request.method !== 'HEAD') return sendText(response, 405, 'Read-only API');
    if (requestUrl.pathname === '/api/health') return sendJson(response, { status: 'ok', mode: 'simulation' });
    if (requestUrl.pathname === '/api/state') return sendJson(response, getWorkspaceSnapshot());

    const requestedPath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
    const filePath = join(root, requestedPath);
    if (!filePath.startsWith(root)) return sendText(response, 403, 'Forbidden');
    try {
      const content = await readFile(filePath);
      response.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] ?? 'text/plain; charset=utf-8' });
      response.end(content);
    } catch {
      sendText(response, 404, 'Not found');
    }
  });
}

function sendJson(response, payload) {
  response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(body);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  createServer().listen(process.env.PORT ?? 3000, () => console.log(`Fieldline listening on http://localhost:${process.env.PORT ?? 3000}`));
}