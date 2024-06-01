import { CodeableConcept, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { MccCondition, MccSocialConcern } from '../../types/mcc-types';
import { displayDate } from '../service-request/service-request.util';

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

export const resourcesFromObject = (
  response: fhirclient.JsonObject
): Resource => {
  const entry: fhirclient.JsonObject = response?.entry[0];

  const resource: any = entry?.resource;

  if (resource.resourceType === 'OperationOutcome') {
    return {} as any;
  }

  return resource;
};

export const resourcesFromObjectArray = (response: fhirclient.JsonObject): Resource[] => {
  if (response?.entry) {
    const entries: fhirclient.JsonArray = response?.entry as fhirclient.JsonArray;
    return entries.map((entry: fhirclient.JsonObject) => entry?.resource as any).filter((resource: any) => resource.resourceType !== 'OperationOutcome')
  }
  return new Array<MccCondition>();
};

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

export const getConceptDisplayString = (code: CodeableConcept): string => {
  if (code.text) return code.text;

  if (code.coding) {
    return code.coding.reduce((_, curr) => curr.display, '');
  }

  return '';
};

export const transformToSocialConcern = (condition: MccCondition): MccSocialConcern => {
  return {
    name: condition.code.text,
    data: condition.clinicalStatus && condition.clinicalStatus.coding[0] ? condition.clinicalStatus.coding[0].code : '',
    description: null,
    date: condition.onsetDateTime ? displayDate(condition.onsetDateTime) : null,
    hovered: false,
  };
}
