import FHIR from 'fhirclient';

export const authorize = async () => {
  await FHIR.oauth2.authorize({
    // Meld Synthea test data sandbox
    redirectUri: '',
    clientId: '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
    scope: 'patient/*.read openid launch',
  });
};

export const checkAuthorize = async () => {
  const client = await FHIR.oauth2.ready();

  return client;
};

// const mccObj: MccObservation = {
//   code: {
//     coding: [
//       {
//         system: 'http://loinc.org',
//         code: '17856-6',
//         display: 'Hemoglobin A1c/Hemoglobin.total in Blood by HPLC',
//       },
//     ],
//     text: 'Hemoglobin A1c/Hemoglobin.total in Blood by HPLC',
//   },
//   status: 'final',
//   effective: {
//     type: 'dateTime',
//     dateTime: {
//       rawDate: '1646841600000',
//       date: '03/10/2022 12:00',
//     },
//   },
//   value: {
//     valueType: 'Quantity',
//     quantityValue: {
//       unit: '%',
//       value: 9.2,
//       system: 'http://unitsofmeasure.org/',
//       code: '%',
//     },
//   },
//   referenceRanges: [
//     {
//       low: {
//         unit: '%',
//         value: 5.6,
//         system: 'http://unitsofmeasure.org',
//         code: 'mg/dL',
//       },
//       text: '4 to 5.6 %',
//     },
//   ],
//   category: [
//     {
//       coding: [
//         {
//           system: 'http://terminology.hl7.org/CodeSystem/observation-category',
//           code: 'laboratory',
//         },
//       ],
//       text: 'Laboratory',
//     },
//   ],
//   fhirid: 'mcc-obs-pnoelle-lab-hgbA1c',
// };

// const Obj: Observation = {
//   resourceType: 'Observation',
//   id: 'mcc-obs-pnoelle-lab-hgbA1c',
//   meta: {
//     versionId: '1',
//     lastUpdated: '2022-05-02T11:40:59.000+00:00',
//     source: '#eb35f0f8c939c1e2',
//     profile: [
//       'http://hl7.org/fhir/us/core/StructureDefinition/us-core-observationresults',
//     ],
//   },
//   status: 'final',
//   category: [
//     {
//       coding: [
//         {
//           system: 'http://terminology.hl7.org/CodeSystem/observation-category',
//           code: 'laboratory',
//         },
//       ],
//       text: 'Laboratory',
//     },
//   ],
//   code: {
//     coding: [
//       {
//         system: 'http://loinc.org',
//         code: '17856-6',
//         display: 'Hemoglobin A1c/Hemoglobin.total in Blood by HPLC',
//       },
//     ],
//   },
//   subject: {
//     reference: 'Patient/mcc-pat-pnoelle',
//   },
//   effectiveDateTime: '2022-03-10',
//   performer: [
//     {
//       reference: 'Practitioner/mcc-prac-carlson-john',
//       display: 'Dr. John Carlson, MD',
//     },
//   ],
//   valueQuantity: {
//     value: 9.2,
//     unit: '%',
//     system: 'http://unitsofmeasure.org/',
//     code: '%',
//   },
//   referenceRange: [
//     {
//       low: {
//         value: 4,
//         unit: '%',
//         system: 'http://unitsofmeasure.org',
//         code: '%',
//       },
//       high: {
//         value: 5.6,
//         unit: '%',
//         system: 'http://unitsofmeasure.org',
//         code: 'mg/dL',
//       },
//       text: '4 to 5.6 %',
//     },
//   ],
// };
