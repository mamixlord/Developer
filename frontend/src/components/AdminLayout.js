import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Settings, FileText, Image, 
  MessageSquare, Mail, Search, LogOut, Menu, X 
} from 'lucide-react';

function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: Settings, label: 'Hizmetler' },
    { path: '/admin/projects', icon: Image, label: 'Projeler' },
    { path: '/admin/blog', icon: FileText, label: 'Blog' },
    { path: '/admin/offers', icon: MessageSquare, label: 'Teklif Talepleri' },
    { path: '/admin/messages', icon: Mail, label: 'Mesajlar' },
    { path: '/admin/seo', icon: Search, label: 'SEO Ayarlari' },
    { path: '/admin/settings', icon: Settings, label: 'Site Ayarlari' },
  ];

  return (
    <div data-testid="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0B' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: '#1A1A1D',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-260px',
        bottom: 0,
        zIndex: 1000,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }} className="admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#FF5A00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '20px',
              color: '#000'
            }}>
              B
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>BILAY</div>
              <div style={{ fontSize: '10px', color: '#A1A1AA' }}>ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              data-testid={`admin-nav-${item.path.split('/').pop() || 'dashboard'}`}
              onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: location.pathname === item.path ? '#FF5A00' : '#A1A1AA',
                background: location.pathname === item.path ? 'rgba(255,90,0,0.1)' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #FF5A00' : '3px solid transparent',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '8px' }}>{user?.email}</div>
          <button
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: '#FF5A00',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Cikis Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '0', transition: 'margin 0.3s ease' }} className="admin-main">
        {/* Top Bar */}
        <header style={{
          height: '64px',
          background: '#1A1A1D',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="admin-menu-toggle"
              style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}
              className="sidebar-toggle"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h1>
          </div>
          <Link to="/" target="_blank" style={{ color: '#A1A1AA', fontSize: '14px' }}>
            Siteyi Gor →
          </Link>
        </header>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
          className="sidebar-overlay"
        />
      )}

      <style>{`
        @media (min-width: 1024px) {
          .admin-sidebar { left: 0 !important; }
          .admin-main { margin-left: 260px !important; }
          .sidebar-toggle { display: none !important; }
          .sidebar-overlay { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;
