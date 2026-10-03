import React from 'react';
import { 
  MapPin, 
  Calendar, 
  Bookmark, 
  Scale, 
  ExternalLink, 
  Eye, 
  Star
} from 'lucide-react';
import { formatDistanceLabel } from '../utils/geoUtils';

export function ActivityCard({ 
  activity, 
  isBookmarked, 
  onToggleBookmark, 
  isCompared, 
  onToggleCompare, 
  onSelectActivity,
  viewMode = 'grid',
  computedDistanceKm
}) {
  const getCostBadge = (tier) => {
    switch(tier) {
      case 'free': return { label: 'Free Event', className: 'tag-free' };
      case 'budget': return { label: 'Budget-Friendly', className: 'tag-budget' };
      case 'moderate': return { label: 'Moderate', className: 'tag-moderate' };
      default: return { label: 'Premium Experience', className: 'tag-premium' };
    }
  };

  const costInfo = getCostBadge(activity.cost.tier);
  const distanceText = formatDistanceLabel(computedDistanceKm ?? activity.distanceFromBkkKm);

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <div className={`activity-list-row ${isCompared ? 'is-compared' : ''}`}>
        <div className="list-col-media">
          <div className="list-thumb-box" onClick={() => onSelectActivity(activity)}>
            <img 
              src={activity.image} 
              alt={activity.title} 
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300';
              }} 
            />
            <span className="list-cat-pill">{activity.categoryLabel}</span>
          </div>
          <div className="list-info-body">
            <div className="list-title-row">
              <h3 className="activity-list-title" onClick={() => onSelectActivity(activity)}>
                {activity.title}
              </h3>
              <div className="list-rating">
                <Star size={13} className="star-icon" fill="currentColor" />
                <span>{activity.rating}</span>
                <span className="rating-count">({activity.reviewsCount})</span>
              </div>
            </div>
            <div className="list-location-meta">
              <span className="organizer-name">{activity.organizer}</span>
              <span className="meta-separator">•</span>
              <span className="location-text">
                <MapPin size={12} />
                {activity.location.name} ({activity.location.province})
              </span>
              <span className="meta-separator">•</span>
              <span className="distance-text-pill">{distanceText}</span>
            </div>
            <div className="list-vibe-tags">
              {activity.vibeTags.slice(0, 3).map(tag => (
                <span key={tag} className="vibe-badge">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="list-col-schedule">
          <div className="schedule-row">
            <Calendar size={13} className="text-emerald" />
            <span className="next-date-text">{activity.nextDate}</span>
          </div>
          <span className="timeframe-sub">{activity.timeframe}</span>
        </div>

        <div className="list-col-cost">
          <span className="cost-highlight">{activity.cost.text}</span>
          <span className={`clean-tag ${costInfo.className}`}>{costInfo.label}</span>
        </div>

        <div className="list-col-actions">
          <button 
            type="button"
            className={`btn-icon ${isBookmarked ? 'saved' : ''}`}
            onClick={() => onToggleBookmark(activity)}
            title={isBookmarked ? 'Remove from bucket list' : 'Add to bucket list'}
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button 
            type="button"
            className={`btn-icon ${isCompared ? 'saved' : ''}`}
            onClick={() => onToggleCompare(activity)}
            title={isCompared ? 'Remove from compare' : 'Compare activity'}
          >
            <Scale size={15} />
          </button>
          <button 
            type="button"
            className="btn-details-sm"
            onClick={() => onSelectActivity(activity)}
          >
            <Eye size={13} />
            <span>Details</span>
          </button>
          <a 
            href={activity.officialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-apply-sm"
            title="Open official organizer or booking page"
          >
            <span>Join</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  // GRID CARD VIEW LAYOUT
  return (
    <div className={`activity-card ${isCompared ? 'is-compared' : ''}`}>
      {/* 1. Media Header with Photo, Category Badge, Rating & Distance */}
      <div className="card-media-wrap" onClick={() => onSelectActivity(activity)}>
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="card-hero-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600';
          }}
        />
        <div className="card-media-overlay"></div>

        {/* Top Badges */}
        <div className="media-top-bar">
          <span className="category-badge-chip">{activity.categoryLabel}</span>
          <div className="rating-badge-chip">
            <Star size={12} fill="currentColor" />
            <span>{activity.rating}</span>
          </div>
        </div>

        {/* Distance Indicator pill floating on image */}
        <div className="media-bottom-bar">
          <div className="distance-indicator">
            <MapPin size={12} />
            <span>{distanceText}</span>
          </div>
          <span className="timing-type-pill">{activity.timeframe}</span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="card-content-body">
        {/* Organizer & Location */}
        <div className="card-organizer-row">
          <span className="organizer-label">{activity.organizer}</span>
          <span className="province-tag">{activity.location.province}</span>
        </div>

        {/* Activity Title */}
        <h3 className="activity-card-title" onClick={() => onSelectActivity(activity)}>
          {activity.title}
        </h3>

        {/* Next Date & Timing */}
        <div className="card-schedule-row">
          <Calendar size={13} className="text-emerald" />
          <span className="date-label">{activity.nextDate}</span>
        </div>

        {/* Cost & Tier */}
        <div className="card-cost-row">
          <span className="cost-main">{activity.cost.text}</span>
          <span className={`clean-tag ${costInfo.className}`}>{costInfo.label}</span>
        </div>

        {/* Vibe Tags */}
        <div className="card-vibe-row">
          {activity.vibeTags.slice(0, 3).map(tag => (
            <span key={tag} className="vibe-chip">#{tag}</span>
          ))}
        </div>
      </div>

      {/* 3. Card Actions Bar */}
      <div className="card-actions-bar">
        <div className="action-buttons-left">
          <button 
            type="button"
            className={`btn-icon ${isBookmarked ? 'saved' : ''}`}
            onClick={() => onToggleBookmark(activity)}
            title={isBookmarked ? 'Remove from bucket list' : 'Add to bucket list'}
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          <button 
            type="button"
            className={`btn-icon ${isCompared ? 'saved' : ''}`}
            onClick={() => onToggleCompare(activity)}
            title={isCompared ? 'Remove from comparison' : 'Compare activity'}
          >
            <Scale size={15} />
          </button>
        </div>

        <div className="action-buttons-right">
          <button 
            type="button"
            className="btn-details"
            onClick={() => onSelectActivity(activity)}
          >
            <Eye size={14} />
            <span>Details</span>
          </button>
          <a 
            href={activity.officialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-join"
          >
            <span>Explore</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
