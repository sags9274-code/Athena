export default function ProfileCard() {
  return (
    <div className="profile-card premium-frame" id="profile-card">
      {/* Top Badge */}
      <span className="profile-card__badge">High Priestess</span>

      {/* Profile Image */}
      <div className="profile-card__image-wrapper">
        <img
          src="/images/athena-1.jpg"
          alt="Goddess Athena"
          className="profile-card__image"
          loading="eager"
        />
        <div className="profile-card__gradient" />
      </div>

      {/* Info Overlay */}
      <div className="profile-card__info">
        <div className="profile-card__info-text">
          <span className="profile-card__label">HOLY ALTAR OF ATHENA</span>
          <span className="profile-card__name">Goddess Athena</span>
        </div>
        <div className="profile-card__status">
          <div className="profile-card__status-dot profile-card__status-dot--active" />
          <div className="profile-card__status-dot" />
        </div>
      </div>
    </div>
  );
}
