import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, register, loginWithGoogle } = useAuth();
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
        { theme: 'outline', size: 'large', width: 380 } // Match card width
      );
    }
  }, [loginWithGoogle, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative">
      {/* Floating User Info (Top Right) */}
      {user && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3 bg-bg-secondary/80 border border-border/80 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="hidden sm:flex flex-col text-right min-w-0">
            <span className="text-xs font-semibold text-text-primary truncate">{user.name}</span>
            <span className="text-[10px] text-text-muted truncate">{user.email}</span>
          </div>
          <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <Link to="/dashboard" className="btn-primary py-1 px-3 text-xs flex items-center gap-1">
            Dashboard <ArrowRight size={12} />
          </Link>
        </div>
      )}

      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-primary/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent-secondary/8 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold">HeroCV</span>
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            <p className="text-text-secondary">Start building your professional resume</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-accent-danger/10 border border-accent-danger/20 text-accent-danger rounded-xl px-4 py-3 mb-6 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input pl-11"
                  placeholder="John Doe"
                  required
                  id="register-name"
                />
              </div>
            </div>

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
                  id="register-email"
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
                  placeholder="At least 6 characters"
                  required
                  id="register-password"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-11"
                  placeholder="Confirm your password"
                  required
                  id="register-confirm-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-base"
              disabled={loading}
              id="register-submit"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
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
            Already have an account?{' '}
            <Link to="/login" className="text-accent-primary font-medium hover:underline" id="goto-login">
              Sign in
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

export default RegisterPage;
