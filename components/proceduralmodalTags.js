/* eslint-disable react-hooks/exhaustive-deps */
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createTag, getTags, updateTag } from '../api/tagsData';
import {
  createProceduralTag, deleteProceduralTag, getProceduralTagsByTagId, getProceduralTags, updateProceduralTag,
} from '../api/proceduraltagsData';

function ProceduralModalTags({ show, onHide, proceduralCardId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState([]);
  const [proceduralTags, setProceduralTags] = useState([]);
  const [filteredTags, setFilteredTags] = useState([]);

  useEffect(() => {
    getTags().then(setTags);
    getProceduralTags().then(setProceduralTags);
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

  const removeTagOfTheProceduralCard = (tagObject) => {
    getProceduralTagsByTagId(tagObject.firebaseKey).then((data) => {
      const { firebaseKey } = Object.values(data)[0];
      deleteProceduralTag(firebaseKey);
      setSearchTerm('');
      setFilteredTags(filteredTags);
      setProceduralTags((prev) => [...prev, {
        firebaseKey, tag_id: tagObject.firebaseKey, tag_label: tagObject.label, procedural_card_id: proceduralCardId,
      }]);
    });
  };

  const isTagInCard = (tag) => proceduralTags.some(
    (pt) => pt.tag_label === tag.label && pt.procedural_card_id === proceduralCardId,
  );

  const tagsController = (tag) => {
    if (isTagInCard(tag)) {
      removeTagOfTheProceduralCard(tag);
    } else {
      createProceduralTag({ tag_id: tag.firebaseKey, tag_label: tag.label, procedural_card_id: proceduralCardId })
        .then(({ name }) => updateProceduralTag({ firebaseKey: name }));
    }
    setSearchTerm('');
    getTags().then(setTags);
    getProceduralTags().then(setProceduralTags);
    setFilteredTags(proceduralTags);
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
            fontSize: '0.68rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#c084fc', marginBottom: '2px',
          }}
          >
            Procedural Card
          </div>
          <Modal.Title style={{ fontWeight: '700', fontSize: '1.1rem', color: 'white' }}>
            Manage Tags
          </Modal.Title>
        </div>
      </Modal.Header>

      <Modal.Body style={{ padding: '16px 20px' }}>
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
                  background: active ? 'rgba(192,132,252,0.15)' : 'rgba(255,255,255,0.06)',
                  border: active ? '1px solid rgba(192,132,252,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontWeight: '500', fontSize: '0.88rem', color: active ? '#c084fc' : 'rgba(255,255,255,0.85)' }}>
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

ProceduralModalTags.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  proceduralCardId: PropTypes.shape({}),
};

ProceduralModalTags.defaultProps = {
  proceduralCardId: {},
};

export default ProceduralModalTags;
