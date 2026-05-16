export const REPORT_TYPES = [
  'Blood Test',
  'X-Ray',
  'MRI',
  'ECG',
  'Prescription',
  'Other'
];

export const VITAL_TYPES = [
  { key: 'bp_systolic', label: 'BP (Systolic)', unit: 'mmHg' },
  { key: 'bp_diastolic', label: 'BP (Diastolic)', unit: 'mmHg' },
  { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm' },
  { key: 'blood_sugar_f', label: 'Blood Sugar (Fasting)', unit: 'mg/dL' },
  { key: 'blood_sugar_pp', label: 'Blood Sugar (PP)', unit: 'mg/dL' },
  { key: 'spo2', label: 'SpO2', unit: '%' },
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'temperature', label: 'Temperature', unit: '°F' },
];

export const REPORT_TYPE_BADGE = {
  'Blood Test': 'badge-blood',
  'X-Ray': 'badge-xray',
  'MRI': 'badge-mri',
  'ECG': 'badge-ecg',
  'Prescription': 'badge-prescription',
  'Other': 'badge-other',
};

export const VITAL_COLORS = {
  bp_systolic: '#9B59B6',
  bp_diastolic: '#8E44AD',
  heart_rate: '#E74C3C',
  blood_sugar_f: '#E67E22',
  blood_sugar_pp: '#D35400',
  spo2: '#3498DB',
  weight: '#1ABC9C',
  temperature: '#F1C40F',
};
