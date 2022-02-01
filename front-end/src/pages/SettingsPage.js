import axios from 'axios';
import React from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';

function SettingsPage(props) {
  const user = useUser();
  const { id } = user;
  const [token] = useToken();
  const [settings, setSettings] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [message, setMessage] = useState(false);
  const [canSaveSettings, setCanSaveSettings] = useState(false);
  const [failedRequest, setFailedRequest] = useState(false);
  const firstUpdate = useRef(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`/api/users/${id}/get-settings/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data) {
          const { settings: settingsValue, message } = response.data;
          setSettings(settingsValue);
          console.log(settingsValue);
          setShowErrorMessage(false);
          setShowSuccessMessage(true);
          setMessage(message);
          setFailedRequest(false);
        }
      } catch (err) {
        setShowErrorMessage(true);
        setShowSuccessMessage(false);
        setMessage(message);
        setFailedRequest(true);
      }
    };
    if (!settings) {
      fetchSettings();
    }
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setCanSaveSettings(true);
  }, [settings]);

  useEffect(() => {
    if (showSuccessMessage || showErrorMessage) {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
      }, 3000);
    }
  }, [showSuccessMessage, showErrorMessage]);

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/api/users/${id}/set-settings/`,
        {
          settings,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        const { message } = response.data;
        setShowErrorMessage(false);
        setShowSuccessMessage(true);
        setMessage(message);
      }
    } catch (err) {
      setShowErrorMessage(true);
      setShowSuccessMessage(false);
      setMessage(message);
    }
  };

  const handleCancel = () => {
    alert('cancel not yet implemented');
  };

  // const handleOnChange = (e) => {}

  if (!settings && !failedRequest) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container">
      <h1>Settings</h1>
      <div className="settings">
        {showSuccessMessage && <div className="success">{message || 'Succesful action'}</div>}
        {showErrorMessage && <div className="fail">{message || 'Failed'}</div>}
        <div className="settings-details">
          <div className="setting">
            <label htmlFor="private-user">Make your profile private</label>
            <input
              type="checkbox"
              name="private-user"
              checked={!!settings?.isPrivateAccount}
              onChange={(e) => setSettings({ ...settings, isPrivateAccount: !settings?.isPrivateAccount })}
            />
            {settings?.isPrivateAccount}
          </div>
        </div>
        <div className="settings-actions">
          <button disabled={!canSaveSettings} className="settings-action" onClick={handleSave}>
            Save
          </button>
          <button disabled={!canSaveSettings} className="settings-action" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
