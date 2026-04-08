import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, formatApiError } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', images: [], featured: false });
  const [error, setError] = useState('');

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get('/api/admin/projects');
      setProjects(res.data);
    } catch (e) { console.error(e); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await api.post('/api/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({...form, images: [...form.images, res.data.url]});
    } catch (e) {
      setError('Gorsel yuklenemedi');
    }
  };

  const handleSave = async () => {
    setError('');
    try {
      if (editing) {
        await api.put(`/api/admin/projects/${editing}`, form);
      } else {
        await api.post('/api/admin/projects', form);
      }
      setEditing(null);
      setForm({ title: '', description: '', category: '', images: [], featured: false });
      loadProjects();
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu projeyi silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/api/admin/projects/${id}`);
      loadProjects();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setForm({ 
      title: project.title, 
      description: project.description, 
      category: project.category,
      images: project.images || [],
      featured: project.featured || false
    });
  };

  return (
    <AdminLayout title="Projeler">
      <div data-testid="admin-projects">
        {/* Form */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
            {editing ? 'Proje Duzenle' : 'Yeni Proje Ekle'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>BASLIK</label>
              <input
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                data-testid="project-title-input"
                placeholder="Proje adi"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>KATEGORI</label>
              <input
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                data-testid="project-category-input"
                placeholder="Ornek: Demir Kapi"
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>ACIKLAMA</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              data-testid="project-desc-input"
              rows={3}
              placeholder="Proje aciklamasi"
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>GORSELLER</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => setForm({...form, images: form.images.filter((_, j) => j !== i)})}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#FF5A00', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                  >
                    <X size={14} color="#000" />
                  </button>
                </div>
              ))}
            </div>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: '#0A0A0B',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}>
              <Upload size={16} />
              Gorsel Yukle
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({...form, featured: e.target.checked})}
              />
              <span style={{ fontSize: '14px' }}>One Cikan Proje</span>
            </label>
          </div>
          {error && <div style={{ color: '#FF5A00', marginTop: '12px', fontSize: '14px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSave} className="btn btn-primary" data-testid="project-save-btn">
              <Save size={16} /> Kaydet
            </button>
            {editing && (
              <button 
                onClick={() => { setEditing(null); setForm({ title: '', description: '', category: '', images: [], featured: false }); }}
                className="btn btn-outline"
              >
                <X size={16} /> Iptal
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {projects.map((project, i) => (
            <div 
              key={project.id}
              data-testid={`project-card-${i}`}
              style={{
                background: '#1A1A1D',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden'
              }}
            >
              {project.images?.[0] && (
                <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                  <img src={project.images[0]} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#FF5A00' }}>{project.category}</span>
                    <h4 style={{ fontSize: '16px', marginTop: '4px' }}>{project.title}</h4>
                  </div>
                  {project.featured && (
                    <span style={{ fontSize: '10px', background: '#FF5A00', color: '#000', padding: '4px 8px' }}>ONE CIKAN</span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: '#A1A1AA', marginTop: '8px' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => handleEdit(project)} style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <Edit size={14} /> Duzenle
                  </button>
                  <button onClick={() => handleDelete(project.id)} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                    <Trash2 size={14} /> Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProjects;
