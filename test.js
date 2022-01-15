
const Controller = require('./src/controller');


const mockResponse = () => {
    const response = {};
    response.status = jest.fn().mockReturnValue(response);
    response.json = jest.fn().mockReturnValue(response);

    return response;
};
