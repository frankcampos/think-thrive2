/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Link from 'next/link';

function TestMode({ cards }) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % cards.length);
    setRevealed(false);
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + cards.length) % cards.length);
    setRevealed(false);
  }, [cards.length]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); setRevealed((r) => !r); }
      if (e.code === 'ArrowRight') goNext();
      if (e.code === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const card = cards[current];
  const isConceptual = card?.type === 'conceptual';
  const accent = isConceptual ? '#00d4ff' : '#c084fc';
  const headerGradient = isConceptual
    ? 'linear-gradient(135deg, #0ea5e9, #00d4ff)'
    : 'linear-gradient(135deg, #9333ea, #c084fc)';

  if (!card) return null;

  const progressPct = ((current + 1) / cards.length) * 100;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 16px' }}>

      {/* Progress bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Progress</span>
          <span style={{ fontSize: '0.8rem', color: accent, fontWeight: '600' }}>
            {current + 1} / {cards.length}
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
          <div style={{
            height: '100%',
            borderRadius: '2px',
            background: headerGradient,
            width: `${progressPct}%`,
            transition: 'width 0.4s ease',
          }}
          />
        </div>
      </div>

      {/* Card */}
      <div style={{
        borderRadius: '20px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${accent}44`,
        boxShadow: `0 20px 60px ${accent}22`,
        marginBottom: '20px',
      }}
      >
        {/* Card header strip */}
        <div style={{
          background: headerGradient,
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        >
          <span style={{
            fontSize: '0.72rem', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'white',
          }}
          >
            {isConceptual ? '◆ Conceptual' : '⚙ Procedural'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', fontWeight: '600' }}>
            Card {current + 1} of {cards.length}
          </span>
        </div>

        {/* Image */}
        {(card.imageUrl || card.picture) && (
          <img
            src={card.imageUrl || card.picture}
            alt={card.question || card.title}
            style={{
              width: '100%', height: '260px', objectFit: 'cover', display: 'block',
            }}
          />
        )}

        {/* Question / Title */}
        <div style={{ padding: '24px 24px 16px' }}>
          <div style={{
            fontSize: '0.68rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: accent,
            marginBottom: '10px',
          }}
          >
            {isConceptual ? 'Question' : 'Task'}
          </div>
          <p style={{
            fontSize: '1.2rem', fontWeight: '700', color: 'white', lineHeight: 1.5, margin: 0,
          }}
          >
            {isConceptual ? card.question : card.title}
          </p>
        </div>

        {/* Reveal answer */}
        {!revealed ? (
          <div style={{ padding: '0 24px 24px' }}>
            <Button
              className="glass-btn"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
              onClick={() => setRevealed(true)}
            >
              {isConceptual ? 'Show Answer' : 'Show Steps'}
            </Button>
          </div>
        ) : (
          <div style={{
            margin: '0 24px 24px',
            background: `${accent}11`,
            border: `1px solid ${accent}33`,
            borderRadius: '12px',
            padding: '18px',
          }}
          >
            <div style={{
              fontSize: '0.68rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: accent,
              marginBottom: '10px',
            }}
            >
              {isConceptual ? 'Answer' : 'Steps'}
            </div>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.7,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}
            >
              {isConceptual ? card.answer : card.taskSteps}
            </p>

            {/* Deep review link */}
            <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${accent}22` }}>
              <Link
                href={isConceptual
                  ? `/conceptual-knowledge/review/${card.firebaseKey}`
                  : `/procedural-knowledge/review/${card.firebaseKey}`}
                passHref
              >
                <Button className="glass-btn-outline" size="sm">
                  Deep Review with AI →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button
          className="glass-btn-outline"
          onClick={goPrev}
          style={{ flex: 1, maxWidth: '160px', padding: '12px' }}
        >
          ← Prev
        </Button>
        <Button
          className="glass-btn"
          onClick={goNext}
          style={{ flex: 1, maxWidth: '160px', padding: '12px' }}
        >
          Next →
        </Button>
      </div>

      {/* Keyboard hint */}
      <p style={{
        textAlign: 'center', marginTop: '14px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)',
      }}
      >
        Press Space to reveal · ← → to navigate
      </p>
    </div>
  );
}

TestMode.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    firebaseKey: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    picture: PropTypes.string,
    question: PropTypes.string,
    title: PropTypes.string,
    answer: PropTypes.string,
    taskSteps: PropTypes.string,
  })).isRequired,
};

export default TestMode;
