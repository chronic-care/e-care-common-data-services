"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorize = exports.authorize = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const authorize = async () => {
    await fhirclient_1.default.oauth2.authorize({
        // Meld Synthea test data sandbox
        redirectUri: '',
        clientId: '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
        scope: 'patient/*.read openid launch',
    });
};
exports.authorize = authorize;
const checkAuthorize = async () => {
    const client = await fhirclient_1.default.oauth2.ready();
    return client;
};
exports.checkAuthorize = checkAuthorize;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc291cmNlL2xpYi9hdXRob3JpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQThCO0FBRXZCLE1BQU0sU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFO0lBQ2xDLE1BQU0sb0JBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQzFCLGlDQUFpQztRQUNqQyxXQUFXLEVBQUUsRUFBRTtRQUNmLFFBQVEsRUFBRSxzQ0FBc0M7UUFDaEQsS0FBSyxFQUFFLDhCQUE4QjtLQUN0QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFQVyxRQUFBLFNBQVMsYUFPcEI7QUFFSyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtJQUN2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpDLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUpXLFFBQUEsY0FBYyxrQkFJekI7QUFFRixtQ0FBbUM7QUFDbkMsWUFBWTtBQUNaLGdCQUFnQjtBQUNoQixVQUFVO0FBQ1Ysc0NBQXNDO0FBQ3RDLDJCQUEyQjtBQUMzQix1RUFBdUU7QUFDdkUsV0FBVztBQUNYLFNBQVM7QUFDVCxnRUFBZ0U7QUFDaEUsT0FBTztBQUNQLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsd0JBQXdCO0FBQ3hCLGtCQUFrQjtBQUNsQixrQ0FBa0M7QUFDbEMsa0NBQWtDO0FBQ2xDLFNBQVM7QUFDVCxPQUFPO0FBQ1AsYUFBYTtBQUNiLDZCQUE2QjtBQUM3Qix1QkFBdUI7QUFDdkIsbUJBQW1CO0FBQ25CLG9CQUFvQjtBQUNwQiw4Q0FBOEM7QUFDOUMsbUJBQW1CO0FBQ25CLFNBQVM7QUFDVCxPQUFPO0FBQ1AsdUJBQXVCO0FBQ3ZCLFFBQVE7QUFDUixlQUFlO0FBQ2YscUJBQXFCO0FBQ3JCLHNCQUFzQjtBQUN0QiwrQ0FBK0M7QUFDL0MseUJBQXlCO0FBQ3pCLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsU0FBUztBQUNULE9BQU87QUFDUCxnQkFBZ0I7QUFDaEIsUUFBUTtBQUNSLGtCQUFrQjtBQUNsQixZQUFZO0FBQ1osa0ZBQWtGO0FBQ2xGLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLDBDQUEwQztBQUMxQyxLQUFLO0FBRUwsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyxzQ0FBc0M7QUFDdEMsWUFBWTtBQUNaLHNCQUFzQjtBQUN0QixvREFBb0Q7QUFDcEQsbUNBQW1DO0FBQ25DLGlCQUFpQjtBQUNqQixzRkFBc0Y7QUFDdEYsU0FBUztBQUNULE9BQU87QUFDUCxxQkFBcUI7QUFDckIsZ0JBQWdCO0FBQ2hCLFFBQVE7QUFDUixrQkFBa0I7QUFDbEIsWUFBWTtBQUNaLGtGQUFrRjtBQUNsRixnQ0FBZ0M7QUFDaEMsYUFBYTtBQUNiLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsU0FBUztBQUNULE9BQU87QUFDUCxZQUFZO0FBQ1osZ0JBQWdCO0FBQ2hCLFVBQVU7QUFDVixzQ0FBc0M7QUFDdEMsMkJBQTJCO0FBQzNCLHVFQUF1RTtBQUN2RSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUCxlQUFlO0FBQ2YsNENBQTRDO0FBQzVDLE9BQU87QUFDUCxxQ0FBcUM7QUFDckMsaUJBQWlCO0FBQ2pCLFFBQVE7QUFDUix5REFBeUQ7QUFDekQseUNBQXlDO0FBQ3pDLFNBQVM7QUFDVCxPQUFPO0FBQ1AscUJBQXFCO0FBQ3JCLGtCQUFrQjtBQUNsQixpQkFBaUI7QUFDakIsNENBQTRDO0FBQzVDLGlCQUFpQjtBQUNqQixPQUFPO0FBQ1Asc0JBQXNCO0FBQ3RCLFFBQVE7QUFDUixlQUFlO0FBQ2Ysb0JBQW9CO0FBQ3BCLHFCQUFxQjtBQUNyQiwrQ0FBK0M7QUFDL0MscUJBQXFCO0FBQ3JCLFdBQVc7QUFDWCxnQkFBZ0I7QUFDaEIsc0JBQXNCO0FBQ3RCLHFCQUFxQjtBQUNyQiwrQ0FBK0M7QUFDL0MseUJBQXlCO0FBQ3pCLFdBQVc7QUFDWCw0QkFBNEI7QUFDNUIsU0FBUztBQUNULE9BQU87QUFDUCxLQUFLIn0=