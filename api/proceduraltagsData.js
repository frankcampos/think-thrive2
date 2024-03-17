import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const createProceduralTag = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags.json`, {
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

const updateProceduralTag = (payload) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags/${payload.firebaseKey}.json`, {
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

const deleteProceduralTag = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags/${firebaseKey}.json`, {
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

const getProceduralTags = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags.json`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch((error) => reject(error));
});

const getProceduralTagsByProceduralCardId = (proceduralCardId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags.json?orderBy="procedural_card_id"&equalTo="${proceduralCardId}"`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch((error) => reject(error));
});

const getProceduralTagsByTagId = (tagId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/proceduraltags.json?orderBy="tag_id"&equalTo="${tagId}"`)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => reject(error));
});

export {
  createProceduralTag,
  updateProceduralTag,
  deleteProceduralTag,
  getProceduralTags,
  getProceduralTagsByProceduralCardId,
  getProceduralTagsByTagId,
};
