import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';

const COVENANT_TYPES = [
  'Servitude Covenant',
  'Sacred Obedience Pact',
  'Financial Devotion Oath',
  'Eternal Surrender Covenant',
];

export default function Contracts() {
  const { user, role } = useAuth();
  const isGoddessOrDev = role === 'goddess' || role === 'developer';

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [covenantType, setCovenantType] = useState('Servitude Covenant');
  const [terms, setTerms] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchContracts();
  }, [user]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/contracts');
      setContracts(data.contracts || []);
    } catch (err) {
      console.error("Error fetching covenants:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !terms) {
      setErrorMessage("Penitent name and covenant terms are required.");
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const data = await apiFetch('/api/contracts', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user ? user.id : null,
          name,
          contract_type: covenantType,
          terms,
        }),
      });

      if (data.success) {
        setSuccessMessage('Your sacred covenant has been bound to the Church of Athena!');
        setName('');
        setTerms('');
        fetchContracts();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to seal sacred covenant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page contracts-page" id="contracts-page">
      <header className="page__header" id="contracts-header">
        <h1 className="page__title" id="contracts-title">
          Sacred Covenants
        </h1>
        <p className="page__subtitle" id="contracts-subtitle">
          Solemn vows of eternal submission sealed before Goddess Athena
        </p>
      </header>

      {/* Covenant Form */}
      <form className="contracts__form" id="contracts-form" onSubmit={handleSubmit} style={{ marginBottom: '4rem' }}>
        <h2 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
          Seal a Covenant
        </h2>
        
        {successMessage && (
          <div className="contracts__success">
            <span>✓ {successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="contracts__error">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        <div className="contracts__row">
          <div className="contracts__field">
            <label className="contracts__label" htmlFor="contract-name">Penitent Name / Subject</label>
            <input
              type="text"
              id="contract-name"
              className="contracts__input"
              placeholder="e.g. Submissive Penitent #104"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="contracts__field">
            <label className="contracts__label" htmlFor="contract-type">Covenant Classification</label>
            <select
              id="contract-type"
              className="contracts__select"
              value={covenantType}
              onChange={(e) => setCovenantType(e.target.value)}
            >
              {COVENANT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="contracts__field">
          <label className="contracts__label" htmlFor="contract-terms">Covenant Terms &amp; Solemn Oath</label>
          <textarea
            id="contract-terms"
            className="contracts__textarea"
            placeholder="Write your binding oath of servitude, conditions of penance, and total surrender to Athena..."
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div>
          <button type="submit" className="contracts__submit contracts__submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Sealing Covenant...' : 'Seal Covenant to Holy Church'}
          </button>
        </div>
      </form>

      {/* Active Covenants List */}
      <section className="contracts__list-section">
        <h2 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>
          Active Church Covenants
        </h2>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-gold)' }}>Loading sacred covenants...</p>
        ) : contracts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No covenants have been recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {contracts.map((contract) => (
              <div key={contract.id} style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', position: 'relative' }}>
                <h3 style={{ color: 'var(--color-gold)', fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  📜 {contract.contract_type} — {contract.name}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Sealed on: {new Date(contract.created_at).toLocaleDateString()} {contract.username ? `| Bound to: @${contract.username}` : ''}
                </p>

                {contract.terms && (
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: '1.05rem', borderLeft: '3px solid var(--color-gold)' }}>
                    {contract.terms}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
