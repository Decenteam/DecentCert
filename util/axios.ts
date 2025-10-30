import axios from 'axios';

export const VCinstance = axios.create({
  baseURL: '/api/vc',
  timeout: 10000,
});

export const VPinstance = axios.create({
  baseURL: '/api/vp',
  timeout: 10000,
});
