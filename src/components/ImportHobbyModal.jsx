import React, { useState } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Sparkles, 
  Loader2, 
  Check, 
  AlertCircle, 
  MapPin,
  Calendar,
  ExternalLink,
  Plus,
  Eye,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  extractHobbyFromUrl, 
  EXAMPLE_HOBBY_LINKS, 
  CATEGORY_IMAGE_PRESETS 
} from '../utils/extractHobbyUtils';
import { ACTIVITY_CATEGORIES } from '../data/filterOptions';

export function ImportHobbyModal({ isOpen, onClose, onImportHobby }) {
  const [urlInput, setUrlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState(null);
  const [extractionStatus, setExtractionStatus] = useState('');
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [extractedData, setExtractedData] = useState(null);
  const [newTagInput, setNewTagInput] = useState('');

  if (!isOpen) return null;

  const handleExtract = async (targetUrl = urlInput) => {
    if (!targetUrl || !targetUrl.trim()) {
      setExtractError('Please enter a web link to extract');
      return;
    }

    setExtractError(null);
    setIsExtracting(true);
    setExtractionStatus('Accessing web page and analyzing OpenGraph metadata...');

    try {
      setTimeout(() => {
        setExtractionStatus('Classifying hobby category, vibe tags & estimating specs...');
      }, 700);

      const result = await extractHobbyFromUrl(targetUrl);
      setExtractedData(result);
      setExtractionStatus('Extraction complete!');
    } catch (err) {
      console.error('Failed to extract:', err);
      setExtractError('Could not read page metadata automatically. You can still fill in the details manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePickExample = (example) => {
    setUrlInput(example.url);
    handleExtract(example.url);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        handleExtract(text);
      }
    } catch {
      // Fallback
    }
  };

  const handleCategoryChange = (catId) => {
    const found = ACTIVITY_CATEGORIES.find(c => c.id === catId);
    if (!found) return;

    setExtractedData(prev => ({
      ...prev,
      category: catId,
      categoryLabel: found.label,
      categoryIcon: found.icon,
      // If user hasn't set custom image, switch to category default
      image: CATEGORY_IMAGE_PRESETS[catId] || prev.image
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().replace(/^#/, '');
    if (!extractedData.vibeTags.includes(clean)) {
      setExtractedData(prev => ({
        ...prev,
        vibeTags: [...prev.vibeTags, clean]
      }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setExtractedData(prev => ({
      ...prev,
      vibeTags: prev.vibeTags.filter(t => t !== tagToRemove)
    }));
  };

  const handleSaveImport = () => {
    if (!extractedData || !extractedData.title.trim()) {
      setExtractError('Please provide at least a title for the hobby');
      return;
    }

    // Trigger celebratory confetti burst!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onImportHobby(extractedData);
    handleClose();
  };

  const handleClose = () => {
    setUrlInput('');
    setExtractedData(null);
    setExtractError(null);
    setIsExtracting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-content modal-import" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="import-modal-header">
          <div className="import-title-wrap">
            <div className="import-icon-badge">
              <Sparkles size={20} className="text-emerald" />
            </div>
            <div>
              <h3 className="modal-headline">Import Hobby via Web Link</h3>
              <p className="modal-subheadline">
                Found a cool hobby, workshop, outdoor trek or club on the web? Paste any link and we'll extract the details automatically!
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleClose} title="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Input Bar */}
        <div className="import-input-section">
          <div className="import-input-wrap">
            <LinkIcon size={16} className="link-input-icon text-muted" />
            <input 
              type="url" 
              className="import-url-input"
              placeholder="Paste any link: e.g. https://en.wikipedia.org/wiki/Bouldering, blog, reddit, meetup..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExtract();
              }}
              disabled={isExtracting}
            />
            {urlInput && (
              <button 
                type="button" 
                className="btn-clear-input"
                onClick={() => setUrlInput('')}
                title="Clear input"
              >
                <X size={14} />
              </button>
            )}
            <button 
              type="button"
              className="btn-paste-clipboard"
              onClick={handlePasteClipboard}
              title="Paste from clipboard"
            >
              Paste
            </button>
            <button 
              type="button"
              className="btn-extract-action"
              onClick={() => handleExtract()}
              disabled={isExtracting || !urlInput.trim()}
            >
              {isExtracting ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  <span>Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Extract Data</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Example Try Chips */}
          <div className="example-links-row">
            <span className="example-links-label">Quick Try:</span>
            <div className="example-chips-wrap">
              {EXAMPLE_HOBBY_LINKS.map((ex, i) => (
                <button 
                  key={i}
                  type="button"
                  className="example-link-chip"
                  onClick={() => handlePickExample(ex)}
                  disabled={isExtracting}
                >
                  <span>{ex.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Extraction Status / Error Messages */}
          {isExtracting && (
            <div className="extraction-status-banner">
              <Loader2 size={15} className="spinning text-emerald" />
              <span>{extractionStatus}</span>
            </div>
          )}

          {extractError && (
            <div className="extraction-error-banner">
              <AlertCircle size={15} className="text-amber" />
              <span>{extractError}</span>
            </div>
          )}
        </div>

        {/* Extracted Data Form / Interactive Live Preview */}
        {extractedData && (
          <div className="import-editor-container">
            {/* View Switcher Tabs */}
            <div className="import-tabs-bar">
              <div className="import-tabs-left">
                <button 
                  type="button"
                  className={`import-tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                  onClick={() => setActiveTab('edit')}
                >
                  <Sliders size={14} />
                  <span>Edit Attributes</span>
                </button>
                <button 
                  type="button"
                  className={`import-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  <Eye size={14} />
                  <span>Live Card Preview</span>
                </button>
              </div>
              <div className="import-source-badge">
                <Check size={12} className="text-emerald" />
                <span>Extracted from {extractedData.sourcePlatform}</span>
              </div>
            </div>

            {/* TAB 1: Edit Fields */}
            {activeTab === 'edit' && (
              <div className="import-form-grid">
                {/* Title */}
                <div className="form-group full-width">
                  <label className="form-label">Hobby / Activity Title *</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.title}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Indoor Bouldering & Problem Solving"
                  />
                </div>

                {/* Category & Timing */}
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-select"
                    value={extractedData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {ACTIVITY_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Schedule / When</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.nextDate}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, nextDate: e.target.value }))}
                    placeholder="e.g. Open Weekends & Evenings"
                  />
                </div>

                {/* Cost Tier & Cost Text */}
                <div className="form-group">
                  <label className="form-label">Cost Tier</label>
                  <select 
                    className="form-select"
                    value={extractedData.cost.tier}
                    onChange={(e) => setExtractedData(prev => ({
                      ...prev,
                      cost: { ...prev.cost, tier: e.target.value }
                    }))}
                  >
                    <option value="free">100% Free</option>
                    <option value="budget">Budget-Friendly (&lt; ฿1,000)</option>
                    <option value="moderate">Moderate (฿1,000 - ฿3,000)</option>
                    <option value="premium">Premium (&gt; ฿3,000)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Cost Details</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.cost.text}
                    onChange={(e) => setExtractedData(prev => ({
                      ...prev,
                      cost: { ...prev.cost, text: e.target.value }
                    }))}
                    placeholder="e.g. ฿350 / session (shoes included)"
                  />
                </div>

                {/* Location Province & Name */}
                <div className="form-group">
                  <label className="form-label">Location / Venue</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.location.name}
                    onChange={(e) => setExtractedData(prev => ({
                      ...prev,
                      location: { ...prev.location, name: e.target.value }
                    }))}
                    placeholder="e.g. Local Climbing Gym or National Park"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Province / Region</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.location.province}
                    onChange={(e) => setExtractedData(prev => ({
                      ...prev,
                      location: { ...prev.location, province: e.target.value }
                    }))}
                    placeholder="e.g. Bangkok, Chiang Mai, Global"
                  />
                </div>

                {/* Organizer & Official Link */}
                <div className="form-group">
                  <label className="form-label">Organizer / Club</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.organizer}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, organizer: e.target.value }))}
                    placeholder="e.g. Bouldering Community Club"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Link</label>
                  <input 
                    type="url" 
                    className="form-input"
                    value={extractedData.officialUrl}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, officialUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                {/* Environment & Difficulty */}
                <div className="form-group">
                  <label className="form-label">Environment</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.environment}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, environment: e.target.value }))}
                    placeholder="e.g. Indoor Climbing Facility"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty / Fitness</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={extractedData.difficulty}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, difficulty: e.target.value }))}
                    placeholder="e.g. All levels (Beginner routes available)"
                  />
                </div>

                {/* Image URL & Quick Presets */}
                <div className="form-group full-width">
                  <div className="label-with-presets">
                    <label className="form-label">Hero Cover Image URL</label>
                    <div className="preset-img-chips">
                      <span className="preset-label">Pick Photo:</span>
                      {Object.keys(CATEGORY_IMAGE_PRESETS).map(catKey => (
                        <button
                          key={catKey}
                          type="button"
                          className="chip-preset-img"
                          onClick={() => setExtractedData(prev => ({ ...prev, image: CATEGORY_IMAGE_PRESETS[catKey] }))}
                        >
                          {catKey}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="img-input-row">
                    <input 
                      type="url" 
                      className="form-input"
                      value={extractedData.image}
                      onChange={(e) => setExtractedData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <img 
                      src={extractedData.image} 
                      alt="Thumbnail preview" 
                      className="img-preview-mini"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200';
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Description / Summary</label>
                  <textarea 
                    className="form-textarea"
                    rows="3"
                    value={extractedData.description}
                    onChange={(e) => setExtractedData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed explanation of this hobby..."
                  />
                </div>

                {/* Vibe Tags Editor */}
                <div className="form-group full-width">
                  <label className="form-label">Vibe Tags</label>
                  <div className="tags-editor-wrap">
                    {extractedData.vibeTags.map(tag => (
                      <span key={tag} className="editable-tag-chip">
                        #{tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="btn-remove-tag"
                          title="Remove tag"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="add-tag-inline">
                      <input 
                        type="text" 
                        placeholder="Add tag..."
                        className="input-add-tag"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTag(e);
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-add-tag"
                        onClick={handleAddTag}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Live Card Preview */}
            {activeTab === 'preview' && (
              <div className="import-preview-wrapper">
                <div className="preview-card-frame">
                  <div className="activity-card preview-active">
                    <div className="card-media-wrap">
                      <img 
                        src={extractedData.image} 
                        alt={extractedData.title} 
                        className="card-hero-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600';
                        }}
                      />
                      <div className="card-media-overlay"></div>
                      <div className="media-top-bar">
                        <span className="category-badge-chip">{extractedData.categoryLabel}</span>
                        <div className="rating-badge-chip">
                          <span>★ {extractedData.rating}</span>
                        </div>
                      </div>
                      <div className="media-bottom-bar">
                        <div className="distance-indicator">
                          <MapPin size={12} />
                          <span>Nearby (~12 km)</span>
                        </div>
                        <span className="timing-type-pill">{extractedData.timeframe}</span>
                      </div>
                    </div>

                    <div className="card-content-body">
                      <div className="card-organizer-row">
                        <span className="organizer-label">{extractedData.organizer}</span>
                        <span className="province-tag">{extractedData.location.province}</span>
                      </div>
                      <h3 className="activity-card-title">{extractedData.title}</h3>
                      <div className="card-schedule-row">
                        <Calendar size={13} className="text-emerald" />
                        <span className="date-label">{extractedData.nextDate}</span>
                      </div>
                      <div className="card-cost-row">
                        <span className="cost-main">{extractedData.cost.text}</span>
                        <span className="clean-tag tag-budget">{extractedData.cost.tier.toUpperCase()}</span>
                      </div>
                      <div className="card-vibe-row">
                        {extractedData.vibeTags.map(tag => (
                          <span key={tag} className="vibe-chip">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="card-actions-bar">
                      <span className="pill-small pill-imported">
                        <Sparkles size={11} style={{ marginRight: 3, display: 'inline' }} />
                        User Discovered
                      </span>
                      <a 
                        href={extractedData.officialUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-join"
                      >
                        <span>Explore</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="preview-tip-box">
                  <Sparkles size={16} className="text-amber" />
                  <p>
                    This is how your imported hobby will appear to visitors on HobbyExplorer. You can favorite it, compare it with other activities, and find it anytime!
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="import-modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary btn-save-import"
                onClick={handleSaveImport}
              >
                <Sparkles size={16} />
                <span>Import Hobby to Explorer</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
