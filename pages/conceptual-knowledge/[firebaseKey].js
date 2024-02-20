import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

function ConceptualKnowledgePage() {
  const router = useRouter();
  const { firebaseKey } = router.query;

  return (
    <div className="text-center my-4">
      <h1>{firebaseKey}</h1>
      <Link href="./path/new" passHref>
        <Button variant="dark" style={{ margin: '0 0 10px' }}>
          Add A Conceptual Card
        </Button>
      </Link>
    </div>
  );
}

export default ConceptualKnowledgePage;
