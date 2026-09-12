# Sensor Data Contract

This project accepts sensor records for analysis only. A record is not evidence that Fieldline can change a physical condition, and no record may trigger an automated physical action.

## Reading fields

| Field | Required | Meaning |
| --- | --- | --- |
| `metric` | yes | Stable metric name, such as `particulate_matter`. |
| `unit` | yes | Unit attached to `value`, such as `µg/m³`. |
| `value` | yes | Finite numeric reading. |

## Provenance fields

Every reading must identify `sourceId`, `sensorId`, `observedAt`, and `receivedAt`. Timestamps must be ISO 8601 values supplied by the future connector or ingestion boundary. The current API does not ingest these records.

## Calibration fields

Every reading must include `status`, `calibratedAt`, `method`, and numeric `uncertainty`.

Allowed calibration statuses are:

- `verified`: calibration is current under the operator's policy.
- `due`: the sensor may be readable but requires calibration review.
- `unknown`: calibration provenance is incomplete.

The validator lives in `src/data/sensor-contract.mjs`. It rejects incomplete records; it does not calibrate, normalize, persist, or transmit sensor data.