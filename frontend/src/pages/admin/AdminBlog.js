import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api, formatApiError } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ 
    title: '', slug: '', content: '', excerpt: '', 
    image: '', meta_title: '', meta_description: '', published: false 
  });
  const [error, setError] = useState('');

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get('/api/admin/blog');
      setPosts(res.data);
    } catch (e) { console.error(e); }
  };

  const generateSlug = (title) => {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    setError('');
    const data = { ...form, slug: form.slug || generateSlug(form.title) };
    try {
      if (editing) {
        await api.put(`/api/admin/blog/${editing}`, data);
      } else {
        await api.post('/api/admin/blog', data);
      }
      setEditing(null);
      setForm({ title: '', slug: '', content: '', excerpt: '', image: '', meta_title: '', meta_description: '', published: false });
      loadPosts();
    } catch (e) {
      setError(formatApiError(e.response?.data?.detail));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu yaziyi silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/api/admin/blog/${id}`);
      loadPosts();
    } catch (e) { console.error(e); }
  };

  const handleEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      published: post.published
    });
  };

  return (
    <AdminLayout title="Blog Yonetimi">
      <div data-testid="admin-blog">
        {/* Form */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
            {editing ? 'Yazi Duzenle' : 'Yeni Yazi Ekle'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>BASLIK</label>
              <input
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value, slug: generateSlug(e.target.value)})}
                data-testid="blog-title-input"
                placeholder="Yazi basligi"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>URL (SLUG)</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({...form, slug: e.target.value})}
                data-testid="blog-slug-input"
                placeholder="ornek-yazi-basligi"
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>OZET</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({...form, excerpt: e.target.value})}
              data-testid="blog-excerpt-input"
              rows={2}
              placeholder="Kisa ozet (liste gorunumunde gosterilir)"
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>ICERIK (HTML)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({...form, content: e.target.value})}
              data-testid="blog-content-input"
              rows={10}
              placeholder="<h2>Baslik</h2><p>Icerik...</p>"
            />
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>GORSEL URL</label>
            <input
              value={form.image}
              onChange={(e) => setForm({...form, image: e.target.value})}
              data-testid="blog-image-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>META BASLIK</label>
              <input
                value={form.meta_title}
                onChange={(e) => setForm({...form, meta_title: e.target.value})}
                placeholder="SEO basligi"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>META ACIKLAMA</label>
              <input
                value={form.meta_description}
                onChange={(e) => setForm({...form, meta_description: e.target.value})}
                placeholder="SEO aciklamasi"
              />
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({...form, published: e.target.checked})}
              />
              <span style={{ fontSize: '14px' }}>Yayinla</span>
            </label>
          </div>
          {error && <div style={{ color: '#FF5A00', marginTop: '12px', fontSize: '14px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={handleSave} className="btn btn-primary" data-testid="blog-save-btn">
              <Save size={16} /> Kaydet
            </button>
            {editing && (
              <button 
                onClick={() => { setEditing(null); setForm({ title: '', slug: '', content: '', excerpt: '', image: '', meta_title: '', meta_description: '', published: false }); }}
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
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>BASLIK</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>SLUG</th>
                <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: '#A1A1AA' }}>DURUM</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#A1A1AA' }}>ISLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} data-testid={`blog-row-${i}`}>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{post.title}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#A1A1AA' }}>{post.slug}</td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {post.published ? (
                      <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <Eye size={14} /> Yayinda
                      </span>
                    ) : (
                      <span style={{ color: '#A1A1AA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <EyeOff size={14} /> Taslak
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(post)} style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer', marginRight: '12px' }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(post.id)} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}>
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

export default AdminBlog;
