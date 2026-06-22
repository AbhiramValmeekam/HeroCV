import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  FileText,
  ScanSearch,
  Target,
  Zap,
  Shield,
  Download,
  ArrowRight,
  Star,
  CheckCircle2,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Writing',
      description: 'Generate professional summaries, enhance bullet points, and get intelligent content suggestions powered by Google Gemini AI.',
      color: '#6366F1',
    },
    {
      icon: FileText,
      title: '4 Professional Templates',
      description: 'Choose from Modern, ATS-Friendly, Minimal, and Creative templates designed to impress recruiters.',
      color: '#8B5CF6',
    },
    {
      icon: ScanSearch,
      title: 'ATS Score Analyzer',
      description: 'Get your resume scored for ATS compatibility with detailed feedback on keywords, formatting, and content.',
      color: '#EC4899',
    },
    {
      icon: Target,
      title: 'Job Description Matcher',
      description: 'Compare your resume against job descriptions to identify gaps and optimize your application.',
      color: '#10B981',
    },
    {
      icon: Download,
      title: 'One-Click PDF Export',
      description: 'Download your resume as a high-quality, professionally formatted PDF ready to submit.',
      color: '#F59E0B',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security. JWT authentication ensures your resumes stay private.',
      color: '#EF4444',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Created' },
    { value: '95%', label: 'ATS Pass Rate' },
    { value: '4.9/5', label: 'User Rating' },
    { value: '50+', label: 'AI Features' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">HeroCV</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right min-w-0">
                  <span className="text-sm font-semibold text-text-primary truncate">{user.name}</span>
                  <span className="text-xs text-text-muted truncate">{user.email}</span>
                </div>
                <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5" id="go-to-dashboard">
                  Dashboard <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost" id="login-nav-link">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary" id="register-nav-link">
                  Get Started Free <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background decorations */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent-secondary/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-accent-primary/10 border border-accent-primary/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Zap size={14} className="text-accent-primary" />
            <span className="text-sm font-medium text-accent-primary">Powered by Google Gemini AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in leading-tight">
            Build Your Perfect Resume
            <br />
            <span className="gradient-text">With AI Intelligence</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 animate-fade-in stagger-2">
            Create professional, ATS-optimized resumes in minutes. Let AI enhance your content,
            analyze your resume score, and match you to your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in stagger-3">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn-primary text-lg px-8 py-4 rounded-2xl animate-pulse-glow"
              id="hero-cta"
            >
              <Sparkles size={20} />
              Start Building Free
            </Link>
            <Link to={user ? '/ats-analyzer' : '/register'} className="btn-secondary text-lg px-8 py-4 rounded-2xl" id="hero-ats-cta">
              <ScanSearch size={20} />
              Analyze My Resume
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in stagger-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" id="features-section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our AI-powered platform combines smart technology with professional design
              to help you stand out from the crowd.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Create Your Resume in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a Template',
                desc: 'Pick from our professionally designed templates optimized for ATS systems.',
              },
              {
                step: '02',
                title: 'Add Your Content',
                desc: 'Fill in your details and let AI enhance your bullet points and summary.',
              },
              {
                step: '03',
                title: 'Download & Apply',
                desc: 'Export your polished resume as PDF and start applying with confidence.',
              },
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="text-6xl font-extrabold gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Loved by <span className="gradient-text">Job Seekers</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Software Engineer at Google',
                text: 'The AI suggestions were spot-on. My resume went from generic to outstanding. Landed interviews at 3 FAANG companies!',
              },
              {
                name: 'Marcus Johnson',
                role: 'Product Manager at Meta',
                text: 'The ATS analyzer showed me exactly why my resume wasn\'t getting through. After fixing the issues, I got 5x more callbacks.',
              },
              {
                name: 'Priya Patel',
                role: 'Data Scientist at Netflix',
                text: 'The job matcher feature helped me tailor my resume perfectly for each application. Absolutely game-changing!',
              },
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-text-secondary mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-10"></div>
            <div className="relative z-10">
              <CheckCircle2 size={48} className="text-accent-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Build Your <span className="gradient-text">Winning Resume?</span>
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
                Join thousands of professionals who've landed their dream jobs with AI-powered resumes.
              </p>
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-primary text-lg px-10 py-4 rounded-2xl"
                id="cta-bottom"
              >
                <Sparkles size={20} />
                Get Started Free
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent-primary" />
            <span className="font-semibold">HeroCV</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <a
              href="https://digitalheroesco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary py-2.5 px-4 text-xs font-semibold text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Built for Digital Heroes
            </a>
            <div className="text-xs text-text-muted text-center md:text-right mt-1">
              <strong>Abhiram Valmeekam</strong> | <a href="mailto:abhiramsharma567@gmail.com" className="hover:underline">abhiramsharma567@gmail.com</a>
            </div>
          </div>
          <p className="text-sm text-text-muted">© 2024 HeroCV. Built with Google Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
