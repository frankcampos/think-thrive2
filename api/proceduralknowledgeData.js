import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createProceduralKnowledge = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduralknowledge.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      reject(error);
    });
});

const updateProceduralKnowledge = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduralknowledge/${payload.firebaseKey}.json`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      reject(error);
    });
});

const getProcedureKnowledgeByPathId = (pathId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduralknowledge.json?orderBy="pathId"&equalTo="${pathId}"`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch((error) => {
      reject(error);
    });
});

const deleteProceduralKnowledge = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduralknowledge/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      reject(error);
    });
});

const getProceduralKnowledgeByFirebaseKey = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduralknowledge/${firebaseKey}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      reject(error);
    });
});

export {
  createProceduralKnowledge, updateProceduralKnowledge, getProcedureKnowledgeByPathId, deleteProceduralKnowledge, getProceduralKnowledgeByFirebaseKey,
};
