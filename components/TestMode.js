import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import ConceptualCard from './conceptualCard';
import ProceduralCard from './proceduralCard';

function TestMode({ cards, userID }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % cards.length);
  };

  const previous = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + cards.length) % cards.length);
  };

  const card = cards[currentSlide];

  return (
    <div>
      <h1 style={{ color: 'lime', textShadow: '2px 2px black' }}>Test Mode</h1>
      <Button onClick={previous}>Prev</Button>
      <Carousel showArrows selectedItem={currentSlide} onChange={setCurrentSlide}>
        {card && card.type === 'conceptual' ? (
          <ConceptualCard key={card?.firebaseKey} conceptualCard={card} userID={userID} />
        ) : (
          <ProceduralCard key={card?.firebaseKey} proceduralCard={card} userID={userID} />
        )}
      </Carousel>
      <Button onClick={next}>Next</Button>
    </div>
  );
}

TestMode.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    firebaseKey: PropTypes.string.isRequired,
  })).isRequired,
  userID: PropTypes.string.isRequired,
};

export default TestMode;
