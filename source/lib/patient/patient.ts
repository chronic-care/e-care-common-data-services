import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccPatient, MccPatientSummary } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
  transformToPatientSummary,
} from './patient.util';

export const getPatientsByName = async (name: string): Promise<MccPatientSummary[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Patient?name=${name}`;
  const patientRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredPatients: MccPatient[] = resourcesFrom(
    patientRequest
  ) as MccPatient[];

  const mappedFilteredPatients = filteredPatients.map(transformToPatientSummary);

  log.info(
    `getPatients - successful`
  );
  log.debug({ serviceName: 'getPatients', result: mappedFilteredPatients });
  return mappedFilteredPatients;
};

export const getPatient = async (id: string): Promise<MccPatientSummary> => {
  if (!id) {
    log.error('getPatient - id not found');
    return notFoundResponse as unknown as MccPatientSummary;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Patient?_id=${id}`;
  const patientRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredPatient: MccPatient = resourcesFromObject(
    patientRequest
  ) as MccPatient;

  log.info(
    `getPatient - successful with id ${id}`
  );
  log.debug({ serviceName: 'getPatient', result: filteredPatient });
  return transformToPatientSummary(filteredPatient);
};
