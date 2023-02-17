import { Procedure, ServiceRequest } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { CounselingSummary } from '../../types/mcc-observations';
import log from '../../utils/loglevel';

import {
  resourcesFrom,
} from './counseling.util';

export const getSummaryCounselings = async (): Promise<CounselingSummary[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath1 = `Procedure?category=409063005`;
  const queryPath2 = `ServiceRequest?category=409063005`;
  const counselingRequest1: fhirclient.JsonArray = await client.patient.request(
    queryPath1
  );

  const counselingRequest2: fhirclient.JsonArray = await client.patient.request(
    queryPath2
  );

  // counseling from problem list item
  const filteredCounseling1: Procedure[] = resourcesFrom(
    counselingRequest1
  ) as Procedure[];

  // counseling from health concern
  const filteredCounseling2: ServiceRequest[] = resourcesFrom(
    counselingRequest2
  ) as ServiceRequest[];

  log.info(
    `getSummaryCounselings - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const summaryCounselings = [...filteredCounseling1, ...filteredCounseling2]
  log.debug({ serviceName: 'getSummaryCounselings', result: summaryCounselings });

  return summaryCounselings;
};
