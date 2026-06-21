import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  ScanSearch,
  Target,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/builder', icon: FileText, label: 'Resume Builder' },
    { path: '/ats-analyzer', icon: ScanSearch, label: 'ATS Analyzer' },
    { path: '/job-matcher', icon: Target, label: 'Job Matcher' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden btn-ghost p-2 rounded-lg bg-bg-secondary border border-border"
        id="sidebar-toggle"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="main-sidebar">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">HeroCV</h1>
            <p className="text-xs text-text-muted">AI Resume Builder</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth < 1024) onToggle(); }}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-3 px-4 mb-3">
            <div className="w-9 h-9 rounded-full gradient-accent flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left hover:text-accent-danger"
            id="logout-button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Digital Heroes and Agent Info */}
        <div className="border-t border-border pt-4 mt-4 px-4 flex flex-col gap-2">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2.5 px-3 text-white rounded-xl text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
          <div style={{ fontSize: '10px', color: 'var(--text-muted, #94a3b8)', textAlign: 'center', lineHeight: 1.4, marginTop: '2px' }}>
            <div style={{ fontWeight: 600 }}>Abhiram Valmeekam</div>
            <div><a href="mailto:abhiramsharma567@gmail.com" className="hover:underline">abhiramsharma567@gmail.com</a></div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
