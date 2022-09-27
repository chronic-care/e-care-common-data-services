"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorize = exports.authorize = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
exports.authorize = async () => {
    await fhirclient_1.default.oauth2.authorize({
        // Meld Synthea test data sandbox
        redirectUri: '',
        clientId: '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
        scope: 'patient/*.read openid launch',
    });
};
exports.checkAuthorize = async () => {
    const client = await fhirclient_1.default.oauth2.ready();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc291cmNlL2xpYi9hdXRob3JpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQThCO0FBRWpCLFFBQUEsU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ2xDLE1BQU0sb0JBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzFCLGlDQUFpQztRQUNqQyxXQUFXLEVBQUUsRUFBRTtRQUNmLFFBQVEsRUFBRSxzQ0FBc0M7UUFDaEQsS0FBSyxFQUFFLDhCQUE4QjtLQUN0QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFVyxRQUFBLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtJQUN2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLG1DQUFtQztBQUNuQyxZQUFZO0FBQ1osZ0JBQWdCO0FBQ2hCLFVBQVU7QUFDVixzQ0FBc0M7QUFDdEMsMkJBQTJCO0FBQzNCLHVFQUF1RTtBQUN2RSxXQUFXO0FBQ1gsU0FBUztBQUNULGdFQUFnRTtBQUNoRSxPQUFPO0FBQ1AscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQix3QkFBd0I7QUFDeEIsa0JBQWtCO0FBQ2xCLGtDQUFrQztBQUNsQyxrQ0FBa0M7QUFDbEMsU0FBUztBQUNULE9BQU87QUFDUCxhQUFhO0FBQ2IsNkJBQTZCO0FBQzdCLHVCQUF1QjtBQUN2QixtQkFBbUI7QUFDbkIsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5QyxtQkFBbUI7QUFDbkIsU0FBUztBQUNULE9BQU87QUFDUCx1QkFBdUI7QUFDdkIsUUFBUTtBQUNSLGVBQWU7QUFDZixxQkFBcUI7QUFDckIsc0JBQXNCO0FBQ3RCLCtDQUErQztBQUMvQyx5QkFBeUI7QUFDekIsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLGdCQUFnQjtBQUNoQixRQUFRO0FBQ1Isa0JBQWtCO0FBQ2xCLFlBQVk7QUFDWixrRkFBa0Y7QUFDbEYsZ0NBQWdDO0FBQ2hDLGFBQWE7QUFDYixXQUFXO0FBQ1gsNEJBQTRCO0FBQzVCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsMENBQTBDO0FBQzFDLEtBQUs7QUFFTCw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDLHNDQUFzQztBQUN0QyxZQUFZO0FBQ1osc0JBQXNCO0FBQ3RCLG9EQUFvRDtBQUNwRCxtQ0FBbUM7QUFDbkMsaUJBQWlCO0FBQ2pCLHNGQUFzRjtBQUN0RixTQUFTO0FBQ1QsT0FBTztBQUNQLHFCQUFxQjtBQUNyQixnQkFBZ0I7QUFDaEIsUUFBUTtBQUNSLGtCQUFrQjtBQUNsQixZQUFZO0FBQ1osa0ZBQWtGO0FBQ2xGLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLFlBQVk7QUFDWixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLHNDQUFzQztBQUN0QywyQkFBMkI7QUFDM0IsdUVBQXVFO0FBQ3ZFLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLGVBQWU7QUFDZiw0Q0FBNEM7QUFDNUMsT0FBTztBQUNQLHFDQUFxQztBQUNyQyxpQkFBaUI7QUFDakIsUUFBUTtBQUNSLHlEQUF5RDtBQUN6RCx5Q0FBeUM7QUFDekMsU0FBUztBQUNULE9BQU87QUFDUCxxQkFBcUI7QUFDckIsa0JBQWtCO0FBQ2xCLGlCQUFpQjtBQUNqQiw0Q0FBNEM7QUFDNUMsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUCxzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLGVBQWU7QUFDZixvQkFBb0I7QUFDcEIscUJBQXFCO0FBQ3JCLCtDQUErQztBQUMvQyxxQkFBcUI7QUFDckIsV0FBVztBQUNYLGdCQUFnQjtBQUNoQixzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLCtDQUErQztBQUMvQyx5QkFBeUI7QUFDekIsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUsifQ==