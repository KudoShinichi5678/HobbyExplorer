import React, { useState } from 'react';
import { 
  Search, 
  X, 
  MapPin, 
  Compass, 
  Navigation, 
  SlidersHorizontal, 
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mountain,
  Flame,
  Music,
  Sparkles,
  Users,
  Trees,
  Eye,
  Waves
} from 'lucide-react';
import { 
  ACTIVITY_CATEGORIES, 
  DISTANCE_SCOPES, 
  TIMING_OPTIONS, 
  BUDGET_OPTIONS, 
  ENVIRONMENT_OPTIONS,
  POPULAR_KEYWORDS 
} from '../data/filterOptions';

// Helper mapping for category icons
const CATEGORY_ICONS = {
  Compass,
  Mountain,
  Flame,
  Music,
  Sparkles,
  Users,
  Trees,
  Eye,
  Waves
};

export function FilterControls({
  filters,
  onFilterChange,
  onResetFilters,
  onDetectGPS,
  isDetectingGPS
}) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleKeywordChange = (e) => {
    onFilterChange('keyword', e.target.value);
  };

  const clearKeyword = () => {
    onFilterChange('keyword', '');
  };

  const handleQuickKeyword = (kw) => {
    if (filters.keyword.toLowerCase().includes(kw.toLowerCase())) {
      onFilterChange('keyword', '');
    } else {
      onFilterChange('keyword', kw);
    }
  };

  // Calculate active filter count
  const activeCount = [
    filters.category !== 'all',
    filters.location !== 'all',
    filters.distanceScope !== 'all',
    filters.timing !== 'all',
    filters.budget !== 'all',
    filters.environment !== 'all',
    filters.keyword.trim() !== ''
  ].filter(Boolean).length;

  const hasAdvancedActive = [
    filters.distanceScope !== 'all',
    filters.environment !== 'all',
    filters.timing !== 'all'
  ].some(Boolean);

  return (
    <div className="filter-card">
      {/* Row 1: Search Bar & Desired Location Selector */}
      <div className="filter-search-row">
        {/* Search Bar */}
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text"
            className="search-input"
            placeholder="Search activities, marathons, treks, secret spots, clubs (e.g. Ridge trek, Jazz, Board games)..."
            value={filters.keyword}
            onChange={handleKeywordChange}
          />
          {filters.keyword && (
            <button className="search-clear-btn" onClick={clearKeyword} title="Clear search">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Desired Location Bar with GPS Detection */}
        <div className="location-control-wrap">
          <div className="location-select-box">
            <MapPin size={16} className="loc-icon" />
            <select 
              className="location-select"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
            >
              <optgroup label="Explorer Mode">
                <option value="all">🌏 All Locations (Nationwide & Beyond)</option>
                <option value="current">📍 My Current Location (GPS / Near Me)</option>
              </optgroup>
              <optgroup label="Central & Bangkok">
                <option value="bangkok">Bangkok (CBD & Greater City)</option>
                <option value="nonthaburi">Nonthaburi & Koh Kret</option>
                <option value="samut-songkhram">Samut Songkhram (Canals & Mangrove)</option>
              </optgroup>
              <optgroup label="Western Mountains">
                <option value="kanchanaburi">Kanchanaburi (Ridge Peaks & Waterfalls)</option>
                <option value="phetchaburi">Phetchaburi (Kaeng Krachan Dark Sky)</option>
              </optgroup>
              <optgroup label="Eastern Coast">
                <option value="chonburi">Chonburi & Bangsaen (Marathon Hub)</option>
                <option value="pattaya">Pattaya (The Fields & Festivals)</option>
              </optgroup>
              <optgroup label="Northern Highlands">
                <option value="chiangmai">Chiang Mai (Old Town & Cloud Peaks)</option>
                <option value="nan">Nan & Pua (Rice Terraces Retreat)</option>
                <option value="mae-hong-son">Mae Hong Son (1,864 Curves Loop)</option>
              </optgroup>
              <optgroup label="Southern Islands & Sea">
                <option value="krabi">Krabi (Railay Rock Climbing & Sea)</option>
                <option value="phuket">Phuket (Promthep Cape & Wellness)</option>
                <option value="phang-nga">Phang Nga (Similan Islands Liveaboard)</option>
              </optgroup>
              <optgroup label="International Getaways">
                <option value="tokyo">Tokyo, Japan (Old Town & Culture)</option>
                <option value="bali">Bali, Indonesia (Sunset Surf & Ocean)</option>
              </optgroup>
            </select>
          </div>

          {/* Quick GPS Auto-Detect Button */}
          <button 
            type="button" 
            className={`btn-gps-detect ${filters.location === 'current' ? 'active' : ''}`}
            onClick={onDetectGPS}
            disabled={isDetectingGPS}
            title="Auto-detect current GPS coordinates"
          >
            <Navigation size={14} className={isDetectingGPS ? 'spinning' : ''} />
            <span>{isDetectingGPS ? 'Locating...' : 'Near Me'}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Category Scroll Bar */}
      <div className="categories-scroll-row">
        {ACTIVITY_CATEGORIES.map(cat => {
          const IconComp = CATEGORY_ICONS[cat.icon] || Compass;
          const isActive = filters.category === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`category-pill-btn ${isActive ? 'active' : ''}`}
              onClick={() => onFilterChange('category', cat.id)}
              title={cat.desc}
            >
              <IconComp size={15} className="cat-icon" />
              <span className="cat-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Row 3: Primary Dropdown Filters */}
      <div className="filter-dropdowns-row">
        {/* 1. Distance Scope */}
        <div className="filter-select-wrap">
          <label className="select-label">Distance / Radius</label>
          <select 
            className="clean-select"
            value={filters.distanceScope}
            onChange={(e) => onFilterChange('distanceScope', e.target.value)}
          >
            {DISTANCE_SCOPES.map(d => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Timing / When */}
        <div className="filter-select-wrap">
          <label className="select-label">Timing / Free Time</label>
          <select 
            className="clean-select"
            value={filters.timing}
            onChange={(e) => onFilterChange('timing', e.target.value)}
          >
            {TIMING_OPTIONS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* 3. Budget */}
        <div className="filter-select-wrap">
          <label className="select-label">Budget / Cost</label>
          <select 
            className="clean-select"
            value={filters.budget}
            onChange={(e) => onFilterChange('budget', e.target.value)}
          >
            {BUDGET_OPTIONS.map(b => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* 4. Environment */}
        <div className="filter-select-wrap">
          <label className="select-label">Environment</label>
          <select 
            className="clean-select"
            value={filters.environment}
            onChange={(e) => onFilterChange('environment', e.target.value)}
          >
            {ENVIRONMENT_OPTIONS.map(env => (
              <option key={env.id} value={env.id}>{env.label}</option>
            ))}
          </select>
        </div>

        {/* Filter Controls Actions */}
        <div className="filter-actions-wrap">
          <button 
            type="button"
            className={`btn-more-filters ${showMoreFilters || hasAdvancedActive ? 'active' : ''}`}
            onClick={() => setShowMoreFilters(prev => !prev)}
          >
            <SlidersHorizontal size={14} />
            <span>Options</span>
            {hasAdvancedActive && <span className="active-dot" />}
            {showMoreFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {activeCount > 0 && (
            <button 
              type="button" 
              className="btn-reset-clean" 
              onClick={onResetFilters}
              title="Reset all filters to default"
            >
              <RotateCcw size={13} />
              <span>Reset ({activeCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 4: Popular Quick Keywords Chips */}
      <div className="quick-tags-bar">
        <span className="quick-tags-title">Quick Picks:</span>
        <div className="quick-tags-list">
          {POPULAR_KEYWORDS.map(kw => {
            const isSelected = filters.keyword.toLowerCase().includes(kw.toLowerCase());
            return (
              <button
                key={kw}
                type="button"
                className={`quick-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleQuickKeyword(kw)}
              >
                {kw}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
