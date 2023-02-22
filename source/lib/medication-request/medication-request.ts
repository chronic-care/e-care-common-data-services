import { Medication } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
} from './medication-request.util';

export const getSummaryMedicationRequests = async (): Promise<Medication[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `MedicationRequest`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredMedicationRequests: Medication[] = resourcesFrom(
    goalRequest
  ) as Medication[];

  log.info(
    `getSummaryMedicationRequests - successful`
  );

  log.debug({ serviceName: 'getSummaryMedicationRequests', result: filteredMedicationRequests });

  return filteredMedicationRequests;
};

export const getMedicationRequests = async (): Promise<Medication[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `MedicationRequest`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredMedicationRequests: Medication[] = resourcesFrom(
    goalRequest
  ) as Medication[];

  log.info(
    `getMedicationRequests - successful`
  );

  log.debug({ serviceName: 'getMedicationRequests', result: filteredMedicationRequests });

  return filteredMedicationRequests;
};

export const getMedicationRequest = async (id: string): Promise<Medication> => {
  if (!id) {
    log.error('getMedicationRequest - id not found');
    return notFoundResponse as unknown as Medication;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `MedicationRequest?_id=${id}`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredMedicationRequest: Medication = resourcesFromObject(
    goalRequest
  ) as Medication;

  log.info(
    `getMedicationRequest - successful with id ${id}`
  );
  log.debug({ serviceName: 'getMedicationRequest', result: filteredMedicationRequest });
  return filteredMedicationRequest;
};
