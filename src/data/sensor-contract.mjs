const requiredProvenanceFields = ['sourceId', 'sensorId', 'observedAt', 'receivedAt'];
const requiredCalibrationFields = ['status', 'calibratedAt', 'method', 'uncertainty'];
const calibrationStatuses = new Set(['verified', 'due', 'unknown']);

export function validateSensorReading(reading) {
  const errors = [];
  if (!reading || typeof reading !== 'object') return ['A sensor reading object is required.'];
  if (typeof reading.metric !== 'string' || !reading.metric.trim()) errors.push('metric is required.');
  if (typeof reading.unit !== 'string' || !reading.unit.trim()) errors.push('unit is required.');
  if (typeof reading.value !== 'number' || !Number.isFinite(reading.value)) errors.push('value must be a finite number.');
  errors.push(...missingFields(reading.provenance, requiredProvenanceFields, 'provenance'));
  errors.push(...missingFields(reading.calibration, requiredCalibrationFields, 'calibration'));
  if (reading.calibration && !calibrationStatuses.has(reading.calibration.status)) errors.push('calibration.status is invalid.');
  if (reading.calibration && typeof reading.calibration.uncertainty !== 'number') errors.push('calibration.uncertainty must be numeric.');
  return errors;
}

export function isValidSensorReading(reading) {
  return validateSensorReading(reading).length === 0;
}

function missingFields(value, fields, prefix) {
  if (!value || typeof value !== 'object') return [`${prefix} is required.`];
  return fields.filter((field) => value[field] === undefined || value[field] === null || value[field] === '').map((field) => `${prefix}.${field} is required.`);
}