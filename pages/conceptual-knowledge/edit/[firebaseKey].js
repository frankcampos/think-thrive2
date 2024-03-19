import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ConceptualCardForm from '../../../components/forms/ConceptualCardForm';
import { getSingleConceptualKnowledge } from '../../../api/conceptualknowledgeData';

function EditConceptualCard() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  // it is pasing the pahtId to the form no good
  const [editConceptualCard, setEditConceptualCard] = useState({});

  useEffect(() => {
    if (firebaseKey) {
      getSingleConceptualKnowledge(firebaseKey).then(setEditConceptualCard);
    }
  }, [firebaseKey]);

  return (
    <div className="text-center my-4">
      <ConceptualCardForm objConceptualCard={editConceptualCard} pathId={firebaseKey} />
    </div>
  );
}

export default EditConceptualCard;
