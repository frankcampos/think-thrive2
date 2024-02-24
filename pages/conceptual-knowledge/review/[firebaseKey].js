/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getSingleConceptualKnowledge } from '../../../api/conceptualknowledgeData';

function ReviewConceptualKnowledge() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [conceptualCard, setConceptualCard] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  console.warn(firebaseKey);

  useEffect(() => {
    getSingleConceptualKnowledge(firebaseKey).then((response) => {
      setConceptualCard(response);
      setShowAnswer(false);
    });
  },
  []);

  const handleShowAnswer = () => {
    if (showAnswer) {
      setShowAnswer(false);
    }

    if (!showAnswer) {
      setShowAnswer(true);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    }}
    >
      <Card variant="dark" style={{ width: '23rem', height: '400px' }}>
        {!showAnswer && (
        <div>
          <h1>{conceptualCard.question}</h1>
          <Form.Control
            style={{
              width: '20rem',
              height: '100px',
              margin: '10px',
            }}
            type="text"
            placeholder="Enter Answer"
          />
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Show the Answer</Button>
        </div>
        )}
        {showAnswer && (
        <div>
          <h3>{conceptualCard.question}</h3>
          <h5>{conceptualCard.answer}</h5>
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Review</Button>
        </div>
        )}
      </Card>
    </div>
  );
}

ReviewConceptualKnowledge.propTypes = {
  conceptualCard: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
  }).isRequired,
};

export default ReviewConceptualKnowledge;
