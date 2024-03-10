import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { createConceptualKnowledge, updateConceptualKnowledge } from '../../api/conceptualknowledgeData';

const initialState = {
  pathId: '',
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

  useEffect(() => {
    if (objConceptualCard.firebaseKey) setFormState({ ...objConceptualCard });
  }, [objConceptualCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn(formState);
    if (objConceptualCard.firebaseKey) {
      updateConceptualKnowledge(formState).then(() => {
        router.push(`/conceptual-knowledge/${pathId}`);
      });
    } else {
      const payload = { ...formState, pathId };
      createConceptualKnowledge(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateConceptualKnowledge(patchPayload).then(() => {
          router.push(`/conceptual-knowledge/${pathId}`);
        });
      });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-black mt-5">{objConceptualCard.firebaseKey ? 'Update' : 'Create'} Conceptual Card</h2>

      <Form.Label style={{ color: 'white' }}>Question</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Question"
        name="question"
        value={formState.question}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'white' }}>Answer</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Answer"
        name="answer"
        value={formState.answer}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'white' }}>Image URL</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Image URL"
        name="imageUrl"
        value={formState.imageUrl}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />
      <Button variant="dark" type="submit" style={{ margin: '10px' }}>
        {objConceptualCard.firebaseKey ? 'Update' : 'Create'}
      </Button>
    </Form>
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
