/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import 'firebase/storage';
import firebase from 'firebase/app';
import { createConceptualKnowledge, updateConceptualKnowledge } from '../../api/conceptualknowledgeData';

const initialState = {
  question: '',
  answer: '',
  imageUrl: '',
  difficulty: '',
  nextReviewDate: '',
  type: 'conceptual',
};

function ConceptualCardForm({ objConceptualCard, pathId }) {
  const [formState, setFormState] = useState(initialState);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const storage = firebase.storage();

  useEffect(() => {
    if (objConceptualCard.firebaseKey) {
      setFormState({ ...objConceptualCard });
      setPreviewUrl(objConceptualCard.imageUrl || '');
    }
  }, [objConceptualCard]);

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
      setFormState((prev) => ({ ...prev, imageUrl: url }));
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
    if (objConceptualCard.firebaseKey) {
      updateConceptualKnowledge(formState).then(() => {
        router.push(`/conceptual-knowledge/${objConceptualCard.pathId}`);
      });
    } else {
      const payload = { ...formState, pathId };
      createConceptualKnowledge(payload).then(({ name }) => {
        updateConceptualKnowledge({ firebaseKey: name }).then(() => {
          router.push(`/conceptual-knowledge/${pathId}`);
        });
      });
    }
  };

  return (
    <div
      className="glass-card"
      style={{ maxWidth: '640px', margin: '0 auto', padding: '36px 32px' }}
    >
      <h2 style={{
        fontWeight: '700', fontSize: '1.5rem', marginBottom: '4px', color: '#00d4ff', textAlign: 'center',
      }}
      >
        {objConceptualCard.firebaseKey ? 'Update' : 'Create'} Conceptual Card
      </h2>
      <p style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '28px',
      }}
      >
        {objConceptualCard.firebaseKey ? 'Edit your card below' : 'Add a question and answer to your learning path'}
      </p>

      <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="What do you want to learn?"
            name="question"
            value={formState.question}
            onChange={handleChange}
            className="glass-input"
            required
          />
        </div>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Answer</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Write a clear, concise answer..."
            name="answer"
            value={formState.answer}
            onChange={handleChange}
            className="glass-input"
            required
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
              border: `2px dashed ${isDragging ? '#00d4ff' : 'rgba(255,255,255,0.2)'}`,
              borderRadius: '12px',
              padding: '24px 16px',
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
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🖼️</div>
                <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontSize: '0.88rem' }}>
                  Drag & drop or click to upload
                </p>
                <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.75rem' }}>Optional — helps visualise the concept</p>
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
                onClick={() => { setPreviewUrl(''); setFormState((prev) => ({ ...prev, imageUrl: '' })); }}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <Button className="glass-btn" type="submit" disabled={uploading}>
            {objConceptualCard.firebaseKey ? 'Update Card' : 'Create Card'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

ConceptualCardForm.propTypes = {
  objConceptualCard: PropTypes.shape({
    pathId: PropTypes.string,
    question: PropTypes.string,
    answer: PropTypes.string,
    imageUrl: PropTypes.string,
    difficulty: PropTypes.string,
    firebaseKey: PropTypes.string,
    nextReviewDate: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  pathId: PropTypes.string.isRequired,
};

export default ConceptualCardForm;
