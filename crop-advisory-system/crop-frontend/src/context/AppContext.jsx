import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { translations } from '../i18n/translations';

const AppContext = createContext();

const API_URL = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');
  
  // Demo State
  const [officers, setOfficers] = useState([
    { id: 'o1', name: 'Priya Sharma', email: 'priya@agr.gov.in', mobile: '9876543210', role: 'officer', district: 'Nashik', state: 'Maharashtra', is_active: true },
    { id: 'o2', name: 'Ravi Desai', email: 'ravi@agr.gov.in', mobile: '9876543211', role: 'officer', district: 'Pune', state: 'Maharashtra', is_active: true },
    { id: 'o3', name: 'Anita Patel', email: 'anita@agr.gov.in', mobile: '9876543212', role: 'officer', district: 'Ahmednagar', state: 'Maharashtra', is_active: true },
    { id: 'o4', name: 'Suresh Kumar', email: 'suresh@agr.gov.in', mobile: '9876543213', role: 'officer', district: 'Chennai', state: 'Tamil Nadu', is_active: true },
    { id: 'o5', name: 'Meena Rao', email: 'meena@agr.gov.in', mobile: '9876543214', role: 'officer', district: 'Coimbatore', state: 'Tamil Nadu', is_active: false },
  ]);

  const [farmers, setFarmers] = useState([
    { id: 'f1', name: 'Rajesh Kumar', email: 'farmer@demo.com', mobile: '9123456789', role: 'farmer', district: 'Nashik', state: 'Maharashtra', is_active: true, crop: 'Tomato', soil: 'Loamy Soil', land: 4.5 },
    { id: 'f2', name: 'Suresh Patil', email: 'suresh@demo.com', mobile: '9123456780', role: 'farmer', district: 'Nashik', state: 'Maharashtra', is_active: true, crop: 'Maize', soil: 'Sandy Soil', land: 2.8 },
    { id: 'f3', name: 'Vijay Deshpande', email: 'vijay@demo.com', mobile: '9123456781', role: 'farmer', district: 'Pune', state: 'Maharashtra', is_active: true, crop: 'Potato', soil: 'Loamy Soil', land: 6.2, status: 'alert' },
    { id: 'f4', name: 'Anil Jadhav', email: 'anil@demo.com', mobile: '9123456782', role: 'farmer', district: 'Nashik', state: 'Maharashtra', is_active: true, crop: 'Tomato', soil: 'Clay', land: 3.1 },
    { id: 'f5', name: 'Priya Shirke', email: 'ps@demo.com', mobile: '9123456783', role: 'farmer', district: 'Pune', state: 'Maharashtra', is_active: false, crop: 'Onion', soil: 'Silt', land: 1.9 },
    { id: 'f6', name: 'Ramesh Ingle', email: 'ri@demo.com', mobile: '9123456784', role: 'farmer', district: 'Ahmednagar', state: 'Maharashtra', is_active: true, crop: 'Rice', soil: 'Clay', land: 5.0 },
    { id: 'f7', name: 'Kavita Gaikwad', email: 'kavita@demo.com', mobile: '9123456785', role: 'farmer', district: 'Chennai', state: 'Tamil Nadu', is_active: true, crop: 'Rice', soil: 'Loamy Soil', land: 3.5 },
    { id: 'f8', name: 'Mohan Naidu', email: 'mohan@demo.com', mobile: '9123456786', role: 'farmer', district: 'Coimbatore', state: 'Tamil Nadu', is_active: true, crop: 'Groundnut', soil: 'Sandy Soil', land: 2.2 },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 'a1', type: 'outbreak', message: 'Disease outbreak Tomato Late Blight 7 farms Nashik high severity', severity: 'high', isRead: false, timestamp: '2h ago', district: 'Nashik' },
    { id: 'a2', type: 'weather', message: 'Heavy rainfall warning', severity: 'medium', isRead: false, timestamp: '5h ago', district: 'Nashik' },
    { id: 'a3', type: 'market', message: 'Tomato prices up 18% at Nashik APMC', severity: 'low', isRead: true, timestamp: '1d ago', district: 'Nashik' },
    { id: 'a4', type: 'broadcast', message: 'Apply copper fungicide immediately - Officer Priya', severity: 'medium', isRead: true, timestamp: '2d ago', district: 'Nashik' },
  ]);

  // Actions
  const login = async (email, password) => {
    try {
      // Try real API
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user, token } = res.data;
      setAuth(user, token);
      return user;
    } catch (err) {
      // Demo Fallback
      const demoUsers = {
        'farmer@demo.com': { id: 'f1', name: 'Rajesh Kumar', email: 'farmer@demo.com', role: 'farmer', district: 'Nashik', state: 'Maharashtra', is_active: true },
        'officer@demo.com': { id: 'o1', name: 'Priya Sharma', email: 'officer@demo.com', role: 'officer', district: 'Nashik', state: 'Maharashtra', is_active: true },
        'admin@demo.com': { id: 'ad1', name: 'Admin User', email: 'admin@demo.com', role: 'admin', is_active: true }
      };
      
      if (demoUsers[email] && password === '123456') {
        const u = demoUsers[email];
        setAuth(u, 'demo-token');
        return u;
      }
      throw new Error('Invalid credentials');
    }
  };

  const setAuth = (u, t) => {
    setUser(u);
    setToken(t);
    localStorage.setItem('user', JSON.stringify(u));
    localStorage.setItem('token', t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLang = (code) => {
    setLang(code);
    localStorage.setItem('lang', code);
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  const addOfficer = async (data) => {
    const newOfficer = { ...data, id: 'o' + (officers.length + 1), is_active: true };
    setOfficers([...officers, newOfficer]);
    try { await axios.post(`${API_URL}/admin/add-officer`, data); } catch (e) {}
    toast.success(`Officer ${data.name} added for ${data.district}!`);
  };

  const toggleUserStatus = (userId, role) => {
    if (role === 'officer') {
      setOfficers(officers.map(o => o.id === userId ? { ...o, is_active: !o.is_active } : o));
    } else {
      setFarmers(farmers.map(f => f.id === userId ? { ...f, is_active: !f.is_active } : f));
    }
    toast.success('User status updated');
  };

  const reassignOfficerDistrict = (officerId, newDistrict) => {
    setOfficers(officers.map(o => o.id === officerId ? { ...o, district: newDistrict } : o));
    toast.success(`Reassigned to ${newDistrict}`);
  };

  const getOfficerForDistrict = (district) => {
    return officers.find(o => o.district === district && o.is_active) || null;
  };

  const getFarmersForOfficer = (district) => {
    return farmers.filter(f => f.district === district);
  };

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
  }, []);

  return (
    <AppContext.Provider value={{
      user, token, lang, theme, officers, farmers, alerts,
      login, logout, setTheme, setLang: changeLang, t,
      addOfficer, toggleUserStatus, reassignOfficerDistrict,
      getOfficerForDistrict, getFarmersForOfficer
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
