import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccCondition, MccSocialConcern } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { getSupplementalDataClient } from '../goal/goal.util';

import {
  resourcesFromObjectArray, transformToSocialConcern,
} from './social-concern.util';

export const getSummarySocialConcerns = async (sdsURL: string, authURL: string, sdsScope: string): Promise<MccSocialConcern[]> => {
  const client = await FHIR.oauth2.ready();

  let sdsClient = await getSupplementalDataClient(client, sdsURL, authURL, sdsScope)

  const queryPath = `Condition?category=http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fcore%2FCodeSystem%2Fcondition-category%7Chealth-concern`;
  const socialConcernRequest1: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const sdssocialConcernRequest: fhirclient.JsonObject = await sdsClient.patient.request(
    queryPath
  );
  log.debug({ serviceName: 'getSummarySocialConcern', result: { socialConcernRequest1 } });

  // socialConcern from service request
  const filteredSocialConcern1: MccCondition[] = resourcesFromObjectArray(
    socialConcernRequest1
  ) as MccCondition[];

  const sdsfilteredSocialConcern1: MccCondition[] = resourcesFromObjectArray(
    sdssocialConcernRequest
  ) as MccCondition[];

  log.info(
    `getSummarySocialConcerns - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const summarySocialConcern = [...filteredSocialConcern1, ...sdsfilteredSocialConcern1]

  const mappedSocialConcern = summarySocialConcern.map(transformToSocialConcern)
  log.debug({ serviceName: 'getSummarySocialConcern', result: mappedSocialConcern });

  return mappedSocialConcern;
};
