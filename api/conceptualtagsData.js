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

const deleteConceptualTag = (firebaseKey) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags/${firebaseKey}.json`, {
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

const getConceptualTags = () => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags.json`)
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        resolve(Object.values(data));
      } else {
        resolve([]);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

const getConceptualTagsByConceptualCardId = (conceptualCardId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags.json?orderBy="conceptual_card_id"&equalTo="${conceptualCardId}"`)
    .then((response) => response.json())
    .then((data) => resolve(Object.values(data)))
    .catch((error) => {
      reject(error);
    });
});

const getConceptualTagByTagId = (tagId) => new Promise((resolve, reject) => {
  fetch(`${endpoint}/conceptualtags.json?orderBy="tag_id"&equalTo="${tagId}"`)
    .then((response) => response.json())
    .then((data) => resolve(data))
    .catch((error) => {
      reject(error);
    });
});

export {
  createConceptualTag, updateConceptualTag, getConceptualTags, getConceptualTagsByConceptualCardId, deleteConceptualTag, getConceptualTagByTagId,
};
