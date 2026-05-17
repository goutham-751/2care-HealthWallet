import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REPORT_TYPES, VITAL_TYPES } from '../../utils/constants';
import { uploadReportAPI } from '../../api/reports';
import { FiUploadCloud, FiX, FiPlus, FiCheck, FiArrowLeft, FiArrowRight, FiFile } from 'react-icons/fi';
import './ReportsPage.css';

export default function UploadReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [notes, setNotes] = useState('');
  const [vitals, setVitals] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileDrop = (e) => { e.preventDefault(); const f = e.dataTransfer?.files[0] || e.target.files[0]; if (f) setFile(f); };
  const addVital = () => setVitals([...vitals, { type: '', value: '', unit: '' }]);
  const removeVital = (i) => setVitals(vitals.filter((_, idx) => idx !== i));
  const updateVital = (i, field, val) => { const v = [...vitals]; v[i][field] = val; if (field === 'type') { const vt = VITAL_TYPES.find(x => x.key === val); v[i].unit = vt?.unit || ''; } setVitals(v); };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('report_type', reportType);
      formData.append('report_date', reportDate);
      formData.append('notes', notes);
      
      const validVitals = vitals.filter(v => v.type && v.value);
      if (validVitals.length > 0) {
        formData.append('vitals', JSON.stringify(validVitals));
      }

      await uploadReportAPI(formData);
      navigate('/reports');
    } catch (err) {
      console.error('Failed to upload', err);
      const msg = err.response?.data?.error || err.message || 'Failed to upload report';
      alert(`Upload Failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Upload File' },
    { num: 2, label: 'Details' },
    { num: 3, label: 'Vitals' },
  ];

  return (
    <div className="upload-page page-enter">
      <button className="btn btn-ghost mb-lg" onClick={() => navigate('/reports')}><FiArrowLeft /> Back to Reports</button>
      <h1 className="mb-lg">Upload Report</h1>

      {/* Progress Steps */}
      <div className="progress-steps">
        {steps.map((s, i) => (
          <div key={s.num} className="progress-step">
            <div className={`progress-step-circle ${step > s.num ? 'completed' : step === s.num ? 'active' : ''}`}>
              {step > s.num ? <FiCheck size={14} /> : s.num}
            </div>
            <span className={`progress-step-label ${step === s.num ? 'active' : ''}`}>{s.label}</span>
            {i < steps.length - 1 && <div className={`progress-step-line ${step > s.num ? 'completed' : ''}`}></div>}
          </div>
        ))}
      </div>

      <div className="upload-form card card-lg" style={{maxWidth:600,margin:'0 auto'}}>
        {/* Step 1: File Upload */}
        {step === 1 && (
          <div>
            <h3 className="mb-md">Step 1: Upload File</h3>
            {!file ? (
              <div className="dropzone" onDragOver={e => e.preventDefault()} onDrop={handleFileDrop} onClick={() => document.getElementById('file-input').click()}>
                <div className="dropzone-icon"><FiUploadCloud /></div>
                <h4>Drag & drop your file</h4>
                <p>PDF, JPG, or PNG · Max 10MB</p>
                <input id="file-input" type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={handleFileDrop} />
                <button className="btn btn-secondary mt-md">Browse Files</button>
              </div>
            ) : (
              <div className="file-preview card">
                <div className="file-preview-info">
                  <FiFile size={24} style={{color:'var(--color-primary)'}} />
                  <div><strong>{file.name}</strong><br /><span className="text-muted" style={{fontSize:'var(--text-xs)'}}>{(file.size / 1024).toFixed(1)} KB</span></div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setFile(null)}><FiX /> Remove</button>
              </div>
            )}
            <div className="upload-nav mt-lg"><div></div><button className="btn btn-primary" onClick={() => setStep(2)} disabled={!file}>Next Step <FiArrowRight /></button></div>
          </div>
        )}

        {/* Step 2: Report Details */}
        {step === 2 && (
          <div>
            <h3 className="mb-md">Step 2: Report Details</h3>
            <div className="input-group"><label>Title *</label><input className="input" placeholder="Blood Test — CBC Panel" value={title} onChange={e => setTitle(e.target.value)} /></div>
            <div className="input-group"><label>Report Type *</label><select className="input" value={reportType} onChange={e => setReportType(e.target.value)}><option value="">Select type...</option>{REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div className="input-group"><label>Report Date *</label><input type="date" className="input" value={reportDate} onChange={e => setReportDate(e.target.value)} /></div>
            <div className="input-group"><label>Notes (optional)</label><textarea className="input" placeholder="Optional notes..." value={notes} onChange={e => setNotes(e.target.value)}></textarea></div>
            <div className="upload-nav mt-lg"><button className="btn btn-ghost" onClick={() => setStep(1)}><FiArrowLeft /> Back</button><button className="btn btn-primary" onClick={() => setStep(3)} disabled={!title || !reportType || !reportDate}>Next Step <FiArrowRight /></button></div>
          </div>
        )}

        {/* Step 3: Vitals */}
        {step === 3 && (
          <div>
            <h3 className="mb-sm">Step 3: Add Vitals (Optional)</h3>
            <p className="text-muted mb-md" style={{fontSize:'var(--text-sm)'}}>Vitals help you track health trends over time.</p>
            <button className="btn btn-secondary btn-sm mb-md" onClick={addVital}><FiPlus /> Add Vital</button>
            {vitals.map((v, i) => (
              <div key={i} className="vital-input-row">
                <select className="input" value={v.type} onChange={e => updateVital(i, 'type', e.target.value)} style={{flex:2}}><option value="">Select vital...</option>{VITAL_TYPES.map(vt => <option key={vt.key} value={vt.key}>{vt.label}</option>)}</select>
                <input type="number" className="input" placeholder="Value" value={v.value} onChange={e => updateVital(i, 'value', e.target.value)} style={{flex:1}} />
                <span className="vital-input-unit">{v.unit}</span>
                <button className="btn btn-ghost btn-icon" onClick={() => removeVital(i)}><FiX /></button>
              </div>
            ))}
            <div className="upload-nav mt-lg">
              <button className="btn btn-ghost" onClick={() => setStep(2)}><FiArrowLeft /> Back</button>
              <button className="btn btn-primary btn-lg" onClick={handleUpload} disabled={uploading}>
                {uploading ? <><span className="spinner"></span> Uploading...</> : <><FiCheck /> Upload Report</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
