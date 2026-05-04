/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Button, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConceptualCard from '../../components/conceptualCard';
import ProceduralCard from '../../components/proceduralCard';
import TestMode from '../../components/TestMode';
import { getProcedureKnowledgeByPathId } from '../../api/proceduralknowledgeData';
import ProceduralCardFormModal from '../../components/forms/proceduralCardFormModal';
import { useAuth } from '../../utils/context/authContext';
import { getConceptualKnowledgeByPathId } from '../../api/conceptualknowledgeData';
import { getSinglePath } from '../../api/pathsData';
import InstructionConceptualAndProceduralModal from '../../components/conceptual-proceduralInstructionsModal';
import SearchBarCards from '../../components/SearchBarCard';

/* Slight tilt per card — alternating pattern so they look scattered */
const ROTATIONS = [-2, 1.5, -1.5, 2, -1, 1, -2.5, 0.5];

/* CSS deck visual — stacked cards with count */
function CardDeck({ total, onTestMode }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
      {/* Stacked card layers */}
      <div className="deck-stack">
        {/* Back layers */}
        <div
          className="deck-layer"
          style={{ background: 'rgba(255,255,255,0.04)', transform: 'rotate(-9deg) translateY(10px) translateX(-6px)' }}
        />
        <div
          className="deck-layer"
          style={{ background: 'rgba(255,255,255,0.06)', transform: 'rotate(-5deg) translateY(6px) translateX(-3px)' }}
        />
        <div
          className="deck-layer"
          style={{ background: 'rgba(255,255,255,0.08)', transform: 'rotate(4deg) translateY(3px) translateX(2px)' }}
        />
        {/* Top card — fully styled */}
        <div className="deck-layer" style={{ background: 'rgba(255,255,255,0.11)', transform: 'rotate(0deg)', overflow: 'hidden' }}>
          <div style={{
            height: '26px', background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)', display: 'flex', alignItems: 'center', paddingLeft: '8px', gap: '4px',
          }}
          >
            <span style={{
              fontSize: '0.55rem', fontWeight: '800', color: 'white', letterSpacing: '1px',
            }}
            >◆ CARDS
            </span>
          </div>
          <div style={{
            padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '5px',
          }}
          >
            {[80, 65, 50, 35].map((w) => (
              <div
                key={w}
                style={{
                  height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.18)', width: `${w}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Count */}
      <span id="totalCards">{total}</span>
      <p style={{
        color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginTop: '4px', marginBottom: '14px',
      }}
      >
        {total === 1 ? 'card in this path' : 'cards in this path'}
      </p>

      {/* Quick test button on the deck */}
      <Button className="glass-btn" size="sm" onClick={onTestMode}>
        🃏 Shuffle &amp; Test
      </Button>
    </div>
  );
}

CardDeck.propTypes = {
  total: PropTypes.number.isRequired,
  onTestMode: PropTypes.func.isRequired,
};

function ConceptualKnowledgePage() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [ConceptualKnowledgeCards, setConceptualKnowledgeCards] = useState([]);
  const [proceduralknowledgeCards, setProceduralKnowledgeCards] = useState([]);
  const [uniqueId, setuniqueId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [isTestMode, setIsTestMode] = useState(false);

  const toggleTestMode = () => setIsTestMode((prev) => !prev);

  const getAllTheConceptualKnowledge = () => {
    if (firebaseKey) {
      getSinglePath(firebaseKey).then((response) => setuniqueId(response.user_id));
      getConceptualKnowledgeByPathId(firebaseKey).then((response) => setConceptualKnowledgeCards(response));
    }
  };

  const getallProceduralKnowledge = () => {
    getSinglePath(firebaseKey).then((response) => setuniqueId(response.user_id));
    getProcedureKnowledgeByPathId(firebaseKey).then((response) => setProceduralKnowledgeCards(response));
  };

  useEffect(() => {
    getAllTheConceptualKnowledge();
    getallProceduralKnowledge();
  }, []);

  const handleModalClose = () => setShowModal(false);
  const handleModalOpen = () => setShowModal(true);

  const mixedCards = [...ConceptualKnowledgeCards, ...proceduralknowledgeCards];
  const filteredCards = mixedCards.filter((card) => {
    if (filter === 'procedural') return card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'conceptual') return card.question && card.question.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return card && ((card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase())) || (card.question && card.question.toLowerCase().includes(searchTerm.toLowerCase())));
    return true;
  });

  const totalCards = ConceptualKnowledgeCards.length + proceduralknowledgeCards.length;

  return (
    <Container className="my-4">
      {/* Action bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '28px',
      }}
      >
        {uniqueId === user.uid && (
          <>
            <Link href={`/conceptual-knowledge/new/${firebaseKey}`} passHref>
              <Button className="glass-btn">+ Conceptual Card</Button>
            </Link>
            <Button className="glass-btn-outline" onClick={handleModalOpen}>+ Procedural Card</Button>
          </>
        )}
        <Button className={isTestMode ? 'glass-btn-danger' : 'glass-btn-outline'} onClick={toggleTestMode}>
          {isTestMode ? 'Exit Test Mode' : 'Enter Test Mode'}
        </Button>
        <InstructionConceptualAndProceduralModal />
      </div>

      <ProceduralCardFormModal
        show={showModal}
        onHide={handleModalClose}
        pathId={firebaseKey}
        onUpdate={getallProceduralKnowledge}
        objProceduralCard={null}
      />

      {isTestMode ? (
        <TestMode cards={mixedCards} />
      ) : (
        <>
          {/* Deck + search */}
          <CardDeck total={totalCards} onTestMode={toggleTestMode} />
          <div style={{ marginBottom: '28px' }}>
            <SearchBarCards onSearchTermChange={setSearchTerm} onFilterChange={setFilter} />
          </div>

          {/* Card grid with tilts */}
          <div className="d-flex flex-wrap justify-content-center">
            {filteredCards.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '48px 32px', maxWidth: '380px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>No cards found</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
                  Try adjusting your search or filter settings.
                </p>
              </div>
            ) : (
              filteredCards.map((card, index) => {
                const rotation = ROTATIONS[index % ROTATIONS.length];
                const tiltStyle = { transform: `rotate(${rotation}deg)` };

                if (card.type === 'conceptual') {
                  return (
                    <div key={card.firebaseKey} className="card-tilt-wrapper" style={tiltStyle}>
                      <ConceptualCard conceptualCard={card} onUpdate={getAllTheConceptualKnowledge} userID={uniqueId} />
                    </div>
                  );
                }
                if (card.type === 'procedural') {
                  return (
                    <div key={card.firebaseKey} className="card-tilt-wrapper" style={tiltStyle}>
                      <ProceduralCard proceduralCard={card} onUpdate={getallProceduralKnowledge} userID={uniqueId} />
                    </div>
                  );
                }
                return null;
              })
            )}
          </div>
        </>
      )}
    </Container>
  );
}

export default ConceptualKnowledgePage;
