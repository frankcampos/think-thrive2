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
  const [userAnswer, setUserAnswer] = useState('');
  console.warn(firebaseKey);

  useEffect(() => {
    getSingleConceptualKnowledge(firebaseKey).then((response) => {
      setConceptualCard(response);
      setShowAnswer(false);
    });
  },
  []);

  const handleShowAnswer = () => {
    setUserAnswer('');
    if (showAnswer) {
      setShowAnswer(false);
      setUserAnswer('');
    }

    if (!showAnswer) {
      setShowAnswer(true);
      setUserAnswer(userAnswer);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    }}
    >
      <Card
        variant="dark"
        style={{
          width: '23rem',
          height: 'auto',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {!showAnswer && (
        <div>
          <h4 style={{ marginBottom: '20px' }}>{conceptualCard.question}</h4>
          <Form.Control
            as="textarea"
            style={{
              width: '18rem',
              height: '100px',
              margin: '10px',
              padding: '10px',
            }}
            type="text"
            placeholder="Enter Answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Show the Answer</Button>
        </div>
        )}
        {showAnswer && (
        <div>
          <h4 style={{ marginBottom: '20px' }}>{conceptualCard.question}</h4>
          <p>__________________________________</p>
          <h5 style={{ marginBottom: '10px' }}>{conceptualCard.answer}</h5>
          <p>__________________________________</p>
          <h5 style={{ marginBottom: '10px' }}>what I remember</h5>
          <p>__________________________________</p>
          <h6 style={{ marginBottom: '1px' }}>{userAnswer}</h6>
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
