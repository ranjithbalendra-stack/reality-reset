# Fieldline Systems

## Company positioning draft

Fieldline Systems is an environmental intelligence company focused on making field observations legible before they become automated decisions. The product begins as a calm, local analysis workspace: it presents illustrative environmental signals, keeps uncertainty visible, and asks an operator to verify evidence before review.

This repository is a verified prototype. It is not a sensor network, a control system, a weather system, a climate model, a medical system, or a claim that software can physically change environmental conditions.

## 1. Proposed company/project name

**Fieldline Systems**

The existing product name, **Fieldline**, is preserved because it already names the verified UI and its environmental-intelligence terminology.

## 2. One-sentence mission

**Help people turn environmental observations into accountable decisions without hiding uncertainty or overstating what software can control.**

## 3. Problem being solved

Environmental teams often receive fragmented readings, ambiguous field notes, and alerts without enough context to judge whether a signal is meaningful. Fieldline's initial product addresses the decision-quality gap between seeing a signal and deciding what deserves verification or human review.

The first problem is deliberately narrower than environmental control: improve observation, provenance awareness, classification, and review discipline.

## 4. Target users and customers

- **PROPOSED:** Environmental monitoring teams at farms, conservation programs, watershed organizations, and research field sites.
- **PROPOSED:** Operations and compliance teams that need a traceable first review of environmental observations.
- **PROPOSED:** University and nonprofit field programs that need a lightweight observation workspace before investing in a full data platform.
- **FUTURE:** Instrument manufacturers and data providers that want a governed analysis surface for their readings.

## 5. Core product

- **IMPLEMENTED:** A single-page Fieldline workspace with Observe, Monitor, Triage, Classify, and Verify sections.
- **IMPLEMENTED:** A local signal triage flow that lets an operator choose an observation or enter a neutral custom signal.
- **IMPLEMENTED:** Three classifications: Context only, Needs verification, and Ready for review.
- **PROPOSED:** A provenance-aware observation review workspace that accepts verified records and keeps sensor confidence, calibration state, and human review status visible.
- **FUTURE:** Multi-site workspaces, role-based review queues, and organization-level audit history.

## 6. Existing verified capabilities

- **IMPLEMENTED:** Responsive browser UI in `index.html` and `style.css`.
- **IMPLEMENTED:** Browser controller in `app.js` for claim selection, custom input, classification display, scroll navigation, station refresh feedback, and a 60-second local timer.
- **IMPLEMENTED:** Pure classification logic in `src/core/engine.mjs`.
- **IMPLEMENTED:** Immutable local workspace helpers in `src/data/state.mjs`.
- **IMPLEMENTED:** Sensor reading validation for metric, unit, value, provenance, and calibration metadata in `src/data/sensor-contract.mjs`.
- **IMPLEMENTED:** Node HTTP server with static asset serving and read-only `/api/health` and `/api/state` endpoints.
- **IMPLEMENTED:** Non-GET/HEAD API requests are rejected with `405 Read-only API`.
- **IMPLEMENTED:** Built-in Node test suite, native integration verification, and production copy build.

## 7. Simulation and analysis capabilities

- **IMPLEMENTED:** Illustrative dashboard values for air quality, soil moisture, open observations, and three station rows.
- **IMPLEMENTED:** Deterministic signal classification messages.
- **IMPLEMENTED:** A local observation timer that changes browser display state only.
- **IMPLEMENTED:** A simulation state snapshot with `mode: "simulation"` and `automatedActionsEnabled: false`.
- **PROPOSED:** Analysis of real readings only after provenance and calibration validation succeeds.
- **FUTURE:** Statistical baselines, anomaly scoring, and trend analysis with explicit uncertainty bounds.

No current feature physically changes weather, climate, water, soil, human biology, or any other real-world system.

## 8. Technical architecture

```text
Browser UI (index.html + style.css)
        |
        v
Browser controller (app.js)
        |
        +--> Data/state helpers (src/data/state.mjs)
        |
        +--> Core classification engine (src/core/engine.mjs)

Node HTTP server (src/api/server.mjs)
        |
        +--> Static files and read-only simulation snapshot

Sensor contract (src/data/sensor-contract.mjs)
        |
        +--> Validation only; no ingestion, persistence, or control
```

- **IMPLEMENTED:** Native ES modules and built-in Node.js APIs.
- **IMPLEMENTED:** No runtime dependency on a database, cloud service, sensor provider, or third-party test framework.
- **PROPOSED:** A separate ingestion boundary that validates external records before analysis, without giving the analysis engine physical control.
- **FUTURE:** Durable storage and identity/access management after the data governance model is approved.

## 9. Data flow

### Current flow

1. **IMPLEMENTED:** A user selects a fixture observation or enters a custom observation in the browser.
2. **IMPLEMENTED:** `app.js` calls `selectObservation` and updates local workspace state.
3. **IMPLEMENTED:** A classification choice calls `classifyObservation`.
4. **IMPLEMENTED:** The engine returns a deterministic label and recommendation message.
5. **IMPLEMENTED:** The browser displays the result and can start a local timer.
6. **IMPLEMENTED:** The API serves a fresh simulation snapshot on each `/api/state` request.

### Intended future flow

1. **PROPOSED:** An authorized ingestion boundary receives a sensor record.
2. **PROPOSED:** The record is checked against the provenance and calibration contract.
3. **PROPOSED:** Valid records are made available to analysis as evidence, with source metadata preserved.
4. **FUTURE:** An operator reviews an analysis result and records a human decision in a separately authorized system.

## 10. API boundaries

- **IMPLEMENTED:** `GET /api/health` returns `{ status: "ok", mode: "simulation" }`.
- **IMPLEMENTED:** `GET /api/state` returns a simulation workspace snapshot.
- **IMPLEMENTED:** `POST`, `PUT`, `PATCH`, and `DELETE` requests are rejected with HTTP 405.
- **IMPLEMENTED:** The API does not accept sensor readings, persist state, issue commands, or control physical systems.
- **PROPOSED:** A future read-only evidence endpoint could expose validated records for analysis.
- **FUTURE:** Any write endpoint would require a separate authorization, audit, safety, and governance decision; it is outside this project phase.

## 11. Safety and scientific limitations

- **IMPLEMENTED:** The UI labels readings as illustrative, simulation mode, or local-only.
- **IMPLEMENTED:** The UI states that no automated actions are enabled.
- **IMPLEMENTED:** The sensor contract requires source identity, timestamps, calibration status, method, and uncertainty.
- **IMPLEMENTED:** The classifier recommends verification or review; it does not claim causality or physical intervention.
- **PROPOSED:** Define metric-specific quality rules with domain experts before accepting real readings.
- **PROPOSED:** Preserve timestamps, units, calibration history, provenance, and uncertainty through every analysis step.
- **FUTURE:** Independent scientific validation, incident review, and documented operating procedures for each deployment context.

## 12. What makes Fieldline different

- **PROPOSED:** It treats uncertainty and provenance as product information, not hidden implementation detail.
- **PROPOSED:** It begins with review discipline rather than an automation promise.
- **IMPLEMENTED:** Its first workflow is understandable without a live data feed and makes the simulation boundary visible.
- **PROPOSED:** It can serve small field programs that need a careful first layer before adopting a larger data platform.

## 13. MVP definition

### MVP baseline

- **IMPLEMENTED:** Local Fieldline workspace and responsive presentation.
- **IMPLEMENTED:** Observation selection, custom signal entry, deterministic classification, and local verification timer.
- **IMPLEMENTED:** Read-only simulation API and native verification scripts.
- **IMPLEMENTED:** Provenance and calibration contract validator, not connected to ingestion.

### MVP completion criteria

- **PROPOSED:** A real operator can import a fixture file through a controlled, offline analysis command without changing the API boundary.
- **PROPOSED:** Every imported record either passes the contract or receives an explicit validation error.
- **PROPOSED:** Every analysis output links back to the record metadata and remains clearly labeled as analysis, not physical action.

## 14. Phase 2 roadmap

- **FUTURE:** Add offline fixture-file ingestion using a documented format.
- **FUTURE:** Add metric-specific range, timestamp, unit, and calibration checks.
- **FUTURE:** Add reproducible baseline and trend analysis with explainable outputs.
- **FUTURE:** Add an operator review queue without automated physical actions.
- **FUTURE:** Expand native tests for fixture parsing, contract failures, and deterministic analysis.

## 15. Phase 3 roadmap

- **FUTURE:** Evaluate one carefully scoped read-only connector with documented provenance guarantees.
- **FUTURE:** Add site and sensor identity management with least-privilege access.
- **FUTURE:** Add durable audit history and exportable review records.
- **FUTURE:** Conduct domain review, security review, and field validation before any production claim.

Physical-environment control is not part of this roadmap.

## 16. Potential business models

- **PROPOSED:** Paid workspace subscriptions for small environmental monitoring teams.
- **PROPOSED:** Annual site-based plans for conservation, agriculture, and research programs.
- **PROPOSED:** Professional services for data-quality and provenance workflow design.
- **FUTURE:** Enterprise governance and audit packages after durable storage exists.

## 17. Required future integrations

- **FUTURE:** Approved sensor or file sources that provide stable source identity, sensor identity, timestamps, units, and calibration metadata.
- **FUTURE:** Identity and access management for operators and organizations.
- **FUTURE:** Durable storage with retention and deletion policy.
- **FUTURE:** Observability for ingestion quality and service health.

No external integration is present in the current prototype.

## 18. Recommended technology stack

- **IMPLEMENTED:** Browser-native HTML, CSS, and JavaScript ES modules.
- **IMPLEMENTED:** Node.js built-in HTTP, filesystem, assertion, and test modules.
- **PROPOSED:** Keep the first ingestion and analysis services in Node.js to preserve the current low-dependency architecture.
- **PROPOSED:** Use a standards-based tabular or JSON fixture format with a versioned schema.
- **FUTURE:** Select storage and identity technologies only after the data governance requirements are known.

Avoid introducing a framework, database, or external service until it removes a demonstrated constraint.

## 19. Testing strategy without unnecessary third-party dependencies

- **IMPLEMENTED:** `npm test` runs the built-in Node test suite.
- **IMPLEMENTED:** `npm run verify:integration` checks static UI wiring, module flow, sensor validation, static serving, and read-only API behavior.
- **IMPLEMENTED:** `npm run build` verifies the production artifact and imported module graph.
- **IMPLEMENTED:** JavaScript syntax checks use Node's built-in `--check`.
- **IMPLEMENTED:** Manual browser verification has passed for observation buttons, custom input, selected signal, classification result, station refresh, scrolling, timer countdown, and timer reset.
- **PROPOSED:** Keep browser checks manual while the project has no browser runtime available.
- **FUTURE:** Add a browser automation tool only if the team explicitly accepts that dependency and the test coverage justifies it.

## 20. README/company positioning draft

Fieldline Systems builds careful environmental intelligence for teams that need to understand a signal before they act on it.

The current Fieldline prototype is a local, simulation-only workspace. It presents illustrative environmental readings, lets an operator select or enter an observation, classifies the signal as context, verification-needed, or ready for review, and provides a short local observation window. Its API is read-only and contains no sensor ingestion, persistence, external service calls, or physical controls.

The product principle is simple: **evidence first, uncertainty visible, automation earned**.

The next product step is not weather control or environmental intervention. It is governed, read-only analysis of records whose provenance and calibration can be demonstrated.

## NEW COMPANY / PROJECT MASTER SPEC

**Name:** Fieldline Systems

**Mission:** Make environmental observations legible and accountable before they become decisions.

**Product:** A provenance-aware environmental observation and review workspace.

**Current status:** Verified local prototype; simulation-only; read-only API.

**Implemented foundation:** Responsive UI, local observation state, deterministic classification engine, timer, sensor contract validator, static Node server, native tests, build, and integration verification.

**Not implemented:** Live sensors, external APIs, persistence, user accounts, predictive claims, automated physical actions, weather/climate control, and biological or medical control.

**MVP direction:** Offline or fixture-based evidence validation and explainable analysis while preserving the read-only boundary.

**Guardrails:** No hidden automation, no implied physical control, no real-data claim without provenance and calibration, and no new dependency without a demonstrated need.