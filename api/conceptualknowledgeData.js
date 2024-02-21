import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createConceptualKnowledge = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualknowledge.json`, {
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

const updateConceptualKnowledge = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualknowledge/${payload.firebaseKey}.json`, {
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

export { createConceptualKnowledge, updateConceptualKnowledge };
