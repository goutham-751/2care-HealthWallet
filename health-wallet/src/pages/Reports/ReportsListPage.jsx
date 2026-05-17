import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportsAPI } from '../../api/reports';
import { REPORT_TYPES, REPORT_TYPE_BADGE } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import { FiSearch, FiFilter, FiX, FiFileText, FiImage, FiShare2 } from 'react-icons/fi';
import './ReportsPage.css';

export default function ReportsListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await getReportsAPI();
        setReports(data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const toggleType = (t) => setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const filtered = useMemo(() => {
    let r = [...reports];
    if (search) r = r.filter(x => x.title.toLowerCase().includes(search.toLowerCase()) || x.notes?.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter.length > 0) r = r.filter(x => typeFilter.includes(x.report_type));
    r.sort((a, b) => sortOrder === 'newest' ? new Date(b.report_date) - new Date(a.report_date) : new Date(a.report_date) - new Date(b.report_date));
    return r;
  }, [reports, search, typeFilter, sortOrder]);

  if (loading) return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><div className="spinner spinner-lg"></div></div>;

  return (
    <div className="reports-page page-enter">
      <div className="reports-header">
        <h1>Reports</h1>
        <button className="btn btn-primary" onClick={() => navigate('/reports/upload')}>Upload Report</button>
      </div>

      <div className="reports-layout">
        {/* Sidebar Filters */}
        <aside className={`reports-filters card ${showFilters ? 'show' : ''}`}>
          <div className="reports-filters-header">
            <h4>Filters</h4>
            <button className="btn btn-ghost btn-sm mobile-close" onClick={() => setShowFilters(false)}><FiX /></button>
          </div>
          <div className="input-group">
            <label>Search</label>
            <div className="input-icon-wrap">
              <FiSearch className="input-icon" />
              <input className="input input-with-icon" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="filter-section">
            <label>Report Type</label>
            <div className="filter-checks">
              {REPORT_TYPES.map(t => (
                <label key={t} className="filter-check">
                  <input type="checkbox" checked={typeFilter.includes(t)} onChange={() => toggleType(t)} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
          {(search || typeFilter.length > 0) && (
            <button className="btn btn-ghost btn-sm btn-full" onClick={() => { setSearch(''); setTypeFilter([]); }}>Reset Filters</button>
          )}
        </aside>

        {/* Main Content */}
        <div className="reports-main">
          <div className="reports-toolbar">
            <span className="reports-count">Showing {filtered.length} of {reports.length} reports</span>
            <div className="reports-toolbar-right">
              <select className="input" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{width:'auto',padding:'6px 32px 6px 12px'}}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
              <button className="btn btn-ghost mobile-filter-btn" onClick={() => setShowFilters(true)}><FiFilter /> Filter</button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state card"><div className="empty-state-icon">🔍</div><h3>No reports found</h3><p>Try adjusting your filters or upload a new one</p></div>
          ) : (
            <div className="reports-grid">
              {filtered.map(r => (
                <div key={r.id} className="report-card card card-hover" onClick={() => navigate(`/reports/${r.id}`)}>
                  <div className="report-card-top">
                    <span className={`badge ${REPORT_TYPE_BADGE[r.report_type]}`}>{r.report_type}</span>
                    <span className="report-card-icon">{r.file_type === 'pdf' ? <FiFileText /> : <FiImage />}</span>
                  </div>
                  <h4 className="report-card-title">{r.title}</h4>
                  <p className="report-card-notes">{r.notes || 'No notes'}</p>
                  <div className="report-card-meta">
                    <span>📅 {formatDate(r.report_date)}</span>
                    {r.vitals && r.vitals.length > 0 && (
                      <span className="report-card-vitals">{r.vitals.map(v => `${v.value} ${v.unit}`).join(' · ')}</span>
                    )}
                  </div>
                  <div className="report-card-actions">
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/reports/${r.id}`); }}>View Report</button>
                    {r.shared_with?.length > 0 && <span className="report-card-shared"><FiShare2 size={12} /> {r.shared_with.length}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
