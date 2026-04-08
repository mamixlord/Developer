import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, formatApiError } from '../../context/AuthContext';
import { Save } from 'lucide-react';

function AdminSettings() {
  const [form, setForm] = useState({
    company_name: '',
    phone: '',
    email: '',
    address: '',
    whatsapp: '',
    google_maps_embed: '',
    about_text: '',
    working_hours: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/api/site-settings');
      if (res.data) setForm(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await api.put('/api/admin/site-settings', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Site Ayarlari">
      <div data-testid="admin-settings">
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '24px' }}>Genel Bilgiler</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>FIRMA ADI</label>
              <input
                value={form.company_name}
                onChange={(e) => setForm({...form, company_name: e.target.value})}
                data-testid="settings-company-input"
                placeholder="Bilay Demir Dograma"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>TELEFON</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                data-testid="settings-phone-input"
                placeholder="+90 212 555 12 34"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>E-POSTA</label>
              <input
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                data-testid="settings-email-input"
                placeholder="info@bilaydemir.com"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>WHATSAPP</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({...form, whatsapp: e.target.value})}
                data-testid="settings-whatsapp-input"
                placeholder="+905551234567"
              />
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>ADRES</label>
            <input
              value={form.address}
              onChange={(e) => setForm({...form, address: e.target.value})}
              data-testid="settings-address-input"
              placeholder="Kagithane, Istanbul"
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>CALISMA SAATLERI</label>
            <input
              value={form.working_hours}
              onChange={(e) => setForm({...form, working_hours: e.target.value})}
              data-testid="settings-hours-input"
              placeholder="Pazartesi - Cumartesi: 08:00 - 18:00"
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>HAKKIMIZDA METNI</label>
            <textarea
              value={form.about_text}
              onChange={(e) => setForm({...form, about_text: e.target.value})}
              data-testid="settings-about-input"
              rows={4}
              placeholder="Firma hakkinda kisa bilgi..."
            />
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>GOOGLE MAPS EMBED URL</label>
            <input
              value={form.google_maps_embed}
              onChange={(e) => setForm({...form, google_maps_embed: e.target.value})}
              data-testid="settings-maps-input"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
          
          {error && <div style={{ color: '#FF5A00', marginTop: '16px', fontSize: '14px' }}>{error}</div>}
          {success && <div style={{ color: '#10B981', marginTop: '16px', fontSize: '14px' }}>Ayarlar kaydedildi!</div>}
          
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn btn-primary"
            data-testid="settings-save-btn"
            style={{ marginTop: '24px' }}
          >
            <Save size={16} />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSettings;
