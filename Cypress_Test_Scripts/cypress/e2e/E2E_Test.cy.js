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

  it('should perform create, get, update, and delete operations with validations', () => {
    // Step 1: Create Campaign
    cy.request('POST', `${baseUrl}/campaign`, campaignData).then((response) => {
      // Debug and validate response
      cy.log('POST Response:', JSON.stringify(response.body));
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id'); // Ensure response has 'id'

      // Validate response time
      expect(response.duration).to.be.lessThan(200);

      // Validate headers
      expect(response.headers['content-type']).to.include('application/json');

      // Validate campaign ID
      campaignId = response.body.id;
      expect(campaignId).to.not.be.undefined;

      // Schema validation
      expect(response.body).to.deep.include({
        name: campaignData.name,
        client: campaignData.client,
        category: campaignData.category,
        type: campaignData.type,
        status: campaignData.status,
      });

      cy.log(`Campaign ID after POST: ${campaignId}`);
    });

    // Step 2: Get Campaign
    cy.then(() => {
      cy.log(`GET URL: ${baseUrl}/campaign/${campaignId}`);
      cy.request('GET', `${baseUrl}/campaign/${campaignId}`).then((response) => {
        // Debug and validate response
        cy.log('GET Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(campaignData.name);

        // Validate schema and headers
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.deep.include({
          name: campaignData.name,
          client: campaignData.client,
          category: campaignData.category,
          type: campaignData.type,
          status: campaignData.status,
        });
      });
    });

    // Step 3: Update Campaign
    cy.then(() => {
      cy.request('PUT', `${baseUrl}/campaign/${campaignId}`, updatedCampaignData).then((response) => {
        // Debug and validate response
        cy.log('PUT Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(updatedCampaignData.name);

        // Validate headers and response time
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.duration).to.be.lessThan(500);

        // Validate schema
        expect(response.body).to.deep.include({
          name: updatedCampaignData.name,
          client: updatedCampaignData.client,
          category: updatedCampaignData.category,
          type: updatedCampaignData.type,
          status: updatedCampaignData.status,
        });
      });
    });

    // Step 4: Delete Campaign
    cy.then(() => {
      cy.request('DELETE', `${baseUrl}/campaign/${campaignId}`).then((response) => {
        // Debug and validate response
        cy.log('DELETE Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(200);

        // Validate headers
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    // Step 5: Verify Campaign is Deleted
    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/campaign/${campaignId}`,
        failOnStatusCode: false, // Prevent test failure on non-200 responses
      }).then((response) => {
        // Debug and validate response
        cy.log('GET After DELETE Response:', JSON.stringify(response.body));
        expect(response.status).to.eq(404);
        if (response.status === 404) {
          cy.log('Campaign is not found');  // Display the custom message
        }
    
        // Verify the status code is 404
        expect(response.status).to.eq(404); // Expecting Not Found
      });
    });

    // Step 6: Validate Duplicates (Optional)
    cy.then(() => {
      cy.request('GET', `${baseUrl}/campaign`).then((response) => {
        const ids = response.body.map((campaign) => campaign.id);
        const uniqueIds = new Set(ids);
        expect(ids.length).to.eq(uniqueIds.size); // Ensure no duplicate IDs
      });
    });

    // Step 7: Negative Test Case for Missing Fields
    cy.then(() => {
      const invalidCampaignData = { name: "Incomplete_Campaign" };
      cy.request({
        method: 'POST',
        url: `${baseUrl}/campaign`,
        body: invalidCampaignData,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400); // Expect Bad Request
        expect(response.body.message).to.include('Validation failed'); // Check error message
      });
    });
  });
});
