import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
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
  const storage = firebase.storage();

  const handleImageChange = async (e) => {
    try {
      if (e.target.files[0]) {
        const imageFile = e.target.files[0];
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        const url = await imageRef.getDownloadURL();
        setFormInput((prevState) => ({ ...prevState, picture: url }));
      }
    } catch (error) {
      console.error('Error uploading image or getting download URL:', error);
    }
  };

  useEffect(() => {
    if (objProceduralCard && objProceduralCard.firebaseKey) setFormInput({ ...objProceduralCard });
  }, [objProceduralCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (objProceduralCard && objProceduralCard.firebaseKey) {
      updateProceduralKnowledge(formInput).then(() => {
        setFormInput(initialState);
        onHide();
        onUpdate();
      });
      return;
    }
    const payload = { ...formInput, pathId };
    createProceduralKnowledge(payload).then(({ name }) => {
      updateProceduralKnowledge({ firebaseKey: name }).then(() => {
        setFormInput(initialState);
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
          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</Form.Label>
            <Form.Control
              placeholder="What do you want to do?"
              value={formInput.title}
              name="title"
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Steps</Form.Label>
            <Form.Control
              as="textarea"
              rows={14}
              placeholder="Break down each task into steps..."
              name="taskSteps"
              value={formInput.taskSteps}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div>
            <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter image URL"
              value={formInput.picture}
              name="picture"
              onChange={handleChange}
              className="glass-input"
              style={{ marginBottom: '8px' }}
            />
            <Form.Control
              type="file"
              name="pictureFile"
              onChange={handleImageChange}
              className="glass-input"
            />
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
        <Button className="glass-btn" onClick={handleSubmit}>
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
