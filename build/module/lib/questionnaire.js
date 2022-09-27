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
import { getObservation, getValue } from './observation';
const activeQuestionnaireStatus = ['active', 'draft', 'retired'];
const fhirOptions = {
    pageLimit: 0,
};
const notFoundResponse = (code) => ({
    code,
    status: 'notfound',
    type: 'QuestionnaireResponse',
});
const resourcesFrom = (response) => {
    const firstEntries = response[0];
    const entries = (firstEntries === null || firstEntries === void 0 ? void 0 : firstEntries.entry)
        ? firstEntries.entry
        : [];
    return entries
        .map((entry) => entry === null || entry === void 0 ? void 0 : entry.resource)
        .filter((resource) => resource.resourceType !== 'OperationOutcome');
};
const getQuestionnaireCodes = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const queryPath = `Questionnaire?code=${code}&_summary=true`;
    const questionnaireRequest = yield client.request(queryPath, fhirOptions);
    const questionnaireResource = resourcesFrom(questionnaireRequest);
    const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined &&
        v.resourceType === 'Questionnaire' &&
        activeQuestionnaireStatus.includes(v.status));
    const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);
    return questionnaireCodes.join(',');
});
export const getQuestionnaireItem = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const questionnaireCodes = yield getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
        const questionnaireRequest = yield client.patient.request(queryPath, fhirOptions);
        const questionnaireResource = resourcesFrom(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (filteredQuestionnaire.length) {
            return filteredQuestionnaire[0];
        }
        else {
            return notFoundResponse(code);
        }
    }
    else {
        const observation = yield getObservation(code);
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
        return mappedObservation;
    }
});
export const getQuestionnaireItems = (code, count, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    const questionnaireCodes = yield getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        const sortType = sort === 'ascending' ? 'date' : '-date';
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count !== null && count !== void 0 ? count : '100'}`;
        const questionnaireRequest = yield client.patient.request(queryPath, fhirOptions);
        const questionnaireResource = resourcesFrom(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (filteredQuestionnaire.length) {
            return filteredQuestionnaire;
        }
        else {
            return [];
        }
    }
    else {
        return [];
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9saWIvcXVlc3Rpb25uYWlyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxPQUFPLElBQUksTUFBTSxZQUFZLENBQUM7QUFHOUIsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekQsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFakUsTUFBTSxXQUFXLEdBQTJCO0lBQzFDLFNBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsSUFBSTtJQUNKLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLElBQUksRUFBRSx1QkFBdUI7Q0FDOUIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUE4QixFQUFjLEVBQUU7SUFDbkUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBMEIsQ0FBQztJQUMxRCxNQUFNLE9BQU8sR0FBNEIsQ0FBQSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsS0FBSztRQUMxRCxDQUFDLENBQUUsWUFBWSxDQUFDLEtBQWlDO1FBQ2pELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDUCxPQUFPLE9BQU87U0FDWCxHQUFHLENBQUMsQ0FBQyxLQUE0QixFQUFFLEVBQUUsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBZSxDQUFDO1NBQzdELE1BQU0sQ0FDTCxDQUFDLFFBQWtCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssa0JBQWtCLENBQ3JFLENBQUM7QUFDTixDQUFDLENBQUM7QUFFRixNQUFNLHFCQUFxQixHQUFHLENBQU8sSUFBWSxFQUFtQixFQUFF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