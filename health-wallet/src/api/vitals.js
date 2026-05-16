import api from './axios';

export async function getVitalsAPI(params = {}) {
  const res = await api.get('/vitals', { params });
  return res.data;
}

export async function logVitalAPI(data) {
  const res = await api.post('/vitals', data);
  return res.data;
}

export async function deleteVitalAPI(id) {
  const res = await api.delete(`/vitals/${id}`);
  return res.data;
}
