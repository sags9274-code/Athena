import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'The Altar', to: '/' },
  { label: 'Sacred Covenants', to: '/contracts' },
  { label: 'Sacred Offerings', to: '/wishlist' },
  { label: 'Book of Judgment', to: '/wall-of-shame' },
  { label: 'Daily Devotions', to: '/free-tasks' },
  { label: 'The Reliquary', to: '/store' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, role, avatarUrl } = useAuth();
  const isGoddessOrDev = role === 'goddess' || role === 'developer';

  const handleAuthAction = async () => {
    if (user) {
      await logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <span style={{ fontSize: '1.4rem', color: 'var(--color-gold)' }}>✝</span>
            <span className="navbar__logo-text">Church of Athena</span>
          </div>
          <span className="navbar__logo-subtitle">Divine Wisdom & Power</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isGoddessOrDev && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
              style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}
            >
              The Sanctum
            </NavLink>
          )}
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          <button className="navbar__cta" id="nav-vip-btn" onClick={handleAuthAction}>
            {user ? 'Depart Shrine' : 'Kneel & Authenticate'}
          </button>
          {user ? (
            <Link to="/profile" className="navbar__avatar" id="nav-avatar" title="View Sacred Profile" style={{ overflow: 'hidden' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1rem' }}>{role === 'goddess' ? '👑' : role === 'developer' ? '💻' : '🕯️'}</span>
              )}
            </Link>
          ) : (
            <div className="navbar__avatar" id="nav-avatar">
              <span style={{ fontSize: '1rem' }}>🕯️</span>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            className={`navbar__toggle ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            id="nav-toggle"
          >
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `navbar__mobile-link ${isActive ? 'navbar__mobile-link--active' : ''}`
            }
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        {isGoddessOrDev && (
          <NavLink
            to="/dashboard"
            className="navbar__mobile-link"
            style={{ color: 'var(--color-gold)' }}
            onClick={() => setMobileOpen(false)}
          >
            The Sanctum
          </NavLink>
        )}
        <button className="navbar__cta" style={{ marginTop: '1rem' }} onClick={handleAuthAction}>
          {user ? 'Depart Shrine' : 'Kneel & Authenticate'}
        </button>
      </div>
    </>
  );
}
