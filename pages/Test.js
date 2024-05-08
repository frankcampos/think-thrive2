import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import TestMode from '../components/TestMode';
import { getSingleConceptualKnowledge, getConceptualKnowledgeByPathId } from '../api/conceptualknowledgeData';
import { getProceduralKnowledgeByFirebaseKey, getProcedureKnowledgeByPathId } from '../api/proceduralknowledgeData';
import { getSinglePath } from '../api/pathsData';

function Test() {
  const router = useRouter();
  const { firebaseKey } = router.query;
  const [pathId, setPathId] = useState('');
  const [allProceduralKnowledge, setAllProceduralKnowledge] = useState([]);
  const [allConceptualKnowledge, setAllConceptualKnowledge] = useState([]);
  const [uniqueId, setUniqueId] = useState('');

  console.warn(firebaseKey);
  console.warn(pathId?.pathId); // I am getting the right value here
  const getCard = () => {
    if (firebaseKey) {
      getSingleConceptualKnowledge(firebaseKey)
        .then((response) => {
          setPathId(response);
          console.warn(response.pathId);
        })
        .catch(() => {
          getProceduralKnowledgeByFirebaseKey(firebaseKey)
            .then((response) => {
              setPathId(response);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        });
    }
  };

  const getUserId = () => {
    if (pathId?.pathId) getSinglePath(pathId.pathId).then((response) => setUniqueId(response.user_id));
  };

  const getAllCardProceduralKnowledge = () => {
    if (pathId?.pathId) {
      Promise.all([
        getProcedureKnowledgeByPathId(pathId.pathId),
        getConceptualKnowledgeByPathId(pathId.pathId),
      ])
        .then(([proceduralResponse, conceptualResponse]) => {
          setAllProceduralKnowledge(proceduralResponse);
          setAllConceptualKnowledge(conceptualResponse);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    getCard();
  }, [firebaseKey]);

  useEffect(() => {
    getUserId();
  }, [pathId]);

  useEffect(() => {
    if (pathId && uniqueId) {
      getAllCardProceduralKnowledge();
    }
  }, [pathId, uniqueId, firebaseKey]);

  const mixedCards = shuffle([...allProceduralKnowledge, ...allConceptualKnowledge]);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
    }}
    >
      <TestMode cards={mixedCards} userID={uniqueId} />
    </div>
  );
}

export default Test;
