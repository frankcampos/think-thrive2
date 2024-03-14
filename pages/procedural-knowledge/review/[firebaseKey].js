/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { getProceduralKnowledgeByFirebaseKey } from '../../../api/proceduralknowledgeData';
import FeedbackOnStepsModal from '../../../components/feedbackonStepsModal';

const ProceduralCardKnowledgeReviewPage = () => {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [showSteps, setShowSteps] = useState(false);
  const [taskSteps, setTaskSteps] = useState('');
  const [proceduralCard, setProceduralCard] = useState({});
  const [example, setExample] = useState('');
  console.warn(taskSteps);
  useEffect(() => {
    getProceduralKnowledgeByFirebaseKey(firebaseKey).then((response) => setProceduralCard(response));
  }, [firebaseKey]);

  async function getStepsFeedBack() {
    try {
      const response = await axios.post('/api/openai', {
        model: 'gpt-4-turbo',
        prompt: `Please explain the answer to this ${taskSteps} in the simplest way possible, as if you're talking to someone who's never heard about the topic before. Include an example of an acronym and a short, easy-to-understand story related to the taskSteps: '${taskSteps}'. Make sure your explanation is very clear and use examples that are easy to relate to.`,
        temperature: 0.7,
        max_tokens: 200,
      });
      setExample(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error OpenAi:', error);
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
    console.warn(taskSteps);
    getStepsFeedBack();
  };

  console.warn('this is the example', example);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{proceduralCard.title}</h1>
      <img
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: ' 20px', width: '90%', height: '90%',
        }}
        src={proceduralCard.picture}
        alt={proceduralCard.title}
      />
      <Button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px',
        }}
      >{showSteps ? 'Hide Steps' : 'Show Steps'}
      </Button>
      {!showSteps && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Steps</h2>
          <Form>
            <Form.Group controlId="formTaskSteps">
              <Form.Label>Type the Steps that you remenber</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="Recall your steps" name="taskSteps" value={taskSteps} onChange={handleChange} />
            </Form.Group>
          </Form>
          <Button
            onClick={handleSubmit}
            style={{
              display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px',
            }}
          >feedback on steps
          </Button>
          <FeedbackOnStepsModal feedbackMessage={example} handleShow={handleSubmit} />
        </div>
      )}
      {showSteps && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Steps</h2>
          <Form>
            <Form.Group controlId="formTaskSteps">
              <Form.Label>TaskSteps</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="BreakDown Each Task Into Steps" name="taskStepsRecall" value={proceduralCard.taskSteps} onChange={handleChange} />
            </Form.Group>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ProceduralCardKnowledgeReviewPage;
