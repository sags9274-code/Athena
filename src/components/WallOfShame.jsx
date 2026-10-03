import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

export default function WallOfShame() {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState('');
  const [tag, setTag] = useState('Sinful Penance');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newComment, setNewComment] = useState({});

  const { role, user, username } = useAuth();
  const canEdit = role === 'goddess' || role === 'developer';

  useEffect(() => {
    fetchBookOfJudgment();
  }, [user]);

  const fetchBookOfJudgment = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/wall-of-shame');
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching Book of Judgment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsSubmitting(true);
    try {
      await apiFetch('/api/wall-of-shame', {
        method: 'POST',
        body: JSON.stringify({
          action: 'create_post',
          user_id: user ? user.id : null,
          media_urls: mediaUrl.trim() ? [mediaUrl.trim()] : ['/images/athena-2.jpg'],
          caption: caption.trim(),
          tag: tag.trim() || 'Sinful Penance',
        }),
      });

      setCaption('');
      setMediaUrl('');
      setTag('Sinful Penance');
      fetchBookOfJudgment();
    } catch (err) {
      alert(err.message || 'Error posting to Book of Judgment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (shameId) => {
    if (!window.confirm("Purge this sinner from the Book of Judgment?")) return;
    try {
      await apiFetch('/api/wall-of-shame', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_post', shame_id: shameId }),
      });
      fetchBookOfJudgment();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLikePost = async (shameId) => {
    try {
      await apiFetch('/api/wall-of-shame', {
        method: 'POST',
        body: JSON.stringify({ action: 'like_post', shame_id: shameId }),
      });
      fetchBookOfJudgment();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (shameId) => {
    const text = newComment[shameId]?.trim();
    if (!text) return;

    try {
      await apiFetch('/api/wall-of-shame', {
        method: 'POST',
        body: JSON.stringify({
          action: 'add_comment',
          shame_id: shameId,
          user_id: user ? user.id : null,
          username: username || (user ? user.email.split('@')[0] : 'Penitent'),
          comment_text: text,
        }),
      });

      setNewComment({ ...newComment, [shameId]: '' });
      fetchBookOfJudgment();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page wall-page" id="wall-of-shame-page">
      <div className="wall__container">
        <header className="page__header wall__header">
          <div className="wall__header-badge">
            <span className="wall__header-badge-dot" />
            <span className="wall__header-badge-text">Holy Archive of Transgressions</span>
          </div>
          <h1 className="page__title wall__title" id="wall-title">Book of Judgment</h1>
          <p className="page__subtitle wall__subtitle" id="wall-subtitle">
            The fallen. The unfaithful. Inscribed eternally for divine judgment.
          </p>
        </header>

        {canEdit && (
          <form onSubmit={handleAddEntry} style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h3 style={{ color: 'var(--color-gold)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Inscribe Sinner in Book of Judgment</h3>
            <input
              type="text"
              placeholder="Sinner Name & Transgression Description..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="wishlist__tribute-input"
              style={{ marginBottom: '1rem', width: '100%' }}
              required
            />
            <input
              type="text"
              placeholder="Image URL (optional, defaults to Athena shrine)"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="wishlist__tribute-input"
              style={{ marginBottom: '1rem', width: '100%' }}
            />
            <input
              type="text"
              placeholder="Tag (e.g. Broken Vow, Insufficient Devotion)"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="wishlist__tribute-input"
              style={{ marginBottom: '1rem', width: '100%' }}
            />
            <button type="submit" className="wishlist__tribute-btn" disabled={isSubmitting} style={{ width: '100%' }}>
              {isSubmitting ? 'Inscribing...' : 'Inscribe in Book of Judgment'}
            </button>
          </form>
        )}

        <section className="wall__gallery-section">
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Consulting the Book of Judgment...</p>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>No transgressions currently recorded in the Book of Judgment.</p>
            </div>
          ) : (
            <div className="wall__gallery" id="wall-gallery">
              {posts.map((item) => (
                <article key={item.id} className="wall__card premium-frame">
                  <div className="wall__card-media-container" style={{ position: 'relative' }}>
                    <img
                      src={item.media_urls?.[0] || '/images/athena-2.jpg'}
                      alt="Transgression Evidence"
                      className="wall__card-media-item"
                      loading="lazy"
                    />
                    <span className="wall__card-badge wall__card-badge--exposed" style={{ background: 'var(--color-accent)', color: 'white', position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
                      {item.tag || 'Sinful Penance'}
                    </span>
                    {canEdit && (
                      <button className="wall__card-delete" onClick={() => handleDeletePost(item.id)}>×</button>
                    )}
                  </div>

                  <div className="wall__card-body" style={{ padding: '1rem' }}>
                    <p className="wall__card-caption" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>{item.caption}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Inscribed: {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleLikePost(item.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gold)', fontWeight: 'bold' }}
                      >
                        ❤️ {item.likes_count || 0}
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="wall__comments-section" style={{ borderTop: '1px solid var(--color-border)', padding: '1rem' }}>
                    <div className="wall__comments-list" style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
                      {item.comments && item.comments.length > 0 ? (
                        item.comments.map((c) => (
                          <div key={c.id} style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', marginBottom: '6px' }}>
                            <span style={{ color: 'var(--color-gold)', fontWeight: 'bold', fontSize: '0.85rem' }}>@{c.username}: </span>
                            <span style={{ color: 'var(--color-text-primary)', fontSize: '0.85rem' }}>{c.comment_text}</span>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>No penitent comments yet.</p>
                      )}
                    </div>

                    {user ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Write comment..."
                          className="wishlist__tribute-input"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          value={newComment[item.id] || ''}
                          onChange={(e) => setNewComment({ ...newComment, [item.id]: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(item.id); }}
                        />
                        <button className="wishlist__tribute-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => handleAddComment(item.id)}>
                          Post
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Authenticate to post comments.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
