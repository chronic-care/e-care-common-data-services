import { Patient } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
} from './patient.util';

export const getPatientsByName = async (name: string): Promise<Patient[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Patient?name=${name}`;
  const patientRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredPatients: Patient[] = resourcesFrom(
    patientRequest
  ) as Patient[];

  log.info(
    `getPatients - successful`
  );
  log.debug({ serviceName: 'getPatients', result: filteredPatients });
  return filteredPatients;
};

export const getPatient = async (id: string): Promise<Patient> => {
  if (!id) {
    log.error('getPatient - id not found');
    return notFoundResponse as unknown as Patient;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Patient?_id=${id}`;
  const patientRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredPatient: Patient = resourcesFromObject(
    patientRequest
  ) as Patient;

  log.info(
    `getPatient - successful with id ${id}`
  );
  log.debug({ serviceName: 'getPatient', result: filteredPatient });
  return filteredPatient;
};
