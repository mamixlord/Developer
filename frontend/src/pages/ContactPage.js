import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { api, formatApiError } from '../context/AuthContext';

function ContactPage() {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/site-settings').then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            ILETISIM
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Bizimle Iletisime Gecin
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            Sorulariniz icin bize ulasin, en kisa surede donelim.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '64px'
          }}>
            {/* Contact Info */}
            <div>
              <h2 style={{ marginBottom: '32px' }}>Iletisim Bilgileri</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <a href={`tel:${settings.phone || '+902125551234'}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Phone size={24} color="#FF5A00" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>TELEFON</div>
                    <div style={{ fontSize: '16px' }}>{settings.phone || '+90 212 555 12 34'}</div>
                  </div>
                </a>
                
                <a href={`mailto:${settings.email || 'info@bilaydemir.com'}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Mail size={24} color="#FF5A00" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>E-POSTA</div>
                    <div style={{ fontSize: '16px' }}>{settings.email || 'info@bilaydemir.com'}</div>
                  </div>
                </a>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <MapPin size={24} color="#FF5A00" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>ADRES</div>
                    <div style={{ fontSize: '16px' }}>{settings.address || 'Kagithane, Istanbul'}</div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <Clock size={24} color="#FF5A00" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '4px' }}>CALISMA SAATLERI</div>
                    <div style={{ fontSize: '16px' }}>{settings.working_hours || 'Pzt - Cmt: 08:00 - 18:00'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 style={{ marginBottom: '32px' }}>Mesaj Gonderin</h2>
              
              {success ? (
                <div data-testid="contact-success" style={{
                  padding: '32px',
                  background: 'rgba(255, 90, 0, 0.1)',
                  border: '1px solid #FF5A00',
                  textAlign: 'center'
                }}>
                  <h3 style={{ marginBottom: '12px', color: '#FF5A00' }}>Mesajiniz Alindi!</h3>
                  <p style={{ color: '#A1A1AA' }}>En kisa surede size donecegiz.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} data-testid="contact-form">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                        AD SOYAD *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        data-testid="contact-name-input"
                        placeholder="Adinizi girin"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                        E-POSTA *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        data-testid="contact-email-input"
                        placeholder="E-posta adresinizi girin"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                        TELEFON
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        data-testid="contact-phone-input"
                        placeholder="Telefon numaranizi girin"
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                        MESAJ *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        data-testid="contact-message-input"
                        placeholder="Mesajinizi yazin"
                      />
                    </div>
                    
                    {error && (
                      <div data-testid="contact-error" style={{ color: '#FF5A00', fontSize: '14px' }}>
                        {error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                      data-testid="contact-submit-btn"
                      style={{ width: '100%' }}
                    >
                      <Send size={18} />
                      {loading ? 'Gonderiliyor...' : 'Mesaj Gonder'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div style={{ marginTop: '64px', aspectRatio: '21/9', background: '#1A1A1D' }}>
            <iframe
              src={settings.google_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.29!2d28.97!3d41.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zS8OixJ%2BxdGhhbmUsIMSwc3RhbmJ1bA!5e0!3m2!1str!2str!4v1"}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Bilay Demir Dograma Konum"
              data-testid="google-map"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactPage;
