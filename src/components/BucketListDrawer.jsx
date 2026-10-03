import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, Eye, Calendar, Download } from 'lucide-react';

export function BucketListDrawer({ 
  isOpen, 
  onClose, 
  savedActivities, 
  onRemoveBookmark, 
  onClearAll,
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
            <Bookmark size={22} className="text-amber" fill="currentColor" />
            <div>
              <h3 className="bookmarks-title">My Weekend Bucket List</h3>
              <p className="bookmarks-subtitle">
                {savedActivities.length} {savedActivities.length === 1 ? 'activity' : 'activities'} saved for your free time
              </p>
            </div>
          </div>
          <div className="bookmarks-actions">
            {savedActivities.length > 0 && (
              <>
                <button 
                  className="btn-clear-compare"
                  onClick={onOpenExport}
                  title="Export bucket list to CSV/JSON"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>
                <button 
                  className="btn-clear-compare btn-danger-subtle"
                  onClick={onClearAll}
                  title="Remove all saved activities"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </>
            )}
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Saved Activities List */}
        {savedActivities.length === 0 ? (
          <div className="compare-empty-state">
            <Bookmark size={48} className="empty-icon text-amber" />
            <h4>Your bucket list is currently empty</h4>
            <p>Click the bookmark icon on any activity card to save it for your upcoming weekend plans.</p>
          </div>
        ) : (
          <div className="saved-jobs-list">
            {savedActivities.map(activity => (
              <div key={activity.id} className="saved-job-item">
                <div className="saved-item-left">
                  <div className="saved-item-avatar" onClick={() => onSelectActivity(activity)}>
                    <img 
                      src={activity.image} 
                      alt={activity.title} 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150';
                      }}
                    />
                  </div>
                  <div className="saved-item-details">
                    <h4 className="saved-item-title" onClick={() => onSelectActivity(activity)}>
                      {activity.title}
                    </h4>
                    <div className="saved-item-meta">
                      <span className="saved-company">{activity.organizer}</span>
                      <span className="meta-dot">•</span>
                      <span className="saved-salary">{activity.cost.text}</span>
                      <span className="meta-dot">•</span>
                      <span className="saved-location">{activity.location.province}</span>
                    </div>
                    <div className="saved-item-tags">
                      <span className="pill-small pill-green">
                        <Calendar size={11} style={{ marginRight: 3, display: 'inline' }} />
                        {activity.nextDate}
                      </span>
                      <span className="pill-small pill-source">{activity.categoryLabel}</span>
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
                    <span>Join</span>
                    <ExternalLink size={12} />
                  </a>
                  <button 
                    className="btn-trash-item"
                    onClick={() => onRemoveBookmark(activity.id)}
                    title="Remove from bucket list"
                  >
                    <Trash2 size={14} />
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
