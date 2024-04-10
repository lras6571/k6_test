import http from 'k6/http';
import { check } from 'k6';

// Define the OAuth 2.0 client credentials
const clientId = 'HVqPZW1qzfUHH64GOqSWRpenrXL2oyu4';
const clientSecret = 'PYK23grCamJkXMJE';

// Define the OAuth 2.0 token endpoint
const tokenUrl = 'https://api-gateway-qa.sysco.com/token';

// Define the API endpoint
const apiUrl = 'https://api-gateway-qa.sysco.com/services/enterprise-taxonomy-reference-codes-bulk-api-v1/mdm-enterprise-taxonomy-reference-codes-bulk-api/batch/taxonomy';

// Define the request body
const requestBody = {
  delimiter: "|",
  language_code: "en_US",
  list_fields: [
    "ALL"
  ]
};

export let options = {
  // Define virtual users and duration
  vus: 2,
  duration: '10s',
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
    'Content-Type': 'application/json',
  };

  // Make the POST request to the API endpoint with OAuth 2.0 token and request body
  let response = http.post(apiUrl, JSON.stringify(requestBody), { headers: headers });

  // Check if the response is successful
  check(response, {
    'status is 200': (r) => r.status === 200,
  });

  // Print the response body
  console.log("Response Body:", response.body);
}