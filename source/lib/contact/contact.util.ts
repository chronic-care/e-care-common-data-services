import { CareTeamParticipant, CodeableConcept, Practitioner, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { MccPatientContact } from '../../types/mcc-types';

// import log from '../../utils/loglevel';

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

export const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
  const entries = (response[0] as fhirclient.JsonObject)?.entry as [fhirclient.JsonObject];
  return entries?.map((entry: fhirclient.JsonObject) => entry.resource as any)
    .filter((resource: Resource) => resource.resourceType !== 'OperationOutcome');
};

export const resourcesFrom2 = (response: fhirclient.JsonArray): Resource[] => {
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

export const transformToMccContact = (participants: CareTeamParticipant[], practitioner: Practitioner): MccPatientContact => {
  const address = practitioner.address ? `${practitioner.address[0].line[0]} ${practitioner.address[0].city} ${practitioner.address[0].state} ${practitioner.address[0].postalCode} ${practitioner.address[0].country}` : '';
  const name = practitioner.name[0].use === 'usual' ? `${practitioner.name[0].given[0]} ${practitioner.name[0].family}` : practitioner.name[0].text;
  participants.find((participant) => participant.member?.reference.includes(practitioner.id)).role[0].text;

  return {
    type: 'person',
    role: participants.find((participant) => participant.member?.reference.includes(practitioner.id)).role[0].text,
    name: name,
    hasImage: false,
    phone: practitioner.telecom[0].value,
    email: practitioner.telecom[1].value,
    address: address,
    relFhirId: 'relation'
  };
}
