import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { classifyObservation } from '../src/core/engine.mjs';
import { createWorkspaceState, selectObservation } from '../src/data/state.mjs';
import { isValidSensorReading, validateSensorReading } from '../src/data/sensor-contract.mjs';
import { createServer } from '../src/api/server.mjs';

test('core engine classifies a signal without enabling automation', () => {
  const classification = classifyObservation('Air quality rose near the ridge.', 'possible');
  assert.equal(classification.label, 'Needs verification');
  assert.match(classification.message, /sensor/);
  assert.equal(createWorkspaceState().automatedActionsEnabled, false);
  assert.throws(() => classifyObservation('', 'possible'), /observation is required/);
  assert.throws(() => classifyObservation('A signal', 'unknown'), /Unknown classification/);
});

test('state layer selects a new observation immutably', () => {
  const original = createWorkspaceState();
  const next = selectObservation(original, 'A new field note.');
  assert.equal(original.selectedObservation, original.observations[0]);
  assert.equal(next.selectedObservation, 'A new field note.');
});

test('sensor contract requires provenance and calibration metadata', () => {
  const reading = {
    metric: 'particulate_matter',
    unit: 'µg/m³',
    value: 12,
    provenance: { sourceId: 'fixture-ridge', sensorId: 'pm-01', observedAt: '2026-09-12T10:00:00Z', receivedAt: '2026-09-12T10:00:02Z' },
    calibration: { status: 'verified', calibratedAt: '2026-08-01T00:00:00Z', method: 'reference co-location', uncertainty: 0.4 }
  };
  assert.equal(isValidSensorReading(reading), true);
  assert.deepEqual(validateSensorReading({ ...reading, provenance: undefined }), ['provenance is required.']);
  assert.equal(isValidSensorReading({ ...reading, calibration: { ...reading.calibration, status: 'expired' } }), false);
});

test('API exposes health and simulation state', async (t) => {
  const server = createServer().listen(0);
  t.after(() => server.close());
  const address = server.address();
  const health = await fetch(`http://127.0.0.1:${address.port}/api/health`).then((response) => response.json());
  const state = await fetch(`http://127.0.0.1:${address.port}/api/state`).then((response) => response.json());
  assert.deepEqual(health, { status: 'ok', mode: 'simulation' });
  assert.equal(state.automatedActionsEnabled, false);
  assert.equal(state.mode, 'simulation');
  const mutationAttempt = await fetch(`http://127.0.0.1:${address.port}/api/state`, { method: 'POST' });
  assert.equal(mutationAttempt.status, 405);
});

test('production build preserves the browser module graph', async () => {
  execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'ignore' });
  const builtApp = await readFile('dist/app.js', 'utf8');
  assert.match(builtApp, /\.\/src\/core\/engine\.mjs/);
  await access('dist/src/core/engine.mjs');
  await access('dist/src/data/state.mjs');
});