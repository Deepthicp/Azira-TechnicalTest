import { validateResponseTime, validateSchema, validateHeaders } from '../support/validations';
import { campaignSchema, updatedCampaignSchema } from '../support/schemas';

describe('Campaign API Automation Flow with Validations', () => {
  let baseUrl;
  let campaignData;
  let updatedCampaignData;
  let campaignId;

  before(() => {
    // Load the data from the fixture file
    cy.fixture('campaignData').then((data) => {
      baseUrl = data.baseUrl;
      campaignData = data.campaignData;
      updatedCampaignData = data.updatedCampaignData;
    });
  });

  it('should perform create, get, update, delete operations and additional validations', () => {
    // Step 1: Create Campaign
    cy.request('POST', `${baseUrl}/campaign`, campaignData).then((response) => {
      cy.log('POST Response:', JSON.stringify(response.body));
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id'); // Ensure response has 'id'

      // Validate headers, response time, and schema
      validateHeaders(response.headers, 'application/json');
      validateResponseTime(response, 200);
      validateSchema(response.body, campaignSchema);

      // Assign campaign ID for subsequent steps
      campaignId = response.body.id;
    });

    // Step 2: Get Campaign
    cy.then(() => {
      cy.request('GET', `${baseUrl}/campaign/${campaignId}`).then((response) => {
        expect(response.status).to.eq(200);

        // Validate headers, response time, and schema
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 200);
        validateSchema(response.body, campaignSchema);
      });
    });

    // Step 3: Update Campaign
    cy.then(() => {
      cy.request('PUT', `${baseUrl}/campaign/${campaignId}`, updatedCampaignData).then((response) => {
        expect(response.status).to.eq(200);

        // Validate headers, response time, and schema
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 500);
        validateSchema(response.body, updatedCampaignSchema);
      });
    });

    // Step 4: Delete Campaign
    cy.then(() => {
      cy.request('DELETE', `${baseUrl}/campaign/${campaignId}`).then((response) => {
        expect(response.status).to.eq(200);

        // Validate headers and response time
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 200);
      });
    });

    // Step 5: Verify Campaign is Deleted
    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/campaign/${campaignId}`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 200);
      });
    });

    // Step 6: Validate Duplicates (Optional)
    cy.then(() => {
      cy.request('GET', `${baseUrl}/campaign`).then((response) => {
        const ids = response.body.map((campaign) => campaign.id);
        const uniqueIds = new Set(ids);
        expect(ids.length).to.eq(uniqueIds.size); // Ensure no duplicate IDs

        // Validate headers and response time
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 200);
      });
    });

    // Step 7: Negative Test Case for Missing Fields
    cy.then(() => {
      const invalidCampaignData = { name: 'Incomplete_Campaign' };
      cy.request({
        method: 'POST',
        url: `${baseUrl}/campaign`,
        body: invalidCampaignData,
        failOnStatusCode: false, // Prevent Cypress from failing the test automatically
      }).then((response) => {
        expect(response.status).to.eq(400); // Expect Bad Request
        expect(response.body.message).to.include('Validation failed'); // Check error message

        // Validate headers and response time
        validateHeaders(response.headers, 'application/json');
        validateResponseTime(response, 200);
      });
    });
  });
});
