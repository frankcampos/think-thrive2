import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
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

  useEffect(() => {
    if (objProceduralCard && objProceduralCard.firebaseKey) setFormInput({ ...objProceduralCard });
  }, [objProceduralCard]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  console.warn('this is the form state', objProceduralCard);
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

    const payload = {
      ...formInput,
      pathId,
    };
    createProceduralKnowledge(payload).then(({ name }) => {
      const patchPayload = { firebaseKey: name };
      updateProceduralKnowledge(patchPayload).then(() => {
        setFormInput(initialState);
        onHide();
        onUpdate();
      });
    });
  };

  const fullscreen = true; // Define the 'fullscreen' variable
  return (
    <Modal className="my-dark-modal" show={show} onHide={onHide} fullscreen={fullscreen}>
      <Modal.Header closeButton>
        <Modal.Title>{objProceduralCard && objProceduralCard.firebaseKey ? 'Update Procedural Card' : 'Create Procedural Card'}</Modal.Title>
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
        <Button type="button" onClick={handleSubmit}>{objProceduralCard && objProceduralCard.firebaseKey ? 'Update' : 'Create'}</Button>
        <Button variant="dark" type="button" onClick={onHide}>Close</Button>
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
