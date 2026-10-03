import React, { useState, useEffect } from 'react';
import { 
  X, 
  Radar, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Globe, 
  Calendar, 
  Users, 
  Mountain 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RadarSyncModal({ isOpen, onClose, onSyncComplete, currentLocName }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    { 
      name: 'Querying DNP Thailand & National Park Permits', 
      status: 'Scanning cool-season trekking queues for Khao Chang Phueak & Chiang Dao...', 
      icon: Mountain, 
      count: 14 
    },
    { 
      name: 'Crawling RunThailand & World Athletics Calendars', 
      status: 'Fetching Bangsaen21, UTCM ultra trails & coastal half marathons...', 
      icon: Calendar, 
      count: 19 
    },
    { 
      name: 'Parsing Thai Trekking & Outdoors Facebook Groups', 
      status: 'Extracting wild camping spots, Dark Sky reserves & local porters...', 
      icon: Globe, 
      count: 22 
    },
    { 
      name: 'Syncing Eventbrite, Ticketmelon & Resident Advisor', 
      status: 'Aggregating Wonderfruit, Chiang Mai Jazz & Candlelight symphonies...', 
      icon: Sparkles, 
      count: 16 
    },
    { 
      name: 'Scanning Meetup.com & Urban Social Clubs', 
      status: 'Matching weekend board games, evening pelotons & sunset runners...', 
      icon: Users, 
      count: 28 
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          try {
            confetti({
              particleCount: 65,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {}
          return 100;
        }
        const next = prev + 5;
        const stepIndex = Math.min(Math.floor((next / 100) * steps.length), steps.length - 1);
        setCurrentStep(stepIndex);
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen) return null;

  const totalDiscovered = steps.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sync" onClick={(e) => e.stopPropagation()}>
        <div className="sync-modal-header">
          <div className="sync-radar-icon-wrap">
            <Radar className="spinning text-emerald" size={28} />
          </div>
          <div>
            <h3 className="sync-title">Activity Radar Scanner</h3>
            <p className="sync-subtitle">
              Live crawler querying adventure permits, road races, concerts, and clubs around {currentLocName}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="sync-progress-container">
          <div className="sync-progress-header">
            <span>Aggregating Active Channels</span>
            <span className="sync-pct">{progress}%</span>
          </div>
          <div className="sync-progress-track">
            <div className="sync-progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Live Step Tracker */}
        <div className="sync-steps-list">
          {steps.map((step, idx) => {
            const isCompleted = currentStep > idx || isFinished;
            const isCurrent = currentStep === idx && !isFinished;
            const StepIcon = step.icon;

            return (
              <div 
                key={step.name} 
                className={`sync-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="step-icon-wrap">
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-emerald" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="spinning text-sky" />
                  ) : (
                    <StepIcon size={18} className="text-muted" />
                  )}
                </div>
                <div className="step-info">
                  <div className="step-name-row">
                    <span className="step-name">{step.name}</span>
                    {isCompleted && (
                      <span className="step-discovered-badge">+{step.count} activities</span>
                    )}
                  </div>
                  <p className="step-status">{step.status}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary / Done Action */}
        <div className="sync-footer">
          {isFinished ? (
            <div className="sync-finish-box">
              <div className="finish-left">
                <Sparkles size={20} className="text-amber" />
                <span>Discovered <strong>{totalDiscovered} live activities</strong> across Thailand & beyond!</span>
              </div>
              <button 
                type="button" 
                className="btn btn-finish-sync"
                onClick={() => {
                  onClose();
                  if (onSyncComplete) onSyncComplete();
                }}
              >
                <span>View Discovered Activities</span>
              </button>
            </div>
          ) : (
            <div className="sync-loading-text">
              <Loader2 size={14} className="spinning" />
              <span>Scanning live community feeds & verified booking platforms...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
