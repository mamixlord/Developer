import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, formatApiError } from '../../context/AuthContext';
import { Save, Plus, Edit, Trash2 } from 'lucide-react';

function AdminSEO() {
  const [seoList, setSeoList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    page_slug: '', meta_title: '', meta_description: '', meta_keywords: '', content: '' 
  });
  const [error, setError] = useState('');

  useEffect(() => { loadSEO(); }, []);

  const loadSEO = async () => {
    try {
      const res = await api.get('/api/admin/seo');
      setSeoList(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editing) {
        await api.put(`/api/admin/seo/${editing}`, form);
      } else {
        await api.post('/api/admin/seo', form);
      }
      setEditing(null);
      setForm({ page_slug: '', meta_title: '', meta_description: '', meta_keywords: '', content: '' });
      loadSEO();
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail));
    }
  };

  const handleEdit = (seo) => {
    setEditing(seo.id);
    setForm({
      page_slug: seo.page_slug,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      meta_keywords: seo.meta_keywords,
      content: seo.content
    });
  };

  const defaultPages = [
    'demir-dograma-istanbul',
    'kagithane-demir-dograma',
    'bahce-kapisi-yapimi',
    'demir-cit-sistemleri',
    'cnc-metal-kesim'
  ];

  return (
    <AdminLayout title="SEO Ayarlari">
      <div data-testid="admin-seo">
        {/* Form */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
            {editing ? 'SEO Duzenle' : 'Yeni SEO Sayfasi Ekle'}
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>SAYFA SLUG</label>
            {!editing ? (
              <select
                value={form.page_slug}
                onChange={(e) => setForm({...form, page_slug: e.target.value})}
                data-testid="seo-slug-select"
                style={{ background: '#0A0A0B' }}
              >
                <option value="">Sayfa Secin veya Yeni Ekleyin</option>
                {defaultPages.map(slug => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
            ) : (
              <input value={form.page_slug} disabled style={{ background: '#27272A' }} />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>META BASLIK</label>
              <input
                value={form.meta_title}
                onChange={(e) => setForm({...form, meta_title: e.target.value})}
                data-testid="seo-title-input"
                placeholder="Sayfa basligi (60 karakter)"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>META ANAHTAR KELIMELER</label>
              <input
                value={form.meta_keywords}
                onChange={(e) => setForm({...form, meta_keywords: e.target.value})}
                data-testid="seo-keywords-input"
                placeholder="kelime1, kelime2, kelime3"
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>META ACIKLAMA</label>
            <textarea
              value={form.meta_description}
              onChange={(e) => setForm({...form, meta_description: e.target.value})}
              data-testid="seo-desc-input"
              rows={2}
              placeholder="Sayfa aciklamasi (160 karakter)"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>SAYFA ICERIGI (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              data-testid="seo-content-input"
              rows={10}
              placeholder="<h2>Baslik</h2><p>Icerik...</p>"
            />
          </div>

          {error && <div style={{ color: '#FF5A00', marginBottom: '12px', fontSize: '14px' }}>{error}</div>}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleSave} className="btn btn-primary" data-testid="seo-save-btn">
              <Save size={16} /> Kaydet
            </button>
            {editing && (
              <button 
                onClick={() => { setEditing(null); setForm({ page_slug: '', meta_title: '', meta_description: '', meta_keywords: '', content: '' }); }}
                className="btn btn-outline"
              >
                Iptal
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>SAYFA</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>META BASLIK</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#A1A1AA' }}>ISLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {seoList.map((seo, i) => (
                <tr key={seo.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} data-testid={`seo-row-${i}`}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>/{seo.page_slug}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#A1A1AA' }}>{seo.meta_title}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(seo)} style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer' }}>
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {seoList.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#A1A1AA' }}>
              Henuz SEO ayari eklenmemis
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminSEO;
