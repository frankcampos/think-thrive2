import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { updateProceduralKnowledge, createProceduralKnowledge } from '../../api/proceduralknowledgeData';

const initialState = {
  title: '',
  taskSteps: '',
  picture: '',
  type: 'procedural',
};

const ProceduralCardFormModal = ({ show, onHide, pathId }) => {
  const [formInput, setFormInput] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formInput,
      pathId,
    };
    createProceduralKnowledge(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateProceduralKnowledge(patchPayload).then(() => {
        setFormInput(initialState);
        onHide();
      });
    });
  };

  const fullscreen = true; // Define the 'fullscreen' variable
  return (
    <Modal className="my-dark-modal" show={show} onHide={onHide} fullscreen={fullscreen}>
      <Modal.Header closeButton>
        <Modal.Title>Create Conceptual Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control placeholder="What do want to do" value={formInput.title} name="title" onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formTaskSteps">
            <Form.Label>TaskSteps</Form.Label>
            <Form.Control as="textarea" rows={20} placeholder="BreakDown Each Task Into Steps" name="taskSteps" value={formInput.taskSteps} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control type="text" placeholder="Image Url" value={formInput.picture} name="picture" onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Button type="button" onClick={handleSubmit}>Create</Button>
        <Button variant="dark" type="button" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ProceduralCardFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  pathId: PropTypes.string.isRequired,
};

export default ProceduralCardFormModal;
