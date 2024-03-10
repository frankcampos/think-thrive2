import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function InstructionsModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = `For Improving My Title:
  What skill or knowledge am I most passionate about acquiring?
  This question helps me focus on what genuinely interests me, leading to a title that reflects my true enthusiasm.
  
  Who do I aspire to be at the end of this learning path?
  Envisioning my future self motivates me to create a title that captures the essence of my end goals.
  
  Can I summarize my learning journey in five words or less?
  This challenge encourages me to distill the essence of my path into a concise and catchy title, making it more appealing and memorable.

  For Refining My Goal:
  What specific outcomes do I want to achieve through this learning path?
  I ask this to ensure my goals are tangible and measurable, making it easier to track my progress and success.
  
  How will achieving this goal change my personal or professional life?
  Reflecting on the potential impact helps me articulate goals that are truly meaningful and motivational to me.
  
  What are the key milestones that will mark my progress toward this goal?
  By identifying milestones, I can think about my goal in more detail and structure my learning path more effectively, ensuring I stay on track.
  
  
  Example 1
  Title: "Becoming a Web Developer"
  Tip: Think of a title that best describes your end goal. It should be short, descriptive, and motivational.
  
  Goal: "My main goal is to acquire the necessary skills to secure a job as a web developer."
  Tip: Clearly articulate your objective. Whether it's securing a job, mastering a new skill, or exploring a passion, ensure it's specific and measurable.
  
  Suggested Picture: A computer screen displaying code or a web development project.
  Tip: Choose an image that symbolizes your journey or desired outcome. It should be visually appealing and relevant to your aspirations. Instruction: Currently, you can only use a URL link. Search for the required picture using your search engine, right-click on it, and select 'copy image address'.
  
  Example 2
  Title: "Mastering Native-Level English Proficiency"
  Tip: Select a title that encapsulates your ultimate objective succinctly and powerfully. The title should be both descriptive and inspiring, clearly reflecting the depth of mastery you aim to achieve in speaking and writing English.
  
  Goal: "My goal is to enhance my English speaking abilities to the extent that I can be mistaken for a native speaker, and to refine my writing skills to express myself clearly and creatively."
  Tip: Define your goal with precision. Whether it’s achieving native-like fluency, excelling in creative writing, or mastering clear communication, specificity is crucial. Ensure your goal is measurable and aligns closely with the skills you wish to develop.
  
  Suggested Picture: A book and a microphone against the backdrop of the Union Jack and the Statue of Liberty.
  Tip: Choose an image that metaphorically represents your ambition of achieving native-level fluency in both spoken and written English. The picture should be inspiring and directly relate to your goal of linguistic mastery. Instruction: At present, you are limited to using a URL link for images. Please search for an appropriate picture using your search engine, right-click on it, and select 'copy image address'.
  `;

  return (
    <>
      <Button variant="dark" style={{ margin: '0 0 10px' }} onClick={handleShow}>
        How to use the app
      </Button>

      <Modal className="my-dark-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>App Instructions for How to Add a Learning Path</Modal.Title>
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
