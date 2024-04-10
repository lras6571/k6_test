import http from 'k6/http';
import { check } from 'k6';

// Define the OAuth 2.0 client credentials
const clientId = 'EaxxEMQ6r6Es5J1wxBGvdcAJxKnAszaw';
const clientSecret = 'Xevl0Gvtsjn9H2a0';

// Define the OAuth 2.0 token endpoint
const tokenUrl = 'https://api-gateway-qa.sysco.com/token';

// Define the API endpoint
const apiUrl = 'https://api-gateway-qa.sysco.com/services/enterprise-taxonomy-bulk-api-v1/enterprise-taxonomy-bulk-api/batch/taxonomy';

export let options = {
  // Define virtual users and duration
  vus: 2,
  duration: '30s',
};

export default function () {
  // Request OAuth 2.0 token using client credentials
  let tokenResponse = http.post(tokenUrl, {
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  // Extract access token from the token response
  let accessToken = JSON.parse(tokenResponse.body).access_token;

  // Define headers with OAuth 2.0 token
  let headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  // Make the GET request to the API endpoint with OAuth 2.0 token
  let response = http.get(apiUrl, { headers: headers });

  // Check if the response is successful
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  // Print the response body
  console.log("Response Body:", response.body);
}