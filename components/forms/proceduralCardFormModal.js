/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/storage';
import { updateProceduralKnowledge, createProceduralKnowledge } from '../../api/proceduralknowledgeData';

const initialState = {
  title: '',
  taskSteps: '',
  picture: '',
  type: 'procedural',
};

const ProceduralCardFormModal = ({
  show, onHide, pathId, onUpdate, objProceduralCard,
}) => {
  const [formInput, setFormInput] = useState(initialState);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const storage = firebase.storage();

  useEffect(() => {
    if (objProceduralCard && objProceduralCard.firebaseKey) {
      setFormInput({ ...objProceduralCard });
      setPreviewUrl(objProceduralCard.picture || '');
    }
  }, [objProceduralCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));
    try {
      const imageRef = storage.ref().child(`images/${Date.now()}_${file.name}`);
      await imageRef.put(file);
      const url = await imageRef.getDownloadURL();
      setFormInput((prev) => ({ ...prev, picture: url }));
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
    uploadFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (objProceduralCard && objProceduralCard.firebaseKey) {
      updateProceduralKnowledge(formInput).then(() => {
        setFormInput(initialState);
        setPreviewUrl('');
        onHide();
        onUpdate();
      });
      return;
    }
    const payload = { ...formInput, pathId };
    createProceduralKnowledge(payload).then(({ name }) => {
      updateProceduralKnowledge({ firebaseKey: name }).then(() => {
        setFormInput(initialState);
        setPreviewUrl('');
        onHide();
        onUpdate();
      });
    });
  };

  const isEditing = objProceduralCard && objProceduralCard.firebaseKey;

  return (
    <Modal show={show} onHide={onHide} fullscreen>
      <Modal.Header
        closeButton
        style={{
          background: 'rgba(15,15,30,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
        }}
      >
        <Modal.Title style={{ fontWeight: '700', color: '#c084fc' }}>
          {isEditing ? 'Update Procedural Card' : 'Create Procedural Card'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ background: 'rgba(15,15,30,0.98)', padding: '32px' }}>
        <div style={{
          maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px',
        }}
        >
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
            {isEditing ? 'Edit your card below' : 'Break a task down into clear, actionable steps'}
          </p>

          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</Form.Label>
            <Form.Control
              placeholder="What do you want to do?"
              value={formInput.title}
              name="title"
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>

          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Steps</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              placeholder="Break down each task into steps..."
              name="taskSteps"
              value={formInput.taskSteps}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          {/* Drag & drop image */}
          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>
              Image (optional)
            </Form.Label>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              style={{
                border: `2px dashed ${isDragging ? '#c084fc' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '12px',
                padding: '24px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? 'rgba(192,132,252,0.07)' : 'rgba(255,255,255,0.04)',
                transition: 'border-color 0.2s ease, background 0.2s ease',
              }}
            >
              {uploading ? (
                <p style={{ color: '#c084fc', margin: 0, fontSize: '0.9rem' }}>Uploading...</p>
              ) : (
                <>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🖼️</div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontSize: '0.88rem' }}>
                    Drag & drop or click to upload
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.75rem' }}>Optional — helps visualise the task</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => uploadFile(e.target.files[0])}
            />
            {previewUrl && !uploading && (
              <div style={{ marginTop: '12px', position: 'relative' }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => { setPreviewUrl(''); setFormInput((prev) => ({ ...prev, picture: '' })); }}
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
        </div>
      </Modal.Body>

      <Modal.Footer style={{
        background: 'rgba(15,15,30,0.98)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
      }}
      >
        <Button className="glass-btn" onClick={handleSubmit} disabled={uploading}>
          {isEditing ? 'Update' : 'Create'}
        </Button>
        <Button className="glass-btn-outline" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ProceduralCardFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  pathId: PropTypes.string.isRequired,
  objProceduralCard: PropTypes.shape({
    title: PropTypes.string,
    picture: PropTypes.string,
    taskSteps: PropTypes.string,
    pathId: PropTypes.string,
    firebaseKey: PropTypes.string,
  }),
};

ProceduralCardFormModal.defaultProps = {
  objProceduralCard: null,
};

export default ProceduralCardFormModal;
