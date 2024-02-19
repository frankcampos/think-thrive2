import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuth } from '../../utils/context/authContext';
import { createPath, updatePath } from '../../api/pathsData';

const initialState = {
  title: '',
  image: '',
  goal: '',
};

function FormPath({ objPath }) {
  const [formState, setFormState] = useState(initialState);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (objPath.firebaseKey) setFormState({ ...objPath });
  }, [objPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (objPath.firebaseKey) {
      updatePath(formState).then(() => {
        router.push('/');
      });
    } else {
      const payload = { ...formState, user_id: user.uid };
      createPath(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updatePath(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-white mt-5">{objPath.firebaseKey ? 'Update' : 'Create'} Learning Path</h2>

      <Form.Label style={{ color: 'white' }}>Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Title"
        name="title"
        value={formState.title}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />

      <Form.Label style={{ color: 'white' }}>Image</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Image URL"
        name="image"
        value={formState.image}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'white' }}>Goal</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Goal"
        name="goal"
        value={formState.goal}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />

      <Button variant="dark" type="submit">
        { objPath.firebaseKey ? 'Update' : 'Create'} Path
      </Button>
    </Form>
  );
}

FormPath.propTypes = {
  objPath: PropTypes.shape({
    firebaseKey: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
  }),
};

FormPath.defaultProps = {
  objPath: initialState,
};

export default FormPath;
