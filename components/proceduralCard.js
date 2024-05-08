/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
    if (window.confirm(`Are you sure you want to delete this ${proceduralCard.title}?`)) deleteProceduralKnowledge(proceduralCard.firebaseKey).then(onUpdate());
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleTagsModalClose = () => {
    setShowTagsModal(false);
  };

  const handleTagsModalOpen = () => {
    setShowTagsModal(true);
  };

  useEffect(() => {
    getProceduralTagsByProceduralCardId(proceduralCard?.firebaseKey).then((response) => {
      setTags(response);
    });
  }, [proceduralCard?.pathId, showTagsModal, showModal]);

  return (
    <Card
      style={{
        width: '19rem', padding: '10px', margin: '10px', background: 'black', borderRadius: '10px', boxShadow: '5px 5px 5px grey',
      }}
    >
      <Card.Title style={{ background: 'grey', borderRadius: '5px', padding: '5px' }}>{proceduralCard?.title}</Card.Title>
      <Card.Img
        variant="top"
        src={proceduralCard?.picture}
        style={{
          width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px',
        }}
      />
      <Card.Text
        style={{
          background: 'grey', borderRadius: '5px', marginTop: '10px', padding: '5px',
        }}
        onClick={handleTagsModalOpen}
      >
        Tags:{tags.map((tag) => (
          <span
            key={tag.firebaseKey}
            style={{
              display: 'inline-block',
              padding: '5px',
              margin: '2px',
              borderRadius: '5px',
              backgroundColor: 'black',
              color: 'white',
            }}
          >{tag.tag_label}
          </span>
      ))}
      </Card.Text>
      <ProceduralModalTags show={showTagsModal} onHide={handleTagsModalClose} proceduralCardId={proceduralCard?.firebaseKey} />
      <Card.Body>
        <Link href={`/procedural-knowledge/review/${proceduralCard?.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }}>Review
          </Button>
        </Link>
        {user.uid === userID && (
          <>
            <Button variant="dark" style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }} onClick={handleModalOpen}>
              Edit
            </Button>
            <ProceduralCardFormModal
              show={showModal}
              onHide={handleModalClose}
              pathId={proceduralCard?.pathId}
              onUpdate={onUpdate}
              objProceduralCard={proceduralCard}
            />
            <Button variant="dark" onClick={deletethisProceduralCard} style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }}>
              Delete
            </Button>
          </>
        )}
        <Card.Text style={{
          background: 'grey', borderRadius: '5px', marginTop: '20px', padding: '5px', width: 'auto', color: 'blue',
        }}
        >
          Procedural Card
        </Card.Text>
      </Card.Body>

    </Card>

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
