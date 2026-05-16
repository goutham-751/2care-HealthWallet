import api from './axios';

export async function shareReportAPI(report_id, email, can_download) {
  const res = await api.post('/shares', { report_id, email, can_download });
  return res.data;
}

export async function getMySharesAPI() {
  const res = await api.get('/shares/mine');
  return res.data;
}

export async function getSharedWithMeAPI() {
  const res = await api.get('/shares/with-me');
  return res.data;
}

export async function revokeShareAPI(id) {
  const res = await api.delete(`/shares/${id}`);
  return res.data;
}
