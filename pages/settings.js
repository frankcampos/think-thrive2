/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import Head from 'next/head';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useAuth } from '../utils/context/authContext';

export default function Settings() {
  const { user } = useAuth();
  const storage = firebase.storage();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.photoURL || '');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const uploadAvatar = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const imageRef = storage.ref().child(`avatars/${user.uid}_${Date.now()}`);
      await imageRef.put(file);
      const url = await imageRef.getDownloadURL();
      setAvatarPreview(url);
      await user.updateProfile({ photoURL: url });
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadAvatar(e.dataTransfer.files[0]);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    try {
      await user.updateProfile({ displayName: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setSaving(false);
    }
  };

  if (user?.isAnonymous) {
    return (
      <div style={{ maxWidth: '480px', margin: '40px auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '40px 32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
          <h3 style={{ fontWeight: '700', color: 'white', marginBottom: '8px' }}>Guest Account</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            Profile settings are only available for signed-in users. Sign in with Google to personalise your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Settings | ThinkThrive</title>
      </Head>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <h1 style={{
          fontWeight: '700', fontSize: '1.8rem', color: 'white', marginBottom: '8px',
        }}
        >
          Settings
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Manage your profile
        </p>

        <div className="glass-card" style={{ padding: '32px' }}>
          <h2 style={{
            fontWeight: '700', fontSize: '1.1rem', color: '#00d4ff', marginBottom: '24px',
          }}
          >
            Profile
          </h2>

          {/* Avatar */}
          <div style={{ marginBottom: '28px' }}>
            <Form.Label
              style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '12px', display: 'block',
              }}
            >
              Profile Picture
            </Form.Label>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px',
              }}
            >
              <img
                src={avatarPreview || '/placeholder-avatar.svg'}
                alt="Profile"
                onError={(e) => { e.target.src = '/placeholder-avatar.svg'; }}
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={(ev) => { ev.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  style={{
                    border: `2px dashed ${isDragging ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: isDragging ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.04)',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {uploading ? (
                    <p style={{ color: '#00d4ff', margin: 0, fontSize: '0.85rem' }}>Uploading...</p>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.82rem' }}>
                      Drag & drop or click to change photo
                    </p>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
          </div>

          {/* Display name */}
          <Form onSubmit={handleSaveName}>
            <Form.Label
              style={{
                color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px', display: 'block',
              }}
            >
              Display Name
            </Form.Label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Form.Control
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="glass-input"
                required
              />
              <Button
                className="glass-btn"
                type="submit"
                disabled={saving || uploading}
                style={{ whiteSpace: 'nowrap', padding: '8px 20px' }}
              >
                {/* eslint-disable-next-line no-nested-ternary */}
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
