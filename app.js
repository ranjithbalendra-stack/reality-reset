import { classifyObservation } from './src/core/engine.mjs';
import { createWorkspaceState, selectObservation } from './src/data/state.mjs';

const claims = document.querySelectorAll('.claim');
const selectedClaim = document.querySelector('#selected-claim');
const customClaim = document.querySelector('#custom-claim');
const result = document.querySelector('#result');
const resultText = document.querySelector('#result-text');
const choices = document.querySelectorAll('.choice');
let timerId;
let workspaceState = createWorkspaceState(claims[0]?.dataset.claim ?? '');

function setClaim(claim) {
  const currentClaim = claim.trim();
  workspaceState = selectObservation(workspaceState, currentClaim);
  selectedClaim.textContent = `“${currentClaim}”`;
  result.hidden = true;
  claims.forEach((button) => button.classList.toggle('is-selected', button.dataset.claim === currentClaim));
}

claims.forEach((button) => button.addEventListener('click', () => setClaim(button.dataset.claim)));
document.querySelector('#use-claim').addEventListener('click', () => { if (customClaim.value.trim()) setClaim(customClaim.value); });

choices.forEach((button) => button.addEventListener('click', () => {
  const classification = classifyObservation(workspaceState.selectedObservation, button.dataset.answer);
  resultText.textContent = classification.message;
  result.hidden = false;
  result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}));

document.querySelector('#reset-answer').addEventListener('click', () => { result.hidden = true; document.querySelector('.triage').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
document.querySelector('#refresh-stations').addEventListener('click', (event) => { const button = event.currentTarget; button.textContent = 'View refreshed ✓'; window.setTimeout(() => { button.innerHTML = 'Refresh view <span aria-hidden="true">↻</span>'; }, 1800); });
document.querySelector('#start-monitoring').addEventListener('click', () => { document.querySelector('.grounding').scrollIntoView({ behavior: 'smooth', block: 'center' }); });

document.querySelector('#start-grounding').addEventListener('click', (event) => {
  const button = event.currentTarget;
  let seconds = 60;
  const timer = document.querySelector('#timer');
  const timerValue = document.querySelector('#timer-value');
  clearInterval(timerId);
  timer.hidden = false;
  button.disabled = true;
  button.textContent = 'Stay with the signal';
  timerValue.textContent = seconds;
  timerId = setInterval(() => {
    seconds -= 1;
    timerValue.textContent = seconds;
    if (seconds <= 0) { clearInterval(timerId); button.disabled = false; button.innerHTML = '<span aria-hidden="true">↻</span> Begin again'; }
  }, 1000);
});