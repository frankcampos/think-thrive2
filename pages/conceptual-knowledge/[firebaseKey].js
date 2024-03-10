/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConceptualCard from '../../components/conceptualCard';
import ProceduralCard from '../../components/proceduralCard';
import { getProcedureKnowledgeByPathId } from '../../api/proceduralknowledgeData';
import ProceduralCardFormModal from '../../components/forms/proceduralCardFormModal';
import { useAuth } from '../../utils/context/authContext';
import { getConceptualKnowledgeByPathId } from '../../api/conceptualknowledgeData';
import { getSinglePath } from '../../api/pathsData';

function ConceptualKnowledgePage() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [ConceptualKnowledgeCards, setConceptualKnowledgeCards] = useState([]);
  const [proceduralknowledgeCards, setProceduralKnowledgeCards] = useState([]);
  const [uniqueId, setuniqueId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

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

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const mixedCards = [...ConceptualKnowledgeCards, ...proceduralknowledgeCards];

  return (
    <div className="text-center my-4">
      {uniqueId === user.uid && (
        <div>
          <Link href={`/conceptual-knowledge/new/${firebaseKey}`} passHref>
            <Button variant="dark" style={{ margin: '0 0 10px' }}>
              Add A Conceptual Card
            </Button>
          </Link>
          <Button variant="dark" style={{ margin: '0 10px 10px' }} onClick={handleModalOpen}>
            Add A Procedural Card
          </Button>
          <ProceduralCardFormModal show={showModal} onHide={handleModalClose} pathId={firebaseKey} />
        </div>
      )}
      <div className="d-flex flex-wrap justify-content-center">
        {mixedCards.map((card) => {
          if (card.type === 'conceptual') {
            return <ConceptualCard key={card.firebaseKey} conceptualCard={card} onUpdate={getAllTheConceptualKnowledge} userID={uniqueId} />;
          } if (card.type === 'procedural') {
            return <ProceduralCard key={card.firebaseKey} proceduralCard={card} onUpdate={getallProceduralKnowledge} userID={uniqueId} />;
          }
          return null; // Add this line to return null if the card type is neither 'conceptual' nor 'procedural'
        })}
      </div>
    </div>
  );
}

export default ConceptualKnowledgePage;
