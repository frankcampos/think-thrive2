/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ModalHeader from 'react-bootstrap/ModalHeader';
import { createTag, getTags, updateTag } from '../api/tagsData';
import {
  createProceduralTag, deleteProceduralTag, getProceduralTagsByTagId, getProceduralTags, updateProceduralTag,
} from '../api/proceduraltagsData';

function ProceduralModalTags({
  show, onHide, proceduralCardId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [proceduralTags, setProceduralTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);
  useEffect(() => {
    getTags().then((tagsArray) => setTags(tagsArray));
    getProceduralTags().then((proceduralTagsArray) => setProceduralTags(proceduralTagsArray));
  }, [searchTerm, filteredTags]); // [filteredTags, proceduralTags] it was causing to many re-renders

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

  const removeTagOfTheProceduralCard = (tagObject) => {
    const tagId = tagObject.firebaseKey;
    getProceduralTagsByTagId(tagId).then((data) => {
      const { firebaseKey } = Object.values(data)[0];
      console.warn('this is my firebasekey', firebaseKey);
      deleteProceduralTag(firebaseKey);
      setSearchTerm('');
      setFilteredTags(filteredTags);
      // I was using filteredTags also in setContentualTags
      setProceduralTags((prevTags) => [...prevTags, {
        firebaseKey, tag_id: tagObject.firebaseKey, tag_label: tagObject.label, procedural_card_id: proceduralCardId,
      }]);
    });
  };

  const isTagINProceduralCard = (tag, proceduralCardsTags, proceduralCardID) => proceduralCardsTags.some((proceduraltag) => proceduraltag.tag_label === tag.label && proceduraltag.procedural_card_id === proceduralCardID);

  const addTagToTheProceduralCard = (tagObject) => {
    createProceduralTag({ tag_id: tagObject.firebaseKey, tag_label: tagObject.label, procedural_card_id: proceduralCardId }).then(({ name }) => {
      const pathPayload = { firebaseKey: name };
      updateProceduralTag(pathPayload);
      setSearchTerm('');
      setFilteredTags(filteredTags);
    });
  };

  const tagsController = (tag, proceduralCardsTags, proceduralCardID) => {
    const tagIsInProceduralCard = isTagINProceduralCard(tag, proceduralCardsTags, proceduralCardID);
    if (tagIsInProceduralCard) {
      removeTagOfTheProceduralCard(tag);
    } else {
      addTagToTheProceduralCard(tag);
    }
    getTags().then((tagsArray) => setTags(tagsArray));
    getProceduralTags().then((proceduralTagsArray) => setProceduralTags(proceduralTagsArray));
    setFilteredTags(proceduralTags);
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
    <Modal className="my-dark-modal" show={show} onHide={onHide}>
      <ModalHeader closeButton closeVariant="white">
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
          tagsController(tag, proceduralTags, proceduralCardId);
        }}
      >
        {isTagINProceduralCard(tag, proceduralTags, proceduralCardId) ? 'Remove' : 'Add'}
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

ProceduralModalTags.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  proceduralCardId: PropTypes.shape({}),
};

ProceduralModalTags.defaultProps = {
  proceduralCardId: {},
};

export default ProceduralModalTags;
