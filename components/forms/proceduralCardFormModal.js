import PropTypes from 'prop-types';
import { Modal, Form, Button } from 'react-bootstrap';
// Remove the duplicate import statement
// import { Form } from 'react-bootstrap';

const ProceduralCardFormModal = ({ show, onHide }) => {
  const fullscreen = true; // Define the 'fullscreen' variable
  return (
    <Modal className="my-dark-modal" show={show} onHide={onHide} fullscreen={fullscreen}>
      <Modal.Header closeButton>
        <Modal.Title>Create Conceptual Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control placeholder="What do want to do" />
          </Form.Group>
          <Form.Group controlId="formTaskSteps">
            <Form.Label>TaskSteps</Form.Label>
            <Form.Control as="textarea" rows={20} placeholder="BreakDown Each Task Into Steps" />
          </Form.Group>
          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control type="text" placeholder="Image Url" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Button type="button">Create</Button>
        <Button variant="dark" type="button" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

ProceduralCardFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ProceduralCardFormModal;
