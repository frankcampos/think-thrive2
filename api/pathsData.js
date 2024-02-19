import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;
console.warn(endpoint);

const createPath = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/paths.json`, {
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

const updatePath = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/paths/${payload.firebaseKey}.json`, {
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

const getPaths = (userId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/paths.json?orderBy="user_id"&equalTo="${userId}"`, {
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

const deletePath = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/paths/${firebaseKey}.json`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      reject(error);
    });
});

const getSinglePath = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/paths/${firebaseKey}.json`, {
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
  createPath, updatePath, getPaths, deletePath, getSinglePath,
};
