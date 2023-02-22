import { Condition } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import log from '../../utils/loglevel';

import {
  resourcesFrom,
} from './social-concern.util';

export const getSummarySocialConcerns = async (): Promise<Condition[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Condition?category=http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fcore%2FCodeSystem%2Fcondition-category%7Chealth-concern`;
  const socialConcernRequest1: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // socialConcern from service request
  const filteredSocialConcern1: Condition[] = resourcesFrom(
    socialConcernRequest1
  ) as Condition[];

  log.info(
    `getSummarySocialConcerns - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const summarySocialConcern = [...filteredSocialConcern1]
  log.debug({ serviceName: 'getSummarySocialConcern', result: summarySocialConcern });

  return summarySocialConcern;
};
