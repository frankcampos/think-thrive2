/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ProceduralCardFormModal from './forms/proceduralCardFormModal';
import { deleteProceduralKnowledge } from '../api/proceduralknowledgeData';
import { useAuth } from '../utils/context/authContext';
import { getProceduralTagsByProceduralCardId } from '../api/proceduraltagsData';
import ProceduralModalTags from './proceduralmodalTags';

function ProceduralCard({ proceduralCard, onUpdate, userID }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [tags, setTags] = useState([]);

  const deletethisProceduralCard = () => {
    if (window.confirm(`Are you sure you want to delete "${proceduralCard.title}"?`)) {
      deleteProceduralKnowledge(proceduralCard.firebaseKey).then(onUpdate);
    }
  };

  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);
  const handleTagsModalClose = () => setShowTagsModal(false);
  const handleTagsModalOpen = () => setShowTagsModal(true);

  useEffect(() => {
    getProceduralTagsByProceduralCardId(proceduralCard?.firebaseKey).then(setTags);
  }, [proceduralCard?.pathId, showTagsModal, showModal]);

  const isOwner = user.uid === userID;

  return (
    <div className="flashcard flashcard-procedural">
      {/* ── Header strip ── */}
      <div className="flashcard-header flashcard-header-procedural">
        <span className="flashcard-header-label">
          ⚙ Procedural
        </span>
      </div>

      {/* ── Image zone ── */}
      {proceduralCard?.picture ? (
        <img
          src={proceduralCard.picture}
          alt={proceduralCard.title}
          className="flashcard-image"
          onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
        />
      ) : (
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(192,132,252,0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
        }}
        >
          ⚙️
        </div>
      )}

      {/* ── Body ── */}
      <div className="flashcard-body">
        <p className="flashcard-title">{proceduralCard?.title}</p>

        {/* Tags */}
        <div
          className="flashcard-tags"
          onClick={handleTagsModalOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTagsModalOpen()}
        >
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag.firebaseKey} className="glass-tag">{tag.tag_label}</span>
            ))
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
              + add tags
            </span>
          )}
        </div>

        <ProceduralModalTags show={showTagsModal} onHide={handleTagsModalClose} proceduralCardId={proceduralCard?.firebaseKey} />

        {/* Actions */}
        <div className="flashcard-actions">
          <Link href={`/procedural-knowledge/review/${proceduralCard?.firebaseKey}`} passHref>
            <Button className="glass-btn" size="sm">Review</Button>
          </Link>
          {isOwner && (
            <>
              <Button className="glass-btn-outline" size="sm" onClick={handleModalOpen}>Edit</Button>
              <ProceduralCardFormModal
                show={showModal}
                onHide={handleModalClose}
                pathId={proceduralCard?.pathId}
                onUpdate={onUpdate}
                objProceduralCard={proceduralCard}
              />
              <Button className="glass-btn-danger" size="sm" onClick={deletethisProceduralCard}>Delete</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ProceduralCard.propTypes = {
  proceduralCard: PropTypes.shape({
    title: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    firebaseKey: PropTypes.string.isRequired,
    pathId: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};

export default ProceduralCard;
