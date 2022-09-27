import { Observation } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { EccMode } from '../../constants/mode';
import { getAllCodes } from '../../query/json';
import type { ObservationMode } from '../../types';
import log from '../../utils/loglevel';

import {
  fhirOptions,
  notFoundResponse,
  resourcesFrom,
} from './observation.util';

export const getObservation = async (code: string): Promise<Observation> => {
  if (!code) {
    log.error('getObservation - code not found');
    return notFoundResponse() as unknown as Observation;
  }

  const client = await FHIR.oauth2.ready();

  log.info(`getObservation - start with code - ${code}`);
  const queryPath = `Observation?${EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`;
  const observationRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath,
    fhirOptions
  );

  const observationResource: Observation[] = resourcesFrom(
    observationRequest
  ) as Observation[];

  const filteredObservations: Observation[] = observationResource.filter(
    (v) => v !== undefined && v.resourceType === 'Observation'
  );

  if (!filteredObservations.length) {
    log.error('getObservation - empty observation');
    return notFoundResponse(code) as unknown as Observation;
  }

  log.info(
    `getObservation - successful with code ${code} - with status ${filteredObservations[0].status}`
  );
  log.debug({ serviceName: 'getObservation', result: filteredObservations[0] });
  return filteredObservations[0];
};

export const getObservations = async (
  code: string,
  mode?: ObservationMode,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  if (!code || !mode) {
    log.error('getObservations - required parameters not found - (code, mode)');
    return [];
  }
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

  log.info(
    `getObservations - start with code - ${code} - ${mode} ${sort} ${max}`
  );
  const queryPath = `Observation?${
    EccMode[mode] ?? EccMode.code
  }=http://loinc.org|${code}&_sort=${sortType}&_count=${max ?? 100}`;
  const observationRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath,
    fhirOptions
  );

  const observationResource: Observation[] = resourcesFrom(
    observationRequest
  ) as Observation[];

  const filteredObservations: Observation[] = observationResource.filter(
    (v) => v !== undefined && v.resourceType === 'Observation'
  );

  if (!filteredObservations.length) {
    log.error('getObservations - empty observations');
    return [];
  }

  log.info(
    `getObservations - successful with code ${code} - with length ${filteredObservations.length}`
  );
  log.debug({ serviceName: 'getObservations', result: filteredObservations });
  return filteredObservations;
};

export const getObservationsByValueSet = async (
  valueSet: string,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  if (!valueSet) {
    log.error('getObservationsByValueSet - valueSet not found');
    return [];
  }

  const client = await FHIR.oauth2.ready();

  log.info('getObservationsByValueSet - getAllCodes');
  const codes = await getAllCodes(valueSet);
  const combinedCodes = codes.join(',');

  if (!combinedCodes) {
    log.error('getObservationsByValueSet - getAllCodes empty');
    return [];
  }

  const sortType = sort === 'descending' ? '-date' : 'date';

  log.info(
    `getObservationsByValueSet - start with valueSet - ${valueSet} - ${sort} ${max}`
  );

  const queryPath = `Observation?${EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`;
  const observationRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath,
    fhirOptions
  );

  const observationResource: Observation[] = resourcesFrom(
    observationRequest
  ) as Observation[];

  const filteredObservations: Observation[] = observationResource.filter(
    (v) => v !== undefined && v.resourceType === 'Observation'
  );

  if (!filteredObservations.length) {
    log.error('getObservationsByValueSet - valueSet not found');
    return [];
  }

  log.info(
    `getObservationsByValueSet - successful with valueSet ${valueSet} - with length ${filteredObservations.length}`
  );
  log.debug({
    serviceName: 'getObservationsByValueSet',
    result: filteredObservations,
  });
  return filteredObservations;
};

export const getObservationsByCategory = async (
  category: string,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  if (!category) {
    log.error('getObservationsByCategory - category not found');
    return [];
  }
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

  log.info(
    `getObservationsByCategory - start with category - ${category} - ${sort} ${max}`
  );

  const queryPath = `Observation?category=${category}&_sort=${sortType}&_count=${
    max ?? 100
  }`;
  const observationRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath,
    fhirOptions
  );

  const observationResource: Observation[] = resourcesFrom(
    observationRequest
  ) as Observation[];

  const filteredObservations: Observation[] = observationResource.filter(
    (v) => v !== undefined && v.resourceType === 'Observation'
  );

  if (!filteredObservations.length) {
    log.error('getObservationsByCategory - empty observations');
    return [];
  }

  log.info(
    `getObservationsByCategory - successful with category ${category} - with length ${filteredObservations.length}`
  );
  log.debug({
    serviceName: 'getObservationsByCategory',
    result: filteredObservations,
  });
  return filteredObservations;
};
