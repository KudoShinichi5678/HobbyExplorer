import React from 'react';
import { X, Scale, ExternalLink, Trash2, MapPin, Calendar } from 'lucide-react';

export function PlannerDrawer({ 
  isOpen, 
  onClose, 
  compareActivities, 
  onRemoveCompare, 
  onClearCompare,
  onSelectActivity 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-compare" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="compare-header">
          <div className="compare-header-left">
            <Scale size={22} className="text-emerald" />
            <div>
              <h3 className="compare-title">Weekend Planner Matrix</h3>
              <p className="compare-subtitle">Compare up to 3 activities side-by-side to plan your perfect free time</p>
            </div>
          </div>
          <div className="compare-header-actions">
            {compareActivities.length > 0 && (
              <button className="btn-clear-compare" onClick={onClearCompare}>
                <Trash2 size={14} />
                <span>Clear All ({compareActivities.length})</span>
              </button>
            )}
            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Matrix */}
        {compareActivities.length === 0 ? (
          <div className="compare-empty-state">
            <Scale size={48} className="empty-icon text-emerald" />
            <h4>No activities selected for comparison yet</h4>
            <p>Click the compare icon on any activity card to add it to your side-by-side planner matrix.</p>
          </div>
        ) : (
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th className="compare-criteria-col">Criteria</th>
                  {compareActivities.map(act => (
                    <th key={act.id} className="compare-job-col">
                      <div className="compare-job-header">
                        <button 
                          className="compare-remove-btn" 
                          onClick={() => onRemoveCompare(act.id)}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                        <div className="compare-company-logo">
                          <img src={act.image} alt={act.title} />
                        </div>
                        <h4 className="compare-job-title" onClick={() => onSelectActivity(act)}>
                          {act.title}
                        </h4>
                        <span className="compare-company-name">{act.organizer}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* 1. Category */}
                <tr>
                  <td className="criteria-label">Category</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <span className="pill-small pill-source">{act.categoryLabel}</span>
                    </td>
                  ))}
                </tr>

                {/* 2. Cost / Budget */}
                <tr>
                  <td className="criteria-label">Cost / Entry Fee</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <strong className="text-highlight text-amber">{act.cost.text}</strong>
                    </td>
                  ))}
                </tr>

                {/* 3. Schedule & Timeframe */}
                <tr>
                  <td className="criteria-label">Schedule & Timeframe</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <div className="table-cell-row">
                        <Calendar size={13} className="text-emerald" />
                        <span><strong>{act.nextDate}</strong></span>
                      </div>
                      <small className="text-muted block mt-1">{act.timeframe}</small>
                    </td>
                  ))}
                </tr>

                {/* 4. Location & Province */}
                <tr>
                  <td className="criteria-label">Location</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <div className="table-cell-row">
                        <MapPin size={13} className="text-sky" />
                        <span>{act.location.name}</span>
                      </div>
                      <small className="text-muted">{act.location.province}, {act.location.country}</small>
                    </td>
                  ))}
                </tr>

                {/* 5. Fitness & Difficulty */}
                <tr>
                  <td className="criteria-label">Difficulty & Fitness</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <span className="font-semibold text-emerald">{act.difficulty}</span>
                      <small className="text-muted block mt-1">{act.fitnessLevel}</small>
                    </td>
                  ))}
                </tr>

                {/* 6. Environment */}
                <tr>
                  <td className="criteria-label">Environment & Setting</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <span>{act.environment}</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Gear / Equipment */}
                <tr>
                  <td className="criteria-label">What to Bring / Gear</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <span className="text-sm">{act.equipmentNeeded}</span>
                    </td>
                  ))}
                </tr>

                {/* 8. Action Link */}
                <tr>
                  <td className="criteria-label">Join / Book</td>
                  {compareActivities.map(act => (
                    <td key={act.id} className="criteria-value">
                      <a 
                        href={act.officialUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="btn-join-primary btn-sm block text-center"
                      >
                        <span>Official Booking</span>
                        <ExternalLink size={13} />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
