import { fightersDetails, fighters } from './mockData';

const BASE_API_URL =
  'https://api.github.com/repos/binary-studio-academy/stage-2-es6-for-everyone/contents/resources/api/';
const SECURITY_HEADERS = {
  headers: {
    authorization: 'token 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'
  }
};

const useMockAPI = true;

export async function callApi(endpoint, method = 'GET') {
  const url = BASE_API_URL + endpoint;
  const options = { method, ...SECURITY_HEADERS };

  return useMockAPI
    ? fakeCallApi(endpoint)
    : fetch(url, options)
        .then((response) => (response.ok ? response.json() : Promise.reject(Error('Failed to load'))))
        .then((result) => JSON.parse(atob(result.content)))
        .catch((error) => {
          throw error;
        });
}

async function fakeCallApi(endpoint) {
  const response = endpoint === 'fighters.json' ? fighters : getFighterById(endpoint);
  return new Promise((resolve, reject) => {
    setTimeout(() => (response ? resolve(response) : reject(Error('Failed to load'))), 500);
  });
}

function getFighterById(endpoint) {
  const start = endpoint.lastIndexOf('/');
  const end = endpoint.lastIndexOf('.json');
  const id = endpoint.substring(start + 1, end);
  return fightersDetails.find((it) => it._id === id);
}
