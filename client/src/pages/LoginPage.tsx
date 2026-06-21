import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          setError('');
          setLoading(true);
          try {
            await loginWithGoogle(response.credential);
            navigate('/dashboard');
          } catch (err: any) {
            setError(err.response?.data?.message || 'Google Sign-In failed.');
          } finally {
            setLoading(false);
          }
        },
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: 380 } // Match card width nicely
      );
    }
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-primary/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-secondary/8 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold">HeroCV</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-text-secondary">Sign in to continue building your resume</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-accent-danger/10 border border-accent-danger/20 text-accent-danger rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11"
                  placeholder="name@example.com"
                  required
                  id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="Enter your password"
                  required
                  id="login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-base"
              disabled={loading}
              id="login-submit"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-secondary px-2 text-text-muted">Or continue with</span>
            </div>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex justify-center w-full">
            <div id="google-signin-btn" className="w-full flex justify-center"></div>
          </div>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-primary font-medium hover:underline" id="goto-register">
              Create one free
            </Link>
          </p>
        </div>

        {/* Footer info (visible before logging in) */}
        <div className="mt-6 flex flex-col items-center gap-2 max-w-sm mx-auto">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2 px-3 text-white rounded-xl text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: '#ffffff',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '11px',
              textDecoration: 'none',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
            }}
          >
            Built for Digital Heroes
          </a>
          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', textAlign: 'center', lineHeight: 1.4 }}>
            <strong>Abhiram Valmeekam</strong> | <a href="mailto:abhiramsharma567@gmail.com" className="hover:underline">abhiramsharma567@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
