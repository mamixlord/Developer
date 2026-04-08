import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail } from 'lucide-react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate('/admin');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div data-testid="admin-login-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0A0A0B',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '48px',
        background: '#1A1A1D',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: '#FF5A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '32px',
            color: '#000',
            margin: '0 auto 24px'
          }}>
            B
          </div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Admin Paneli</h1>
          <p style={{ color: '#A1A1AA', fontSize: '14px' }}>Yonetim paneline giris yapin</p>
        </div>

        <form onSubmit={handleSubmit} data-testid="admin-login-form">
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
              E-POSTA
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="#A1A1AA" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="admin-email-input"
                placeholder="admin@bilaydemir.com"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', marginBottom: '8px' }}>
              SIFRE
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="#A1A1AA" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="admin-password-input"
                placeholder="••••••••"
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          {error && (
            <div data-testid="admin-login-error" style={{
              padding: '12px',
              background: 'rgba(255, 90, 0, 0.1)',
              border: '1px solid rgba(255, 90, 0, 0.3)',
              color: '#FF5A00',
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-btn"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? 'Giris Yapiliyor...' : 'Giris Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
