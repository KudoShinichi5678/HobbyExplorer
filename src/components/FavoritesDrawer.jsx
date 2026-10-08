import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Calendar, 
  Download,
  Sparkles,
  MapPin
} from 'lucide-react';

export function FavoritesDrawer({ 
  isOpen, 
  onClose, 
  favoriteActivities, 
  onRemoveFavorite, 
  onClearAllFavorites,
  onSelectActivity,
  onOpenExport
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-bookmarks" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bookmarks-header">
          <div className="bookmarks-title-wrap">
            <Heart size={22} className="text-rose" fill="currentColor" />
            <div>
              <h3 className="bookmarks-title">My Favorite Hobbies</h3>
              <p className="bookmarks-subtitle">
                {favoriteActivities.length} {favoriteActivities.length === 1 ? 'hobby' : 'hobbies'} saved in your favorites collection
              </p>
            </div>
          </div>

          <div className="bookmarks-actions">
            {favoriteActivities.length > 0 && (
              <>
                <button 
                  className="btn-clear-compare"
                  onClick={onOpenExport}
                  title="Export favorites to CSV or JSON"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
                <button 
                  className="btn-clear-compare btn-danger-subtle"
                  onClick={onClearAllFavorites}
                  title="Remove all favorited hobbies"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </>
            )}
            <button className="modal-close-btn" onClick={onClose} title="Close drawer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Favorite Activities List */}
        {favoriteActivities.length === 0 ? (
          <div className="compare-empty-state">
            <Heart size={48} className="empty-icon text-rose" />
            <h4>No favorite hobbies yet</h4>
            <p>
              Click the heart icon on any hobby card to mark it as a favorite so you can find it easily anytime!
            </p>
          </div>
        ) : (
          <div className="saved-jobs-list">
            {favoriteActivities.map(activity => (
              <div key={activity.id} className="saved-job-item">
                <div className="saved-item-left">
                  <div 
                    className="saved-item-avatar" 
                    onClick={() => onSelectActivity(activity)}
                    title="Click to view details"
                  >
                    <img 
                      src={activity.image} 
                      alt={activity.title} 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150';
                      }} 
                    />
                  </div>
                  <div className="saved-item-details">
                    <h4 
                      className="saved-item-title" 
                      onClick={() => onSelectActivity(activity)}
                    >
                      {activity.title}
                    </h4>
                    <div className="saved-item-meta">
                      <span className="saved-company">{activity.organizer}</span>
                      <span className="meta-dot">•</span>
                      <span className="saved-salary">{activity.cost.text}</span>
                      <span className="meta-dot">•</span>
                      <span className="saved-location">
                        <MapPin size={11} style={{ display: 'inline', marginRight: 2 }} />
                        {activity.location.province}
                      </span>
                    </div>
                    <div className="saved-item-tags">
                      <span className="pill-small pill-green">
                        <Calendar size={11} style={{ marginRight: 3, display: 'inline' }} />
                        {activity.nextDate}
                      </span>
                      <span className="pill-small pill-source">{activity.categoryLabel}</span>
                      {activity.isUserImported && (
                        <span className="pill-small pill-imported">
                          <Sparkles size={10} style={{ marginRight: 2, display: 'inline' }} />
                          Imported
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="saved-item-actions">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => onSelectActivity(activity)}
                    title="View full details"
                  >
                    <Eye size={14} />
                  </button>
                  <a 
                    href={activity.officialUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn btn-apply-primary btn-sm"
                    title="Open official organizer page"
                  >
                    <span>Explore</span>
                    <ExternalLink size={12} />
                  </a>
                  <button 
                    className="btn-trash-item"
                    onClick={() => onRemoveFavorite(activity.id)}
                    title="Remove from favorites"
                  >
                    <Heart size={15} fill="currentColor" className="text-rose" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
