import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useAuth } from '../utils/context/authContext';

function ProceduralCard({ proceduralCard, onUpdate, userID }) {
  const { user } = useAuth();
  console.warn('onUpdate', onUpdate);
  return (
    <Card
      style={{
        width: '19rem', padding: '10px', margin: '10px', background: 'black', borderRadius: '10px',
      }}
    >
      <Card.Title style={{ background: 'grey', borderRadius: '5px' }}>{proceduralCard.title}</Card.Title>
      <Card.Img variant="top" src={proceduralCard.picture} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <Card.Text style={{ background: 'grey', borderRadius: '5px', marginTop: '10px' }}>
        Tags:
      </Card.Text>
      <Card.Body>
        <Link href="./" passHref>
          <Button variant="dark" style={{ marginRight: '10px' }}>Review
          </Button>
        </Link>
        {user.uid === userID && (
        <>
          <Link href="./" passHref>
            <Button variant="dark" style={{ marginRight: '10px' }}>
              Edit
            </Button>
          </Link>
          <Button variant="dark" onClick={console.warn('hi')} style={{ marginRight: '10px' }}>
            Delete
          </Button>
        </>
        )}
      </Card.Body>

    </Card>

  );
}

ProceduralCard.propTypes = {
  proceduralCard: PropTypes.shape({
    title: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired,
};

export default ProceduralCard;
