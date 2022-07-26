import axios from 'axios';

import {
  DRCHRONO_ACCESS_TOKEN,
  DRCHRONO_DOCTOR_ID,
  HERU_SERVICE_TOKEN,
} from './mocks/mockConstants';

import heruService from '../documentupload/services/heru.service';

jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

describe('Test for getDrChronoAccessTokenAsync', () => {
  test('should return DrChrono AccessToken', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        response: {
          accountIntegration: {
            accessToken: DRCHRONO_ACCESS_TOKEN,
          },
        },
      },
    });

    // Action
    const response = await heruService.getDrChronoAccessTokenAsync(
      HERU_SERVICE_TOKEN,
      DRCHRONO_DOCTOR_ID,
    );

    const expectedResult = {
      drChronoAccessToken: DRCHRONO_ACCESS_TOKEN,
    };

    // Assertion
    expect(response).toEqual(expectedResult);
  });
});
