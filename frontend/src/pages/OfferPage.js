import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Upload, Send } from 'lucide-react';
import { api, formatApiError } from '../context/AuthContext';

function OfferPage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: '', phone: '', service: '', width: '', height: '', message: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/services').then(res => setServices(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (image) data.append('image', image);
      
      await api.post('/api/offer-request', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="offer-page">
      <Header />
      
      {/* Hero */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '80px',
        background: 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1D 100%)'
      }}>
        <div className="container">
          <span style={{ color: '#FF5A00', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em' }}>
            UCRETSIZ TEKLIF
          </span>
          <h1 style={{ marginTop: '16px', maxWidth: '600px' }}>
            Projeniz Icin Teklif Alin
          </h1>
          <p style={{ color: '#A1A1AA', marginTop: '24px', maxWidth: '500px', fontSize: '18px' }}>
            Formu doldurun, size ozel teklif hazirlayalim.
          </p>
        </div>
      </section>

      {/* Offer Form */}
      <section className="section" style={{ background: '#0A0A0B' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          {success ? (
            <div data-testid="offer-success" style={{
              padding: '48px',
              background: 'rgba(255, 90, 0, 0.1)',
              border: '1px solid #FF5A00',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '16px', color: '#FF5A00' }}>Teklif Talebiniz Alindi!</h2>
              <p style={{ color: '#A1A1AA', marginBottom: '24px' }}>
                En kisa surede sizinle iletisime gececegiz.
              </p>
              <button 
                onClick={() => { setSuccess(false); setFormData({name:'',phone:'',service:'',width:'',height:'',message:''}); setImage(null); }}
                className="btn btn-outline"
              >
                Yeni Teklif Iste
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-testid="offer-form" style={{
              padding: '48px',
              background: '#1A1A1D',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h2 style={{ marginBottom: '32px' }}>Teklif Formu</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                    AD SOYAD *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    data-testid="offer-name-input"
                    placeholder="Adinizi girin"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                    TELEFON *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    data-testid="offer-phone-input"
                    placeholder="Telefon numaraniz"
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                  HIZMET TURU *
                </label>
                <select
                  required
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  data-testid="offer-service-select"
                  style={{ background: '#0A0A0B' }}
                >
                  <option value="">Hizmet Secin</option>
                  {services.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                    GENISLIK (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.width}
                    onChange={(e) => setFormData({...formData, width: e.target.value})}
                    data-testid="offer-width-input"
                    placeholder="Ornek: 200"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                    YUKSEKLIK (cm)
                  </label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    data-testid="offer-height-input"
                    placeholder="Ornek: 180"
                  />
                </div>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                  ACIKLAMA
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  data-testid="offer-message-input"
                  placeholder="Projeniz hakkinda detaylar..."
                />
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
                  GORSEL YUKLE
                </label>
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  background: '#0A0A0B',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}>
                  <Upload size={32} color="#A1A1AA" />
                  <span style={{ marginTop: '12px', color: '#A1A1AA', fontSize: '14px' }}>
                    {image ? image.name : 'Gorsel secmek icin tiklayin'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    data-testid="offer-image-input"
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              
              {error && (
                <div data-testid="offer-error" style={{ marginTop: '20px', color: '#FF5A00', fontSize: '14px' }}>
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                data-testid="offer-submit-btn"
                style={{ width: '100%', marginTop: '32px' }}
              >
                <Send size={18} />
                {loading ? 'Gonderiliyor...' : 'Teklif Iste'}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default OfferPage;
