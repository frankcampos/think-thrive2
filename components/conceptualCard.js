import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../utils/context/authContext';
import { deleteConceptualKnowledge } from '../api/conceptualknowledgeData';
import ModalTags from './modalTags';

function ConceptualCard({ conceptualCard, onUpdate, userID }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const deletethisConceptualCard = () => {
    if (window.confirm(`Are you sure you want to delete this ${conceptualCard.question}?`)) deleteConceptualKnowledge(conceptualCard.firebaseKey).then(onUpdate());
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Card variant="danger" style={{ width: '19rem', padding: '10px', margin: '10px' }}>
      <Card.Title>{conceptualCard.question}</Card.Title>
      <Card.Img style={{ width: '100%', height: '250px' }} variant="top" src={conceptualCard.imageUrl} />
      <Card.Text onClick={handleShowModal}>
        Tags: no tags yet <br />
      </Card.Text>
      <ModalTags show={showModal} onHide={handleCloseModal} conceptualCardId={conceptualCard.firebaseKey} />
      <Card.Body>
        <Link href={`/conceptual-knowledge/review/${conceptualCard.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>Review
          </Button>
        </Link>
        {user.uid === userID && (
          <>
            <Link href={`/conceptual-knowledge/edit/${conceptualCard.firebaseKey}`} passHref>
              <Button variant="dark" style={{ marginRight: '10px' }}>
                Edit
              </Button>
            </Link>
            <Button variant="dark" onClick={deletethisConceptualCard} style={{ marginRight: '10px' }}>
              Delete
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
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
