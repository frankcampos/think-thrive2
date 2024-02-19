import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { deletePath } from '../api/pathsData';

function PathCard({ path, onUpdate }) {
  const deletethisPath = () => {
    if (window.confirm(`Are you sure you want to delete this ${path.title}?`)) deletePath(path.firebaseKey).then(onUpdate());
  };
  return (
    <Card variant="danger" style={{ width: '18rem' }}>
      <Card.Title>{path.title}</Card.Title>
      <Card.Img style={{ width: '100%', height: '250px' }} variant="top" src={path.image} />
      <Card.Body>
        <Card.Text>{`Goal: ${path.goal}`}</Card.Text>
        <Link href={`/path/${path.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>View</Button>
        </Link>
        <Link href={`/path/edit/${path.firebaseKey}`} passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>Edit</Button>
        </Link>
        <Button variant="dark" onClick={deletethisPath} style={{ marginRight: '10px' }}>Delete</Button>
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
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PathCard;
