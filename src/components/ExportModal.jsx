import React from 'react';
import { X, Download, FileSpreadsheet, FileCode } from 'lucide-react';
import { exportActivitiesToCSV, exportActivitiesToJSON } from '../utils/exportUtils';

export function ExportModal({ 
  isOpen, 
  onClose, 
  filteredActivities = [], 
  savedActivities = [],
  favoriteActivities = []
}) {
  if (!isOpen) return null;

  const handleExport = (format, dataset) => {
    let data = filteredActivities;
    if (dataset === 'saved') data = savedActivities;
    else if (dataset === 'favorites') data = favoriteActivities;

    const name = `hobby-explorer-${dataset}-${new Date().toISOString().slice(0, 10)}`;
    if (format === 'csv') {
      exportActivitiesToCSV(data, `${name}.csv`);
    } else {
      exportActivitiesToJSON(data, `${name}.json`);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-export" onClick={(e) => e.stopPropagation()}>
        <div className="export-header">
          <div className="export-title-wrap">
            <Download size={22} className="text-emerald" />
            <div>
              <h3 className="export-title">Export Weekend Plans & Activities</h3>
              <p className="export-subtitle">Download your filtered discoveries, bucket list, or favorites</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="export-options-grid">
          {/* Option 1: CSV Export */}
          <div className="export-option-card">
            <div className="opt-icon-wrap">
              <FileSpreadsheet size={28} className="text-emerald" />
            </div>
            <h4>Excel / CSV Spreadsheet</h4>
            <p>Full formatted spreadsheet compatible with Microsoft Excel, Google Sheets, and Apple Numbers.</p>
            
            <div className="opt-btn-group">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleExport('csv', 'filtered')}
                disabled={filteredActivities.length === 0}
              >
                Export Filtered ({filteredActivities.length})
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => handleExport('csv', 'favorites')}
                disabled={favoriteActivities.length === 0}
              >
                Export Favorites ({favoriteActivities.length})
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => handleExport('csv', 'saved')}
                disabled={savedActivities.length === 0}
              >
                Export Bucket List ({savedActivities.length})
              </button>
            </div>
          </div>

          {/* Option 2: JSON Export */}
          <div className="export-option-card">
            <div className="opt-icon-wrap">
              <FileCode size={28} className="text-sky" />
            </div>
            <h4>JSON Data Format</h4>
            <p>Structured JSON data ideal for personal scripts, calendar imports, and mapping integrations.</p>
            
            <div className="opt-btn-group">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => handleExport('json', 'filtered')}
                disabled={filteredActivities.length === 0}
              >
                Export Filtered ({filteredActivities.length})
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => handleExport('json', 'favorites')}
                disabled={favoriteActivities.length === 0}
              >
                Export Favorites ({favoriteActivities.length})
              </button>
              <button 
                className="btn btn-ghost btn-sm"
                onClick={() => handleExport('json', 'saved')}
                disabled={savedActivities.length === 0}
              >
                Export Bucket List ({savedActivities.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
