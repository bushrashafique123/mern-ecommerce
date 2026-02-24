import axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiRequest({ method = 'get', endpoint, data = {}, successMessage, useToken = true }) {
  try {
    const headers = {};

    if (useToken) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await api.request({
      url: endpoint,
      method,
      headers,
      data: ['post', 'put', 'patch'].includes(method) ? data : undefined,
      params: method === 'get' ? data : undefined,
    });

    if (successMessage || response.data?.message) {
      toast.success(successMessage || response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error(error);
    
    // Handle admin-only access errors
    if (error.response?.status === 403) {
      toast.error('Admin Access Required', {
        description: 'Only administrators can perform this action.',
        action: {
          label: 'Dismiss',
          onClick: () => console.log('Dismissed'),
        },
      });
      return null;
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.response?.data?.error || 'An error occurred';
    toast.error(errorMessage, {
      description: 'Please try again.',
      action: {
        label: 'Retry',
        onClick: () => {
          console.log('Retry clicked');
        },
      },
    });
    return null;
  }
}
