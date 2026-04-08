import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Calendar, ArrowRight } from 'lucide-react';
import { api } from '../context/AuthContext';

function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/api/blog').then(res => setPosts(res.data)).catch(console.error);
  }, []);

  return (
    <div data-testid="blog-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            BLOG
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Metal Iscilik Rehberi
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            Demir dograma ve metal iscilik hakkinda faydali bilgiler.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          {posts.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '32px'
            }}>
              {posts.map((post, i) => (
                <Link 
                  key={post.id || i}
                  to={`/blog/${post.slug}`}
                  data-testid={`blog-post-${i}`}
                  style={{
                    display: 'block',
                    background: '#1A1A1D',
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {post.image && (
                    <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A1A1AA', fontSize: '13px', marginBottom: '12px' }}>
                      <Calendar size={14} />
                      {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR') : 'Tarih yok'}
                    </div>
                    <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{post.title}</h3>
                    <p style={{ color: '#A1A1AA', fontSize: '14px', lineHeight: 1.7 }}>
                      {post.excerpt}
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      marginTop: '20px',
                      color: '#FF5A00',
                      fontSize: '14px',
                      fontWeight: 600
                    }}>
                      Devamini Oku <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '96px 24px', color: '#A1A1AA' }}>
              <p style={{ fontSize: '18px', marginBottom: '16px' }}>Henuz blog yazisi eklenmemis.</p>
              <p>Yakinda faydali icerikler paylasilacak.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogPage;
