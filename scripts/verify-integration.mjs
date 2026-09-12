import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/api/server.mjs';
import { classifyObservation } from '../src/core/engine.mjs';
import { createWorkspaceState, selectObservation } from '../src/data/state.mjs';
import { isValidSensorReading } from '../src/data/sensor-contract.mjs';

const html = await readFile('index.html', 'utf8');
const app = await readFile('app.js', 'utf8');
const requiredControls = ['start-monitoring', 'refresh-stations', 'use-claim', 'reset-answer', 'start-grounding'];
const requiredSelectors = ['selected-claim', 'custom-claim', 'result', 'result-text', 'timer', 'timer-value'];

for (const control of requiredControls) assert.match(html, new RegExp(`id="${control}"`), `${control} is missing from the UI`);
for (const selector of requiredSelectors) assert.match(app, new RegExp(`#${selector}`), `${selector} is not wired in app.js`);
for (const handler of ['setClaim', 'classifyObservation', 'scrollIntoView', 'setInterval']) assert.match(app, new RegExp(handler), `${handler} is missing from the browser controller`);

const state = selectObservation(createWorkspaceState(), 'A native verification note.');
assert.equal(state.selectedObservation, 'A native verification note.');
assert.equal(classifyObservation(state.selectedObservation, 'possible').label, 'Needs verification');
assert.equal(isValidSensorReading({
  metric: 'particulate_matter',
  unit: 'µg/m³',
  value: 12,
  provenance: { sourceId: 'fixture', sensorId: 'pm-01', observedAt: '2026-09-12T10:00:00Z', receivedAt: '2026-09-12T10:00:02Z' },
  calibration: { status: 'verified', calibratedAt: '2026-08-01T00:00:00Z', method: 'reference', uncertainty: 0.4 }
}), true);

const server = createServer().listen(0);
try {
  const { port } = server.address();
  const get = (path, options) => fetch(`http://127.0.0.1:${port}${path}`, options);
  assert.equal((await get('/')).status, 200);
  assert.equal((await get('/app.js')).status, 200);
  assert.equal((await get('/api/health')).status, 200);
  assert.equal((await get('/api/state', { method: 'POST' })).status, 405);
} finally {
  server.close();
}

console.log('Native integration verification: passed');
console.log('Manual browser checks remain: click each UI control in a browser and observe scroll, selected claim, result visibility, refresh label, and timer countdown.');