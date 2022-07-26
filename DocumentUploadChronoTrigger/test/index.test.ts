import httpTrigger from '../authorize/index';
import { Context } from '@azure/functions';

describe('Test for Demo Document Function', () => {
  let context: Context;

  beforeEach(() => {
    context = { log: jest.fn() } as unknown as Context;
  });

  // Here our test will be written
  it('should return a 200', async () => {
    // Arrange
    const request = {
      query: {},
      body: { name: 'John' },
    };

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.log).toBeCalledTimes(1);
    expect(context.res && context.res.status).toEqual(200);
  });

  it('should return a result string with the name given in the request body', async () => {
    // Arrange
    const request = {
      query: {},
      body: { name: 'John' },
    };
    const resultString =
      'Hello, John. This HTTP document triggered function executed successfully.';

    // Action
    await httpTrigger(context, request);

    // Assertion
    expect(context.log).toBeCalledTimes(1);
    expect(context.res && context.res.body).toEqual(resultString);
  });
});
