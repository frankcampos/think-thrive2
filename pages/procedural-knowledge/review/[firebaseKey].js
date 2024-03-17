/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button, Container, Form, Spinner, Row, Col,
} from 'react-bootstrap';
import { getProceduralKnowledgeByFirebaseKey } from '../../../api/proceduralknowledgeData';
import FeedbackOnStepsModal from '../../../components/feedbackonStepsModal';

const ProceduralCardKnowledgeReviewPage = () => {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [showSteps, setShowSteps] = useState(false);
  const [taskSteps, setTaskSteps] = useState('');
  const [proceduralCard, setProceduralCard] = useState({});
  const [example, setExample] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProceduralKnowledgeByFirebaseKey(firebaseKey).then((response) => setProceduralCard(response));
  }, [firebaseKey]);

  async function getStepsFeedBack() {
    setLoading(true);
    try {
      const response = await axios.post('/api/openai', {
        model: 'gpt-4-turbo',
        prompt: `Considering the task of '${proceduralCard.title}', you've outlined these steps: '${taskSteps}'. Let's take a closer look together to see if anything might have been missed or could be tweaked for better clarity or efficiency. After reviewing, I'll suggest a revised set of steps that includes any improvements or additional actions needed to complete the task more effectively. Remember, it's all about making the process as smooth and straightforward as possible for you.`,
        max_tokens: 600,
      });
      setExample(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error OpenAi:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'taskSteps') {
      setTaskSteps(value);
    } else {
      setProceduralCard((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    getStepsFeedBack();
    setTaskSteps('');
    setShowModal(true);
  };

  return (
    <Container
      style={{
        background: 'black', position: 'relative', width: '90%', borderRadius: '10px', padding: '20px',
      }}
    >
      <Button
        onClick={() => router.push(`/conceptual-knowledge/${proceduralCard.pathId}`)}
        style={{
          position: 'absolute', right: 0, marginTop: '10px', marginRight: '10px', background: 'grey', color: 'black',
        }}
      >X
      </Button>
      <h1 style={{
        textAlign: 'center', padding: '10px', background: 'grey', borderRadius: '10px',
      }}
      >{proceduralCard.title ? proceduralCard.title.toUpperCase() : ''}
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
      >
        <img
          style={{
            marginTop: '20px',
            width: '50%',
            height: '50%',
            borderRadius: '10px',
          }}
          src={proceduralCard.picture}
          alt={proceduralCard.title}
        />
      </div>
      <Button
        onClick={() => {
          setShowSteps(!showSteps);
          setShowModal(false); // hide the modal when the "Hide Steps" button is clicked
        }}
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '20px', background: 'grey', color: 'black',
        }}
      >{showSteps ? 'Hide Steps' : 'Show Steps'}
      </Button>
      {!showSteps && (
        <div>
          <h2 style={{
            textAlign: 'center', paddingBottom: '10px', background: 'grey', color: ' black', borderRadius: '10px',
          }}
          >Steps
          </h2>
          {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10vh',
          }}
          >
            <Spinner animation="border" variant="white" />
            <p style={{ color: 'white' }}>Loading...</p>
          </div>
          )}
          <Form>
            <Form.Group controlId="formTaskSteps">
              <Form.Label style={{ color: 'white' }}>Type the Steps that you remember</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="Recall your steps" name="taskSteps" value={taskSteps} onChange={handleChange} />
            </Form.Group>
          </Form>
          <Row>
            <Col>
              <Button
                variant="secondary"
                onClick={handleSubmit}
                style={{
                  display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '20px', color: 'black',
                }}
              >feedback on steps
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => router.push(`/conceptual-knowledge/${proceduralCard.pathId}`)}
                style={{
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: '20px',
                  marginBottom: '20px',
                  color: 'black',
                }}
                variant="secondary"
              >Close
              </Button>
            </Col>
          </Row>
            {!loading && showModal && <FeedbackOnStepsModal feedbackMessage={example} handleShow={showModal} />}
        </div>
      )}
      {showSteps && (
        <div>
          <h2 style={{ textAlign: 'center', color: 'white' }}>Steps</h2>
          <Form>
            <Form.Group controlId="formTaskSteps">
              <Form.Label style={{ color: 'white' }}>TaskSteps</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="BreakDown Each Task Into Steps" name="taskStepsRecall" value={proceduralCard.taskSteps} onChange={handleChange} readOnly style={{ fontSize: '20px' }} />
            </Form.Group>
          </Form>
          <Button
            onClick={() => router.push(`/conceptual-knowledge/${proceduralCard.pathId}`)}
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '20px',
              marginBottom: '20px',
              color: 'black',
            }}
            variant="secondary"
          >Close
          </Button>
        </div>
      )}

    </Container>
  );
};

export default ProceduralCardKnowledgeReviewPage;
