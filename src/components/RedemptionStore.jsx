import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function RedemptionStore() {
  const { user, role } = useAuth();
  
  const [badges, setBadges] = useState([]);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State for Goddess/Dev
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('🕯️');
  const [cost, setCost] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isGoddessOrDev = role === 'goddess' || role === 'developer';

  useEffect(() => {
    fetchReliquary();
  }, [user]);

  const fetchReliquary = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/store');
      setBadges(data.badges || []);

      if (user) {
        const profData = await apiFetch(`/api/profile?user_id=${user.id}`);
        setPointsBalance(profData.points || 0);
        setUserBadges(profData.badges || []);
      }
    } catch (err) {
      console.error('Error fetching reliquary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBadge = async (e) => {
    e.preventDefault();
    if (!title || !icon) return;
    setIsSubmitting(true);

    try {
      await apiFetch('/api/store', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_badge',
          title,
          description: desc,
          icon,
          cost: parseInt(cost, 10),
        }),
      });

      setTitle('');
      setDesc('');
      fetchReliquary();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimBadge = async (badge) => {
    if (!user) {
      alert('You must authenticate to claim sacred relics.');
      return;
    }

    try {
      const data = await apiFetch('/api/store', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          badge_id: badge.id,
          cost: badge.cost,
        }),
      });

      if (data.success) {
        alert(`Sacred Relic Claimed: ${badge.title}`);
        fetchReliquary();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const ownedBadgeIds = new Set(userBadges.map(b => b.id));

  return (
    <div className="page tasks-page" id="store-page">
      <header className="page__header">
        <h1 className="page__title">The Sacred Reliquary</h1>
        <p className="page__subtitle">
          Offer your accumulated devotion points to claim holy relics and marks of divine grace.
        </p>
      </header>

      {/* Points Balance */}
      {user && (
        <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem 3rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', display: 'inline-block' }}>
            <span style={{ display: 'block', fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Available Sacred Points</span>
            <span style={{ display: 'block', fontSize: '3.5rem', color: 'var(--color-gold)', fontFamily: 'var(--font-display)', textShadow: '0 0 20px rgba(201,168,76,0.4)' }}>{pointsBalance}</span>
          </div>
        </section>
      )}

      {/* Goddess Create Badge Form */}
      {isGoddessOrDev && (
        <section style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '1rem' }}>Consecrate New Sacred Relic</h2>
          <form onSubmit={handleAddBadge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Icon (e.g. 🕯️)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                required
                className="wishlist__tribute-input"
              />
              <input
                type="text"
                placeholder="Relic Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="wishlist__tribute-input"
              />
            </div>
            <input
              type="text"
              placeholder="Relic Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="wishlist__tribute-input"
            />
            <input
              type="number"
              placeholder="Point Cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              className="wishlist__tribute-input"
            />
            <button type="submit" className="wishlist__tribute-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Consecrating...' : 'Consecrate Relic'}
            </button>
          </form>
        </section>
      )}

      {/* Relics Storefront */}
      {loading ? (
        <p style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Opening Sacred Reliquary...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {badges.map((badge) => {
            const isOwned = ownedBadgeIds.has(badge.id);
            const canAfford = pointsBalance >= badge.cost;

            return (
              <div
                key={badge.id}
                className="premium-frame"
                style={{
                  background: isOwned ? 'rgba(201,168,76,0.1)' : 'var(--color-bg-card)',
                  border: isOwned ? '1px solid var(--color-gold)' : '1px solid var(--color-border)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {isOwned && (
                  <div style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--color-gold)', fontSize: '1.2rem' }}>
                    ✓ Claimed
                  </div>
                )}
                
                <span style={{ fontSize: '4rem', marginBottom: '1rem', filter: isOwned ? 'drop-shadow(0 0 15px rgba(201,168,76,0.6))' : 'none' }}>
                  {badge.icon}
                </span>
                
                <h3 style={{ color: 'var(--color-text-primary)', fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {badge.title}
                </h3>
                
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>
                  {badge.description}
                </p>

                <div style={{ marginTop: 'auto', width: '100%' }}>
                  <div style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>
                    {badge.cost} Sacred Points
                  </div>

                  {!isOwned ? (
                    <button 
                      onClick={() => handleClaimBadge(badge)}
                      disabled={!canAfford}
                      className="wishlist__tribute-btn"
                      style={{ 
                        opacity: canAfford ? 1 : 0.5, 
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        width: '100%'
                      }}
                    >
                      {canAfford ? 'Claim Relic' : 'Need More Points'}
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="wishlist__tribute-btn"
                      style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', width: '100%' }}
                    >
                      Sacred Relic Claimed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
