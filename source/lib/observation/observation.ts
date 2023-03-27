import { Observation } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { EccMode } from '../../constants/mode';
import { getAllCodes, getCodesFromValueSetCode } from '../../query/json';
import type { ObservationMode } from '../../types';
import { legacy_MccObservationCollection, MccObservation } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import {
  convertToObservationCollection,
  fhirOptions,
  notFoundResponse,
  resourcesFrom,
} from './observation.util';

export const getObservation = async (code: string): Promise<MccObservation> => {
  if (!code) {
    log.error('getObservation - code not found');
    return notFoundResponse() as unknown as MccObservation;
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
    return notFoundResponse(code) as unknown as MccObservation;
  }

  const filteredMccObservation = filteredObservations[0]

  log.info(
    `getObservation - successful with code ${code} - with status ${filteredMccObservation.status}`
  );
  log.debug({ serviceName: 'getObservation', result: filteredMccObservation });
  return filteredMccObservation;
};

export const getObservations = async (
  code: string,
  mode?: ObservationMode,
  sort?: string,
  max?: string
): Promise<MccObservation[]> => {
  if (!code) {
    log.error('getObservations - required parameters not found - (code)');
    return [];
  }
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

  log.info(
    `getObservations - start with code - ${code} - ${mode} ${sort} ${max}`
  );
  const queryPath = `Observation?${EccMode[mode] ?? EccMode.code
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

  const filteredMccObservation = filteredObservations

  log.info(
    `getObservations - successful with code ${code} - with length ${filteredMccObservation.length}`
  );
  log.debug({ serviceName: 'getObservations', result: filteredMccObservation });
  return filteredMccObservation;
};

export const getObservationsByValueSet = async (
  valueSet: string,
  sort?: string,
  max?: string
): Promise<MccObservation[]> => {
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

  const queryPath = `Observation?${EccMode.code}=${combinedCodes}&_sort=${sortType}${max ? `&_count=${max}` : ''}`;
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

  const filteredMccObservation = filteredObservations

  log.info(
    `getObservationsByValueSet - successful with valueSet ${valueSet} - with length ${filteredMccObservation.length}`
  );
  log.debug({
    serviceName: 'getObservationsByValueSet',
    result: filteredMccObservation,
  });
  return filteredMccObservation;
};

export const getObservationsByCategory = async (
  category: string,
  sort?: string,
  max?: string,
  date?: string
): Promise<MccObservation[]> => {
  if (!category) {
    log.error('getObservationsByCategory - category not found');
    return [];
  }
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

  log.info(
    `getObservationsByCategory - start with category - ${category} - ${sort} ${max}`
  );

  const queryPath = `Observation?category=${category}
    ${sortType ? `&_sort=` : ''}
    ${max ? `&_count=${max}` : ''}
    ${date ? `&date=${date}` : ''}
  `;
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

export const getLatestObservation = async (code: string, translate: boolean, mode?: string): Promise<Observation> => {
  if (!code) {
    log.error('getLatestObservation - code not found');
    return notFoundResponse() as unknown as Observation;
  }

  const client = await FHIR.oauth2.ready();
  let codeValueSets = code;

  if (translate) {
    if (code.includes('|')) {
      const codeArray = code.split('|')
      codeValueSets = await getCodesFromValueSetCode(codeArray[0], codeArray[1]);
    } else {
      codeValueSets = await getCodesFromValueSetCode('http://loinc.org', code);
    }
  }

  log.info(`getLatestObservation - start with code - ${code}`);
  const queryPath = `Observation?${EccMode[mode] ?? EccMode.code}=http://loinc.org|${codeValueSets}&_sort=-date&_count=1`;
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

export const getObservationsSegmented = async (valueSet: string, max?: number, sort?: string, mode?: string, unit?: string): Promise<legacy_MccObservationCollection> => {
  if (!valueSet) {
    log.error('getObservationsSegmented - valueSet not found');
    return {
      result: 'valueSet not found'
    };
  }

  const client = await FHIR.oauth2.ready();

  log.info('getObservationsSegmented - getAllCodes');
  const codes = await getAllCodes(valueSet);
  const combinedCodes = codes.join(',');

  if (!combinedCodes) {
    log.error('getObservationsSegmented - getAllCodes empty');
    return {
      result: 'codes from valueset Empty'
    };
  }

  const sortType = sort === 'ascending' ? 'date' : '-date';

  log.info(
    `getObservationsSegmented - start with valueSet - ${valueSet} - ${sort} ${max} - ${unit}`
  );

  const queryPath = `Observation?${mode ?? EccMode.code}=${combinedCodes}&_sort=${sortType}${max ? `&_count=${max}` : ''}`;
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
    log.error('getObservationsSegmented - valueSet not found');
    return {
      result: 'valueSet not found'
    };
  }

  const segmentedObservation = convertToObservationCollection(filteredObservations);

  log.info(
    `getObservationsSegmented - successful with segmented ${valueSet}`
  );
  log.debug({
    serviceName: 'getObservationsSegmented',
    result: segmentedObservation,
  });

  return segmentedObservation;
}
