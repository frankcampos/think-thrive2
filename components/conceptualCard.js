/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
    if (window.confirm(`Are you sure you want to delete this ${conceptualCard.question}?`)) deleteConceptualKnowledge(conceptualCard.firebaseKey).then(onUpdate());
  };
  useEffect(() => {
    getConceptualTagsByConceptualCardId(conceptualCard.firebaseKey).then((response) => {
      setTags(response);
    });
  }, [conceptualCard.pathId, showModal]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    onUpdate();
  };
  return (
    <Card
      variant="danger"
      style={{
        width: '19rem', padding: '10px', margin: '10px', background: 'black', borderRadius: '10px', boxShadow: '5px 5px 5px grey',
      }}
    >
      <Card.Title style={{ background: 'grey', borderRadius: '5px', padding: '5px' }}>{conceptualCard.question}</Card.Title>
      <Card.Img style={{ borderRadius: '10px', width: '100%', height: '250px' }} variant="top" src={conceptualCard.imageUrl} />
      <Card.Text
        style={{
          background: 'grey', borderRadius: '5px', marginTop: '10px', padding: '5px',
        }}
        onClick={handleShowModal}
      >
        Tags: {tags.map((tag) => (
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
      <ModalTags show={showModal} onHide={handleCloseModal} conceptualCardId={conceptualCard.firebaseKey} />
      <Card.Body>
        <Link href={`/conceptual-knowledge/review/${conceptualCard.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }}>Review
          </Button>
        </Link>
        {user.uid === userID && (
          <>
            <Link href={`/conceptual-knowledge/edit/${conceptualCard.firebaseKey}`} passHref>
              <Button variant="dark" style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }}>
                Edit
              </Button>
            </Link>
            <Button variant="dark" onClick={deletethisConceptualCard} style={{ marginRight: '10px', boxShadow: '2px 2px 2px white' }}>
              Delete
            </Button>
          </>
        )}
        <Card.Text style={{
          background: 'grey', borderRadius: '5px', marginTop: '20px', padding: '5px', width: 'auto', color: 'white',
        }}
        >
          Conceptual Card
        </Card.Text>
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
