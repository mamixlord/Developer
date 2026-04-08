import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/hizmetler', label: 'Hizmetler' },
    { path: '/projeler', label: 'Projeler' },
    { path: '/hakkimizda', label: 'Hakkimizda' },
    { path: '/blog', label: 'Blog' },
    { path: '/iletisim', label: 'Iletisim' },
  ];

  return (
    <header 
      data-testid="main-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(10, 10, 11, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        height: '80px'
      }}>
        {/* Logo */}
        <Link to="/" data-testid="logo-link" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          textDecoration: 'none'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: '#FF5A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '24px',
            color: '#000'
          }}>
            B
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.02em' }}>
              BILAY
            </div>
            <div style={{ fontSize: '11px', color: '#A1A1AA', letterSpacing: '0.1em' }}>
              DEMIR DOGRAMA
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`nav-${link.path.replace('/', '') || 'home'}`}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: location.pathname === link.path ? '#FF5A00' : '#FFFFFF',
                transition: 'color 0.3s ease'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/teklif-al" 
            className="btn btn-primary"
            data-testid="header-cta-btn"
            style={{ display: 'none' }}
            id="desktop-cta"
          >
            <Phone size={16} />
            Teklif Al
          </Link>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              padding: '8px'
            }}
            className="mobile-menu-btn"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          data-testid="mobile-menu"
          style={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            background: '#0A0A0B',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px'
          }}
        >
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '16px 0',
                fontSize: '18px',
                fontWeight: 500,
                color: location.pathname === link.path ? '#FF5A00' : '#FFFFFF',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link 
            to="/teklif-al"
            onClick={() => setIsOpen(false)}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px' }}
          >
            <Phone size={16} />
            Teklif Al
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; gap: 8px; }
          #desktop-cta { display: inline-flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export default Header;
