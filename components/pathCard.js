/* eslint-disable @next/next/no-img-element */
import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import { deletePath } from '../api/pathsData';

function PathCard({ path, onUpdate }) {
  const { user } = useAuth();
  const deletethisPath = () => {
    if (window.confirm(`Are you sure you want to delete this ${path.title}?`)) deletePath(path.firebaseKey).then(onUpdate());
  };
  const madeBy = user.uid === path.user_id ? `Made by: ${user.displayName}` : `Made by: ${path.user_name}`;
  const userPhoto = user.uid === path.user_id ? `${user.photoURL}` : `${path.user_photo}`;

  return (
    <Card variant="danger" style={{ width: '18rem', padding: '10px', margin: '10px' }}>
      <Card.Title>{path.title}</Card.Title>
      <Card.Img style={{ width: '100%', height: '250px' }} variant="top" src={path.image} />
      <Card.Body>
        <Card.Text>{`Goal: ${path.goal}`}</Card.Text>
        <img
          src={userPhoto}
          alt="User profile"
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid',
            padding: '4px',
            borderColor: 'black',
            margin: '2px',
          }}
        />
        <Card.Text>{madeBy}</Card.Text>
        <Link href={`/conceptual-knowledge/${path.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>View</Button>
        </Link>
        {user.uid === path.user_id && (
          <>
            <Link href={`/path/edit/${path.firebaseKey}`} passHref>
              <Button variant="dark" style={{ marginRight: '10px' }}>Edit</Button>
            </Link>
            <Button variant="dark" onClick={deletethisPath} style={{ marginRight: '10px' }}>Delete</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

PathCard.propTypes = {
  path: PropTypes.shape({
    firebaseKey: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    goal: PropTypes.string,
    user_id: PropTypes.string,
    user_name: PropTypes.string,
    user_photo: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PathCard;
