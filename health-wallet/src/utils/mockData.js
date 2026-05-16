// Realistic mock data for demo/development

export const mockUser = {
  id: 1,
  name: 'Riya Sharma',
  email: 'riya@example.com',
  created_at: '2025-11-10'
};

// Generate vitals data over time
function generateVitalsData(type, baseValue, variance, days = 30) {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      id: days - i + 1,
      vital_type: type,
      value: Math.round((baseValue + (Math.random() - 0.5) * variance) * 10) / 10,
      recorded_at: d.toISOString().split('T')[0],
      note: ''
    });
  }
  return data;
}

export const mockVitals = {
  bp_systolic: generateVitalsData('bp_systolic', 118, 20, 30),
  bp_diastolic: generateVitalsData('bp_diastolic', 76, 12, 30),
  heart_rate: generateVitalsData('heart_rate', 78, 16, 30),
  blood_sugar_f: generateVitalsData('blood_sugar_f', 94, 20, 30),
  spo2: generateVitalsData('spo2', 97, 4, 30),
  weight: generateVitalsData('weight', 65, 2, 30),
  temperature: generateVitalsData('temperature', 98.2, 1.5, 30),
};

export const mockReports = [
  {
    id: 1,
    title: 'CBC Complete Panel',
    report_type: 'Blood Test',
    report_date: '2026-01-15',
    file_type: 'pdf',
    notes: 'Annual blood work — all values normal',
    created_at: '2026-01-15T10:30:00',
    vitals: [
      { vital_type: 'blood_sugar_f', value: 92, unit: 'mg/dL' },
      { vital_type: 'heart_rate', value: 78, unit: 'bpm' }
    ],
    shared_with: [
      { id: 1, name: 'Dr. Suresh Rajan', email: 'dr.suresh@hospital.com' },
    ]
  },
  {
    id: 2,
    title: 'Chest X-Ray — Front',
    report_type: 'X-Ray',
    report_date: '2025-12-02',
    file_type: 'image',
    notes: 'No abnormalities detected',
    created_at: '2025-12-02T14:15:00',
    vitals: [],
    shared_with: []
  },
  {
    id: 3,
    title: 'ECG — Resting 12-Lead',
    report_type: 'ECG',
    report_date: '2026-03-10',
    file_type: 'pdf',
    notes: 'Normal sinus rhythm',
    created_at: '2026-03-10T09:00:00',
    vitals: [
      { vital_type: 'heart_rate', value: 72, unit: 'bpm' },
      { vital_type: 'bp_systolic', value: 118, unit: 'mmHg' },
      { vital_type: 'bp_diastolic', value: 76, unit: 'mmHg' }
    ],
    shared_with: [
      { id: 1, name: 'Dr. Suresh Rajan', email: 'dr.suresh@hospital.com' },
      { id: 2, name: 'Arjun Sharma', email: 'arjun@example.com' }
    ]
  },
  {
    id: 4,
    title: 'Lipid Profile — Complete',
    report_type: 'Blood Test',
    report_date: '2026-04-20',
    file_type: 'pdf',
    notes: 'Cholesterol slightly elevated — monitor diet',
    created_at: '2026-04-20T11:45:00',
    vitals: [
      { vital_type: 'blood_sugar_f', value: 98, unit: 'mg/dL' }
    ],
    shared_with: []
  },
  {
    id: 5,
    title: 'Vitamin D & B12 Panel',
    report_type: 'Blood Test',
    report_date: '2026-05-01',
    file_type: 'pdf',
    notes: 'Vitamin D deficient — supplementation started',
    created_at: '2026-05-01T16:30:00',
    vitals: [],
    shared_with: []
  },
  {
    id: 6,
    title: 'Knee MRI — Right',
    report_type: 'MRI',
    report_date: '2026-02-14',
    file_type: 'image',
    notes: 'Minor meniscus wear — physio recommended',
    created_at: '2026-02-14T13:20:00',
    vitals: [],
    shared_with: [
      { id: 3, name: 'Dr. Priya Menon', email: 'priya.menon@ortho.com' }
    ]
  },
  {
    id: 7,
    title: 'Monthly Prescription',
    report_type: 'Prescription',
    report_date: '2026-05-10',
    file_type: 'pdf',
    notes: 'Metformin 500mg, Vitamin D3 60K weekly',
    created_at: '2026-05-10T10:00:00',
    vitals: [
      { vital_type: 'bp_systolic', value: 122, unit: 'mmHg' },
      { vital_type: 'bp_diastolic', value: 78, unit: 'mmHg' },
      { vital_type: 'blood_sugar_f', value: 104, unit: 'mg/dL' },
      { vital_type: 'heart_rate', value: 76, unit: 'bpm' }
    ],
    shared_with: []
  },
  {
    id: 8,
    title: 'Thyroid Panel — TSH, T3, T4',
    report_type: 'Blood Test',
    report_date: '2026-04-05',
    file_type: 'pdf',
    notes: 'All values within normal range',
    created_at: '2026-04-05T08:15:00',
    vitals: [],
    shared_with: []
  }
];

export const mockSharedWithMe = [
  {
    id: 101,
    title: 'Father — BP Monitoring Log',
    report_type: 'Other',
    report_date: '2026-05-05',
    file_type: 'pdf',
    notes: 'Weekly BP check — stable',
    shared_by: 'Arjun Sharma',
    shared_at: '2026-05-06',
    can_download: true
  },
  {
    id: 102,
    title: 'Mother — HbA1c Report',
    report_type: 'Blood Test',
    report_date: '2026-04-28',
    file_type: 'pdf',
    notes: 'HbA1c at 6.2% — pre-diabetic range',
    shared_by: 'Arjun Sharma',
    shared_at: '2026-04-29',
    can_download: false
  }
];
