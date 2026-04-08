import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, formatApiError } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'wrench', order: 0 });
  const [error, setError] = useState('');

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const res = await api.get('/api/services');
      setServices(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editing) {
        await api.put(`/api/admin/services/${editing}`, form);
      } else {
        await api.post('/api/admin/services', form);
      }
      setEditing(null);
      setForm({ title: '', description: '', icon: 'wrench', order: 0 });
      loadServices();
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu hizmeti silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/api/admin/services/${id}`);
      loadServices();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (service) => {
    setEditing(service.id);
    setForm({ title: service.title, description: service.description, icon: service.icon, order: service.order });
  };

  return (
    <AdminLayout title="Hizmetler">
      <div data-testid="admin-services">
        {/* Form */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
            {editing ? 'Hizmet Duzenle' : 'Yeni Hizmet Ekle'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>BASLIK</label>
              <input
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                data-testid="service-title-input"
                placeholder="Hizmet adi"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>IKON</label>
              <select
                value={form.icon}
                onChange={(e) => setForm({...form, icon: e.target.value})}
                data-testid="service-icon-select"
                style={{ background: '#0A0A0B' }}
              >
                <option value="door">Kapi</option>
                <option value="fence">Cit</option>
                <option value="scissors">Kesim</option>
                <option value="cog">Disli</option>
                <option value="sun">Gunes</option>
                <option value="wrench">Anahtar</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>SIRA</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})}
                data-testid="service-order-input"
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>ACIKLAMA</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              data-testid="service-desc-input"
              rows={3}
              placeholder="Hizmet aciklamasi"
            />
          </div>
          {error && <div style={{ color: '#FF5A00', marginTop: '12px', fontSize: '14px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSave} className="btn btn-primary" data-testid="service-save-btn">
              <Save size={16} /> Kaydet
            </button>
            {editing && (
              <button 
                onClick={() => { setEditing(null); setForm({ title: '', description: '', icon: 'wrench', order: 0 }); }}
                className="btn btn-outline"
              >
                <X size={16} /> Iptal
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>SIRA</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>BASLIK</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>ACIKLAMA</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#A1A1AA' }}>ISLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, i) => (
                <tr key={service.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} data-testid={`service-row-${i}`}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{service.order}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{service.title}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#A1A1AA' }}>{service.description}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(service)} style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer', marginRight: '12px' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminServices;
