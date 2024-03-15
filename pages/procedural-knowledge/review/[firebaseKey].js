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
        prompt: `Considering the task of '${proceduralCard.title}', you've outlined these steps: '${taskSteps}'. Let's take a closer look together to see if anything might have been missed or could be tweaked for better clarity or efficiency. After reviewing, I'll suggest a revised set of steps that includes any improvements or additional actions needed to complete the task more effectively. Remember, it's all about making the process as smooth and straightforward as possible for you.`,
        max_tokens: 600,
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
      <h1 style={{ textAlign: 'center', padding: '10px' }}>{proceduralCard.title ? proceduralCard.title.toUpperCase() : ''}</h1>
      <img
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: ' 20px', width: '50%', height: '50%',
        }}
        src={proceduralCard.picture}
        alt={proceduralCard.title}
      />
      <Button
        onClick={() => setShowSteps(!showSteps)}
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '20px',
        }}
      >{showSteps ? 'Hide Steps' : 'Show Steps'}
      </Button>
      {!showSteps && (
        <div>
          <h2 style={{ textAlign: 'center', paddingBottom: '10px' }}>Steps</h2>
          <Form>
            <Form.Group controlId="formTaskSteps">
              <Form.Label>Type the Steps that you remenber</Form.Label>
              <Form.Control as="textarea" rows={10} placeholder="Recall your steps" name="taskSteps" value={taskSteps} onChange={handleChange} />
            </Form.Group>
          </Form>
          <Button
            onClick={handleSubmit}
            style={{
              display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', marginBottom: '20px',
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
