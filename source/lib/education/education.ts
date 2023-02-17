import { Procedure, ServiceRequest } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { EducationSummary } from '../../types/mcc-observations';
import log from '../../utils/loglevel';

import {
  resourcesFrom,
} from './education.util';

export const getSummaryEducations = async (): Promise<EducationSummary[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath1 = `Procedure?category=409073007,311401005`;
  const queryPath2 = `ServiceRequest?category=409073007`;
  const educationRequest1: fhirclient.JsonArray = await client.patient.request(
    queryPath1
  );

  const educationRequest2: fhirclient.JsonArray = await client.patient.request(
    queryPath2
  );

  // education from problem list item
  const filteredEducation1: Procedure[] = resourcesFrom(
    educationRequest1
  ) as Procedure[];

  // education from health concern
  const filteredEducation2: ServiceRequest[] = resourcesFrom(
    educationRequest2
  ) as ServiceRequest[];

  log.info(
    `getSummaryEducation - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const summaryEducation = [...filteredEducation1, ...filteredEducation2]
  log.debug({ serviceName: 'getSummaryEducation', result: summaryEducation });

  return summaryEducation;
};
