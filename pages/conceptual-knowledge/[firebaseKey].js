/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import ConceptualCard from '../../components/conceptualCard';
import { getConceptualKnowledgeByPathId } from '../../api/conceptualknowledgeData';
import { getSinglePath } from '../../api/pathsData';

function ConceptualKnowledgePage() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [ConceptualKnowledgeCards, setConceptualKnowledgeCards] = useState([]);
  const [pathId, setPathId] = useState('');

  useEffect(() => {
    if (firebaseKey) {
      getSinglePath(firebaseKey).then((response) => setPathId(response.user_id));
      getConceptualKnowledgeByPathId(firebaseKey).then((response) => setConceptualKnowledgeCards(response));
      console.warn('this is my conceptual knowledge cards', ConceptualKnowledgeCards);
    }
  }, [ConceptualKnowledgeCards, firebaseKey]);
  return (
    <div className="text-center my-4">
      <h1>{firebaseKey}</h1>
      <Link href={`/conceptual-knowledge/new/${firebaseKey}`} passHref>
        <Button variant="dark" style={{ margin: '0 0 10px' }}>
          Add A Conceptual Card
        </Button>
      </Link>
      <div className="d-flex flex-wrap justify-content-center">
        {ConceptualKnowledgeCards.map((card) => (
          <ConceptualCard key={card.firebaseKey} conceptualCard={card} onUpdate={{}} userID={pathId} />
        ))}
      </div>
    </div>
  );
}

export default ConceptualKnowledgePage;