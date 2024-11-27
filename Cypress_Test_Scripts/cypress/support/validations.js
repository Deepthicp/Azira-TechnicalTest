// validations.js
export const validateResponseTime = (response, maxDuration) => {
  expect(response.duration).to.be.lessThan(maxDuration);
};

export const validateHeaders = (response, expectedContentType) => {
  // Check if response and headers are defined
  if (response && response.headers) {
    const contentType = response.headers['content-type'];

    // Check if content-type exists and matches the expected content type
    if (contentType) {
      expect(contentType).to.include(expectedContentType);
    } else {
      cy.log('Content-Type header is missing');
    }
  } else {
    cy.log('Response or response headers are missing');
  }
};


export const validateSchema = (responseBody, expectedSchema) => {
  Object.keys(expectedSchema).forEach((key) => {
    expect(responseBody).to.have.property(key, expectedSchema[key]);
  });
};

export const validateStatusCode = (response, expectedStatus) => {
  expect(response.status).to.eq(expectedStatus);
};
