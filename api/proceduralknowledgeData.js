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

export { createProceduralKnowledge, updateProceduralKnowledge };
