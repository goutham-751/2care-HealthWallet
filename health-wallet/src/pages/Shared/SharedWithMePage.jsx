import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSharedWithMeAPI } from '../../api/shares';
import { downloadReportFileAPI } from '../../api/reports';
import { REPORT_TYPE_BADGE } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { FiFileText, FiDownload, FiInfo } from 'react-icons/fi';
import './SharedPage.css';

export default function SharedWithMePage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShared() {
      try {
        const data = await getSharedWithMeAPI();
        setReports(data);
      } catch (err) {
        console.error('Failed to load shared reports', err);
      } finally {
        setLoading(false);
      }
    }
    fetchShared();
  }, []);

  const handleDownload = async (id, title) => {
    try {
      const blob = await downloadReportFileAPI(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title || `shared-report-${id}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download file. You may not have permission.');
    }
  };

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner spinner-lg"></div></div>;

  return (
    <div className="shared-page page-enter">
      <h1 className="mb-md">Shared with Me</h1>
      <div className="shared-banner">
        <FiInfo /> You have read-only access to these reports. You cannot upload or delete.
      </div>

      {reports.length === 0 ? (
        <div className="empty-state card"><div className="empty-state-icon">📨</div><h3>No shared reports</h3><p>Reports shared with you will appear here</p></div>
      ) : (
        <div className="shared-grid">
          {reports.map(r => (
            <div key={r.id} className="card card-hover shared-card">
              <div className="shared-card-top">
                <span className={`badge ${REPORT_TYPE_BADGE[r.report_type]}`}>{r.report_type}</span>
                <span className="shared-card-from">Shared by {r.shared_by_name || r.shared_by_email}</span>
              </div>
              <h4>{r.title}</h4>
              <p className="shared-card-notes">{r.notes}</p>
              <div className="shared-card-meta">
                <span>📅 {formatDate(r.report_date)}</span>
                <span>Shared on {formatDate(r.shared_at)}</span>
              </div>
              <div className="shared-card-actions">
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/reports/${r.id}`)}><FiFileText /> View Report</button>
                {r.can_download ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(r.id, r.title)}><FiDownload /> Download</button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
