import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockReports } from '../../utils/mockData';
import { formatDate, timeAgo } from '../../utils/formatters';
import { REPORT_TYPE_BADGE } from '../../utils/constants';
import { getVitalStatus } from '../../utils/vitalRanges';
import { FiArrowLeft, FiDownload, FiShare2, FiTrash2, FiX, FiMail } from 'react-icons/fi';
import './ReportsPage.css';

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const report = mockReports.find(r => r.id === Number(id));
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [canDownload, setCanDownload] = useState(false);

  if (!report) {
    return (
      <div className="page-enter">
        <div className="empty-state card card-lg"><div className="empty-state-icon">📋</div><h3>Report not found</h3><p>This report doesn't exist or was deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/reports')}>Back to Reports</button>
        </div>
      </div>
    );
  }

  const statusLabels = { normal: 'Normal', warning: 'Borderline', danger: 'Out of Range' };

  return (
    <div className="report-detail page-enter">
      <button className="btn btn-ghost mb-lg" onClick={() => navigate('/reports')}><FiArrowLeft /> Back to Reports</button>
      <div className="report-detail-layout">
        <div className="report-detail-viewer card card-lg">
          <div className="report-viewer-placeholder">
            <div className="report-viewer-icon">{report.file_type === 'pdf' ? '📄' : '🖼️'}</div>
            <h3>{report.title}</h3>
            <p>{report.file_type === 'pdf' ? 'PDF Document' : 'Image File'}</p>
            <button className="btn btn-primary mt-md"><FiDownload /> Download File</button>
          </div>
        </div>
        <aside className="report-detail-sidebar">
          <div className="card">
            <h4>Report Details</h4>
            <div className="report-meta-list">
              <div className="report-meta-item"><span className="report-meta-label">Type</span><span className={`badge ${REPORT_TYPE_BADGE[report.report_type]}`}>{report.report_type}</span></div>
              <div className="report-meta-item"><span className="report-meta-label">Date</span><span>{formatDate(report.report_date)}</span></div>
              <div className="report-meta-item"><span className="report-meta-label">Uploaded</span><span>{timeAgo(report.created_at)}</span></div>
              {report.notes && <div className="report-meta-item"><span className="report-meta-label">Notes</span><span>{report.notes}</span></div>}
            </div>
          </div>

          {report.vitals && report.vitals.length > 0 && (
            <div className="card mt-md">
              <h4>Vitals in this Report</h4>
              <div className="report-vitals-list">
                {report.vitals.map((v, i) => {
                  const status = getVitalStatus(v.vital_type, v.value);
                  return (
                    <div key={i} className="report-vital-row">
                      <span className="report-vital-name">{v.vital_type.replace(/_/g, ' ')}</span>
                      <span className="report-vital-value font-mono">{v.value} {v.unit}</span>
                      <span className={`badge badge-${status}`}><span className={`status-dot status-dot-${status}`}></span> {statusLabels[status]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="card mt-md">
            <div className="flex justify-between items-center mb-md">
              <h4>Shared With</h4>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowShareModal(true)}><FiShare2 /> Share</button>
            </div>
            {report.shared_with?.length > 0 ? (
              <div className="report-shares-list">
                {report.shared_with.map(s => (
                  <div key={s.id} className="report-share-row">
                    <div className="report-share-avatar">{s.name.charAt(0)}</div>
                    <div className="report-share-info"><span className="report-share-name">{s.name}</span><span className="report-share-email">{s.email}</span></div>
                    <button className="btn btn-ghost btn-sm" style={{color:'var(--color-danger)'}}>Revoke</button>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted" style={{fontSize:'var(--text-sm)'}}>Not shared with anyone yet.</p>}
          </div>

          <button className="btn btn-danger btn-full mt-md"><FiTrash2 /> Delete Report</button>
        </aside>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Share this Report</h3><button className="modal-close" onClick={() => setShowShareModal(false)}><FiX /></button></div>
            <div className="input-group">
              <label>Email address</label>
              <div className="input-icon-wrap"><FiMail className="input-icon" /><input className="input input-with-icon" placeholder="dr.suresh@hospital.com" value={shareEmail} onChange={e => setShareEmail(e.target.value)} /></div>
            </div>
            <div className="input-group">
              <label>Permissions</label>
              <div className="filter-checks">
                <label className="filter-check"><input type="radio" name="perm" checked={!canDownload} onChange={() => setCanDownload(false)} /><span>View only</span></label>
                <label className="filter-check"><input type="radio" name="perm" checked={canDownload} onChange={() => setCanDownload(true)} /><span>View + Download</span></label>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => setShowShareModal(false)}>Share Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
