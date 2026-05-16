import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { mockVitals, mockReports } from '../../utils/mockData';
import { VITAL_RANGES, getVitalStatus, getVitalStatusColor } from '../../utils/vitalRanges';
import { getGreeting, getTodayFormatted, formatDate, timeAgo } from '../../utils/formatters';
import { REPORT_TYPE_BADGE } from '../../utils/constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FiUpload, FiPlus, FiArrowRight, FiFileText, FiImage, FiTrendingDown, FiTrendingUp, FiMinus } from 'react-icons/fi';
import './DashboardPage.css';

const VITALS_DISPLAY = [
  { key: 'heart_rate', label: 'Heart Rate' },
  { key: 'bp_systolic', label: 'BP Systolic' },
  { key: 'blood_sugar_f', label: 'Blood Sugar' },
  { key: 'spo2', label: 'SpO2' },
  { key: 'temperature', label: 'Temperature' },
  { key: 'weight', label: 'Weight' },
];

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const recentReports = [...mockReports].sort((a, b) => new Date(b.report_date) - new Date(a.report_date)).slice(0, 5);

  return (
    <div className="dashboard page-enter">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Good afternoon, {user?.fullName?.split(' ')[0]}</h1>
          <p>Your health at a glance · {formatDate(new Date())}</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary" onClick={() => navigate('/reports/upload')}><FiUpload /> Upload Report</button>
          <button className="btn btn-secondary" onClick={() => navigate('/vitals')}><FiPlus /> Log Vitals</button>
        </div>
      </header>

      {/* Vitals Summary Cards */}
      <div className="vitals-grid">
        {VITALS_DISPLAY.map(v => {
          const data = mockVitals[v.key];
          if (!data || data.length === 0) return null;
          const latest = data[data.length - 1];
          const prev = data.length > 7 ? data[data.length - 8] : data[0];
          const delta = Math.round((latest.value - prev.value) * 10) / 10;
          const range = VITAL_RANGES[v.key];
          const status = getVitalStatus(v.key, latest.value);

          return (
            <div key={v.key} className="vital-card card card-hover" onClick={() => navigate('/vitals')}>
              <div className="vital-card-header">
                <span className="vital-card-icon" style={{color: range.color}}>{range.icon}</span>
                <span className={`status-dot status-dot-${status}`}></span>
              </div>
              <div className="vital-card-value font-mono">{latest.value}</div>
              <div className="vital-card-unit">{range.unit}</div>
              <div className="vital-card-label">{v.label}</div>
              <div className={`vital-card-delta ${delta > 0 ? 'up' : delta < 0 ? 'down' : ''}`}>
                {delta > 0 ? <FiTrendingUp /> : delta < 0 ? <FiTrendingDown /> : <FiMinus />}
                <span>{delta > 0 ? '+' : ''}{delta} from last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Row: Recent Reports + Mini Chart */}
      <div className="dashboard-bottom">
        <div className="dashboard-recent card">
          <div className="dashboard-recent-header">
            <h3>Recent Records</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/reports')}>View all <FiArrowRight /></button>
          </div>
          {recentReports.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No reports yet</h3><p>Upload your first health report</p>
              <button className="btn btn-primary" onClick={() => navigate('/reports/upload')}>Upload Report</button>
            </div>
          ) : (
            <div className="recent-list">
              {recentReports.map(r => (
                <div key={r.id} className="recent-item" onClick={() => navigate(`/reports/${r.id}`)}>
                  <div className="recent-item-icon">{r.file_type === 'pdf' ? <FiFileText /> : <FiImage />}</div>
                  <div className="recent-item-info">
                    <span className="recent-item-title">{r.title}</span>
                    <span className="recent-item-meta"><span className={`badge ${REPORT_TYPE_BADGE[r.report_type]}`}>{r.report_type}</span> · {formatDate(r.report_date)}</span>
                  </div>
                  <span className="recent-item-time">{timeAgo(r.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-chart card">
          <h3>Blood Pressure — Last 30 Days</h3>
          <div className="dashboard-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockVitals.bp_systolic.map((v, i) => ({
                date: v.recorded_at.slice(5),
                systolic: v.value,
                diastolic: mockVitals.bp_diastolic[i]?.value
              }))}>
                <defs>
                  <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9B59B6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#9B59B6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
                <XAxis dataKey="date" tick={{fontSize:11, fill:'#718096'}} />
                <YAxis domain={[60, 160]} tick={{fontSize:11, fill:'#718096'}} />
                <Tooltip contentStyle={{borderRadius:'8px', border:'1px solid #E2E8F0', boxShadow:'0 4px 16px rgba(0,0,0,0.08)'}} />
                <ReferenceLine y={120} stroke="#E74C3C" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="systolic" stroke="#9B59B6" fill="url(#bpGrad)" strokeWidth={2} name="Systolic" />
                <Area type="monotone" dataKey="diastolic" stroke="#8E44AD" fill="none" strokeDasharray="5 5" strokeWidth={1.5} name="Diastolic" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
