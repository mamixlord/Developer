import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../context/AuthContext';
import { Eye, Trash2, Check, X, Phone, Calendar } from 'lucide-react';

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadOffers(); }, []);

  const loadOffers = async () => {
    try {
      const res = await api.get('/api/admin/offer-requests');
      setOffers(res.data);
    } catch (e) { console.error(e); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/offer-requests/${id}/status?status=${status}`);
      loadOffers();
    } catch (e) { console.error(e); }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm('Bu talebi silmek istediginize emin misiniz?')) return;
    try {
      await api.delete(`/api/admin/offer-requests/${id}`);
      setSelected(null);
      loadOffers();
    } catch (e) { console.error(e); }
  };

  const statusColors = {
    new: '#FF5A00',
    contacted: '#3B82F6',
    completed: '#10B981',
    cancelled: '#A1A1AA'
  };

  const statusLabels = {
    new: 'Yeni',
    contacted: 'Iletisime Gecildi',
    completed: 'Tamamlandi',
    cancelled: 'Iptal'
  };

  return (
    <AdminLayout title="Teklif Talepleri">
      <div data-testid="admin-offers" style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: '24px' }}>
        {/* List */}
        <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>AD</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>HIZMET</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>DURUM</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', color: '#A1A1AA' }}>TARIH</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '12px', color: '#A1A1AA' }}>ISLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, i) => (
                <tr 
                  key={offer.id} 
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: selected?.id === offer.id ? 'rgba(255,90,0,0.1)' : 'transparent',
                    cursor: 'pointer'
                  }} 
                  data-testid={`offer-row-${i}`}
                  onClick={() => setSelected(offer)}
                >
                  <td style={{ padding: '16px', fontSize: '14px' }}>{offer.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#A1A1AA' }}>{offer.service}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '4px 8px', 
                      background: `${statusColors[offer.status]}20`,
                      color: statusColors[offer.status]
                    }}>
                      {statusLabels[offer.status] || offer.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '13px', color: '#A1A1AA' }}>
                    {offer.created_at ? new Date(offer.created_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelected(offer); }} 
                      style={{ background: 'transparent', border: 'none', color: '#FF5A00', cursor: 'pointer', marginRight: '12px' }}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteOffer(offer.id); }} 
                      style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {offers.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#A1A1AA' }}>
              Henuz teklif talebi yok
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div style={{ background: '#1A1A1D', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px' }}>Talep Detayi</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>AD SOYAD</div>
              <div style={{ fontSize: '16px' }}>{selected.name}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>TELEFON</div>
              <a href={`tel:${selected.phone}`} style={{ fontSize: '16px', color: '#FF5A00', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} /> {selected.phone}
              </a>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>HIZMET</div>
              <div style={{ fontSize: '16px' }}>{selected.service}</div>
            </div>

            {(selected.width || selected.height) && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>OLCULER</div>
                <div style={{ fontSize: '16px' }}>
                  {selected.width && `Genislik: ${selected.width}cm`}
                  {selected.width && selected.height && ' / '}
                  {selected.height && `Yukseklik: ${selected.height}cm`}
                </div>
              </div>
            )}

            {selected.message && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>MESAJ</div>
                <div style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: 1.6 }}>{selected.message}</div>
              </div>
            )}

            {selected.image && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>GORSEL</div>
                <img src={selected.image} alt="" style={{ width: '100%', borderRadius: '4px' }} />
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>DURUM GUNCELLE</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => updateStatus(selected.id, key)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      background: selected.status === key ? statusColors[key] : 'transparent',
                      color: selected.status === key ? '#000' : statusColors[key],
                      border: `1px solid ${statusColors[key]}`,
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOffers;
