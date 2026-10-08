import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Bookmark, 
  Scale, 
  CheckCircle, 
  Check, 
  Share2, 
  Sparkles,
  Star,
  Backpack,
  Navigation,
  Globe2,
  ExternalLink,
  Heart
} from 'lucide-react';
import { formatDistanceLabel } from '../utils/geoUtils';

export function ActivityDetailModal({ 
  activity, 
  onClose, 
  isBookmarked, 
  onToggleBookmark, 
  isFavorite,
  onToggleFavorite,
  isCompared, 
  onToggleCompare,
  computedDistanceKm 
}) {
  const [copied, setCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(activity?.image);

  if (!activity) return null;

  const distanceText = formatDistanceLabel(computedDistanceKm ?? activity.distanceFromBkkKm);

  const handleCopy = () => {
    const text = `${activity.title}\nCategory: ${activity.categoryLabel}\nLocation: ${activity.location.name} (${activity.location.province})\nWhen: ${activity.nextDate} (${activity.timeframe})\nCost: ${activity.cost.text}\nLink: ${activity.officialUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const images = [activity.image, ...(activity.gallery || [])];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} title="Close modal">
          <X size={20} />
        </button>

        {/* Source Attribution Alert Banner */}
        <div className="source-attribution-banner">
          <div className="source-attr-left">
            {activity.isUserImported ? (
              <Sparkles size={16} className="text-emerald" />
            ) : (
              <Globe2 size={16} className="text-emerald" />
            )}
            <div>
              <strong>{activity.isUserImported ? 'Community Discovery' : 'Verified Discovery'} • {activity.sourcePlatform}</strong>
              <p className="source-attr-desc">{activity.sourceSnippet}</p>
            </div>
          </div>
          <span className="source-snippet-pill">
            <MapPin size={12} />
            {distanceText}
          </span>
        </div>

        {/* Hero Media Section */}
        <div className="modal-hero-banner">
          <img 
            src={activeImage || activity.image} 
            alt={activity.title} 
            className="modal-banner-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900';
            }}
          />
          <div className="modal-banner-gradient"></div>
          <div className="modal-banner-content">
            <span className="modal-cat-tag">{activity.categoryLabel}</span>
            <h2 className="modal-activity-title">{activity.title}</h2>
            <div className="modal-banner-meta">
              <span className="modal-organizer">{activity.organizer}</span>
              <span className="meta-separator">•</span>
              <div className="modal-rating">
                <Star size={14} className="star-icon" fill="currentColor" />
                <span>{activity.rating} ({activity.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail gallery if multiple images */}
        {images.length > 1 && (
          <div className="modal-gallery-strip">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumbnail"
                className={`gallery-thumb ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))}
          </div>
        )}

        {/* Quick Specs Grid */}
        <div className="specs-highlight-grid">
          <div className="spec-card">
            <span className="spec-label">Schedule / When</span>
            <strong className="spec-val text-emerald">{activity.nextDate}</strong>
            <span className="spec-sub">{activity.timeframe}</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">Cost / Entry</span>
            <strong className="spec-val text-amber">{activity.cost.text}</strong>
            <span className="spec-sub">Tier: {activity.cost.tier.toUpperCase()}</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">Fitness & Difficulty</span>
            <strong className="spec-val text-sky">{activity.difficulty}</strong>
            <span className="spec-sub">{activity.fitnessLevel}</span>
          </div>

          <div className="spec-card">
            <span className="spec-label">Environment & Group</span>
            <strong className="spec-val text-purple">{activity.environment}</strong>
            <span className="spec-sub">{activity.groupSize}</span>
          </div>
        </div>

        {/* Location & Navigation Bar */}
        <div className="modal-location-box">
          <div className="location-box-left">
            <MapPin size={18} className="text-emerald" />
            <div>
              <h4 className="loc-headline">{activity.location.name}</h4>
              <p className="loc-subtext">{activity.location.province}, {activity.location.country} • {distanceText}</p>
            </div>
          </div>
          <a 
            href={activity.location.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-open-maps"
          >
            <Navigation size={14} />
            <span>Open in Google Maps</span>
          </a>
        </div>

        {/* Gear / What to Bring Box */}
        {activity.equipmentNeeded && (
          <div className="gear-advisory-box">
            <div className="gear-header">
              <Backpack size={16} className="text-amber" />
              <strong>Recommended Gear & What to Bring:</strong>
            </div>
            <p className="gear-text">{activity.equipmentNeeded}</p>
          </div>
        )}

        {/* Overview Narrative */}
        <div className="modal-narrative-section">
          <h4 className="section-title">About this Experience</h4>
          <p className="narrative-body">{activity.description}</p>
        </div>

        {/* Highlights */}
        {activity.highlights && activity.highlights.length > 0 && (
          <div className="modal-highlights-section">
            <h4 className="section-title">Key Highlights</h4>
            <div className="highlights-list">
              {activity.highlights.map((item, idx) => (
                <div key={idx} className="highlight-item">
                  <Sparkles size={15} className="highlight-icon text-amber" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Included Perks */}
        {activity.includedPerks && activity.includedPerks.length > 0 && (
          <div className="modal-perks-section">
            <h4 className="section-title">What's Included</h4>
            <div className="perks-list">
              {activity.includedPerks.map((perk, idx) => (
                <div key={idx} className="perk-item">
                  <CheckCircle size={15} className="text-emerald" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="modal-actions-footer">
          <div className="footer-left-buttons">
            {/* Favorite Action Button */}
            <button 
              type="button"
              className={`btn btn-modal-action ${isFavorite ? 'saved-rose' : ''}`}
              onClick={() => onToggleFavorite(activity)}
              title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
            >
              <Heart size={15} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'text-rose' : ''} />
              <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            {/* Bucket List Action Button */}
            <button 
              type="button"
              className={`btn btn-modal-action ${isBookmarked ? 'saved' : ''}`}
              onClick={() => onToggleBookmark(activity)}
            >
              <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? 'Saved in Bucket List' : 'Add to Bucket List'}</span>
            </button>

            <button 
              type="button"
              className={`btn btn-modal-action ${isCompared ? 'saved' : ''}`}
              onClick={() => onToggleCompare(activity)}
            >
              <Scale size={15} />
              <span>{isCompared ? 'In Planner' : 'Add to Compare'}</span>
            </button>

            <button 
              type="button"
              className="btn btn-modal-action"
              onClick={handleCopy}
              title="Copy activity summary to clipboard"
            >
              {copied ? <Check size={15} className="text-emerald" /> : <Share2 size={15} />}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          <a 
            href={activity.officialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-join-primary"
          >
            <span>Visit Official Page / Book</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
