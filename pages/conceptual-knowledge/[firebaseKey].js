/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConceptualCard from '../../components/conceptualCard';
import ProceduralCard from '../../components/proceduralCard';
import { getProcedureKnowledgeByPathId } from '../../api/proceduralknowledgeData';
import ProceduralCardFormModal from '../../components/forms/proceduralCardFormModal';
import { useAuth } from '../../utils/context/authContext';
import { getConceptualKnowledgeByPathId } from '../../api/conceptualknowledgeData';
import { getSinglePath } from '../../api/pathsData';
import InstructionConceptualAndProceduralModal from '../../components/conceptual-proceduralInstructionsModal';
import SearchBarCards from '../../components/SearchBarCard';

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

  const getAllTheConceptualKnowledge = () => {
    if (firebaseKey) {
      getSinglePath(firebaseKey).then((response) => {
        setuniqueId(response.user_id);
      });
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

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const mixedCards = [...ConceptualKnowledgeCards, ...proceduralknowledgeCards];
  const filteredCards = mixedCards.filter((card) => {
    if (filter === 'procedural') {
      return card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase());
    } if (filter === 'conceptual') {
      return card.question && card.question.toLowerCase().includes(searchTerm.toLowerCase());
    } if (filter === 'all') {
      return card && ((card.title && card.title.toLowerCase().includes(searchTerm.toLowerCase())) || (card.question && card.question.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    return true;
  });

  return (
    <Container className="text-center my-4">
      <div>
        {uniqueId === user.uid && (
        <>
          <Link href={`/conceptual-knowledge/new/${firebaseKey}`} passHref>
            <Button variant="dark" style={{ margin: '0 0 10px' }}>
              Add A Conceptual Card
            </Button>
          </Link>
          <Button variant="dark" style={{ margin: '0 10px 10px' }} onClick={handleModalOpen}>
            Add A Procedural Card
          </Button>
        </>
        )}
      </div>
      <div>
        <InstructionConceptualAndProceduralModal />
        <SearchBarCards
          style={{
            margin: '20px',
            backgroundColor: '#333',
            color: '#fff',
          }}
          onSearchTermChange={setSearchTerm}
          onFilterChange={setFilter}
        />
        <h1 id="totalCards">I have {ConceptualKnowledgeCards.length + proceduralknowledgeCards.length} cards in total</h1>
        <ProceduralCardFormModal show={showModal} onHide={handleModalClose} pathId={firebaseKey} onUpdate={getallProceduralKnowledge} objProceduralCard={null} />
      </div>

      <div className="d-flex flex-wrap justify-content-center">
        {filteredCards.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Oops!</h2>
            <p>No cards match your search.</p>
            <img src="https://thumbs.dreamstime.com/b/expression-words-design-oops-illustration-162212955.jpg" alt="No match" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
            <p>Try adjusting your search or filter settings.</p>
          </div>
        ) : (
          filteredCards.map((card) => {
            if (card.type === 'conceptual') {
              return <ConceptualCard key={card.firebaseKey} conceptualCard={card} onUpdate={getAllTheConceptualKnowledge} userID={uniqueId} />;
            } if (card.type === 'procedural') {
              return <ProceduralCard key={card.firebaseKey} proceduralCard={card} onUpdate={getallProceduralKnowledge} userID={uniqueId} />;
            }
            return null;
          })
        )}
      </div>
    </Container>
  );
}

export default ConceptualKnowledgePage;
