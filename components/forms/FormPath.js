import React, { useEffect, useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/storage';
import { useAuth } from '../../utils/context/authContext';
import { createPath, updatePath } from '../../api/pathsData';

const initialState = {
  title: '',
  image: '',
  goal: '',
};

function FormPath({ objPath }) {
  const [formState, setFormState] = useState(initialState);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();
  const storage = firebase.storage();

  useEffect(() => {
    if (objPath.firebaseKey) {
      setFormState({ ...objPath });
      setPreviewUrl(objPath.image || '');
    }
  }, [objPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const imageRef = storage.ref().child(`images/${Date.now()}_${file.name}`);
      await imageRef.put(file);
      const url = await imageRef.getDownloadURL();
      setFormState((prev) => ({ ...prev, image: url }));
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (objPath.firebaseKey) {
      updatePath({ ...formState, user_name: user.displayName, user_photo: user.photoURL }).then(() => {
        router.push('/');
      });
    } else {
      const payload = {
        ...formState, user_id: user.uid, user_name: user.displayName, user_photo: user.photoURL,
      };
      createPath(payload).then(({ name }) => {
        updatePath({ firebaseKey: name }).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <div
      className="glass-card"
      style={{ maxWidth: '560px', margin: '0 auto', padding: '36px 32px' }}
    >
      <h2 style={{
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '4px',
        color: '#00d4ff',
        textAlign: 'center',
      }}
      >
        {objPath.firebaseKey ? 'Update' : 'Create'} Learning Path
      </h2>
      <p style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '28px',
      }}
      >
        {objPath.firebaseKey ? 'Edit your path details below' : 'Fill in the details to start your learning journey'}
      </p>

      <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Title */}
        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>
            Title
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Becoming a Web Developer"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>

        {/* Drag & Drop image upload */}
        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>
            Cover Image
          </Form.Label>

          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current.click()}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              border: `2px dashed ${isDragging ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '12px',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'rgba(0,212,255,0.07)' : 'rgba(255,255,255,0.04)',
              transition: 'border-color 0.2s ease, background 0.2s ease',
            }}
          >
            {uploading ? (
              <p style={{ color: '#00d4ff', margin: 0, fontSize: '0.9rem' }}>Uploading...</p>
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🖼️</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontSize: '0.9rem' }}>
                  Drag & drop an image here
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', margin: 0, fontSize: '0.78rem' }}>
                  or click to browse files
                </p>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => uploadFile(e.target.files[0])}
          />

          {/* Preview */}
          {previewUrl && !uploading && (
            <div style={{ marginTop: '12px', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
              <button
                type="button"
                onClick={() => { setPreviewUrl(''); setFormState((prev) => ({ ...prev, image: '' })); }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Goal */}
        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>
            Goal
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="What will you be able to do after completing this path?"
            name="goal"
            value={formState.goal}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <Button
            className="glass-btn"
            type="submit"
            disabled={uploading}
            style={{ padding: '10px 40px', fontSize: '0.95rem', fontWeight: '600' }}
          >
            {objPath.firebaseKey ? 'Update Path' : 'Create Path'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

FormPath.propTypes = {
  objPath: PropTypes.shape({
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

FormPath.defaultProps = {
  objPath: initialState,
};

export default FormPath;
