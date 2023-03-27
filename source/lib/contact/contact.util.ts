import { CodeableConcept, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { MccPatientContact, PatientContactRole } from '../../types/mcc-types';

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

export const transformToMccContact = (contact: PatientContactRole): MccPatientContact => {
  const address = contact.address ? `${contact.address[0].line[0]} ${contact.address[0].city} ${contact.address[0].state} ${contact.address[0].postalCode} ${contact.address[0].country}` : '';
  const relation = contact.role === 'Patient' ? `${contact.role}/${contact.id}` : (contact as any).patient ? (contact as any).patient.reference : ''
  const name = contact.name[0].use === 'usual' ? `${contact.name[0].given[0]} ${contact.name[0].family}` : contact.name[0].text;
  return {
    type: 'person',
    role: contact.role,
    name: name,
    hasImage: false,
    phone: contact.telecom[0].value,
    email: contact.telecom[1].value,
    address: address,
    relFhirId: relation,
  };
}
