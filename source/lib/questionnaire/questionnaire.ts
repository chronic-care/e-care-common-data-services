import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { MccQuestionnaire, MccQuestionnaireResponse } from '../../types/mcc-types';
import log from '../../utils/loglevel';
import { getObservation } from '../observation';
import { getValue } from '../observation/observation.util';

import {
  activeQuestionnaireStatus,
  fhirOptions,
  notFoundResponse,
  resourcesFrom,
} from './questionnaire.util';

const getQuestionnaireCodes = async (code: string): Promise<string> => {
  if (!code) {
    log.error('getQuestionnaireCodes - code not found');
    return '';
  }

  const client = await FHIR.oauth2.ready();

  log.info(`getQuestionnaireCodes - start with code - ${code}`);
  const queryPath = `Questionnaire?code=${code}&_summary=true`;
  const questionnaireRequest: fhirclient.JsonArray = await client.request(
    queryPath,
    fhirOptions
  );

  const questionnaireResource: MccQuestionnaire[] = resourcesFrom(
    questionnaireRequest
  ) as MccQuestionnaire[];

  const filteredQuestionnaire: MccQuestionnaire[] = questionnaireResource.filter(
    (v) =>
      v !== undefined &&
      v.resourceType === 'Questionnaire' &&
      activeQuestionnaireStatus.includes(v.status)
  );

  const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);
  const combinedQuestionnaireCodes = questionnaireCodes.join(',');

  log.info(
    `getQuestionnaireCodes - complete with codes - ${combinedQuestionnaireCodes}`
  );

  return combinedQuestionnaireCodes;
};

export const getQuestionnaireItem = async (
  code: string
): Promise<MccQuestionnaireResponse> => {
  if (!code) {
    log.error('getQuestionnaireItem - code not found');
    return notFoundResponse() as unknown as MccQuestionnaireResponse;
  }
  const client = await FHIR.oauth2.ready();

  log.info(`getQuestionnaireItem - start with code - ${code}`);
  const questionnaireCodes = await getQuestionnaireCodes(code);

  if (questionnaireCodes) {
    log.info(
      `getQuestionnaireItem - start after get codes - ${questionnaireCodes}`
    );
    const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
    const questionnaireRequest: fhirclient.JsonArray =
      await client.patient.request(queryPath, fhirOptions);

    const questionnaireResource: MccQuestionnaireResponse[] = resourcesFrom(
      questionnaireRequest
    ) as MccQuestionnaireResponse[];

    const filteredQuestionnaire: MccQuestionnaireResponse[] =
      questionnaireResource.filter(
        (v) => v !== undefined && v.resourceType === 'QuestionnaireResponse'
      );

    if (!filteredQuestionnaire.length) {
      log.error('getQuestionnaireItem - empty questionnaire');
      return notFoundResponse(code) as unknown as MccQuestionnaireResponse;
    }

    log.info(
      `getQuestionnaireItem - successful with code ${code} - with length ${filteredQuestionnaire.length}`
    );
    log.debug({
      serviceName: 'getQuestionnaireItem',
      result: filteredQuestionnaire[0],
    });
    return filteredQuestionnaire[0];
  } else {
    log.info(`getQuestionnaireItem - start with observation code - ${code}`);
    const observation: any = await getObservation(code);

    if (observation.status === 'notfound') {
      log.error('getQuestionnaireItem - empty observations');
      return notFoundResponse(code) as unknown as MccQuestionnaireResponse;
    }

    const mappedObservationToQuestioinnaireResponse = {
      item: [
        {
          answer: [getValue(observation)],
          linkId: observation.code.coding[0].code,
        },
      ],
      resourceType: observation.resourceType,
      authored: observation.issued,
    };

    log.info(
      `getQuestionnaireItem - successful with code ${code} - with answer ${mappedObservationToQuestioinnaireResponse[0].answer}`
    );
    log.debug({
      serviceName: 'getQuestionnaireItem',
      result: mappedObservationToQuestioinnaireResponse,
    });
    return mappedObservationToQuestioinnaireResponse as unknown as MccQuestionnaireResponse;
  }
};

export const getQuestionnaireItems = async (
  code: string,
  count?: string,
  sort?: string
): Promise<MccQuestionnaireResponse[]> => {
  if (!code) {
    log.error('getQuestionnaireItems - code not found');
    return [];
  }
  const client = await FHIR.oauth2.ready();

  log.info(`getQuestionnaireItems - start with code - ${code}`);
  const questionnaireCodes = await getQuestionnaireCodes(code);

  if (questionnaireCodes) {
    log.info(
      `getQuestionnaireItems - start after get codes - ${questionnaireCodes}`
    );
    const sortType = sort === 'ascending' ? 'date' : '-date';

    const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count ?? '100'
      }`;
    const questionnaireRequest: fhirclient.JsonArray =
      await client.patient.request(queryPath, fhirOptions);

    const questionnaireResource: MccQuestionnaireResponse[] = resourcesFrom(
      questionnaireRequest
    ) as MccQuestionnaireResponse[];

    const filteredQuestionnaire: MccQuestionnaireResponse[] =
      questionnaireResource.filter(
        (v) => v !== undefined && v.resourceType === 'QuestionnaireResponse'
      );

    if (!filteredQuestionnaire.length) {
      log.error('getQuestionnaireItems - empty questionnaire');
      return [];
    }

    log.info(
      `getQuestionnaireItems - successful with code ${code} - with length ${filteredQuestionnaire.length}`
    );
    log.debug({
      serviceName: 'getQuestionnaireItems',
      result: filteredQuestionnaire,
    });
    return filteredQuestionnaire;
  } else {
    log.error('getQuestionnaireItems - empty codes');
    return [];
  }
};
