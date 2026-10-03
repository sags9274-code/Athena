import ProfileCard from './ProfileCard';
import { handleCheckout, THRONE_PAYMENT_URL } from '../utils/checkout';

export default function Hero() {
  return (
    <section className="hero" id="hero-section">
      {/* Background */}
      <div className="hero__bg">
        <img
          src="/images/athena-3.jpg"
          alt="Goddess Athena Cathedral Shrine"
          className="hero__bg-image"
          loading="eager"
        />
        <div className="hero__bg-overlay" />
        <div className="hero__bg-vignette" />
      </div>

      {/* Content Grid */}
      <div className="hero__content">
        {/* Left Column */}
        <div className="hero__left">
          {/* Verified Badge */}
          <div className="hero__badge" id="hero-badge">
            <span className="hero__badge-dot" />
            <span className="hero__badge-text">Holy Church of Goddess Athena</span>
            <span className="hero__badge-check">✦</span>
          </div>

          {/* Main Heading */}
          <div className="hero__heading">
            <h1 className="hero__heading-line1">Kneel Before</h1>
            <p className="hero__heading-line2">Goddess Athena.</p>
          </div>

          {/* Subtext */}
          <p className="hero__subtext">
            Enter the sacred shrine. Bow your head, offer your devotions, and surrender all to Her divine glory.
          </p>

          {/* CTA Buttons */}
          <div className="hero__ctas">
            <button className="hero__cta-primary" id="cta-vip" onClick={() => handleCheckout('Altar Covenant Submission', 200)}>
              <span className="hero__cta-icon">✦</span>
              Pledge to Her Holy Altar
            </button>
            <button className="hero__cta-secondary" id="cta-tribute" onClick={() => handleCheckout('Immediate Offering', 50)}>
              <span className="hero__cta-icon">🕯️</span>
              Offer Sacred Tribute
            </button>
          </div>

          {/* Stats */}
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">Divine Wrath</span>
              <span className="hero__stat-label">Absolute Power</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">Holy Altar</span>
              <span className="hero__stat-label">Sacred Devotion</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">High Priestess</span>
              <span className="hero__stat-label">Eternal Goddess</span>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Card */}
        <div className="hero__right">
          <ProfileCard />
        </div>
      </div>
    </section>
  );
}
