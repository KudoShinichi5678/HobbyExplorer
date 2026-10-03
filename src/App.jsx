import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterControls } from './components/FilterControls';
import { PresetBar } from './components/PresetBar';
import { ActivityCard } from './components/ActivityCard';
import { ActivityDetailModal } from './components/ActivityDetailModal';
import { RadarSyncModal } from './components/RadarSyncModal';
import { PlannerDrawer } from './components/PlannerDrawer';
import { BucketListDrawer } from './components/BucketListDrawer';
import { VibeInsightsModal } from './components/VibeInsightsModal';
import { ExportModal } from './components/ExportModal';
import { INITIAL_ACTIVITIES } from './data/mockActivities';
import { DESIRED_LOCATIONS } from './data/filterOptions';
import { calculateDistanceKm, getCurrentLocationCoordinates } from './utils/geoUtils';
import './App.css';
import { 
  SearchX, 
  RotateCcw, 
  BellRing,
  ArrowUp,
  LayoutGrid,
  List,
  ArrowUpDown,
  Compass
} from 'lucide-react';

const DEFAULT_FILTERS = {
  keyword: '',
  category: 'all',
  location: 'all',
  distanceScope: 'all',
  timing: 'all',
  budget: 'all',
  environment: 'all'
};

export default function App() {
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'distance' | 'rating' | 'cost-asc'
  const [activePresetId, setActivePresetId] = useState(null);

  // User Coordinates for dynamic distance calculation
  const [userCoords, setUserCoords] = useState({ lat: 13.7563, lng: 100.5018 }); // Default Bangkok center
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsLocationName, setGpsLocationName] = useState('Bangkok (Default)');

  // Modals and Drawers
  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [isBucketListOpen, setIsBucketListOpen] = useState(false);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Bucket list state with localStorage persistence
  const [savedActivities, setSavedActivities] = useState(() => {
    try {
      const stored = localStorage.getItem('hobbyexplorer_saved_activities');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Comparison / Planner state (max 3)
  const [compareActivities, setCompareActivities] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notification, setNotification] = useState(null);

  // Save bucket list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hobbyexplorer_saved_activities', JSON.stringify(savedActivities));
    } catch {}
  }, [savedActivities]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3200);
  };

  // Auto-detect browser GPS coordinates
  const handleDetectGPS = async () => {
    setIsDetectingGPS(true);
    try {
      const coords = await getCurrentLocationCoordinates();
      setUserCoords(coords);
      setGpsLocationName('Near My Current Location (GPS)');
      setFilters(prev => ({ ...prev, location: 'current' }));
      showToast('GPS position acquired! Distances recalculated.', 'success');
    } catch {
      showToast('Could not access GPS. Using chosen destination instead.', 'warning');
    } finally {
      setIsDetectingGPS(false);
    }
  };

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setActivePresetId(null);
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // If user selected a known location from dropdown, update userCoords center
      if (key === 'location') {
        const found = DESIRED_LOCATIONS.find(l => l.id === value);
        if (found && found.lat != null && found.lng != null) {
          setUserCoords({ lat: found.lat, lng: found.lng });
          setGpsLocationName(found.label.split('(')[0].trim());
        }
      }
      return updated;
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setActivePresetId(null);
    setUserCoords({ lat: 13.7563, lng: 100.5018 });
    setGpsLocationName('All Locations');
    showToast('Filters reset to default');
  };

  // Select 1-click Preset
  const handleSelectPreset = (preset) => {
    setActivePresetId(preset.id);
    setFilters(prev => ({
      ...prev,
      ...preset.filters
    }));
    showToast(`Applied preset: ${preset.name}`, 'success');
  };

  // Toggle bookmark in bucket list
  const handleToggleBookmark = (activity) => {
    const exists = savedActivities.some(a => a.id === activity.id);
    if (exists) {
      setSavedActivities(prev => prev.filter(a => a.id !== activity.id));
      showToast('Removed from bucket list');
    } else {
      setSavedActivities(prev => [activity, ...prev]);
      showToast('Added to your weekend bucket list!', 'success');
    }
  };

  // Toggle compare activity
  const handleToggleCompare = (activity) => {
    const exists = compareActivities.some(a => a.id === activity.id);
    if (exists) {
      setCompareActivities(prev => prev.filter(a => a.id !== activity.id));
      showToast('Removed from planner matrix');
    } else {
      if (compareActivities.length >= 3) {
        showToast('You can compare a maximum of 3 activities at once.', 'warning');
        return;
      }
      setCompareActivities(prev => [...prev, activity]);
      showToast(`Added to comparison (${compareActivities.length + 1}/3)`, 'success');
    }
  };

  // Active location label
  const currentLocationLabel = useMemo(() => {
    if (filters.location === 'all') return 'All Locations (Worldwide)';
    if (filters.location === 'current') return gpsLocationName;
    const found = DESIRED_LOCATIONS.find(l => l.id === filters.location);
    return found ? found.label.split('(')[0].trim() : 'Custom Location';
  }, [filters.location, gpsLocationName]);

  // Filter & Sort evaluation logic
  const displayedActivities = useMemo(() => {
    // 1. Calculate dynamic distance for each activity based on userCoords
    const withDistance = activities.map(act => {
      const dist = calculateDistanceKm(
        userCoords.lat,
        userCoords.lng,
        act.location.lat,
        act.location.lng
      );
      return {
        ...act,
        computedDistanceKm: dist ?? act.distanceFromBkkKm
      };
    });

    // 2. Filter matches
    const matched = withDistance.filter(act => {
      // Keyword search
      if (filters.keyword.trim() !== '') {
        const query = filters.keyword.toLowerCase();
        const inTitle = act.title.toLowerCase().includes(query);
        const inCat = act.categoryLabel.toLowerCase().includes(query);
        const inOrg = act.organizer.toLowerCase().includes(query);
        const inDesc = act.description.toLowerCase().includes(query);
        const inLoc = act.location.name.toLowerCase().includes(query);
        const inProv = act.location.province.toLowerCase().includes(query);
        const inVibes = act.vibeTags.some(t => t.toLowerCase().includes(query));
        const inGear = act.equipmentNeeded ? act.equipmentNeeded.toLowerCase().includes(query) : false;
        if (!inTitle && !inCat && !inOrg && !inDesc && !inLoc && !inProv && !inVibes && !inGear) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && act.category !== filters.category) {
        return false;
      }

      // Location match
      if (filters.location !== 'all' && filters.location !== 'current') {
        if (act.location.region !== filters.location) {
          return false;
        }
      }

      // Distance scope filter
      if (filters.distanceScope !== 'all') {
        const dist = act.computedDistanceKm;
        if (filters.distanceScope === 'in-city' && dist > 30) return false;
        if (filters.distanceScope === 'day-trip' && dist > 150) return false;
        if (filters.distanceScope === 'weekend-trip' && (dist < 30 || dist > 450)) return false;
        if (filters.distanceScope === 'expedition' && dist < 450) return false;
      }

      // Timing filter
      if (filters.timing !== 'all' && act.timingType !== filters.timing) {
        return false;
      }

      // Budget filter
      if (filters.budget !== 'all' && act.cost.tier !== filters.budget) {
        return false;
      }

      // Environment filter
      if (filters.environment !== 'all') {
        const isOutdoor = act.environment.toLowerCase().includes('outdoor');
        if (filters.environment === 'outdoor' && !isOutdoor) return false;
        if (filters.environment === 'indoor' && isOutdoor) return false;
      }

      return true;
    });

    // 3. Sort matches
    const sorted = [...matched].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.computedDistanceKm - b.computedDistanceKm;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      }
      if (sortBy === 'cost-asc') {
        return a.cost.amount - b.cost.amount;
      }
      if (sortBy === 'cost-desc') {
        return b.cost.amount - a.cost.amount;
      }
      // 'recommended': high rating first with featured variety
      return b.rating - a.rating;
    });

    return sorted;
  }, [activities, filters, sortBy, userCoords]);

  const handleRadarComplete = () => {
    showToast('Radar sweep complete! Fresh weekend activities synced.', 'success');
  };

  return (
    <div className="app-shell">
      {/* Toast Notification */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          <BellRing size={16} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <Header 
        onOpenRadar={() => setIsRadarOpen(true)}
        isScanning={isRadarOpen}
        savedCount={savedActivities.length}
        onOpenBucketList={() => setIsBucketListOpen(true)}
        compareCount={compareActivities.length}
        onOpenPlanner={() => setIsPlannerOpen(true)}
        onOpenInsights={() => setIsInsightsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        currentLocationName={currentLocationLabel}
        totalCount={activities.length}
        filteredCount={displayedActivities.length}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Curated Vibe Inspiration Preset Bar */}
        <PresetBar 
          activePresetId={activePresetId}
          onSelectPreset={handleSelectPreset}
          onResetFilters={handleResetFilters}
        />

        {/* Search, Desired Location & Facet Filter Controls */}
        <FilterControls 
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onDetectGPS={handleDetectGPS}
          isDetectingGPS={isDetectingGPS}
        />

        {/* Activities Feed Section */}
        <section className="jobs-feed-section">
          {/* Feed Controls Header */}
          <div className="feed-header-bar">
            <div className="feed-count-wrap">
              <span className="count-number">{displayedActivities.length}</span>
              <span className="count-label">
                {displayedActivities.length === 1 ? 'activity available' : 'activities available'}
              </span>
              <span className="scope-indicator">
                near {currentLocationLabel}
              </span>
            </div>

            <div className="feed-toolbar-right">
              {/* Sort Dropdown */}
              <div className="sort-wrap">
                <ArrowUpDown size={14} className="sort-icon" />
                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recommended">Sort: Curated / Top Rated</option>
                  <option value="distance">Sort: Closest Distance</option>
                  <option value="cost-asc">Sort: Lowest Cost / Free First</option>
                  <option value="cost-desc">Sort: Premium Experience</option>
                  <option value="rating">Sort: Highest Review Count</option>
                </select>
              </div>

              {/* View Switcher: Grid vs List */}
              <div className="view-mode-toggle">
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid Cards View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Compact List View"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Activities Feed / Empty State */}
          {displayedActivities.length === 0 ? (
            <div className="empty-state-clean">
              <SearchX size={48} className="empty-icon text-emerald" />
              <h3>No activities match your current criteria</h3>
              <p>Try widening your distance radius, changing your desired destination, or clearing search keywords.</p>
              <button className="btn-clean-reset" onClick={handleResetFilters}>
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'clean-jobs-grid' : 'clean-jobs-list'}>
              {displayedActivities.map(activity => (
                <ActivityCard 
                  key={activity.id}
                  activity={activity}
                  viewMode={viewMode}
                  computedDistanceKm={activity.computedDistanceKm}
                  isBookmarked={savedActivities.some(a => a.id === activity.id)}
                  onToggleBookmark={handleToggleBookmark}
                  isCompared={compareActivities.some(a => a.id === activity.id)}
                  onToggleCompare={handleToggleCompare}
                  onSelectActivity={setSelectedActivity}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          <ArrowUp size={16} />
        </button>
      )}

      {/* Footer */}
      <footer className="clean-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Compass size={18} className="text-emerald" />
            <span>HobbyExplorer</span>
          </div>
          <p>© 2026 HobbyExplorer • Dedicated discovery engine for hobbies, outdoor treks, marathons, concerts, and clubs</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {selectedActivity && (
        <ActivityDetailModal 
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          isBookmarked={savedActivities.some(a => a.id === selectedActivity.id)}
          onToggleBookmark={handleToggleBookmark}
          isCompared={compareActivities.some(a => a.id === selectedActivity.id)}
          onToggleCompare={handleToggleCompare}
          computedDistanceKm={selectedActivity.computedDistanceKm}
        />
      )}

      <RadarSyncModal 
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        onSyncComplete={handleRadarComplete}
        currentLocName={currentLocationLabel}
      />

      <PlannerDrawer 
        isOpen={isPlannerOpen}
        onClose={() => setIsPlannerOpen(false)}
        compareActivities={compareActivities}
        onRemoveCompare={(id) => setCompareActivities(prev => prev.filter(a => a.id !== id))}
        onClearCompare={() => {
          setCompareActivities([]);
          showToast('Comparison planner cleared');
        }}
        onSelectActivity={(act) => {
          setIsPlannerOpen(false);
          setSelectedActivity(act);
        }}
      />

      <BucketListDrawer 
        isOpen={isBucketListOpen}
        onClose={() => setIsBucketListOpen(false)}
        savedActivities={savedActivities}
        onRemoveBookmark={(id) => setSavedActivities(prev => prev.filter(a => a.id !== id))}
        onClearAll={() => {
          setSavedActivities([]);
          showToast('Bucket list cleared');
        }}
        onSelectActivity={(act) => {
          setIsBucketListOpen(false);
          setSelectedActivity(act);
        }}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <VibeInsightsModal 
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        allActivities={activities}
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filteredActivities={displayedActivities}
        savedActivities={savedActivities}
      />
    </div>
  );
}
