const observations = [
  'Particulate matter rose 18% near the ridge line.',
  'The creek temperature is outside its seasonal range.',
  'The south plot may need irrigation this week.'
];

export function createWorkspaceState(selectedObservation = observations[0]) {
  return {
    mode: 'simulation',
    selectedObservation,
    observations: [...observations],
    automatedActionsEnabled: false
  };
}

export function selectObservation(state, observation) {
  const selectedObservation = String(observation ?? '').trim();
  if (!selectedObservation) return state;
  return { ...state, selectedObservation };
}

export function getWorkspaceSnapshot() {
  return createWorkspaceState();
}