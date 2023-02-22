import { ServiceRequest } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { ReferralSummary } from '../../types/mcc-observations';
import log from '../../utils/loglevel';

import {
  resourcesFrom,
} from './referral.util';

export const getSummaryReferrals = async (): Promise<ReferralSummary[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `ServiceRequest?category=440379008,3457005,409073007,409063005`;
  const referralRequest1: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // referral from service request
  const filteredReferral1: ServiceRequest[] = resourcesFrom(
    referralRequest1
  ) as ServiceRequest[];

  log.info(
    `getSummaryReferral - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const summaryReferral = [...filteredReferral1]
  log.debug({ serviceName: 'getSummaryReferral', result: summaryReferral });

  return summaryReferral;
};
