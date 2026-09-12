const classifications = {
  context: {
    label: 'Context only',
    message: 'Keep this as context only. The current signal is not sufficient to support an operational decision.'
  },
  verification: {
    label: 'Needs verification',
    message: 'Verify the sensor, timestamp, and baseline before escalating. A trend is useful only when its provenance is clear.'
  },
  review: {
    label: 'Ready for review',
    message: 'Route this to an operator review. The signal is strong enough to inspect, but no automated action should happen without a defined policy.'
  }
};

const answerAliases = { fiction: 'context', possible: 'verification', real: 'review' };

export function classifyObservation(observation, answer) {
  const normalizedObservation = String(observation ?? '').trim();
  const classification = classifications[answerAliases[answer] ?? answer];

  if (!normalizedObservation) throw new Error('An observation is required.');
  if (!classification) throw new Error(`Unknown classification: ${answer}`);

  return { observation: normalizedObservation, ...classification };
}

export function getClassificationOptions() {
  return Object.entries(classifications).map(([value, option]) => ({ value, ...option }));
}