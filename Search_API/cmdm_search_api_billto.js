import http from 'k6/http';
import { check } from 'k6';
import { clientId, clientSecret,tokenUrl,apiUrl} from './config.js';

//Request body
const requestBody = {
  entity: "bill-to",
  search_attribute: "bill_to_id",
  query_string: "427",
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

  // Extract access token from the token response
  let accessToken = JSON.parse(tokenResponse.body).access_token;

  // Define headers
  let headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  //POST request to the API endpoint
  let response = http.post(apiUrl, JSON.stringify(requestBody), { headers: headers });

  // Check response code
  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Print the response body
  console.log("Response Body:", response.body);
}