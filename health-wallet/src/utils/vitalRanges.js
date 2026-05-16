// Normal range definitions for each vital type
export const VITAL_RANGES = {
  bp_systolic:     { min: 90,  max: 120, unit: 'mmHg',  warn: [120, 130], danger: 130, label: 'Blood Pressure (Systolic)', icon: '🫀', color: 'var(--vital-bp)' },
  bp_diastolic:    { min: 60,  max: 80,  unit: 'mmHg',  warn: [80, 90],   danger: 90,  label: 'Blood Pressure (Diastolic)', icon: '🫀', color: 'var(--vital-bp)' },
  heart_rate:      { min: 60,  max: 100, unit: 'bpm',   warn: [100, 110], danger: 110, label: 'Heart Rate', icon: '❤️', color: 'var(--vital-hr)' },
  blood_sugar_f:   { min: 70,  max: 99,  unit: 'mg/dL', warn: [100, 125], danger: 126, label: 'Blood Sugar (Fasting)', icon: '🩸', color: 'var(--vital-sugar)' },
  blood_sugar_pp:  { min: 70,  max: 139, unit: 'mg/dL', warn: [140, 199], danger: 200, label: 'Blood Sugar (PP)', icon: '🩸', color: 'var(--vital-sugar)' },
  spo2:            { min: 95,  max: 100, unit: '%',     warn: [92, 95],   danger: 92,  label: 'SpO2', icon: '🫁', color: 'var(--vital-spo2)' },
  weight:          { min: 0,   max: 999, unit: 'kg',    warn: [0, 0],     danger: 0,   label: 'Weight', icon: '⚖️', color: 'var(--vital-weight)' },
  temperature:     { min: 97,  max: 99,  unit: '°F',    warn: [99, 100],  danger: 100, label: 'Temperature', icon: '🌡️', color: 'var(--vital-temp)' },
};

export function getVitalStatus(type, value) {
  const range = VITAL_RANGES[type];
  if (!range) return 'unknown';
  if (type === 'weight') return 'normal'; // weight doesn't have a universal range
  if (value >= range.min && value <= range.max) return 'normal';
  if (type === 'spo2') {
    if (value < range.danger) return 'danger';
    if (value < range.min) return 'warning';
    return 'normal';
  }
  if (value >= range.danger) return 'danger';
  if (value >= range.warn[0]) return 'warning';
  if (value < range.min) return 'warning';
  return 'normal';
}

export function getVitalStatusColor(status) {
  switch (status) {
    case 'normal': return 'var(--color-healthy)';
    case 'warning': return 'var(--color-warning)';
    case 'danger': return 'var(--color-danger)';
    default: return 'var(--color-neutral)';
  }
}
