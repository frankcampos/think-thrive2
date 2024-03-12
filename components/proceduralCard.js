import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ProceduralCardFormModal from './forms/proceduralCardFormModal';
import { deleteProceduralKnowledge } from '../api/proceduralknowledgeData';
import { useAuth } from '../utils/context/authContext';

function ProceduralCard({ proceduralCard, onUpdate, userID }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const deletethisProceduralCard = () => {
    if (window.confirm(`Are you sure you want to delete this ${proceduralCard.title}?`)) deleteProceduralKnowledge(proceduralCard.firebaseKey).then(onUpdate());
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <Card
      style={{
        width: '19rem', padding: '10px', margin: '10px', background: 'black', borderRadius: '10px',
      }}
    >
      <Card.Title style={{ background: 'grey', borderRadius: '5px', padding: '5px' }}>{proceduralCard.title}</Card.Title>
      <Card.Img
        variant="top"
        src={proceduralCard.picture}
        style={{
          width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px',
        }}
      />
      <Card.Text style={{
        background: 'grey', borderRadius: '5px', marginTop: '10px', padding: '5px',
      }}
      >
        Tags:
      </Card.Text>
      <Card.Body>
        <Link href="./" passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>Review
          </Button>
        </Link>
        {user.uid === userID && (
        <>
          <Button variant="dark" style={{ marginRight: '10px' }} onClick={handleModalOpen}>
            Edit
          </Button>
          <ProceduralCardFormModal
            show={showModal}
            onHide={handleModalClose}
            pathId={proceduralCard.pathId}
            onUpdate={onUpdate}
            objProceduralCard={proceduralCard}
          />
          <Button variant="dark" onClick={deletethisProceduralCard} style={{ marginRight: '10px' }}>
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
