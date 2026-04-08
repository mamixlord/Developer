import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar } from 'lucide-react';
import { api } from '../context/AuthContext';

function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/blog/${slug}`)
      .then(res => setPost(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div data-testid="blog-post-loading" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0A0A0B',
        color: '#FF5A00'
      }}>
        Yukleniyor...
      </div>
    );
  }

  if (!post) {
    return (
      <div data-testid="blog-post-not-found">
        <Header />
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#0A0A0B'
        }}>
          <h1 style={{ marginBottom: '24px' }}>Yazi Bulunamadi</h1>
          <Link to="/blog" className="btn btn-primary">
            <ArrowLeft size={18} />
            Blog'a Don
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div data-testid="blog-post-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link to="/blog" style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            color: '#FF5A00',
            fontSize: '14px',
            marginBottom: '24px'
          }}>
            <ArrowLeft size={16} />
            Blog'a Don
          </Link>
          
          <h1 style={{ marginBottom: '24px' }}>{post.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A1A1AA' }}>
            <Calendar size={16} />
            {post.created_at ? new Date(post.created_at).toLocaleDateString('tr-TR') : ''}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {post.image && (
            <div style={{ marginBottom: '48px', aspectRatio: '16/9', overflow: 'hidden' }}>
              <img 
                src={post.image} 
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          
          <div 
            data-testid="blog-post-content"
            style={{ 
              color: '#A1A1AA', 
              fontSize: '17px', 
              lineHeight: 1.9,
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BlogPostPage;
