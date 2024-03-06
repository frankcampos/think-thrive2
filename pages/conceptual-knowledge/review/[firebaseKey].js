/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getSingleConceptualKnowledge } from '../../../api/conceptualknowledgeData';

function ReviewConceptualKnowledge() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [conceptualCard, setConceptualCard] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [example, setExample] = useState('');
  const [feedback, setFeedback] = useState('');

  const { question } = conceptualCard;
  console.warn(firebaseKey, 'firebaseKey');

  console.warn('question', conceptualCard.pathId);

  async function generateExample() {
    try {
      const response = await axios.post('/api/openai', {
        model: 'gpt-4-turbo',
        prompt: `Please explain the answer to this ${question} in the simplest way possible, as if you're talking to someone who's never heard about the topic before. Include an example of an acronym and a short, easy-to-understand story related to the question: '${question}'. Make sure your explanation is very clear and use examples that are easy to relate to.`,
        temperature: 0.7,
        max_tokens: 200,
      });
      setExample(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error OpenAi:', error);
    }
  }

  async function getAnswerFeedBack() {
    try {
      const response = await axios.post('/api/openai', {
        model: 'gpt-4-turbo',
        prompt: `Given the question: '${question}' and the provided answer: '${userAnswer}', please evaluate the accuracy, clarity, and completeness of the answer. Offer constructive feedback on how the answer could be improved, including suggestions for making it more understandable and engaging, and point out any missing information or inaccuracies.`,
        temperature: 0.7,
        max_tokens: 200,
      });
      setFeedback(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error OpenAi:', error);
    }
  }

  useEffect(() => {
    getSingleConceptualKnowledge(firebaseKey).then((response) => {
      setConceptualCard(response);
      setShowAnswer(false);
      generateExample();
    });
  },
  [userAnswer]);

  const handleClose = () => {
    router.push(`/conceptual-knowledge/${conceptualCard.pathId}`);
  };

  const handleShowAnswer = () => {
    getAnswerFeedBack();
    setUserAnswer('');
    if (showAnswer) {
      setShowAnswer(false);
      setUserAnswer('');
    } else {
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
          width: 'auto',
          backgroundColor: 'black',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        {!showAnswer && (
        <div>
          <h4 style={{ marginBottom: '20px', background: 'grey', borderRadius: '5px' }}>{conceptualCard.question}</h4>
          <Form.Control
            as="textarea"
            style={{
              width: '18rem',
              height: 'auto',
              margin: '10px',
              padding: '10px',
            }}
            type="text"
            placeholder="Enter Answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Show the Answer</Button>
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleClose}>Close</Button>
        </div>
        )}
        {showAnswer && (
        <div style={{ height: 'auto' }}>
          <h3 style={{ marginBottom: '10px', background: 'grey', borderRadius: '5px' }}>{conceptualCard.question}</h3>
          <h4 style={{ marginBottom: '10px', background: 'white', borderRadius: '5px' }}>{conceptualCard.answer}</h4>
          <h3 style={{ marginBottom: '10px', background: 'grey', borderRadius: '5px' }}>My Answer</h3>
          <h4 style={{ marginBottom: '10px', background: 'white', borderRadius: '5px' }}>{userAnswer}</h4>
          <h3 style={{ marginBottom: '10px', background: 'grey', borderRadius: '5px' }}>Answer Feedback</h3>
          <h4 style={{ marginBottom: '10px', background: 'white', borderRadius: '5px' }}>{feedback}</h4>
          <h3 style={{ marginBottom: '10px', background: 'grey', borderRadius: '5px' }}>Example</h3>
          <h4 style={{ marginBottom: '1px', background: 'white', borderRadius: '5px' }}>{example}</h4>
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Review</Button>
          <Button variant="dark" style={{ margin: '10px' }} onClick={handleClose}>Close</Button>
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
