import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Settings, User, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updateUser({ name, email });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg({ type: '', text: '' });
    try {
      const { token } = await authService.changePassword(currentPassword, newPassword);
      localStorage.setItem('token', token);
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const FeedbackMsg: React.FC<{ msg: { type: string; text: string } }> = ({ msg }) => {
    if (!msg.text) return null;
    return (
      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm mt-4 ${msg.type === 'success' ? 'bg-accent-success/10 border border-accent-success/20 text-accent-success' : 'bg-accent-danger/10 border border-accent-danger/20 text-accent-danger'}`}>
        {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {msg.text}
      </div>
    );
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings size={28} className="text-accent-primary" />
          Settings
        </h1>
        <p className="text-text-secondary">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <User size={18} className="text-accent-primary" />
          Profile Information
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required id="settings-name" />
          </div>
          <div>
            <label className="input-label">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required id="settings-email" />
          </div>
          <button type="submit" className="btn-primary" disabled={profileLoading} id="save-profile">
            {profileLoading ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Changes
          </button>
          <FeedbackMsg msg={profileMsg} />
        </form>
      </div>

      {/* Password Section */}
      <div className="card">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Lock size={18} className="text-accent-primary" />
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="input-label">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" required id="current-password" />
          </div>
          <div>
            <label className="input-label">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" required id="new-password" />
          </div>
          <div>
            <label className="input-label">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required id="confirm-new-password" />
          </div>
          <button type="submit" className="btn-primary" disabled={passwordLoading} id="change-password-btn">
            {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : null}
            Change Password
          </button>
          <FeedbackMsg msg={passwordMsg} />
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
