import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, CheckCircle, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero3D from '../components/Hero3D';
import { api } from '../context/AuthContext';

function HomePage() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, projectsRes, testimonialsRes] = await Promise.all([
        api.get('/api/services'),
        api.get('/api/projects?featured=true'),
        api.get('/api/testimonials')
      ]);
      setServices(servicesRes.data);
      setProjects(projectsRes.data);
      setTestimonials(testimonialsRes.data);
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  const serviceIcons = {
    door: '🚪',
    fence: '🏗️',
    scissors: '✂️',
    cog: '⚙️',
    sun: '☀️',
    wrench: '🔧'
  };

  return (
    <div data-testid="home-page">
      <Header />
      
      {/* Hero Section */}
      <section 
        data-testid="hero-section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)',
          overflow: 'hidden'
        }}
      >
        <Hero3D />
        
        {/* Content Overlay */}
        <div className="container" style={{ position: 'relative', zIndex: 10, paddingTop: '100px' }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'rgba(255, 90, 0, 0.1)',
              border: '1px solid rgba(255, 90, 0, 0.3)',
              marginBottom: '24px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#FF5A00',
              letterSpacing: '0.1em'
            }}>
              KAGITHANE, ISTANBUL
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              METAL ISLERI<br />
              <span style={{ color: '#FF5A00' }}>USTASI</span>
            </h1>
            
            <p style={{
              fontSize: '18px',
              color: '#A1A1AA',
              lineHeight: 1.8,
              marginBottom: '40px',
              maxWidth: '500px'
            }}>
              20 yillik tecrubemizle demir kapi, bahce citi, CNC kesim ve ozel metal uretim hizmetleri sunuyoruz. Kalite ve guven bizimle.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link 
                to="/teklif-al" 
                className="btn btn-primary"
                data-testid="hero-cta-btn"
              >
                <Phone size={18} />
                Ucretsiz Teklif Al
              </Link>
              <Link 
                to="/projeler" 
                className="btn btn-outline"
                data-testid="hero-projects-btn"
              >
                Projelerimiz
                <ArrowRight size={18} />
              </Link>
            </div>
            
            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '48px',
              marginTop: '64px',
              flexWrap: 'wrap'
            }}>
              {[
                { value: '20+', label: 'Yillik Tecrube' },
                { value: '500+', label: 'Tamamlanan Proje' },
                { value: '%100', label: 'Musteri Memnuniyeti' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#FF5A00' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '14px', color: '#A1A1AA' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10
        }}>
          <span style={{ fontSize: '12px', color: '#A1A1AA', letterSpacing: '0.1em' }}>ASAGI KAYDIR</span>
          <div style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(180deg, #FF5A00 0%, transparent 100%)'
          }} />
        </div>
      </section>

      {/* Services Section */}
      <section data-testid="services-section" className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ 
              color: '#FF5A00', 
              fontSize: '12px', 
              fontWeight: 600, 
              letterSpacing: '0.2em' 
            }}>
              HIZMETLERIMIZ
            </span>
            <h2 style={{ marginTop: '16px' }}>
              Profesyonel Metal Isleri
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {services.map((service, i) => (
              <div 
                key={service.id || i}
                className="card"
                data-testid={`service-card-${i}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
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
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>
                  {service.title}
                </h3>
                <p style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: 1.7 }}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/hizmetler" className="btn btn-outline">
              Tum Hizmetler
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section data-testid="projects-section" className="section" style={{ background: '#1A1A1D' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ 
              color: '#FF5A00', 
              fontSize: '12px', 
              fontWeight: 600, 
              letterSpacing: '0.2em' 
            }}>
              PORTFOLYO
            </span>
            <h2 style={{ marginTop: '16px' }}>
              Son Projelerimiz
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {projects.length > 0 ? projects.slice(0, 6).map((project, i) => (
              <div 
                key={project.id || i}
                data-testid={`project-card-${i}`}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: '#0A0A0B',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {project.images?.[0] && (
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '24px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))'
                }}>
                  <span style={{ fontSize: '12px', color: '#FF5A00', fontWeight: 600 }}>
                    {project.category}
                  </span>
                  <h4 style={{ fontSize: '18px', marginTop: '8px' }}>
                    {project.title}
                  </h4>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#A1A1AA' }}>
                Projeler yaklnda eklenecek
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/projeler" className="btn btn-outline">
              Tum Projeler
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section data-testid="why-us-section" className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ 
                color: '#FF5A00', 
                fontSize: '12px', 
                fontWeight: 600, 
                letterSpacing: '0.2em' 
              }}>
                NEDEN BIZ?
              </span>
              <h2 style={{ marginTop: '16px', marginBottom: '32px' }}>
                Kalite ve Guvenin Adresi
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  '20 yillik sektör tecrubesi',
                  'Yerinde ucretsiz keşif',
                  'Garanti belgeli urunler',
                  'Profesyonel montaj ekibi',
                  'Rekabetci fiyatlar',
                  '7/24 musteri desteği'
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <CheckCircle size={20} color="#FF5A00" />
                    <span style={{ fontSize: '16px' }}>{item}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/teklif-al" className="btn btn-primary" style={{ marginTop: '40px' }}>
                <Phone size={18} />
                Hemen Arayin
              </Link>
            </div>
            
            <div style={{
              position: 'relative',
              aspectRatio: '4/3',
              background: '#1A1A1D',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=800"
                alt="Metal atolyemiz"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '-20px',
                right: '-20px',
                background: '#FF5A00',
                padding: '24px',
                color: '#000'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 900 }}>20+</div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>YIL TECRUBE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section data-testid="testimonials-section" className="section" style={{ background: '#1A1A1D' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ 
              color: '#FF5A00', 
              fontSize: '12px', 
              fontWeight: 600, 
              letterSpacing: '0.2em' 
            }}>
              REFERANSLAR
            </span>
            <h2 style={{ marginTop: '16px' }}>
              Musterilerimiz Ne Diyor?
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {testimonials.map((testimonial, i) => (
              <div 
                key={testimonial.id || i}
                className="card"
                data-testid={`testimonial-card-${i}`}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(testimonial.rating || 5)].map((_, j) => (
                    <Star key={j} size={18} fill="#FF5A00" color="#FF5A00" />
                  ))}
                </div>
                <p style={{ 
                  color: '#A1A1AA', 
                  fontSize: '15px', 
                  lineHeight: 1.8,
                  marginBottom: '20px',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </p>
                <div>
                  <div style={{ fontWeight: 600 }}>{testimonial.name}</div>
                  {testimonial.company && (
                    <div style={{ fontSize: '13px', color: '#FF5A00' }}>{testimonial.company}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section data-testid="cta-section" style={{
        padding: '96px 0',
        background: 'linear-gradient(135deg, #FF5A00 0%, #FF7A33 100%)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#000', marginBottom: '16px' }}>
            Projeniz mi Var?
          </h2>
          <p style={{ color: 'rgba(0,0,0,0.7)', fontSize: '18px', marginBottom: '32px' }}>
            Hemen ucretsiz teklif alin, size en uygun cozumu sunalim.
          </p>
          <Link 
            to="/teklif-al" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 32px',
              background: '#000',
              color: '#FFF',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.05em'
            }}
          >
            <Phone size={18} />
            UCRETSIZ TEKLIF AL
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
