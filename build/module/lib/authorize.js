var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FHIR from 'fhirclient';
export const authorize = () => __awaiter(void 0, void 0, void 0, function* () {
    yield FHIR.oauth2.authorize({
        // Meld Synthea test data sandbox
        redirectUri: '',
        clientId: '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
        scope: 'patient/*.read openid launch',
    });
});
export const checkAuthorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    return client;
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc291cmNlL2xpYi9hdXRob3JpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sWUFBWSxDQUFDO0FBRTlCLE1BQU0sQ0FBQyxNQUFNLFNBQVMsR0FBRyxHQUFTLEVBQUU7SUFDbEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUMxQixpQ0FBaUM7UUFDakMsV0FBVyxFQUFFLEVBQUU7UUFDZixRQUFRLEVBQUUsc0NBQXNDO1FBQ2hELEtBQUssRUFBRSw4QkFBOEI7S0FDdEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFBLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsR0FBUyxFQUFFO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUV6QyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUEsQ0FBQztBQUVGLG1DQUFtQztBQUNuQyxZQUFZO0FBQ1osZ0JBQWdCO0FBQ2hCLFVBQVU7QUFDVixzQ0FBc0M7QUFDdEMsMkJBQTJCO0FBQzNCLHVFQUF1RTtBQUN2RSxXQUFXO0FBQ1gsU0FBUztBQUNULGdFQUFnRTtBQUNoRSxPQUFPO0FBQ1AscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQix3QkFBd0I7QUFDeEIsa0JBQWtCO0FBQ2xCLGtDQUFrQztBQUNsQyxrQ0FBa0M7QUFDbEMsU0FBUztBQUNULE9BQU87QUFDUCxhQUFhO0FBQ2IsNkJBQTZCO0FBQzdCLHVCQUF1QjtBQUN2QixtQkFBbUI7QUFDbkIsb0JBQW9CO0FBQ3BCLDhDQUE4QztBQUM5QyxtQkFBbUI7QUFDbkIsU0FBUztBQUNULE9BQU87QUFDUCx1QkFBdUI7QUFDdkIsUUFBUTtBQUNSLGVBQWU7QUFDZixxQkFBcUI7QUFDckIsc0JBQXNCO0FBQ3RCLCtDQUErQztBQUMvQyx5QkFBeUI7QUFDekIsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLGdCQUFnQjtBQUNoQixRQUFRO0FBQ1Isa0JBQWtCO0FBQ2xCLFlBQVk7QUFDWixrRkFBa0Y7QUFDbEYsZ0NBQWdDO0FBQ2hDLGFBQWE7QUFDYixXQUFXO0FBQ1gsNEJBQTRCO0FBQzVCLFNBQVM7QUFDVCxPQUFPO0FBQ1AsMENBQTBDO0FBQzFDLEtBQUs7QUFFTCw2QkFBNkI7QUFDN0IsaUNBQWlDO0FBQ2pDLHNDQUFzQztBQUN0QyxZQUFZO0FBQ1osc0JBQXNCO0FBQ3RCLG9EQUFvRDtBQUNwRCxtQ0FBbUM7QUFDbkMsaUJBQWlCO0FBQ2pCLHNGQUFzRjtBQUN0RixTQUFTO0FBQ1QsT0FBTztBQUNQLHFCQUFxQjtBQUNyQixnQkFBZ0I7QUFDaEIsUUFBUTtBQUNSLGtCQUFrQjtBQUNsQixZQUFZO0FBQ1osa0ZBQWtGO0FBQ2xGLGdDQUFnQztBQUNoQyxhQUFhO0FBQ2IsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLFlBQVk7QUFDWixnQkFBZ0I7QUFDaEIsVUFBVTtBQUNWLHNDQUFzQztBQUN0QywyQkFBMkI7QUFDM0IsdUVBQXVFO0FBQ3ZFLFdBQVc7QUFDWCxTQUFTO0FBQ1QsT0FBTztBQUNQLGVBQWU7QUFDZiw0Q0FBNEM7QUFDNUMsT0FBTztBQUNQLHFDQUFxQztBQUNyQyxpQkFBaUI7QUFDakIsUUFBUTtBQUNSLHlEQUF5RDtBQUN6RCx5Q0FBeUM7QUFDekMsU0FBUztBQUNULE9BQU87QUFDUCxxQkFBcUI7QUFDckIsa0JBQWtCO0FBQ2xCLGlCQUFpQjtBQUNqQiw0Q0FBNEM7QUFDNUMsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUCxzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLGVBQWU7QUFDZixvQkFBb0I7QUFDcEIscUJBQXFCO0FBQ3JCLCtDQUErQztBQUMvQyxxQkFBcUI7QUFDckIsV0FBVztBQUNYLGdCQUFnQjtBQUNoQixzQkFBc0I7QUFDdEIscUJBQXFCO0FBQ3JCLCtDQUErQztBQUMvQyx5QkFBeUI7QUFDekIsV0FBVztBQUNYLDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUsifQ==