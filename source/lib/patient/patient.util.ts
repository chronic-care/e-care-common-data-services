import { CodeableConcept, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { MccPatient, MccPatientSummary } from '../../types/mcc-types';

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

export const transformToPatientSummary = (patient: MccPatient): MccPatientSummary => {
  const raceExtension = patient.extension ? patient.extension.find(ext => ext.url.includes('StructureDefinition/us-core-race')) : undefined;
  const race = raceExtension ? raceExtension.extension.find(ext => ext.url === "text")?.valueString : '';


  const id = patient.identifier ? patient.identifier.find(id => (id.system) && id.system.includes('NamingSystem/identifier'))?.value : '';



  const fhirid = patient.id;

  const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'U';

  const dob = new Date(patient.birthDate);
  const ageDiffMs = Date.now() - dob.getTime();
  const ageDate = new Date(ageDiffMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970).toString();

  const ethnicityExtension = patient.extension ? patient.extension.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity") : undefined;
  const ethnicity = ethnicityExtension ? ethnicityExtension.extension.find(ext => ext.url === "text")?.valueString : undefined;

  const name = patient.name ? patient.name[0].text : '';

  return { race, id, fhirid, gender, age, dateOfBirth: patient.birthDate, ethnicity, name }
}
