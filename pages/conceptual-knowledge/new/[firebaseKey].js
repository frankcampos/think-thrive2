import { useRouter } from 'next/router';
import ConceptualCardForm from '../../../components/forms/ConceptualCardForm';

function AddConceptualCard() {
  const router = useRouter();
  const { firebaseKey } = router.query;

  return (
    <div className="text-center my-4">
      <h1>this is my conceptual card form{firebaseKey}</h1>
      <ConceptualCardForm objConceptualCard={{ }} pathId={firebaseKey} />
    </div>
  );
}

export default AddConceptualCard;
