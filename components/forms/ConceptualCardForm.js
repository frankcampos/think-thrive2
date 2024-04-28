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
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    try {
      if (e.target.files[0]) {
        const imageFile = e.target.files[0];
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        const url = await imageRef.getDownloadURL();
        setFormState((prevState) => ({
          ...prevState,
          imageUrl: url,
        }));
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
        const patchPayload = { firebaseKey: name };
        updateConceptualKnowledge(patchPayload).then(() => {
          router.push(`/conceptual-knowledge/${pathId}`);
        });
      });
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      style={{
        borderColor: 'black', borderStyle: 'solid', backgroundColor: 'lightgray', padding: '10px', borderRadius: '10px',
      }}
    >
      <h2
        className="text-black mt-5"
        style={{
          fontSize: '2em', fontWeight: 'bold', color: 'darkslategray', textShadow: '2px 2px lightgray',
        }}
      >
        {objConceptualCard.firebaseKey ? 'Update' : 'Create'} Conceptual Card
      </h2>
      <Form.Label style={{ color: 'grey' }}>Question</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Question"
        name="question"
        value={formState.question}
        onChange={handleChange}
        style={{ backgroundColor: 'white', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'grey' }}>Answer</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Answer"
        name="answer"
        value={formState.answer}
        onChange={handleChange}
        style={{ backgroundColor: 'white', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'grey' }}>Enter Image URL or Upload an Image File</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Image URL"
        name="imageUrl"
        value={formState.imageUrl}
        onChange={handleChange}
        style={{
          backgroundColor: 'white', color: 'black', border: '1px solid white', marginBottom: '10px',
        }}
      />
      <Form.Control
        type="file"
        name="imageFile"
        onChange={handleImageChange}
        style={{ backgroundColor: 'lightgrey', color: 'black', border: '1px solid white' }}
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
