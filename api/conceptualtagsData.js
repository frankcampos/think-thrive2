import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createConceptualTag = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags.json`, {
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

const updateConceptualTag = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags/${payload.firebaseKey}.json`, {
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

const getConceptualTags = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags.json`)
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch((error) => {
      reject(error);
    });
});

export { createConceptualTag, updateConceptualTag, getConceptualTags };
