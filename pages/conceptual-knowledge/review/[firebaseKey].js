/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
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
        prompt: `Hey there! You've just tackled a flashcard with the question: '${question}' and you've provided this answer: '${userAnswer}'. Let's take a moment to dive into how accurate and helpful your answer was. We'll look into the details together and see if there's anything missing or if there were any inaccuracies. I'll also share some tips on how you can make your answers even stronger, clearer, and more engaging. The goal here is to boost your understanding and make learning a more enjoyable journey. Ready? Let's get started!`,
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
      // generateExample();
    });
  }, []);

  const handleClose = () => {
    router.push(`/conceptual-knowledge/${conceptualCard.pathId}`);
  };

  const handleGoToTestMode = () => {
    router.push({
      pathname: '/Test',
      query: { firebaseKey },
    });
  };
  const handleShowAnswer = () => {
    getAnswerFeedBack();
    generateExample();
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
    <Container style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto', padding: '20px',
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
                width: '98%',
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
            <Button variant="dark" style={{ margin: '10px' }} onClick={handleGoToTestMode}>Go to Test Mode</Button>
          </div>
        )}
        {showAnswer && (
          <div style={{ height: 'auto' }}>
            <h3 style={{
              marginBottom: '10px', background: 'grey', borderRadius: '5px', padding: '5px',
            }}
            >{conceptualCard.question}
            </h3>
            <h4 style={{
              marginBottom: '10px', background: 'white', borderRadius: '5px', padding: '5px',
            }}
            >{conceptualCard.answer}
            </h4>
            <h3 style={{
              marginBottom: '10px', background: 'grey', borderRadius: '5px', padding: '5px',
            }}
            >My Answer
            </h3>
            <h4 style={{
              marginBottom: '10px', background: 'white', borderRadius: '5px', padding: '5px',
            }}
            >{userAnswer}
            </h4>
            <h3 style={{
              marginBottom: '10px', background: 'grey', borderRadius: '5px', padding: '5px',
            }}
            >Answer Feedback
            </h3>
            <pre style={{
              marginBottom: '10px',
              background: 'white',
              borderRadius: '5px',
              padding: '5px',
              whiteSpace: 'pre-wrap',
              fontSize: '16px', // Add this line to make the text bigger
            }}
            >
              <code>
                {feedback}
              </code>
            </pre>
            <h3 style={{
              marginBottom: '10px', background: 'grey', borderRadius: '5px', padding: '5px',
            }}
            >Example
            </h3>
            <pre style={{
              marginBottom: '10px',
              background: 'white',
              borderRadius: '5px',
              padding: '5px',
              whiteSpace: 'pre-wrap',
              fontSize: '16px', // Add this line to make the text bigger

            }}
            >
              <code>
                {example}
              </code>
            </pre>
            <Button variant="dark" style={{ margin: '10px' }} onClick={handleShowAnswer}>Review</Button>
            <Button variant="dark" style={{ margin: '10px' }} onClick={handleClose}>Close</Button>
          </div>
        )}
      </Card>
    </Container>
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
