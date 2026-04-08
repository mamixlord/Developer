import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle } from 'lucide-react';

function AboutPage() {
  return (
    <div data-testid="about-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            HAKKIMIZDA
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Bilay Demir Dograma
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            20 yillik tecrube, yuzlerce mutlu musteri.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{ marginBottom: '24px' }}>Hikayemiz</h2>
              <p style={{ color: '#A1A1AA', lineHeight: 1.8, marginBottom: '20px' }}>
                Bilay Demir Dograma, 2004 yilinda Kagithane'de kucuk bir atolye olarak kuruldu. 
                Yillar icinde buyuyerek Istanbul'un en guvenilir demir dograma firmalarindan biri haline geldik.
              </p>
              <p style={{ color: '#A1A1AA', lineHeight: 1.8, marginBottom: '20px' }}>
                Misyonumuz, musterilerimize en kaliteli malzeme ve iscilikle, zamanlnda ve uygun fiyatli 
                cozumler sunmaktir. Her projede musteri memnuniyetini on planda tutuyoruz.
              </p>
              <p style={{ color: '#A1A1AA', lineHeight: 1.8 }}>
                Modern CNC makinelerimiz ve uzman kadromuzla, demir kapi, bahce citi, korkuluk ve 
                her turlu ozel metal uretimi gerceklestiriyoruz.
              </p>
            </div>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=800"
                alt="Bilay Demir Dograma Atolyesi"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: '#1A1A1D' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '64px' }}>Degerlerimiz</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px'
          }}>
            {[
              { title: 'Kalite', desc: 'En iyi malzeme ve iscilik' },
              { title: 'Guven', desc: 'Sozu tutar, zamaninda teslim' },
              { title: 'Tecrube', desc: '20 yillik sektor bilgisi' },
              { title: 'Musteri Odakli', desc: 'Sizin icin en iyisi' }
            ].map((value, i) => (
              <div key={i} className="card" data-testid={`value-card-${i}`}>
                <CheckCircle size={32} color="#FF5A00" style={{ marginBottom: '16px' }} />
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{value.title}</h3>
                <p style={{ color: '#A1A1AA', fontSize: '14px' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: '#FF5A00' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '48px',
            textAlign: 'center'
          }}>
            {[
              { value: '20+', label: 'Yil Tecrube' },
              { value: '500+', label: 'Proje' },
              { value: '1000+', label: 'Mutlu Musteri' },
              { value: '%100', label: 'Memnuniyet' }
            ].map((stat, i) => (
              <div key={i} data-testid={`stat-${i}`}>
                <div style={{ fontSize: '48px', fontWeight: 900, color: '#000' }}>{stat.value}</div>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)', fontWeight: 600 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
