import http from 'k6/http';
import { check } from 'k6';
import { clientId, clientSecret,tokenUrl,apiUrl} from './config.js';

//Request body
const requestBody = {
  entity: "ship-to",
  search_attribute: "ship_to_id",
  query_string: "737",
  operator: "like"
};

export let options = {
  // Define virtual users and duration
  vus: 10,
  duration: '30s',
};

export default function () {
  // Request OAuth 2.0 token
  let tokenResponse = http.post(tokenUrl, {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  // Extract access token
  let accessToken = JSON.parse(tokenResponse.body).access_token;

  // Define headers
  let headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  // Make the POST request to the API endpoint with OAuth 2.0 token and request body
  let response = http.post(apiUrl, JSON.stringify(requestBody), { headers: headers });

  // Check the response code
  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Print response body
  console.log("Response Body:", response.body);
}