/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { createTag, getTags, updateTag } from '../api/tagsData';
import {
  createConceptualTag, deleteConceptualTag, getConceptualTagByTagId, getConceptualTags, updateConceptualTag,
} from '../api/conceptualtagsData';

function ModalTags({
  show, onHide, conceptualCardId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [conceptualTags, setConceptualTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  useEffect(() => {
    getTags().then((tagsArray) => setTags(tagsArray));
    getConceptualTags().then((conceptualTagsArray) => setConceptualTags(conceptualTagsArray));
  }, [searchTerm, filteredTags]); // [filteredTags, conceptualTags] it was causing to many re-renders

  const addTag = () => {
    if (searchTerm.trim() === '') {
      return;
    }

    createTag({ label: searchTerm }).then(({ name }) => {
      const pathPayload = { firebaseKey: name };
      updateTag(pathPayload);

      setFilteredTags([{
        firebaseKey: name,
        label: searchTerm,
      }]);
      setSearchTerm('');
    });
  };

  const removeTagOfTheConceptualCard = (tagObject) => {
    const tagId = tagObject.firebaseKey;
    getConceptualTagByTagId(tagId).then((data) => {
      const { firebaseKey } = Object.values(data)[0];
      console.warn('this is my firebasekey', firebaseKey);
      deleteConceptualTag(firebaseKey);
      setSearchTerm('');
      setFilteredTags(filteredTags);
      // I was using filteredTags also in setContentualTags
      setConceptualTags((prevTags) => [...prevTags, {
        firebaseKey, tag_id: tagObject.firebaseKey, tag_label: tagObject.label, conceptual_card_id: conceptualCardId,
      }]);
    });
  };

  const isTagINConceptualCard = (tag, conceptualCardsTags, conceptualCardID) => conceptualCardsTags.some((conceptualtag) => conceptualtag.tag_label === tag.label && conceptualtag.conceptual_card_id === conceptualCardID);

  const addTagToTheConceptualCard = (tagObject) => {
    createConceptualTag({ tag_id: tagObject.firebaseKey, tag_label: tagObject.label, conceptual_card_id: conceptualCardId }).then(({ name }) => {
      const pathPayload = { firebaseKey: name };
      updateConceptualTag(pathPayload);
      setSearchTerm('');
      setFilteredTags(filteredTags);
    });
  };

  const tagsController = (tag, conceptualCardsTags, conceptualCardID) => {
    const tagIsInConceptualCard = isTagINConceptualCard(tag, conceptualCardsTags, conceptualCardID);
    if (tagIsInConceptualCard) {
      removeTagOfTheConceptualCard(tag);
      setSearchTerm('');
    } else {
      addTagToTheConceptualCard(tag);
    }
    getTags().then((tagsArray) => setTags(tagsArray));
    getConceptualTags().then((conceptualTagsArray) => setConceptualTags(conceptualTagsArray));
    setFilteredTags(conceptualTags);
  };

  useEffect(() => {
    if (searchTerm !== '') {
      const filtered = tags.filter((tag) => tag.label.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredTags(filtered);
    } else {
      setFilteredTags(tags);
    }
  }, [searchTerm]);

  return (
    <Modal className="my-dark-modal text-dark" show={show} onHide={onHide}>
      <ModalHeader closeButton closeVariant=" white">
        <Modal.Title>Tags</Modal.Title>
      </ModalHeader>
      <Modal.Body>
        <input type="text" placeholder="Search Tag" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </Modal.Body>
      {
  filteredTags.map((tag) => (
    <div
      key={tag.firebaseKey}
      style={{
        display: 'inline-block', padding: '5px', borderRadius: '5px', backgroundColor: '#f0f0f0', margin: '5px', color: 'black',
      }}
    >
      {tag.label}
      <Button
        style={{ marginLeft: '20px', backgroundColor: '#007bff', color: 'white' }}
        variant="dark"
        onClick={() => {
          tagsController(tag, conceptualTags, conceptualCardId);
        }}
      >
        {isTagINConceptualCard(tag, conceptualTags, conceptualCardId) ? 'Remove' : 'Add'}
      </Button>
    </div>
  ))
}
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {
          !filteredTags.some((tag) => tag && tag.label && tag.label.toLowerCase() === searchTerm.toLowerCase()) && (
            <Button variant="primary" onClick={addTag}>
              Create Tag
            </Button>
          )
        }
      </Modal.Footer>
    </Modal>
  );
}

ModalTags.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  conceptualCardId: PropTypes.shape({}),
};

ModalTags.defaultProps = {
  conceptualCardId: {},
};

export default ModalTags;
