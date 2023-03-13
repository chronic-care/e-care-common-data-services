import { Condition } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccCondition } from '../../types/mcc-types';
import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
} from './condition.util';

export const getSummaryConditions = async (): Promise<MccCondition[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath1 = `Condition?category=http%3A%2F%2Fterminology.hl7.org%2FCodeSystem%2Fcondition-category%7Cproblem-list-item`;
  const queryPath2 = `Condition?category=http%3A%2F%2Fhl7.org%2Ffhir%2Fus%2Fcore%2FCodeSystem%2Fcondition-category%7Chealth-concern`;
  const conditionRequest1: fhirclient.JsonArray = await client.patient.request(
    queryPath1
  );

  const conditionRequest2: fhirclient.JsonArray = await client.patient.request(
    queryPath2
  );

  // condition from problem list item
  const filteredConditions1: MccCondition[] = resourcesFrom(
    conditionRequest1
  ) as MccCondition[];

  // condition from health concern
  const filteredConditions2: MccCondition[] = resourcesFrom(
    conditionRequest2
  ) as MccCondition[];

  log.info(
    `getSummaryConditions - successful`
  );
  // merged both conditions array, TODO: to add categorisation based on valueset
  const filteredConditions = [...filteredConditions1, ...filteredConditions2]
  log.debug({ serviceName: 'getSummaryConditions', result: filteredConditions });

  return filteredConditions;
};

export const getConditions = async (): Promise<MccCondition[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Condition`;
  const conditionRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  const filteredConditions: MccCondition[] = resourcesFrom(
    conditionRequest
  ) as MccCondition[];

  log.info(
    `getConditions - successful`
  );
  log.debug({ serviceName: 'getConditions', result: filteredConditions });
  return filteredConditions;
};

export const getCondition = async (id: string): Promise<MccCondition> => {
  if (!id) {
    log.error('getCondition - id not found');
    return notFoundResponse as unknown as MccCondition;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Condition?_id=${id}`;
  const conditionRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredCondition: MccCondition = resourcesFromObject(
    conditionRequest
  ) as MccCondition;

  log.info(
    `getCondition - successful with id ${id}`
  );
  log.debug({ serviceName: 'getCondition', result: filteredCondition });
  return filteredCondition;
};
