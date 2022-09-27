var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FHIR from 'fhirclient';
import log from '../../utils/loglevel';
import { getObservation } from '../observation';
import { getValue } from '../observation/observation.util';
import { activeQuestionnaireStatus, fhirOptions, notFoundResponse, resourcesFrom, } from './questionnaire.util';
const getQuestionnaireCodes = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code) {
        log.error('getQuestionnaireCodes - code not found');
        return '';
    }
    const client = yield FHIR.oauth2.ready();
    log.info(`getQuestionnaireCodes - start with code - ${code}`);
    const queryPath = `Questionnaire?code=${code}&_summary=true`;
    const questionnaireRequest = yield client.request(queryPath, fhirOptions);
    const questionnaireResource = resourcesFrom(questionnaireRequest);
    const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined &&
        v.resourceType === 'Questionnaire' &&
        activeQuestionnaireStatus.includes(v.status));
    const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);
    const combinedQuestionnaireCodes = questionnaireCodes.join(',');
    log.info(`getQuestionnaireCodes - complete with codes - ${combinedQuestionnaireCodes}`);
    return combinedQuestionnaireCodes;
});
export const getQuestionnaireItem = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code) {
        log.error('getQuestionnaireItem - code not found');
        return notFoundResponse();
    }
    const client = yield FHIR.oauth2.ready();
    log.info(`getQuestionnaireItem - start with code - ${code}`);
    const questionnaireCodes = yield getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        log.info(`getQuestionnaireItem - start after get codes - ${questionnaireCodes}`);
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
        const questionnaireRequest = yield client.patient.request(queryPath, fhirOptions);
        const questionnaireResource = resourcesFrom(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (!filteredQuestionnaire.length) {
            log.error('getQuestionnaireItem - empty questionnaire');
            return notFoundResponse(code);
        }
        log.info(`getQuestionnaireItem - successful with code ${code} - with length ${filteredQuestionnaire.length}`);
        log.debug({
            serviceName: 'getQuestionnaireItem',
            result: filteredQuestionnaire[0],
        });
        return filteredQuestionnaire[0];
    }
    else {
        log.info(`getQuestionnaireItem - start with observation code - ${code}`);
        const observation = yield getObservation(code);
        if (observation.status === 'notfound') {
            log.error('getQuestionnaireItem - empty observations');
            return notFoundResponse(code);
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
        log.info(`getQuestionnaireItem - successful with code ${code} - with answer ${mappedObservationToQuestioinnaireResponse[0].answer}`);
        log.debug({
            serviceName: 'getQuestionnaireItem',
            result: mappedObservationToQuestioinnaireResponse,
        });
        return mappedObservationToQuestioinnaireResponse;
    }
});
export const getQuestionnaireItems = (code, count, sort) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code) {
        log.error('getQuestionnaireItems - code not found');
        return [];
    }
    const client = yield FHIR.oauth2.ready();
    log.info(`getQuestionnaireItems - start with code - ${code}`);
    const questionnaireCodes = yield getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        log.info(`getQuestionnaireItems - start after get codes - ${questionnaireCodes}`);
        const sortType = sort === 'ascending' ? 'date' : '-date';
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count !== null && count !== void 0 ? count : '100'}`;
        const questionnaireRequest = yield client.patient.request(queryPath, fhirOptions);
        const questionnaireResource = resourcesFrom(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (!filteredQuestionnaire.length) {
            log.error('getQuestionnaireItems - empty questionnaire');
            return [];
        }
        log.info(`getQuestionnaireItems - successful with code ${code} - with length ${filteredQuestionnaire.length}`);
        log.debug({
            serviceName: 'getQuestionnaireItems',
            result: filteredQuestionnaire,
        });
        return filteredQuestionnaire;
    }
    else {
        log.error('getQuestionnaireItems - empty codes');
        return [];
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9saWIvcXVlc3Rpb25uYWlyZS9xdWVzdGlvbm5haXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sSUFBSSxNQUFNLFlBQVksQ0FBQztBQUc5QixPQUFPLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQztBQUN2QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRTNELE9BQU8sRUFDTCx5QkFBeUIsRUFDekIsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixhQUFhLEdBQ2QsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixNQUFNLHFCQUFxQixHQUFHLENBQU8sSUFBWSxFQUFtQixFQUFFO0lBQ3BFLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDcEQsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUV6QyxHQUFHLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFHLHNCQUFzQixJQUFJLGdCQUFnQixDQUFDO0lBQzdELE1BQU0sb0JBQW9CLEdBQXlCLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FDckUsU0FBUyxFQUNULFdBQVcsQ0FDWixDQUFDO0lBRUYsTUFBTSxxQkFBcUIsR0FBb0IsYUFBYSxDQUMxRCxvQkFBb0IsQ0FDRixDQUFDO0lBRXJCLE1BQU0scUJBQXFCLEdBQW9CLHFCQUFxQixDQUFDLE1BQU0sQ0FDekUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNKLENBQUMsS0FBSyxTQUFTO1FBQ2YsQ0FB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