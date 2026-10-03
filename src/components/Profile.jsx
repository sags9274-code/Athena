import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, role, username, setUsername, avatarUrl, setAvatarUrl } = useAuth();
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newAvatarUrlInput, setNewAvatarUrlInput] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    if (user) {
      setNewUsername(username || '');
      setNewAvatarUrlInput(avatarUrl || '');
      fetchProfileData(user.id);
    }
  }, [user, username, avatarUrl]);

  const fetchProfileData = async (userId) => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/profile?user_id=${userId}`);
      setPoints(data.points || 0);
      setBadges(data.badges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveStatus({ message: 'Saving sacred profile...', type: 'info' });
    
    try {
      const data = await apiFetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          username: newUsername.trim(),
          avatar_url: newAvatarUrlInput.trim() || null,
        }),
      });

      if (data.success) {
        setUsername(data.user.username);
        setAvatarUrl(data.user.avatar_url);
        setIsEditingUsername(false);
        setIsEditingAvatar(false);
        setSaveStatus({ message: 'Sacred profile updated successfully!', type: 'success' });
        setTimeout(() => setSaveStatus({ message: '', type: '' }), 3000);
      }
    } catch (err) {
      setSaveStatus({ message: err.message || 'Error updating profile.', type: 'error' });
    }
  };

  if (!user) {
    return (
      <div className="page profile-page">
        <div className="profile-auth-warning">
          Please authenticate before entering the shrine.
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-page">
      <header className="page__header">
        <h1 className="page__title">Sacred Profile</h1>
        <p className="page__subtitle">Manage your identity and showcase your marks of devotion.</p>
      </header>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div className="profile-avatar-large" style={{ position: 'relative' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="profile-avatar-img" />
              ) : (
                role === 'goddess' ? '👑' : role === 'developer' ? '💻' : '🕯️'
              )}
            </div>
            <button
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-gold)',
                color: 'var(--color-gold)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {isEditingAvatar ? 'Cancel' : 'Change Avatar'}
            </button>
          </div>
          
          <div className="profile-info">
            {isEditingAvatar && (
              <form onSubmit={handleUpdateProfile} style={{ marginBottom: '1rem', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newAvatarUrlInput}
                  onChange={(e) => setNewAvatarUrlInput(e.target.value)}
                  className="profile-username-input"
                  placeholder="Paste image URL for avatar..."
                  style={{ width: '100%' }}
                />
                <button type="submit" className="profile-btn-save">Save</button>
              </form>
            )}

            {isEditingUsername ? (
              <form className="profile-username-form" onSubmit={handleUpdateProfile}>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="profile-username-input"
                  placeholder="Enter new username"
                  maxLength={25}
                  autoFocus
                />
                <button type="submit" className="profile-btn-save">Save</button>
                <button type="button" className="profile-btn-cancel" onClick={() => setIsEditingUsername(false)}>Cancel</button>
              </form>
            ) : (
              <div className="profile-username-display">
                <h2 className="profile-username">@{username || 'Devoted_Penitent'}</h2>
                <button className="profile-edit-icon" onClick={() => setIsEditingUsername(true)} title="Edit Username">
                  ✏️
                </button>
              </div>
            )}
            
            {saveStatus.message && (
              <div className={`profile-status profile-status--${saveStatus.type}`}>
                {saveStatus.message}
              </div>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-label">Sacred Rank</span>
                <span className={`profile-stat-value role-badge role-badge--${role}`}>
                  {role === 'goddess' ? 'High Goddess Athena' : role === 'developer' ? 'High Priest' : 'Penitent Sub'}
                </span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-label">Sacred Points</span>
                <span className="profile-stat-value points-highlight">
                  {loading ? '...' : points}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="profile-section">
          <h3 className="profile-section-title">Your Consecrated Relics</h3>
          {loading ? (
            <p className="profile-loading">Inspecting your relics...</p>
          ) : badges.length === 0 ? (
            <div className="profile-empty-state">
              <p>You haven't claimed any sacred relics yet.</p>
              <p className="profile-empty-sub">Perform daily devotions and visit the Reliquary to claim them!</p>
            </div>
          ) : (
            <div className="profile-badges-grid">
              {badges.map((badge, idx) => (
                <div key={idx} className="profile-badge-card">
                  <div className="profile-badge-icon">{badge.icon}</div>
                  <div className="profile-badge-name">{badge.title}</div>
                  <div className="profile-badge-desc">{badge.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
