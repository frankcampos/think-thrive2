/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

function FeedbackOnStepsModal({ feedbackMessage, handleShow }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (handleShow) {
      setShow(true);
    }
  }, [feedbackMessage]);

  console.warn('modal', feedbackMessage);

  const text = feedbackMessage;

  return (
    <>
      <Modal className="my-dark-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>FeedBack</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

FeedbackOnStepsModal.propTypes = {
  feedbackMessage: PropTypes.string.isRequired,
  handleShow: PropTypes.func.isRequired,
};

export default FeedbackOnStepsModal;
