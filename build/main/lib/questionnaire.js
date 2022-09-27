"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionnaireItems = exports.getQuestionnaireItem = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const observation_1 = require("./observation");
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
const getQuestionnaireCodes = async (code) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const queryPath = `Questionnaire?code=${code}&_summary=true`;
    const questionnaireRequest = await client.request(queryPath, fhirOptions);
    const questionnaireResource = resourcesFrom(questionnaireRequest);
    const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined &&
        v.resourceType === 'Questionnaire' &&
        activeQuestionnaireStatus.includes(v.status));
    const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);
    return questionnaireCodes.join(',');
};
const getQuestionnaireItem = async (code) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const questionnaireCodes = await getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
        const questionnaireRequest = await client.patient.request(queryPath, fhirOptions);
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
        const observation = await (0, observation_1.getObservation)(code);
        const mappedObservation = {
            item: [
                {
                    answer: [(0, observation_1.getValue)(observation)],
                    linkId: observation.code.coding[0].code,
                },
            ],
            resourceType: observation.resourceType,
            authored: observation.issued,
        };
        return mappedObservation;
    }
};
exports.getQuestionnaireItem = getQuestionnaireItem;
const getQuestionnaireItems = async (code, count, sort) => {
    const client = await fhirclient_1.default.oauth2.ready();
    const questionnaireCodes = await getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        const sortType = sort === 'ascending' ? 'date' : '-date';
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count !== null && count !== void 0 ? count : '100'}`;
        const questionnaireRequest = await client.patient.request(queryPath, fhirOptions);
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
};
exports.getQuestionnaireItems = getQuestionnaireItems;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9saWIvcXVlc3Rpb25uYWlyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0REFBOEI7QUFHOUIsK0NBQXlEO0FBRXpELE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sV0FBVyxHQUEyQjtJQUMxQyxTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLElBQUk7SUFDSixNQUFNLEVBQUUsVUFBVTtJQUNsQixJQUFJLEVBQUUsdUJBQXVCO0NBQzlCLENBQUMsQ0FBQztBQUVILE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBOEIsRUFBYyxFQUFFO0lBQ25FLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQTBCLENBQUM7SUFDMUQsTUFBTSxPQUFPLEdBQTRCLENBQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLEtBQUs7UUFDMUQsQ0FBQyxDQUFFLFlBQVksQ0FBQyxLQUFpQztRQUNqRCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsT0FBTyxPQUFPO1NBQ1gsR0FBRyxDQUFDLENBQUMsS0FBNEIsRUFBRSxFQUFFLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQWUsQ0FBQztTQUM3RCxNQUFNLENBQ0wsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLGtCQUFrQixDQUNyRSxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFtQixFQUFFO0lBQ3BFLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxF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