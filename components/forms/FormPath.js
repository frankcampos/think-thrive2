import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/storage';
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
  const storage = firebase.storage();

  useEffect(() => {
    if (objPath.firebaseKey) setFormState({ ...objPath });
  }, [objPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = async (e) => {
    try {
      if (e.target.files[0]) {
        const imageFile = e.target.files[0];
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${imageFile.name}`);
        await imageRef.put(imageFile);
        const url = await imageRef.getDownloadURL();
        setFormState((prevState) => ({ ...prevState, image: url }));
      }
    } catch (error) {
      console.error('Error uploading image or getting download URL:', error);
    }
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
        updatePath({ firebaseKey: name }).then(() => {
          router.push('/');
        });
      });
    }
  };

  return (
    <div
      className="glass-card"
      style={{ maxWidth: '560px', margin: '0 auto', padding: '36px 32px' }}
    >
      <h2 style={{
        fontWeight: '700',
        fontSize: '1.5rem',
        marginBottom: '28px',
        color: 'white',
        textAlign: 'center',
      }}
      >
        {objPath.firebaseKey ? 'Update' : 'Create'} Learning Path
      </h2>

      <Form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            className="glass-input"
          />
        </div>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Image URL or Upload Image</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formState.image}
            onChange={handleChange}
            placeholder="Enter the URL of an image"
            className="glass-input"
            style={{ marginBottom: '8px' }}
          />
          <Form.Control
            type="file"
            name="imageFile"
            onChange={handleImageChange}
            className="glass-input"
          />
        </div>

        <div>
          <Form.Label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '6px' }}>Goal</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Goal"
            name="goal"
            value={formState.goal}
            onChange={handleChange}
            className="glass-input"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
          <Button className="glass-btn" type="submit">
            {objPath.firebaseKey ? 'Update Path' : 'Create Path'}
          </Button>
        </div>
      </Form>
    </div>
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
