import React, { useState } from 'react';
import "./CSS/OnboardingPage.css";
import { getApiUrl } from "../config";

export const OnboardingPage = () => {
  const [saving, setSaving] = useState(false);
  const [industry, setIndustry] = useState('');
  const [workerConfig, setWorkerConfig] = useState({
    monday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    tuesday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    wednesday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    thursday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    friday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    saturday: { start: '09:00', end: '17:00', workers: 1, dayOff: false },
    sunday: { start: '09:00', end: '17:00', workers: 1, dayOff: false }
  });

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('No token found, please login again.');
        setSaving(false);
        return;
      }

      const basicRes = await fetch(getApiUrl('api/basic'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const basicData = await basicRes.json();
      if (!basicRes.ok || !basicData || !basicData._id || !basicData._id.$oid) {
        alert('Failed to fetch user information.');
        setSaving(false);
        return;
      }

      const userId = basicData._id.$oid;

      const updateRes = await fetch(getApiUrl('api/update_user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          updates: {
            _id: { "$oid": userId },
            industry: industry,
            workerConfig: workerConfig,
          },
        }),
      });

      const updateData = await updateRes.json();
      if (updateRes.ok && updateData.success) {
        alert('Information saved successfully!');
        setTimeout(() => {
          window.location.href = '/homepage';
        }, 1000);
      } else {
        alert(updateData.message || 'Save failed');
        setSaving(false);
      }
    } catch (error) {
      console.error('Error during saving user info', error);
      alert('Something went wrong.');
      setSaving(false);
    }
  };

  return (
    <div className="onboarding-container">
      <h1>Welcome to AI Scheduler!</h1>
      <p>Let's set up your business profile</p>
      
      <div className="form-section">
        <label>
          Industry:
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g., Healthcare, Retail, etc."
          />
        </label>
      </div>

      <div className="schedule-section">
        <h2>Set Your Business Hours</h2>
        <div className="business-hours-list">
        {Object.entries(workerConfig).map(([day, config]) => (
          <div key={day} className="business-hours-card">
            <div className="day-header">
              <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
              <label className="dayoff-label">
                <input
                  type="checkbox"
                  checked={config.dayOff}
                  onChange={(e) => setWorkerConfig(prev => ({
                    ...prev,
                    [day]: { ...prev[day], dayOff: e.target.checked }
                  }))}
                />
                Day Off
              </label>
            </div>
            {!config.dayOff && (
              <div className="time-row">
                <div>
                  <label>Start Time
                    <input
                      type="time"
                      value={config.start}
                      onChange={(e) => setWorkerConfig(prev => ({
                        ...prev,
                        [day]: { ...prev[day], start: e.target.value }
                      }))}
                    />
                  </label>
                </div>
                <div>
                  <label>End Time
                    <input
                      type="time"
                      value={config.end}
                      onChange={(e) => setWorkerConfig(prev => ({
                        ...prev,
                        [day]: { ...prev[day], end: e.target.value }
                      }))}
                    />
                  </label>
                </div>
                <div>
                  <label>Workers
                    <input
                      type="number"
                      min="1"
                      value={config.workers}
                      onChange={(e) => setWorkerConfig(prev => ({
                        ...prev,
                        [day]: { ...prev[day], workers: parseInt(e.target.value) || 1 }
                      }))}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={saving}
        className="submit-button"
      >
        {saving ? 'Saving...' : 'Save and Continue'}
      </button>
    </div>
  );
};
