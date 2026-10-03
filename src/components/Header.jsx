import React from 'react';
import { 
  Compass, 
  Bookmark, 
  BarChart3, 
  Scale, 
  Radar, 
  MapPin, 
  Download
} from 'lucide-react';

export function Header({ 
  onOpenRadar, 
  isScanning, 
  savedCount, 
  onOpenBucketList, 
  compareCount, 
  onOpenPlanner,
  onOpenInsights,
  onOpenExport,
  currentLocationName,
  filteredCount
}) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-logo-icon">
            <Compass size={22} className="compass-icon" />
          </div>
          <div>
            <div className="brand-name-row">
              <span className="brand-name">HobbyExplorer</span>
              <span className="brand-badge">Activities & Clubs</span>
            </div>
            <p className="brand-subtitle">Find What To Do • Treks, Marathons, Concerts & Nature</p>
          </div>
        </div>

        {/* Current Location Pill in Header */}
        <div className="header-location-pill" title="Currently exploring around this location">
          <MapPin size={14} className="location-pin-icon" />
          <span className="location-text-bold">{currentLocationName}</span>
          <span className="location-count-badge">{filteredCount} options</span>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Live Activity Radar button */}
          <button 
            className="btn btn-header-action btn-radar"
            onClick={onOpenRadar}
            disabled={isScanning}
            title="Scan nearby clubs, events and weekend adventures"
            aria-label="Activity Radar"
          >
            <Radar size={16} className={isScanning ? 'spinning text-emerald' : 'text-emerald'} />
            <span className="btn-label">{isScanning ? 'Scanning...' : 'Radar'}</span>
          </button>

          {/* Vibe Insights */}
          <button 
            className="btn btn-header-action"
            onClick={onOpenInsights}
            title="View activity trends and weekend analytics"
            aria-label="Activity Insights"
          >
            <BarChart3 size={15} />
            <span className="btn-label">Insights</span>
          </button>

          {/* Planner / Compare */}
          <button 
            className={`btn btn-header-action ${compareCount > 0 ? 'active' : ''}`}
            onClick={onOpenPlanner}
            title="Compare up to 3 activities side-by-side"
            aria-label={`Compare activities (${compareCount} selected)`}
          >
            <Scale size={15} />
            <span className="btn-label">Compare</span>
            {compareCount > 0 && <span className="header-badge">{compareCount}</span>}
          </button>

          {/* Bucket List (Saved) */}
          <button 
            className={`btn btn-header-action ${savedCount > 0 ? 'active' : ''}`}
            onClick={onOpenBucketList}
            title="View your saved bucket list activities"
            aria-label={`Bucket List (${savedCount} saved)`}
          >
            <Bookmark size={15} fill={savedCount > 0 ? 'currentColor' : 'none'} />
            <span className="btn-label">Bucket List</span>
            {savedCount > 0 && <span className="header-badge highlight">{savedCount}</span>}
          </button>

          {/* Export */}
          <button 
            className="btn btn-header-action btn-export-quick"
            onClick={onOpenExport}
            title="Download bucket list / filtered activities to CSV or JSON"
            aria-label="Export activities"
          >
            <Download size={15} />
            <span className="btn-label">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
