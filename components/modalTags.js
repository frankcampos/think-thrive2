/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createTag, getTags, updateTag } from '../api/tagsData';
import {
  createConceptualTag, deleteConceptualTag, getConceptualTagByTagId, getConceptualTags, updateConceptualTag,
} from '../api/conceptualtagsData';

function ModalTags({ show, onHide, conceptualCardId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [conceptualTags, setConceptualTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  useEffect(() => {
    getTags().then((tagsArray) => setTags(tagsArray));
    getConceptualTags().then((arr) => setConceptualTags(arr));
  }, [searchTerm, filteredTags]);

  useEffect(() => {
    if (searchTerm !== '') {
      setFilteredTags(tags.filter((tag) => tag.label.toLowerCase().includes(searchTerm.toLowerCase())));
    } else {
      setFilteredTags(tags);
    }
  }, [searchTerm]);

  const addTag = () => {
    if (searchTerm.trim() === '') return;
    createTag({ label: searchTerm }).then(({ name }) => {
      updateTag({ firebaseKey: name });
      setFilteredTags([{ firebaseKey: name, label: searchTerm }]);
      setSearchTerm('');
    });
  };

  const removeTagOfTheConceptualCard = (tagObject) => {
    getConceptualTagByTagId(tagObject.firebaseKey).then((data) => {
      const { firebaseKey } = Object.values(data)[0];
      deleteConceptualTag(firebaseKey);
      setSearchTerm('');
      setFilteredTags(filteredTags);
      setConceptualTags((prev) => [...prev, {
        firebaseKey, tag_id: tagObject.firebaseKey, tag_label: tagObject.label, conceptual_card_id: conceptualCardId,
      }]);
    });
  };

  const isTagInCard = (tag) => conceptualTags.some(
    (ct) => ct.tag_label === tag.label && ct.conceptual_card_id === conceptualCardId,
  );

  const tagsController = (tag) => {
    if (isTagInCard(tag)) {
      removeTagOfTheConceptualCard(tag);
    } else {
      createConceptualTag({ tag_id: tag.firebaseKey, tag_label: tag.label, conceptual_card_id: conceptualCardId })
        .then(({ name }) => updateConceptualTag({ firebaseKey: name }));
    }
    setSearchTerm('');
    getTags().then(setTags);
    getConceptualTags().then(setConceptualTags);
    setFilteredTags(conceptualTags);
  };

  const showCreateButton = searchTerm.trim() !== ''
    && !filteredTags.some((tag) => tag?.label?.toLowerCase() === searchTerm.toLowerCase());

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="glass-modal-content">
      <Modal.Header
        closeButton
        closeVariant="white"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px' }}
      >
        <div>
          <div style={{
            fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#00d4ff', marginBottom: '2px',
          }}
          >
            Conceptual Card
          </div>
          <Modal.Title style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white' }}>
            Manage Tags
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '16px 20px' }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="Search or create a tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && showCreateButton && addTag()}
          className="glass-input"
          style={{
            width: '100%', padding: '10px 14px', marginBottom: '14px', borderRadius: '8px',
          }}
        />

        {/* Tag list */}
        <div style={{
          maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px',
        }}
        >
          {filteredTags.length === 0 && (
            <p style={{
              color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0',
            }}
            >
              No tags found.
            </p>
          )}
          {filteredTags.map((tag) => {
            const active = isTagInCard(tag);
            return (
              <div
                key={tag.firebaseKey}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: active ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
                  border: active ? '1px solid rgba(0,212,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontWeight: '500', fontSize: '0.88rem', color: active ? '#00d4ff' : 'rgba(255,255,255,0.85)' }}>
                  {active && <span style={{ marginRight: '6px' }}>✓</span>}
                  {tag.label}
                </span>
                <Button
                  size="sm"
                  className={active ? 'glass-btn-danger' : 'glass-btn'}
                  onClick={() => tagsController(tag)}
                  style={{ minWidth: '64px' }}
                >
                  {active ? 'Remove' : '+ Add'}
                </Button>
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer style={{
        borderTop: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
      }}
      >
        <Button className="glass-btn-outline" onClick={onHide}>Close</Button>
        {showCreateButton && (
          <Button className="glass-btn" onClick={addTag}>
            + Create &ldquo;{searchTerm}&rdquo;
          </Button>
        )}
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
