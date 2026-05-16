import { useNavigate } from 'react-router-dom';
import { mockSharedWithMe } from '../../utils/mockData';
import { REPORT_TYPE_BADGE } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { FiFileText, FiDownload, FiInfo } from 'react-icons/fi';
import './SharedPage.css';

export default function SharedWithMePage() {
  const navigate = useNavigate();

  return (
    <div className="shared-page page-enter">
      <h1 className="mb-md">Shared with Me</h1>
      <div className="shared-banner">
        <FiInfo /> You have read-only access to these reports. You cannot upload or delete.
      </div>

      {mockSharedWithMe.length === 0 ? (
        <div className="empty-state card"><div className="empty-state-icon">📨</div><h3>No shared reports</h3><p>Reports shared with you will appear here</p></div>
      ) : (
        <div className="shared-grid">
          {mockSharedWithMe.map(r => (
            <div key={r.id} className="card card-hover shared-card">
              <div className="shared-card-top">
                <span className={`badge ${REPORT_TYPE_BADGE[r.report_type]}`}>{r.report_type}</span>
                <span className="shared-card-from">Shared by {r.shared_by}</span>
              </div>
              <h4>{r.title}</h4>
              <p className="shared-card-notes">{r.notes}</p>
              <div className="shared-card-meta">
                <span>📅 {formatDate(r.report_date)}</span>
                <span>Shared on {formatDate(r.shared_at)}</span>
              </div>
              <div className="shared-card-actions">
                <button className="btn btn-primary btn-sm"><FiFileText /> View Report</button>
                {r.can_download && <button className="btn btn-ghost btn-sm"><FiDownload /> Download</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
