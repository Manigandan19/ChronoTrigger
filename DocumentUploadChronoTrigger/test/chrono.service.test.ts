import axios from 'axios';

import {
  DRCHRONO_ACCESS_TOKEN,
  DRCHRONO_DOCTOR_ID,
  DRCHRONO_PATIENT_ID,
  PRE_SIGNED_BLOB_LINK,
  TEST_MODALITY_NAME,
} from './mocks/mockConstants';
import chronoService from '../documentupload/services/chrono.service';

jest.mock('axios');
const mockedAxios = jest.mocked(axios, true);

describe('Test for uploadDocumentToDrChronoAsync', () => {
  test('should return success status as 201', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 201,
    });

    mockedAxios.request.mockResolvedValue({
      data: JSON.stringify(new ArrayBuffer(16)),
    });

    const request = {
      drChronoAccessToken: DRCHRONO_ACCESS_TOKEN,
      externalDoctorId: DRCHRONO_DOCTOR_ID,
      externalPatientId: DRCHRONO_PATIENT_ID,
      presignedBlobLink: PRE_SIGNED_BLOB_LINK,
      testModalityName: TEST_MODALITY_NAME,
    };

    // Action
    const response = await chronoService.uploadDocumentToDrChronoAsync(request);

    // Assertion
    expect(response.status).toBe(201);
  });

  test('should return error status as 401 without drChronoAccessToken', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 401,
    });
    mockedAxios.request.mockResolvedValue({
      data: JSON.stringify(new ArrayBuffer(16)),
    });

    const request = {
      drChronoAccessToken: '',
      externalDoctorId: DRCHRONO_DOCTOR_ID,
      externalPatientId: DRCHRONO_PATIENT_ID,
      presignedBlobLink: PRE_SIGNED_BLOB_LINK,
      testModalityName: TEST_MODALITY_NAME,
    };

    // Action
    const response = await chronoService.uploadDocumentToDrChronoAsync(request);

    // Assertion
    expect(response.status).toBe(401);
  });

  test('should return error message without externalDoctorId', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 400,
    });
    mockedAxios.request.mockResolvedValue({
      data: JSON.stringify(new ArrayBuffer(16)),
    });

    const request = {
      drChronoAccessToken: DRCHRONO_ACCESS_TOKEN,
      externalDoctorId: '',
      externalPatientId: DRCHRONO_PATIENT_ID,
      presignedBlobLink: PRE_SIGNED_BLOB_LINK,
      testModalityName: TEST_MODALITY_NAME,
    };

    // Action
    const response = await chronoService.uploadDocumentToDrChronoAsync(request);

    // Assertion
    expect(response.status).toBe(400);
  });

  test('should return error message without externalPatientId', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 400,
    });

    mockedAxios.request.mockResolvedValue({
      data: JSON.stringify(new ArrayBuffer(16)),
    });

    const request = {
      drChronoAccessToken: DRCHRONO_ACCESS_TOKEN,
      externalDoctorId: DRCHRONO_DOCTOR_ID,
      externalPatientId: '',
      presignedBlobLink: PRE_SIGNED_BLOB_LINK,
      testModalityName: TEST_MODALITY_NAME,
    };
    // Action
    const response = await chronoService.uploadDocumentToDrChronoAsync(request);

    // Assertion
    expect(response.status).toBe(400);
  });

  test('should return error message without presignedBlobLink', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 400,
    });

    const request = {
      drChronoAccessToken: DRCHRONO_ACCESS_TOKEN,
      externalDoctorId: DRCHRONO_DOCTOR_ID,
      externalPatientId: DRCHRONO_PATIENT_ID,
      presignedBlobLink: '',
      testModalityName: TEST_MODALITY_NAME,
    };

    // Action
    const response = await chronoService.uploadDocumentToDrChronoAsync(request);

    // Assertion
    expect(response.status).toBe(400);
  });
});
