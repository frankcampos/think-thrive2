import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function InstructionsModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = `The main goal of creating a learning path is to help you start organizing your learning and to figure out why you want to learn a specific skill or knowledge.

When you click the 'Add a Learning Path' button, you'll see a form to fill out. This form lets you add a title, a goal, and a picture. After you create it, you'll see a card with your title, goal, and picture. You can delete, edit, or view this card. If you click the 'View' button, you'll go to a page where you can make new cards about ideas and steps. You'll also see all the cards you've made there.

Example 

Title: "Becoming a Web Developer"
- Tip: Choose a title that clearly shows what you want to achieve. Keep it short, to the point, and motivating.

Goal: "I want to learn all the necessary skills to get a job as a web developer."
- Tip: Be clear about what you want to do. It could be getting a job, getting better at something, or learning something new because you're curious. Make sure it's something you can track and know when you've achieved it.

Suggested Picture: A picture of a computer screen with code or a web development project.
- Instruction: Right now, you need to use a URL link for the picture. Find the picture you want on the internet, right-click on it, and choose 'copy image address' to use it.
- Tip: Pick a picture that shows what you're aiming for. It should look good and make sense for your goal.
`;

  return (
    <>
      <Button variant="dark" style={{ margin: '0 0 10px' }} onClick={handleShow}>
        How It Works
      </Button>

      <Modal className="my-dark-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Creating Your Learning Path: A Guide</Modal.Title>
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

export default InstructionsModal;
