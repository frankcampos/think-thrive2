/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
import { deleteConceptualKnowledge } from '../api/conceptualknowledgeData';
import { getConceptualTagsByConceptualCardId } from '../api/conceptualtagsData';
import ModalTags from './modalTags';

function ConceptualCard({ conceptualCard, onUpdate, userID }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState([]);

  const deletethisConceptualCard = () => {
    if (window.confirm(`Are you sure you want to delete "${conceptualCard.question}"?`)) {
      deleteConceptualKnowledge(conceptualCard.firebaseKey).then(onUpdate);
    }
  };

  useEffect(() => {
    getConceptualTagsByConceptualCardId(conceptualCard.firebaseKey).then(setTags);
  }, [conceptualCard.pathId, showModal]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    onUpdate();
  };

  const isOwner = user.uid === userID;

  return (
    <div className="flashcard flashcard-conceptual">
      {/* ── Header strip ── */}
      <div className="flashcard-header flashcard-header-conceptual">
        <span className="flashcard-header-label">
          ◆ Conceptual
        </span>
        {conceptualCard.difficulty && (
          <span style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            background: 'rgba(0,0,0,0.2)',
            padding: '2px 8px',
            borderRadius: '10px',
            color: 'white',
            textTransform: 'capitalize',
          }}
          >
            {conceptualCard.difficulty}
          </span>
        )}
      </div>

      {/* ── Image zone ── */}
      {conceptualCard.imageUrl ? (
        <img
          src={conceptualCard.imageUrl}
          alt={conceptualCard.question}
          className="flashcard-image"
          onError={(e) => { e.target.src = '/placeholder-image.svg'; }}
        />
      ) : (
        <div style={{
          height: '120px',
          background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,255,0.05))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
        }}
        >
          💡
        </div>
      )}

      {/* ── Body ── */}
      <div className="flashcard-body">
        <p className="flashcard-title">{conceptualCard.question}</p>

        {/* Tags */}
        <div
          className="flashcard-tags"
          onClick={handleShowModal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleShowModal()}
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

        <ModalTags show={showModal} onHide={handleCloseModal} conceptualCardId={conceptualCard.firebaseKey} />

        {/* Actions */}
        <div className="flashcard-actions">
          <Link href={`/conceptual-knowledge/review/${conceptualCard.firebaseKey}`} passHref>
            <Button className="glass-btn" size="sm">Review</Button>
          </Link>
          {isOwner && (
            <>
              <Link href={`/conceptual-knowledge/edit/${conceptualCard.firebaseKey}`} passHref>
                <Button className="glass-btn-outline" size="sm">Edit</Button>
              </Link>
              <Button className="glass-btn-danger" size="sm" onClick={deletethisConceptualCard}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

ConceptualCard.propTypes = {
  conceptualCard: PropTypes.shape({
    firebaseKey: PropTypes.string,
    question: PropTypes.string,
    imageUrl: PropTypes.string,
    difficulty: PropTypes.string,
    user_id: PropTypes.string,
    pathId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};

export default ConceptualCard;
