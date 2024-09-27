import { CodeableConcept, Resource } from 'fhir/r4';
import { fhirclient } from 'fhirclient/lib/types';

import { getFilenameFromValueSetCode } from '../../query/json';
import { MccCondition, MccConditionSummary } from '../../types/mcc-types';
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

export const resourcesFrom = (response: fhirclient.JsonObject): Resource[] => {
  const entries: fhirclient.JsonObject[] = response?.entry
    ? (response.entry as [fhirclient.JsonObject])
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

export const getConceptCode = (code: CodeableConcept): string => {

  if (code) {


    if (code.coding) {
      return code.coding.reduce((_, curr) => curr.code, '');
    }

    if (code.text) return code.text;

  }


  return '';
};

// function getCodeableConceptAsString(codeableConcept: CodeableConcept) {
//   return 'NULL' + JSON.stringify(codeableConcept)
// }

// export const getCodeableConceptAsStrings = (codeableConcept: CodeableConcept): string => {
//   // if (codeableConcept) {
//   //   if (codeableConcept.text) {
//   //     return codeableConcept.text
//   //   } else if (codeableConcept.coding) {
//   //     return codeableConcept.coding[0].display
//   //   }
//   // }
//   return 'MISSING'
// }

export const transformToConditionSummary = async (fhirCondition: MccCondition): Promise<MccConditionSummary> => {
  const profileMapping = {
    '2.16.840.1.113762.1.4.1222.159': 'CKD'
  }
  const code = fhirCondition.code.coding[0];

  const codeName = await getFilenameFromValueSetCode(code.system, code.code)

  const transformedData: MccConditionSummary = {
    code: fhirCondition.code,
    categories: fhirCondition.category[0].coding[0].code,
    provenance: "This is Provenance",
    history: [
      {
        code: fhirCondition.code,
        onset: fhirCondition.onsetDateTime ? displayDate(fhirCondition.onsetDateTime) : '',
        abatement: null,
        clinicalStatus: getConceptCode(fhirCondition.clinicalStatus),
        verificationStatus: getConceptCode(fhirCondition.verificationStatus),
        categories: fhirCondition.category[0].text,
        recorded: fhirCondition.recordedDate ? new Date(fhirCondition.recordedDate).getTime() : null,
        note: "",
        fhirid: fhirCondition.id,
        recordedAsText: fhirCondition.recordedDate ? displayDate(fhirCondition.onsetDateTime) : '',
      },
    ],
    profileId: profileMapping[codeName],
    firstRecordedAsText: fhirCondition.recordedDate ? displayDate(fhirCondition.recordedDate) : '',
    firstOnsetAsText: fhirCondition.onsetDateTime ? displayDate(fhirCondition.onsetDateTime) : '',
    clinicalStatus: getConceptCode(fhirCondition.clinicalStatus),
    verificationStatus: getConceptCode(fhirCondition.verificationStatus),
    asserter: fhirCondition.asserter ? fhirCondition.asserter.display : ''
  };




  return transformedData;
}
