import axios from 'axios';
import { IBarberShop } from '../types/barberShop';
import { IEmployee } from '../types/employee';
import { IAppointment } from '../types/appointment';

const api = axios.create({
    baseURL: 'http://localhost:5199/api',
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (data: any ) => api.post(`/Auth/login`, data);
export const register = (data: any) => api.post(`/Auth/register`,data);
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
export const getAppointments = () => api.get<IAppointment[]>(`/Appointments`);
export const deleteAppointment = (id: string) => api.delete(`/Appointments/${id}`);
export const getBarberShops = () => api.get<IBarberShop[]>(`/BarberShops`);
export const getBarbersByShops = (shopId: string) => api.get<IEmployee[]>(`/Auth/list-barber/${shopId}`)
export const createAppointment = (data: {barberShopId: string, employeeId: string, startTime: string}) => api.post(`/Appointments`,data);

export default api;