import { useState, useEffect } from 'react';
import { getVitalsAPI, logVitalAPI } from '../../api/vitals';
import { VITAL_RANGES, getVitalStatus } from '../../utils/vitalRanges';
import { VITAL_TYPES, VITAL_COLORS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FiPlus, FiX } from 'react-icons/fi';
import './VitalsPage.css';

const CHART_VITALS = ['bp_systolic', 'heart_rate', 'blood_sugar_f', 'spo2', 'weight', 'temperature'];
const RANGES = { '7': 7, '30': 30, '90': 90 };

export default function VitalsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logType, setLogType] = useState('');
  const [logValue, setLogValue] = useState('');
  const [logNote, setLogNote] = useState('');

  const [vitalsData, setVitalsData] = useState({});
  const [allVitals, setAllVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      const vitRes = await getVitalsAPI();
      setAllVitals(vitRes);
      
      const grouped = {};
      vitRes.forEach(v => {
        if (!grouped[v.vital_type]) grouped[v.vital_type] = [];
        grouped[v.vital_type].push(v);
      });
      
      Object.keys(grouped).forEach(k => {
        grouped[k].sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));
      });
      
      setVitalsData(grouped);
    } catch (err) {
      console.error('Failed to fetch vitals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const filterData = (key) => {
    const data = vitalsData[key] || [];
    return data.slice(-RANGES[dateRange]).map(d => ({ date: d.recorded_at.slice(5, 10), value: d.value }));
  };

  const getStats = (key) => {
    const data = vitalsData[key]?.slice(-RANGES[dateRange]) || [];
    if (data.length === 0) return { min: 0, max: 0, avg: 0 };
    const vals = data.map(d => d.value);
    return { min: Math.min(...vals), max: Math.max(...vals), avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 };
  };

  const handleLog = async () => {
    if (!logType || !logValue) return alert('Type and Value are required');
    
    // Find unit from ranges
    const range = VITAL_RANGES[logType];
    const unit = range ? range.unit : '';

    try {
      await logVitalAPI({
        vital_type: logType,
        value: Number(logValue),
        unit: unit,
        recorded_at: new Date().toISOString(),
        note: logNote
      });
      setShowLogModal(false); 
      setLogType(''); 
      setLogValue(''); 
      setLogNote('');
      fetchVitals(); // Refresh data
    } catch (err) {
      console.error('Failed to log vital', err);
      alert('Failed to log vital');
    }
  };

  if (loading && allVitals.length === 0) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner spinner-lg"></div></div>;

  return (
    <div className="vitals-page page-enter">
      <div className="vitals-page-header">
        <h1>Vitals Tracker</h1>
        <div className="vitals-controls">
          <div className="range-buttons">
            {Object.keys(RANGES).map(r => (
              <button key={r} className={`btn btn-sm ${dateRange === r ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDateRange(r)}>{r}D</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowLogModal(true)}><FiPlus /> Log Vitals</button>
        </div>
      </div>

      <div className="vitals-charts-grid">
        {CHART_VITALS.map(key => {
          const range = VITAL_RANGES[key] || { label: key, unit: '', max: 999 };
          const data = filterData(key);
          const stats = getStats(key);
          const latest = data[data.length - 1]?.value || '--';
          const status = latest !== '--' ? getVitalStatus(key, latest) : 'normal';
          const color = VITAL_COLORS[key] || '#9CA3AF';

          return (
            <div key={key} className="vital-chart-card card">
              <div className="vital-chart-header">
                <div>
                  <h4>{range.label}</h4>
                  <span className="vital-chart-latest font-mono">{latest} {range.unit}</span>
                  {latest !== '--' && <span className={`badge badge-${status}`} style={{marginLeft:8}}>{status}</span>}
                </div>
              </div>
              <div className="vital-chart-body">
                {data.length === 0 ? (
                  <div className="empty-state" style={{height:'180px',justifyContent:'center'}}><p>No data recorded</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#718096' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#718096' }} domain={['auto','auto']} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
                      {range.max < 900 && <ReferenceLine y={range.max} stroke="#E74C3C" strokeDasharray="4 4" />}
                      <Area type="monotone" dataKey="value" stroke={color} fill={`url(#grad-${key})`} strokeWidth={2} name={range.label} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="vital-chart-stats">
                <span>Min: <strong>{stats.min}</strong></span>
                <span>Max: <strong>{stats.max}</strong></span>
                <span>Avg: <strong>{stats.avg}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* History Table */}
      <div className="card mt-lg">
        <h3 className="mb-md">Recent Vitals History</h3>
        <div className="vitals-table-wrap">
          {allVitals.length === 0 ? (
            <div className="empty-state"><p>No vitals logged yet</p></div>
          ) : (
          <table className="vitals-table">
            <thead><tr><th>Date</th><th>Vital</th><th>Value</th><th>Status</th></tr></thead>
            <tbody>
              {[...allVitals].sort((a, b) => new Date(b.recorded_at) - new Date(a.recorded_at)).slice(0, 15).map((d, i) => {
                const range = VITAL_RANGES[d.vital_type] || { label: d.vital_type, unit: '' };
                const status = getVitalStatus(d.vital_type, d.value);
                return (
                  <tr key={d.id || i}>
                    <td>{formatDate(d.recorded_at)}</td>
                    <td>{range.label}</td>
                    <td className="font-mono">{d.value} {d.unit || range.unit}</td>
                    <td><span className={`badge badge-${status}`}><span className={`status-dot status-dot-${status}`}></span> {status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Log a Vital</h3><button className="modal-close" onClick={() => setShowLogModal(false)}><FiX /></button></div>
            <div className="input-group"><label>Vital Type *</label><select className="input" value={logType} onChange={e => setLogType(e.target.value)}><option value="">Select vital...</option>{VITAL_TYPES.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}</select></div>
            <div className="input-group"><label>Value *</label><input type="number" className="input" placeholder="Enter value" value={logValue} onChange={e => setLogValue(e.target.value)} /></div>
            <div className="input-group"><label>Note (optional)</label><textarea className="input" placeholder="After morning walk..." value={logNote} onChange={e => setLogNote(e.target.value)}></textarea></div>
            <button className="btn btn-primary btn-full" onClick={handleLog}>Log Vital</button>
          </div>
        </div>
      )}
    </div>
  );
}
