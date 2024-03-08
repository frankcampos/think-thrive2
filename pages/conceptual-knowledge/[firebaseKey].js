/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConceptualCard from '../../components/conceptualCard';
import ProceduralCardFormModal from '../../components/forms/proceduralCardFormModal';
import { useAuth } from '../../utils/context/authContext';
import { getConceptualKnowledgeByPathId } from '../../api/conceptualknowledgeData';
import { getSinglePath } from '../../api/pathsData';

function ConceptualKnowledgePage() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [ConceptualKnowledgeCards, setConceptualKnowledgeCards] = useState([]);
  const [pathId, setPathId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const getAllTheConceptualKnowledge = () => {
    if (firebaseKey) {
      getSinglePath(firebaseKey).then((response) => setPathId(response.user_id));
      getConceptualKnowledgeByPathId(firebaseKey).then((response) => setConceptualKnowledgeCards(response));
    }
  };

  useEffect(() => {
    getAllTheConceptualKnowledge();
  }, []);
  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <div className="text-center my-4">
      {pathId === user.uid && (
        <div>
          <Link href={`/conceptual-knowledge/new/${firebaseKey}`} passHref>
            <Button variant="dark" style={{ margin: '0 0 10px' }}>
              Add A Conceptual Card
            </Button>
          </Link>
          <Button variant="dark" style={{ margin: '0 10px 10px' }} onClick={handleModalOpen}>
            Add A Procedural Card
          </Button>
          <ProceduralCardFormModal show={showModal} onHide={handleModalClose} />
        </div>
      )}
      <div className="d-flex flex-wrap justify-content-center">
        {ConceptualKnowledgeCards.map((card) => (
          <ConceptualCard key={card.firebaseKey} conceptualCard={card} onUpdate={getAllTheConceptualKnowledge} userID={pathId} />
        ))}
      </div>
    </div>
  );
}

export default ConceptualKnowledgePage;
