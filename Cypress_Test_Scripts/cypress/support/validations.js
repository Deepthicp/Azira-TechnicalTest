//response time validation
export const validateResponseTime = (response, maxDuration) => {
    expect(response.duration).to.be.lessThan(maxDuration);
  };
  
//content-type validation
export const validateHeaders = (response, expectedContentType) => {
    expect(response.headers['content-type']).to.include(expectedContentType);
  };
  
//schema validation
export const validateSchema = (responseBody, expectedSchema) => {
    Object.keys(expectedSchema).forEach((key) => {
      expect(responseBody).to.have.property(key, expectedSchema[key]);
    });
  };
  
//Status code validation
export const validateStatusCode = (response, expectedStatus) => {
    expect(response.status).to.eq(expectedStatus);
  };
  