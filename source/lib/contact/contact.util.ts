import { CareTeamParticipant, CodeableConcept, Practitioner, Reference, Resource } from 'fhir/r4';
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

function resolve(ref?: Reference, members?: Map<string, Practitioner>) {
  let resourceID: string | undefined = ref?.reference?.split('/').reverse()?.[0]
  return members?.get(resourceID ?? 'missing id')
}

export const transformToMccContact = (careTeamParticipant: CareTeamParticipant, careTeamMembers: Map<string, Practitioner>): MccPatientContact => {
  const theRole = careTeamParticipant?.role ? getConceptDisplayString(careTeamParticipant?.role[0]) : ''

  const theParticipation = resolve(careTeamParticipant.member, careTeamMembers);

  const thePhone = theParticipation?.telecom?.find((t) => t?.system === 'phone');
  const theEmail = theParticipation?.telecom?.find((t) => t?.system === 'email');

  var theAddress = '';
  if (theParticipation) {
    if (theParticipation.address) {
      var theLine = (theParticipation.address[0].line ? theParticipation.address[0].line[0] : '');
      var theCity = (theParticipation.address[0].city ? theParticipation.address[0].city : '');
      var theState = (theParticipation.address[0].state ? theParticipation.address[0].state : '');
      var theZip = (theParticipation.address[0].postalCode ? theParticipation.address[0].postalCode : '');
      theAddress = `${theLine} ${theCity} ${theState} ${theZip}`
    }
  }


  const theName = theParticipation?.name?.[0].text ?? careTeamParticipant.member?.display ?? careTeamParticipant.member?.reference ?? "No name";

  return {
    type: 'person',
    role: theRole,
    name: theName,
    hasImage: false,
    phone: thePhone ? thePhone?.value : '',
    email: theEmail ? theEmail?.value : '',
    address: theAddress ? theAddress : '',
    relFhirId: 'relation'
  };
}
