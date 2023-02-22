import { Goal } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import log from '../../utils/loglevel';

import {
  notFoundResponse,
  resourcesFrom,
  resourcesFromObject,
} from './goal.util';

export const getSummaryGoals = async (): Promise<Goal[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Goal`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredGoals: Goal[] = resourcesFrom(
    goalRequest
  ) as Goal[];

  log.info(
    `getSummaryGoals - successful`
  );

  log.debug({ serviceName: 'getSummaryGoals', result: filteredGoals });

  return filteredGoals;
};

export const getGoals = async (): Promise<Goal[]> => {
  const client = await FHIR.oauth2.ready();

  const queryPath = `Goal`;
  const goalRequest: fhirclient.JsonArray = await client.patient.request(
    queryPath
  );

  // goal from problem list item
  const filteredGoals: Goal[] = resourcesFrom(
    goalRequest
  ) as Goal[];

  log.info(
    `getGoals - successful`
  );

  log.debug({ serviceName: 'getGoals', result: filteredGoals });

  return filteredGoals;
};

export const getGoal = async (id: string): Promise<Goal> => {
  if (!id) {
    log.error('getGoal - id not found');
    return notFoundResponse as unknown as Goal;
  }

  const client = await FHIR.oauth2.ready();

  const queryPath = `Goal?_id=${id}`;
  const goalRequest: fhirclient.JsonObject = await client.patient.request(
    queryPath
  );

  const filteredGoal: Goal = resourcesFromObject(
    goalRequest
  ) as Goal;

  log.info(
    `getGoal - successful with id ${id}`
  );
  log.debug({ serviceName: 'getGoal', result: filteredGoal });
  return filteredGoal;
};
