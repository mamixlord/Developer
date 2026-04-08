import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

function Footer() {
  return (
    <footer 
      data-testid="main-footer"
      style={{
        background: '#0A0A0B',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '64px 0 32px'
      }}
    >
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Company Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
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
                <div style={{ fontWeight: 700, fontSize: '18px' }}>BILAY</div>
                <div style={{ fontSize: '11px', color: '#A1A1AA', letterSpacing: '0.1em' }}>DEMIR DOGRAMA</div>
              </div>
            </div>
            <p style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: 1.8 }}>
              20 yillik tecrubemizle Kagithane ve Istanbul genelinde kaliteli demir dograma hizmetleri sunuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: '#FF5A00' }}>
              HIZLI ERISIM
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { path: '/hizmetler', label: 'Hizmetlerimiz' },
                { path: '/projeler', label: 'Projelerimiz' },
                { path: '/teklif-al', label: 'Teklif Al' },
                { path: '/blog', label: 'Blog' },
                { path: '/iletisim', label: 'Iletisim' },
              ].map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  style={{ color: '#A1A1AA', fontSize: '14px', transition: 'color 0.3s' }}
                  onMouseOver={e => e.target.style.color = '#FF5A00'}
                  onMouseOut={e => e.target.style.color = '#A1A1AA'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: '#FF5A00' }}>
              HIZMETLERIMIZ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                'Demir Kapi',
                'Bahce Citleri',
                'CNC Kesim',
                'Ozel Metal Uretim',
                'Tente Sistemleri',
                'Kaynak/Tamir'
              ].map(service => (
                <span key={service} style={{ color: '#A1A1AA', fontSize: '14px' }}>
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px', color: '#FF5A00' }}>
              ILETISIM
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <a 
                href="tel:+902125551234" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A1A1AA', fontSize: '14px' }}
              >
                <Phone size={18} color="#FF5A00" />
                +90 212 555 12 34
              </a>
              <a 
                href="mailto:info@bilaydemir.com" 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A1A1AA', fontSize: '14px' }}
              >
                <Mail size={18} color="#FF5A00" />
                info@bilaydemir.com
              </a>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#A1A1AA', fontSize: '14px' }}>
                <MapPin size={18} color="#FF5A00" style={{ flexShrink: 0, marginTop: '2px' }} />
                Kagithane, Istanbul
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <p style={{ color: '#A1A1AA', fontSize: '13px' }}>
            © 2024 Bilay Demir Dograma. Tum haklari saklidir.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['demir-dograma-istanbul', 'kagithane-demir-dograma', 'cnc-metal-kesim'].map(slug => (
              <Link
                key={slug}
                to={`/${slug}`}
                style={{ color: '#A1A1AA', fontSize: '12px' }}
              >
                {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/905551234567"
        target="_blank"
        rel="noopener noreferrer"
        data-testid="whatsapp-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} color="#FFFFFF" fill="#FFFFFF" />
      </a>
    </footer>
  );
}

export default Footer;
