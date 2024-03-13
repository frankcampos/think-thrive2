/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProceduralKnowledgeByFirebaseKey } from '../../../api/proceduralknowledgeData';

const ProceduralCardKnowledgeReviewPage = () => {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [proceduralCard, setProceduralCard] = useState({});

  useEffect(() => {
    getProceduralKnowledgeByFirebaseKey(firebaseKey).then((response) => setProceduralCard(response));
  }, [firebaseKey]);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{proceduralCard.title}</h1>
      <img
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: ' 20px', width: '90%', height: '90%',
        }}
        src={proceduralCard.picture}
        alt={proceduralCard.title}
      />
      <img
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: ' 20px', width: '90%', height: '90%',
        }}
        src={proceduralCard.picture}
        alt={proceduralCard.title}
      />
      <img
        style={{
          display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: ' 20px', width: '90%', height: '90%',
        }}
        src={proceduralCard.picture}
        alt={proceduralCard.title}
      />
    </div>
  );
};

export default ProceduralCardKnowledgeReviewPage;
