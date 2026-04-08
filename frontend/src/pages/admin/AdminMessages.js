import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../context/AuthContext';
import { Eye, Trash2, X, Mail, Phone } from 'lucide-react';

function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadMessages(); }, []);

  const loadMessages = async () => {
    try {
      const res = await api.get('/api/admin/contact-messages');
      setMessages(res.data);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/contact-messages/${id}/status?status=${status}`);
      loadMessages();
    } catch (e) { console.error(e); }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Bu mesaji silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/api/admin/contact-messages/${id}`);
      setSelected(null);
      loadMessages();
    } catch (e) { console.error(e); }
  };

  return (
    <AdminLayout title="Iletisim Mesajlari">
      <div data-testid="admin-messages" style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '24px' }}>
        {/* List */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>AD</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>E-POSTA</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>DURUM</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>TARIH</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#A1A1AA' }}>ISLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, i) => (
                <tr 
                  key={msg.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: selected?.id === msg.id ? 'rgba(255,90,0,0.1)' : 'transparent',
                    cursor: 'pointer'
                  }} 
                  data-testid={`message-row-${i}`}
                  onClick={() => { setSelected(msg); if(msg.status === 'unread') updateStatus(msg.id, 'read'); }}
                >
                  <td style={{ padding: '16px', fontSize: '14px', fontWeight: msg.status === 'unread' ? 600 : 400 }}>{msg.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#A1A1AA' }}>{msg.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      background: msg.status === 'unread' ? 'rgba(255,90,0,0.2)' : 'rgba(161,161,170,0.2)',
                      color: msg.status === 'unread' ? '#FF5A00' : '#A1A1AA'
                    }}>
                      {msg.status === 'unread' ? 'Okunmamis' : 'Okundu'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#A1A1AA' }}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelected(msg); }} 
                      style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer', marginRight: '12px' }}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }} 
                      style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {messages.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#A1A1AA' }}>
              Henuz mesaj yok
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px' }}>Mesaj Detayi</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>AD SOYAD</div>
              <div style={{ fontSize: '16px' }}>{selected.name}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>E-POSTA</div>
              <a href={`mailto:${selected.email}`} style={{ fontSize: '16px', color: '#FF5A00', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} /> {selected.email}
              </a>
            </div>

            {selected.phone && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>TELEFON</div>
                <a href={`tel:${selected.phone}`} style={{ fontSize: '16px', color: '#FF5A00', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} /> {selected.phone}
                </a>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>MESAJ</div>
              <div style={{ 
                fontSize: '14px', 
                color: '#FFF', 
                lineHeight: 1.8,
                padding: '16px',
                background: '#0A0A0B',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {selected.message}
              </div>
            </div>

            <a 
              href={`mailto:${selected.email}`}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Mail size={16} /> Yanitla
            </a>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminMessages;
