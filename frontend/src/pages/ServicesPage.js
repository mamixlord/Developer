import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../context/AuthContext';

function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/api/services').then(res => setServices(res.data)).catch(console.error);
  }, []);

  const serviceIcons = {
    door: '🚪', fence: '🏗️', scissors: '✂️', cog: '⚙️', sun: '☀️', wrench: '🔧'
  };

  const serviceImages = {
    'Demir Kapi': 'https://images.unsplash.com/photo-1696521938054-399082dd4f8c?w=600',
    'Bahce Citleri': 'https://images.unsplash.com/photo-1598635232306-8953c6a2fbc8?w=600',
    'CNC Kesim': 'https://images.unsplash.com/photo-1738162837619-5d0b158abcec?w=600',
    'Ozel Metal Uretim': 'https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=600',
    'Tente Sistemleri': 'https://images.unsplash.com/photo-1565618408044-681f42bdd0be?w=600',
    'Kaynak/Tamir': 'https://images.unsplash.com/photo-1565618408044-681f42bdd0be?w=600'
  };

  return (
    <div data-testid="services-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            HIZMETLERIMIZ
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Profesyonel Metal Iscilik Hizmetleri
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            20 yillik tecrubemizle her turlu metal isinde yaninizdayiz.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {services.map((service, i) => (
              <div 
                key={service.id || i}
                data-testid={`service-detail-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '48px',
                  alignItems: 'center',
                  padding: '48px',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255, 90, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginBottom: '20px'
                  }}>
                    {serviceIcons[service.icon] || '🔧'}
                  </div>
                  <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>{service.title}</h2>
                  <p style={{ color: '#A1A1AA', lineHeight: 1.8, marginBottom: '24px' }}>
                    {service.description}
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['Kaliteli malzeme', 'Profesyonel montaj', 'Garanti belgesi'].map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#A1A1AA' }}>
                        <span style={{ color: '#FF5A00' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ order: i % 2 === 0 ? 2 : 1, aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img 
                    src={serviceImages[service.title] || 'https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=600'}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ServicesPage;
