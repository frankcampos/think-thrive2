import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createTag, getTags, updateTag } from '../api/tagsData';
import { createConceptualTag, updateConceptualTag } from '../api/conceptualtagsData';

function ModalTags({ show, onHide, conceptualCardId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  console.warn(conceptualCardId);

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

  const addTagToTheConceptualCard = (tagObject) => {
    createConceptualTag({ tag_id: tagObject.firebaseKey, tag_label: tagObject.label, conceptual_card_id: conceptualCardId }).then(({ name }) => {
      const pathPayload = { firebaseKey: name };
      updateConceptualTag(pathPayload);
    });
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
          {tag.label}
          <Button
            style={{ marginLeft: '20px' }}
            variant="dark"
            onClick={() => {
              addTagToTheConceptualCard(tag);
            }}
          >
            Add Tag
          </Button>
        </div>
      ))}
      <Modal.Footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="primary" onClick={addTag}>
          Create Tag
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalTags.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  conceptualCardId: PropTypes.shape({}), // Update the prop type to a more specific shape
};

ModalTags.defaultProps = {
  conceptualCardId: {}, // Add defaultProps declaration for conceptualCardId
};

export default ModalTags;
