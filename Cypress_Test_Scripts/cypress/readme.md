Campaign API Automation Tests with Cypress
This repository contains automated tests for the Campaign API using Cypress. The API is designed to handle the creation, updating, retrieval, and deletion of campaign data.

API Endpoints
POST /campaign: Create a new campaign.
GET /campaign/{id}: Get the details of a specific campaign by ID.
PUT /campaign/{id}: Update an existing campaign.
DELETE /campaign/{id}: Delete a campaign by ID.
GET /campaign: Get the list of all campaigns.


Project Setup
Install Node.js (if not already installed):

Visit Node.js website to download and install the latest stable version.
Install Cypress: After cloning the repository, install Cypress by running the following commands in your project directory:


npm install cypress --save-dev
Start the API Server: Ensure the  API server is running locally on http://localhost:8081.
Run Cypress Tests: After setting up, you can run the Cypress tests by executing the following command:

npx cypress open
Alternatively, to run tests in the command line (headless mode):


npx cypress run --spec "cypress/e2e/E2E_Test.cy.js"
Test Cases
Test Flow
The tests are organized to follow the following sequence:

Create Campaign
Validates that the API successfully creates a campaign with the provided data.
Checks the response status, headers, response body, and schema.
Logs the campaign ID for use in subsequent tests.

Get Campaign
Verifies that the correct campaign is retrieved by its ID.
Ensures the campaign's name and other details match the input data.
Checks the response headers and response time. 

Update Campaign
Sends an update request to modify the campaign details.
Validates that the campaign name and status are updated successfully.
Ensures the response status, headers, and schema are correct.

Delete Campaign
Deletes the campaign by its ID.
Verifies that the campaign is removed and returns a 404 error when trying to retrieve it.
Verify Deletion

After deletion, attempts to retrieve the campaign to ensure it no longer exists (returns a 404 status).

Validate No Duplicates
Ensures that there are no duplicate campaigns by checking the uniqueness of campaign IDs in the system.

Negative Test Case (Invalid Data)
Tests the API with invalid or incomplete data (e.g., missing required fields) to ensure the correct validation error message is returned.

Test Validations
Schema Validation: Ensures the response body contains the correct data and structure.
Response Time Validation: Ensures the API responds within acceptable time limits.
Headers Validation: Ensures the correct Content-Type is included in the response headers.
Duplicate ID Validation: Ensures that no duplicate campaign IDs exist.
Negative Test Cases: Validates how the system responds to invalid or incomplete data.