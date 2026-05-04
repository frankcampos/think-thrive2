import React, { useEffect, useState } from 'react';
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
  const router = useRouter();
  const storage = firebase.storage();

  useEffect(() => {
    if (objConceptualCard.firebaseKey) setFormState({ ...objConceptualCard });
  }, [objConceptualCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = async (e) => {
    try {
      if (e.target.files[0]) {
        const imageFile = e.target.files[0];
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        const url = await imageRef.getDownloadURL();
        setFormState((prevState) => ({ ...prevState, imageUrl: url }));
      }
    } catch (error) {
      console.error('Error uploading image or getting download URL:', error);
    }
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
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '28px',
        color: 'white',
      }}
      >
        {objConceptualCard.firebaseKey ? 'Update' : 'Create'} Conceptual Card
      </h2>

      <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Question</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Question"
            name="question"
            value={formState.question}
            onChange={handleChange}
            className="glass-input"
          />
        </div>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Answer</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Answer"
            name="answer"
            value={formState.answer}
            onChange={handleChange}
            className="glass-input"
          />
        </div>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Image URL"
            name="imageUrl"
            value={formState.imageUrl}
            onChange={handleChange}
            className="glass-input"
            style={{ marginBottom: '8px' }}
          />
          <Form.Control
            type="file"
            name="imageFile"
            onChange={handleImageChange}
            className="glass-input"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button className="glass-btn" type="submit">
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
