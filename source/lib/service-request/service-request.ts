// import { Reference } from 'fhir/r4';
// import { Condition, ServiceRequest } from 'fhir/r4';
// import { Condition } from 'fhir/r4';
import { ServiceRequest } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccServiceRequestSummary } from '../../types/mcc-types';

import { getCondition } from '../condition';





import {

  displayConcept,
  resourcesFromObjectArray, transformToServiceRequest,
} from './service-request.util';

async function updateServiceRequestsReferences(serviceRequestResults: ServiceRequest[]) {

  const updates = new Map<string, string>();

  const promiseArray = serviceRequestResults.map(async serviceRequestResult => {
    if (serviceRequestResult.reasonReference) {
      const perhaps = await getCondition(serviceRequestResult.reasonReference[0].reference.split("/")[1]);
      if (perhaps.code) {
        updates.set(serviceRequestResult.reasonReference[0].reference, displayConcept(perhaps.code));
      } else {
        updates.set(serviceRequestResult.reasonReference[0].reference, 'MISSING');
      }

    }
  });
  await Promise.all(promiseArray);
  return updates;
}

export const getSummaryServiceRequest = async (): Promise<MccServiceRequestSummary[]> => {

  const client = await FHIR.oauth2.ready();

  const queryPath = `ServiceRequest?status=active`;
  const serviceRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );


  const serviceRequestResults: ServiceRequest[] = resourcesFromObjectArray(
    serviceRequest
  ) as ServiceRequest[];


  const conditionMap = await updateServiceRequestsReferences(serviceRequestResults);





  const mappedServiceRequests = serviceRequestResults.map(
    function (x) { return transformToServiceRequest(x, conditionMap); }
  );



  return mappedServiceRequests;
};
