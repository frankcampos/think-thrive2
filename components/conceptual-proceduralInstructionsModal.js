import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function InstructionConceptualAndProceduralModal() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const text = `The primary objective of creating procedural and conceptual cards is to facilitate navigation between two main ideas: 'how-to' and 'what is it'.

  How to Add a Conceptual Card
  1. Click on 'Add a Conceptual Card'. A form with fields for a question, an answer, and image inputs will appear.
  2. When typing the answer, formulate it in your own words; do not copy and paste. You have the option to edit the answer later if needed.
  3. The picture input can be left empty, but if a visual representation is necessary, you can add one by searching for the desired image using the browser, right-clicking on it, and selecting "copy image address" to paste into the input field.
  4. After clicking the create button, the newly created card will be displayed. You can also add tags by clicking on the tag label; this is mainly for organizing your cards. You have the flexibility to create a new tag, add a tag to your card, or remove one.
  5. Additionally, you have the options to edit and delete the card. When you click on the review button, it will present the card in a 'flashcard' style, displaying a question. Type what you remember. After finishing, clicking the button will reveal the answer, showing both the answer you provided when creating the card and the answer you just typed. It will also give you feedback on your answer and provide an example.
  
  Example for Adding a Conceptual Card:
  Title: "What is Agile Methodology?"
  Question: "Explain the Agile software development process."
  -Answer: "Agile methodology is a practice that promotes continuous iteration of development and testing throughout the software development lifecycle of the project. It involves breaking the project into small, manageable units called sprints, allowing teams to focus on high-quality development, testing, and collaboration."
  Image Input: For a visual representation, you might add an infographic that outlines the Agile process stages. If you don't have an image ready, you can later add one by finding an Agile process diagram online, right-clicking it, and selecting "copy image address" to paste into the input field.
  -Tags: #AgileMethodology #SoftwareDevelopment #ProjectManagement
  
  How to Add a Procedural Card
  1. Click on 'Add Procedural Card'. You will see a form with fields for the title, task steps, and image inputs.
  2. In the title, specify the skill that you want to remember, such as 'How to run the server in Next.js' or 'How to make chicken soup'. For the task steps, number the steps required to complete the task or at least separate them clearly.
  3. You can leave the image input empty and add it later, following the same process as for adding an image to a conceptual card.
  4. After clicking Create, your new card will be displayed. You can delete, edit, and review it, and you have the same features to add, remove, and create tags as with your conceptual card.
  5. When you click the review button, you will see a card with the title of the skill, and if available, the picture associated with the skill. You will see a button to display the steps; clicking on it will show you the steps that you typed in your form when creating the card. You will have an input field where you can type the steps that you remember. After finishing, you can click the 'feedback on steps' button. It will display a modal with feedback on your steps, offering recommendations if you forgot any of those steps.
  
  Example for Adding a Procedural Card:
  Title: "How to Create a Basic HTML Page"
  -Task Steps:
    1. Open a text editor: Start by opening your preferred code editor (e.g., Visual Studio Code).
    2. Write the basic structure: Type the basic HTML structure, including the <!DOCTYPE html> <html>, <head>, and <body> tags,
    3. Add a title: Inside the <head> section, add a <title> tag to name your webpage.
    4. Insert content: In the <body> section, add your content, such as <h1> for headings and <p> for paragraphs.
  5. Save the file: Save your file with a .html extension (e.g., index.html).
  6. View in a browser: Open the file in a web browser to see your basic HTML page.
  Image Input: You could add a screenshot of simple HTML code in the text editor or a flowchart diagramming the steps. If you don't have an image now, you can add it later by following the same image addition process described above.
  Tags: #HTML #WebDevelopment #CodingBasics
  `;

  return (
    <>
      <Button variant="dark" style={{ margin: '0 0 10px' }} onClick={handleShow}>
        How It Works
      </Button>

      <Modal className="my-dark-modal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Creating Your Conceptual and Procedural Card : A Guide</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ whiteSpace: 'pre-wrap' }}>{text}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InstructionConceptualAndProceduralModal;
