import { Questionnaire, QuestionnaireResponse, Resource } from 'fhir/r4';
import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import { getObservation, getValue } from './observation';

const activeQuestionnaireStatus = ['active', 'draft', 'retired'];

const fhirOptions: fhirclient.FhirOptions = {
  pageLimit: 0,
};

const notFoundResponse = (code) => ({
  code,
  status: 'notfound',
  type: 'QuestionnaireResponse',
});

const resourcesFrom = (response: fhirclient.JsonArray): Resource[] => {
  const firstEntries = response[0] as fhirclient.JsonObject;
  const entries: fhirclient.JsonObject[] = firstEntries?.entry
    ? (firstEntries.entry as [fhirclient.JsonObject])
    : [];
  return entries
    .map((entry: fhirclient.JsonObject) => entry?.resource as any)
    .filter(
      (resource: Resource) => resource.resourceType !== 'OperationOutcome'
    );
};

const getQuestionnaireCodes = async (code: string): Promise<string> => {
  const client = await FHIR.oauth2.ready();
  const queryPath = `Questionnaire?code=${code}&_summary=true`;
  const questionnaireRequest: fhirclient.JsonArray = await client.request(
    queryPath,
    fhirOptions
  );

  const questionnaireResource: Questionnaire[] = resourcesFrom(
    questionnaireRequest
  ) as Questionnaire[];

  const filteredQuestionnaire: Questionnaire[] = questionnaireResource.filter(
    (v) =>
      v !== undefined &&
      v.resourceType === 'Questionnaire' &&
      activeQuestionnaireStatus.includes(v.status)
  );

  const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);

  return questionnaireCodes.join(',');
};

export const getQuestionnaireItem = async (
  code: string
): Promise<QuestionnaireResponse> => {
  const client = await FHIR.oauth2.ready();
  const questionnaireCodes = await getQuestionnaireCodes(code);
  if (questionnaireCodes) {
    const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
    const questionnaireRequest: fhirclient.JsonArray =
      await client.patient.request(queryPath, fhirOptions);

    const questionnaireResource: QuestionnaireResponse[] = resourcesFrom(
      questionnaireRequest
    ) as QuestionnaireResponse[];

    const filteredQuestionnaire: QuestionnaireResponse[] =
      questionnaireResource.filter(
        (v) => v !== undefined && v.resourceType === 'QuestionnaireResponse'
      );

    if (filteredQuestionnaire.length) {
      return filteredQuestionnaire[0];
    } else {
      return notFoundResponse(code) as unknown as QuestionnaireResponse;
    }
  } else {
    const observation = await getObservation(code);

    const mappedObservation = {
      item: [
        {
          answer: [getValue(observation)],
          linkId: observation.code.coding[0].code,
        },
      ],
      resourceType: observation.resourceType,
      authored: observation.issued,
    };

    return mappedObservation as unknown as QuestionnaireResponse;
  }
};

export const getQuestionnaireItems = async (
  code: string,
  count?: string,
  sort?: string
): Promise<QuestionnaireResponse[]> => {
  const client = await FHIR.oauth2.ready();
  const questionnaireCodes = await getQuestionnaireCodes(code);
  if (questionnaireCodes) {
    const sortType = sort === 'ascending' ? 'date' : '-date';

    const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${
      count ?? '100'
    }`;
    const questionnaireRequest: fhirclient.JsonArray =
      await client.patient.request(queryPath, fhirOptions);

    const questionnaireResource: QuestionnaireResponse[] = resourcesFrom(
      questionnaireRequest
    ) as QuestionnaireResponse[];

    const filteredQuestionnaire: QuestionnaireResponse[] =
      questionnaireResource.filter(
        (v) => v !== undefined && v.resourceType === 'QuestionnaireResponse'
      );

    if (filteredQuestionnaire.length) {
      return filteredQuestionnaire;
    } else {
      return [];
    }
  } else {
    return [];
  }
};
