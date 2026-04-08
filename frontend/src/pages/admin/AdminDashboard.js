import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { api } from '../../context/AuthContext';
import { FileText, Image, MessageSquare, Mail } from 'lucide-react';

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/admin/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const statCards = [
    { 
      icon: MessageSquare, 
      label: 'Teklif Talepleri', 
      value: stats?.offers?.total || 0,
      sub: `${stats?.offers?.new || 0} yeni`,
      color: '#FF5A00'
    },
    { 
      icon: Mail, 
      label: 'Mesajlar', 
      value: stats?.messages?.total || 0,
      sub: `${stats?.messages?.unread || 0} okunmamis`,
      color: '#3B82F6'
    },
    { 
      icon: Image, 
      label: 'Projeler', 
      value: stats?.projects || 0,
      color: '#10B981'
    },
    { 
      icon: FileText, 
      label: 'Blog Yazilari', 
      value: stats?.blog_posts || 0,
      color: '#8B5CF6'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div data-testid="admin-dashboard">
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {statCards.map((card, i) => (
            <div 
              key={i}
              data-testid={`stat-card-${i}`}
              style={{
                background: '#1A1A1D',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${card.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}>
                  <card.icon size={20} color={card.color} />
                </div>
                <span style={{ color: '#A1A1AA', fontSize: '14px' }}>{card.label}</span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{card.value}</div>
              {card.sub && <div style={{ fontSize: '13px', color: card.color, marginTop: '4px' }}>{card.sub}</div>}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#1A1A1D',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Hizli Islemler</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { label: 'Yeni Proje Ekle', path: '/admin/projects' },
              { label: 'Blog Yazisi Ekle', path: '/admin/blog' },
              { label: 'Talepleri Gor', path: '/admin/offers' },
              { label: 'Mesajlari Gor', path: '/admin/messages' }
            ].map((action, i) => (
              <a
                key={i}
                href={action.path}
                style={{
                  padding: '12px 20px',
                  background: '#0A0A0B',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#FFF',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
