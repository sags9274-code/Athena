import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

export default function Dashboard() {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  
  const isGoddessOrDev = role === 'goddess' || role === 'developer';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSubs: 0,
    totalTasksCompleted: 0,
    totalShamePosts: 0,
  });
  const [subs, setSubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && !isGoddessOrDev) {
      navigate('/');
    } else if (user && isGoddessOrDev) {
      fetchDashboardData();
    }
  }, [user, role, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/dashboard');
      setStats(data.stats || { totalSubs: 0, totalTasksCompleted: 0, totalShamePosts: 0 });
      setSubs(data.subs || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubs = subs.filter(sub => 
    (sub.email && sub.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (sub.username && sub.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    sub.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isGoddessOrDev) return null;

  return (
    <div className="page dashboard-page" style={{ paddingTop: '100px', minHeight: '100vh', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header className="page__header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="page__title" style={{ color: 'var(--color-gold)' }}>The Holy Sanctum</h1>
        <p className="page__subtitle">High Priestess &amp; Admin Dashboard — Oversee all subjects and devotions.</p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Opening the Holy Sanctum...</p>
      ) : (
        <>
          {/* Top Stats */}
          <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="dashboard-stat-card">
              <h3>Bound Penitents</h3>
              <p className="dashboard-stat-value">{stats.totalSubs}</p>
            </div>
            <div className="dashboard-stat-card">
              <h3>Rites Performed</h3>
              <p className="dashboard-stat-value">{stats.totalTasksCompleted}</p>
            </div>
            <div className="dashboard-stat-card">
              <h3>Book of Judgment Entries</h3>
              <p className="dashboard-stat-value">{stats.totalShamePosts}</p>
            </div>
          </div>

          {/* Subs Roster */}
          <div className="dashboard-table-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ color: 'var(--color-gold)', margin: 0, fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Penitents Roster</h2>
              <input 
                type="text" 
                placeholder="Search by username or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="wishlist__tribute-input"
                style={{ width: '100%', maxWidth: '300px' }}
              />
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Penitent User / ID</th>
                    <th>Pledged Date</th>
                    <th>Rites Performed</th>
                    <th>Points Earned</th>
                    <th>Points Redeemed</th>
                    <th>Sacred Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.length > 0 ? (
                    filteredSubs.map(sub => (
                      <tr key={sub.id}>
                        <td data-label="Sub">
                          <div style={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>@{sub.username}</div>
                          {sub.email && <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{sub.email}</div>}
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{sub.id}</div>
                        </td>
                        <td data-label="Joined">{sub.joined}</td>
                        <td data-label="Tasks">{sub.tasksCompleted}</td>
                        <td data-label="Earned" style={{ color: 'var(--color-gold)' }}>+{sub.earned}</td>
                        <td data-label="Spent" style={{ color: 'var(--color-accent)' }}>-{sub.spent}</td>
                        <td data-label="Balance" style={{ fontWeight: 'bold' }}>{sub.earned - sub.spent}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                        No penitents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
