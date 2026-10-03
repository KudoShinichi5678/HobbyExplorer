import React from 'react';
import { X, BarChart3, Sparkles, Compass, Calendar } from 'lucide-react';

export function VibeInsightsModal({ isOpen, onClose, allActivities }) {
  if (!isOpen) return null;

  const total = allActivities.length;
  const freeActivities = allActivities.filter(a => a.cost.tier === 'free').length;
  const outdoorActivities = allActivities.filter(a => a.environment.toLowerCase().includes('outdoor')).length;
  const clubActivities = allActivities.filter(a => a.category === 'clubs' || a.category === 'running').length;
  const waterActivities = allActivities.filter(a => a.category === 'water-sports').length;

  // Category counts
  const categoryCounts = allActivities.reduce((acc, act) => {
    acc[act.categoryLabel] = (acc[act.categoryLabel] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  // Vibe tag frequency
  const vibeCounts = allActivities.reduce((acc, act) => {
    act.vibeTags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const topVibeTags = Object.entries(vibeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-analytics" onClick={(e) => e.stopPropagation()}>
        <div className="analytics-header">
          <div className="analytics-title-wrap">
            <BarChart3 size={24} className="text-emerald" />
            <div>
              <h3 className="analytics-title">Weekend Vibe & Activity Insights</h3>
              <p className="analytics-subtitle">
                Synthesized intelligence across {total} outdoor adventures, races, festivals, and social clubs
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Numbers Row */}
        <div className="analytics-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Outdoor Wilderness</span>
            <strong className="stat-val text-emerald">{outdoorActivities}</strong>
            <span className="stat-desc">{Math.round((outdoorActivities/total)*100)}% nature & open air</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">100% Free Events</span>
            <strong className="stat-val text-green">{freeActivities}</strong>
            <span className="stat-desc">Zero cost community meetups</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Clubs & Active Crews</span>
            <strong className="stat-val text-amber">{clubActivities}</strong>
            <span className="stat-desc">Running, board games & peloton</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Ocean & Watersports</span>
            <strong className="stat-val text-sky">{waterActivities}</strong>
            <span className="stat-desc">SUP, climbing, diving & surfing</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-section">
          <div className="section-header-row">
            <Compass size={18} className="text-emerald" />
            <h4 className="section-title">Activity Category Distribution</h4>
          </div>
          <div className="salary-benchmark-bars">
            {sortedCategories.map(([label, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={label} className="benchmark-bar-row">
                  <span className="bar-label">{label}</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill fill-entry" 
                      style={{ width: `${Math.max(pct, 12)}%`, background: 'var(--accent-emerald)' }}
                    ></div>
                  </div>
                  <span className="bar-value">{count} activities ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vibe Tags in Demand */}
        <div className="analytics-section">
          <div className="section-header-row">
            <Sparkles size={18} className="text-amber" />
            <h4 className="section-title">Most Popular Vibe Tags This Season</h4>
          </div>
          <div className="top-skills-cloud">
            {topVibeTags.map(([tag, count]) => (
              <span key={tag} className="skill-count-badge">
                #{tag} <strong className="text-emerald">({count})</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Seasonal Recommendation Alert */}
        <div className="seasonal-tip-card">
          <Calendar size={20} className="text-emerald" />
          <div>
            <strong>Seasonal Pro-Tip: Cool Season Mountain Expeditions</strong>
            <p>
              National Park permits for high mountain ridge treks (such as Khao Chang Phueak and Doi Luang Chiang Dao)
              are open strictly between November and February. Book your slot early through the official DNP portal!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
