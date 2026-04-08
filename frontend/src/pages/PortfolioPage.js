import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { api } from '../context/AuthContext';

function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/api/projects').then(res => setProjects(res.data)).catch(console.error);
  }, []);

  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const filteredProjects = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div data-testid="portfolio-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            PORTFOLYO
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Tamamlanan Projelerimiz
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            Yillar icinde tamamladigimiz projelerden ornekler.
          </p>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          {/* Filter */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                data-testid={`filter-${cat}`}
                style={{
                  padding: '10px 20px',
                  background: filter === cat ? '#FF5A00' : 'transparent',
                  color: filter === cat ? '#000' : '#FFFFFF',
                  border: `1px solid ${filter === cat ? '#FF5A00' : 'rgba(255,255,255,0.1)'}`,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat === 'all' ? 'Tumu' : cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredProjects.length > 0 ? filteredProjects.map((project, i) => (
              <div 
                key={project.id || i}
                data-testid={`project-item-${i}`}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {project.images?.[0] ? (
                  <img 
                    src={project.images[0]} 
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#A1A1AA'
                  }}>
                    Gorsel Yok
                  </div>
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
                  <p style={{ fontSize: '14px', color: '#A1A1AA', marginTop: '8px' }}>
                    {project.description}
                  </p>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '96px 24px', color: '#A1A1AA' }}>
                <p style={{ fontSize: '18px', marginBottom: '16px' }}>Henuz proje eklenmemis.</p>
                <p>Yakinda projelerimizi burada gorebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PortfolioPage;
