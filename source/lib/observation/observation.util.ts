import { Observation, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

export const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

export const notFoundResponse = (code?: string) => ({
  code,
  status: 'notfound',
  value: {
    stringValue: 'No Data Available',
    valueType: 'string',
  },
});

export const resourcesFrom = (response: fhirclient.JsonArray): Resource[] => {
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
