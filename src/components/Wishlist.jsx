import { useState } from 'react';
import { handleCheckout, THRONE_PAYMENT_URL } from '../utils/checkout';

import handbagImg from '../assets/handbag.png';
import perfumeImg from '../assets/perfume.png';
import getawayImg from '../assets/getaway.png';
import diningImg from '../assets/dining.png';
import spaImg from '../assets/spa.png';
import jewelryImg from '../assets/jewelry.png';
import robeImg from '../assets/robe.png';
import cashImg from '../assets/cash.png';

const SACRED_OFFERINGS = [
  {
    id: 'altar-gold',
    name: 'Altar Gold Offering',
    price: '$2,500',
    numericPrice: 2500,
    priority: 'High',
    image: handbagImg,
  },
  {
    id: 'holy-incense',
    name: 'Sacred Anointing Oils',
    price: '$350',
    numericPrice: 350,
    priority: 'Medium',
    image: perfumeImg,
  },
  {
    id: 'temple-pilgrimage',
    name: 'Temple Pilgrimage Tribute',
    price: '$5,000',
    numericPrice: 5000,
    priority: 'High',
    image: getawayImg,
  },
  {
    id: 'sacred-banquet',
    name: 'Sacred Banquet Feast',
    price: '$500',
    numericPrice: 500,
    priority: 'Medium',
    image: diningImg,
  },
  {
    id: 'sanctuary-rest',
    name: 'Sanctuary Purification Ritual',
    price: '$800',
    numericPrice: 800,
    priority: 'Low',
    image: spaImg,
  },
  {
    id: 'crown-jewels',
    name: 'Sacred Crown Jewels',
    price: '$1,200',
    numericPrice: 1200,
    priority: 'High',
    image: jewelryImg,
  },
  {
    id: 'silk-vestment',
    name: 'Silk High Priestess Vestment',
    price: '$250',
    numericPrice: 250,
    priority: 'Low',
    image: robeImg,
  },
  {
    id: 'cash-tribute',
    name: 'Direct Altar Tribute',
    price: '$100+',
    numericPrice: 100,
    priority: 'Medium',
    image: cashImg,
  },
];

export default function Wishlist() {
  const [customAmount, setCustomAmount] = useState('');

  const handleSendGift = (item) => {
    handleCheckout(`Offering: ${item.name}`, item.numericPrice);
  };

  const handleCustomTribute = (e) => {
    e.preventDefault();
    if (customAmount && !isNaN(customAmount) && Number(customAmount) > 0) {
      handleCheckout('Custom Altar Offering', Number(customAmount));
    } else {
      window.open(THRONE_PAYMENT_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page wishlist-page" id="wishlist-page">
      {/* Page Header */}
      <header className="page__header" id="wishlist-header">
        <h1 className="page__title" id="wishlist-title">
          Sacred Offerings &amp; Altar Tribute
        </h1>
        <p className="page__subtitle" id="wishlist-subtitle">
          Kneel and lay your gifts before Goddess Athena. Generous penitents are granted divine favor.
        </p>
      </header>

      {/* Grid of Wishlist Gift Cards */}
      <div className="wishlist__grid" id="wishlist-grid">
        {SACRED_OFFERINGS.map((item) => (
          <div
            key={item.id}
            className="wishlist__card"
            id={`wishlist-card-${item.id}`}
          >
            <div className="wishlist__card-header">
              <div
                className="wishlist__card-image-container"
                id={`wishlist-image-${item.id}`}
              >
                <img src={item.image} alt={item.name} className="wishlist__card-image" />
              </div>
              <span
                className={`wishlist__card-priority wishlist__card-priority--${item.priority.toLowerCase()} wishlist__badge wishlist__badge--${item.priority.toLowerCase()}`}
                id={`wishlist-badge-${item.id}`}
              >
                {item.priority} Rite
              </span>
            </div>

            <div
              className="wishlist__card-name"
              id={`wishlist-name-${item.id}`}
            >
              {item.name}
            </div>

            <div
              className="wishlist__card-price"
              id={`wishlist-price-${item.id}`}
            >
              {item.price}
            </div>

            <button
              type="button"
              className="wishlist__card-btn"
              id={`wishlist-send-btn-${item.id}`}
              onClick={() => handleSendGift(item)}
            >
              Lay Offering on Altar
            </button>
          </div>
        ))}
      </div>

      {/* Tribute Section */}
      <section
        className="wishlist__tribute"
        id="wishlist-tribute"
      >
        <h2 className="wishlist__tribute-title" id="tribute-title">
          Custom Altar Offering (Throne)
        </h2>

        <form onSubmit={handleCustomTribute} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: 'bold' }}>$</span>
              <input 
                type="number" 
                min="5"
                placeholder="100" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="wishlist__tribute-input" 
                style={{ paddingLeft: '35px', maxWidth: '200px' }}
              />
            </div>
            <button 
              type="submit"
              className="wishlist__tribute-btn"
              style={{ display: 'inline-block', textDecoration: 'none', border: 'none', cursor: 'pointer' }}
            >
              Submit Holy Offering
            </button>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Direct Throne Payment Link: <a href={THRONE_PAYMENT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>{THRONE_PAYMENT_URL}</a>
          </p>
        </form>
      </section>
    </div>
  );
}
