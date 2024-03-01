// give me a modal with a browser with a button, I will add the functionality later
//
// And this snippet from components/modalTags.js:
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createTag, getTags, updateTag } from '../api/tagsData';

function ModalTags({ show, onHide }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  console.warn(searchTerm);

  useEffect(() => {
    getTags().then((tagsArray) => setTags(tagsArray));
  },
  []);

  const addTag = () => {
    createTag({ label: searchTerm }).then(({ name }) => {
      const pathPayload = { firebaseKey: name };
      updateTag(pathPayload);
    });
    setSearchTerm('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Modal.Body>
      {tags.map((tag) => (
        <div key={tag.firebaseKey}>
          <p>{tag.label}</p>
        </div>
      ))}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        <Button variant="primary" onClick={addTag}>
          Add Tag
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalTags.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ModalTags;
