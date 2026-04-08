import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone } from 'lucide-react';
import { api } from '../context/AuthContext';

function SEOPage({ slug }) {
  const [seoData, setSeoData] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get(`/api/seo/${slug}`).then(res => setSeoData(res.data)).catch(console.error);
    api.get('/api/services').then(res => setServices(res.data)).catch(console.error);
  }, [slug]);

  const defaultContent = {
    'demir-dograma-istanbul': {
      title: 'Demir Dograma Istanbul',
      metaTitle: 'Demir Dograma Istanbul | Bilay Demir Dograma',
      metaDescription: 'Istanbul\'da profesyonel demir dograma hizmetleri. Kaliteli iscilik, uygun fiyat.',
      content: `
        <h2>Istanbul'da Profesyonel Demir Dograma Hizmetleri</h2>
        <p>Bilay Demir Dograma olarak, Istanbul genelinde 20 yildir kaliteli demir dograma hizmeti sunuyoruz. 
        Demir kapi, bahce citi, korkuluk ve ozel metal uretim konusunda uzman ekibimizle yaninizdayiz.</p>
        <h3>Hizmet Bolgelerimiz</h3>
        <p>Kagithane merkezli olarak Istanbul'un tum ilcelerine hizmet veriyoruz.</p>
      `
    },
    'kagithane-demir-dograma': {
      title: 'Kagithane Demir Dograma',
      metaTitle: 'Kagithane Demir Dograma | Bilay Demir Dograma',
      metaDescription: 'Kagithane\'de guvenilir demir dograma firması. Ucretsiz kesif, kaliteli iscilik.',
      content: `
        <h2>Kagithane'nin Guvenilir Demir Dograma Firmasi</h2>
        <p>Kagithane'de 20 yildir hizmet veren firmamiz, bolgenin en tecrubeli demir dograma atölyesidir.</p>
      `
    },
    'bahce-kapisi-yapimi': {
      title: 'Bahce Kapisi Yapimi',
      metaTitle: 'Bahce Kapisi Yapimi | Bilay Demir Dograma',
      metaDescription: 'Ozel tasarim bahce kapisi yapimi. Ferforje, modern ve klasik modeller.',
      content: `
        <h2>Ozel Tasarim Bahce Kapilari</h2>
        <p>Evinize ozel bahce kapisi tasarimi ve uretimi yapiyoruz. Ferforje, modern ve klasik modeller.</p>
      `
    },
    'demir-cit-sistemleri': {
      title: 'Demir Cit Sistemleri',
      metaTitle: 'Demir Cit Sistemleri | Bilay Demir Dograma',
      metaDescription: 'Dayanikli demir cit sistemleri. Panel cit, ferforje cit, bahce citi.',
      content: `
        <h2>Dayanikli Demir Cit Sistemleri</h2>
        <p>Bahceniz icin en uygun cit sistemini secmenize yardimci oluyoruz.</p>
      `
    },
    'cnc-metal-kesim': {
      title: 'CNC Metal Kesim',
      metaTitle: 'CNC Metal Kesim Istanbul | Bilay Demir Dograma',
      metaDescription: 'Hassas CNC metal kesim hizmetleri. Lazer kesim, plazma kesim.',
      content: `
        <h2>Hassas CNC Metal Kesim Hizmetleri</h2>
        <p>Modern CNC makinelerimizle hassas metal kesim hizmeti sunuyoruz.</p>
      `
    }
  };

  const pageData = seoData?.content ? seoData : defaultContent[slug] || defaultContent['demir-dograma-istanbul'];

  return (
    <div data-testid={`seo-page-${slug}`}>
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            BILAY DEMIR DOGRAMA
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '700px' }}>
            {pageData.title || pageData.meta_title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px'
          }}>
            <div>
              <div 
                style={{ color: '#A1A1AA', fontSize: '17px', lineHeight: 1.9 }}
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
              
              <Link to="/teklif-al" className="btn btn-primary" style={{ marginTop: '32px' }}>
                <Phone size={18} />
                Ucretsiz Teklif Al
              </Link>
            </div>
            
            <div>
              <h3 style={{ marginBottom: '24px', color: '#FF5A00' }}>Hizmetlerimiz</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {services.map((service, i) => (
                  <div key={i} className="card" style={{ padding: '16px' }}>
                    <h4 style={{ fontSize: '16px' }}>{service.title}</h4>
                    <p style={{ fontSize: '14px', color: '#A1A1AA', marginTop: '8px' }}>{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '64px 0',
        background: '#FF5A00'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#000', marginBottom: '16px' }}>Hemen Arayin</h2>
          <p style={{ color: 'rgba(0,0,0,0.7)', marginBottom: '24px' }}>Ucretsiz kesif ve teklif icin bizi arayin.</p>
          <a href="tel:+902125551234" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 32px',
            background: '#000',
            color: '#FFF',
            fontWeight: 600
          }}>
            <Phone size={18} />
            +90 212 555 12 34
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default SEOPage;
