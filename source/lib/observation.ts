import { Observation, Resource } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { EccMode } from '../constants/mode';
import { getAllCodes } from '../query/json';
import type { ObservationMode } from '../types';

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

const notFoundResponse = (code) => ({
  code,
  status: 'notfound',
  value: {
    stringValue: 'No Data Available',
    valueType: 'string',
  },
});

const resourcesFrom = (response: fhirclient.JsonArray): Resource[] => {
  const firstEntries = response[0] as fhirclient.JsonObject;
  const entries: fhirclient.JsonObject[] = firstEntries?.entry
    ? (firstEntries.entry as [fhirclient.JsonObject])
    : [];
  return entries
    .map((entry: fhirclient.JsonObject) => entry?.resource as any)
    .filter(
      (resource: Resource) => resource.resourceType !== 'OperationOutcome'
    );
};

export const getObservation = async (code: string): Promise<Observation> => {
  const client = await FHIR.oauth2.ready();
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

  if (filteredObservations.length) {
    return filteredObservations[0];
  } else {
    return notFoundResponse(code) as unknown as Observation;
  }
};

export const getValue = (obs: Observation): any => {
  if (obs.valueQuantity) {
    return {
      valueQuantity: obs.valueQuantity,
    };
  } else if (obs.valueBoolean) {
    return {
      valueBoolean: obs.valueBoolean,
    };
  } else if (obs.valueInteger) {
    return {
      valueInteger: obs.valueInteger,
    };
  } else if (obs.valueString) {
    return {
      valueString: obs.valueString,
    };
  } else if (obs.valueRange) {
    return {
      valueRange: obs.valueRange,
    };
  } else if (obs.valueCodeableConcept) {
    return {
      valueCodeableConcept: obs.valueCodeableConcept,
    };
  } else {
    return {
      value: 'Unknown type',
    };
  }
};

export const getObservations = async (
  code: string,
  mode: ObservationMode,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

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

  if (filteredObservations.length) {
    return filteredObservations;
  } else {
    return [];
  }
};

export const getObservationsByValueSet = async (
  valueSet: string,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  const client = await FHIR.oauth2.ready();

  const codes = await getAllCodes(valueSet);
  const combinedCodes = codes.join(',');

  const sortType = sort === 'descending' ? '-date' : 'date';

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

  if (filteredObservations.length) {
    return filteredObservations;
  } else {
    return [];
  }
};

export const getObservationsByCategory = async (
  category: string,
  sort?: string,
  max?: string
): Promise<Observation[]> => {
  const client = await FHIR.oauth2.ready();

  const sortType = sort === 'descending' ? '-date' : 'date';

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

  if (filteredObservations.length) {
    return filteredObservations;
  } else {
    return [];
  }
};
