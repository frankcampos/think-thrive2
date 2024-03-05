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
      updatePath({ ...formState, user_name: user.displayName, user_photo: user.photoURL }).then(() => {
        router.push('/');
      });
    } else {
      const payload = {
        ...formState, user_id: user.uid, user_name: user.displayName, user_photo: user.photoURL,
      };
      createPath(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updatePath(patchPayload).then(() => {
          router.push('/');
        });
      });
    }
  };
  return (
    <Form variant="dark" onSubmit={handleSubmit}>
      <h2 className="text-black mt-5" style={{ display: 'flex', justifyContent: 'center' }}>{objPath.firebaseKey ? 'Update' : 'Create'} Learning Path</h2>

      <Form.Label style={{ color: 'black' }}>Title</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Title"
        name="title"
        value={formState.title}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />

      <Form.Label style={{ color: 'black' }}>Image</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Image URL"
        name="image"
        value={formState.image}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />
      <Form.Label style={{ color: 'black' }}>Goal</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter Goal"
        name="goal"
        value={formState.goal}
        onChange={handleChange}
        style={{ backgroundColor: 'grey', color: 'black', border: '1px solid white' }}
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="dark" type="submit" style={{ margin: '10px' }}>
          {objPath.firebaseKey ? 'Update' : 'Create'} Path
        </Button>
      </div>
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
