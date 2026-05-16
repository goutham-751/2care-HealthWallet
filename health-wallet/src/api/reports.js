import api from './axios';

export async function getReportsAPI(params = {}) {
  const res = await api.get('/reports', { params });
  return res.data;
}

export async function getReportAPI(id) {
  const res = await api.get(`/reports/${id}`);
  return res.data;
}

export async function uploadReportAPI(formData) {
  const res = await api.post('/reports', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function updateReportAPI(id, data) {
  const res = await api.put(`/reports/${id}`, data);
  return res.data;
}

export async function deleteReportAPI(id) {
  const res = await api.delete(`/reports/${id}`);
  return res.data;
}

export async function downloadReportFileAPI(id) {
  const res = await api.get(`/reports/${id}/file`, { responseType: 'blob' });
  return res.data;
}
