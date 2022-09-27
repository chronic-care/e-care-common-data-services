"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuestionnaireItems = exports.getQuestionnaireItem = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const loglevel_1 = __importDefault(require("../../utils/loglevel"));
const observation_1 = require("../observation");
const observation_util_1 = require("../observation/observation.util");
const questionnaire_util_1 = require("./questionnaire.util");
const getQuestionnaireCodes = async (code) => {
    if (!code) {
        loglevel_1.default.error('getQuestionnaireCodes - code not found');
        return '';
    }
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info(`getQuestionnaireCodes - start with code - ${code}`);
    const queryPath = `Questionnaire?code=${code}&_summary=true`;
    const questionnaireRequest = await client.request(queryPath, questionnaire_util_1.fhirOptions);
    const questionnaireResource = (0, questionnaire_util_1.resourcesFrom)(questionnaireRequest);
    const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined &&
        v.resourceType === 'Questionnaire' &&
        questionnaire_util_1.activeQuestionnaireStatus.includes(v.status));
    const questionnaireCodes = filteredQuestionnaire.map((val) => val.id);
    const combinedQuestionnaireCodes = questionnaireCodes.join(',');
    loglevel_1.default.info(`getQuestionnaireCodes - complete with codes - ${combinedQuestionnaireCodes}`);
    return combinedQuestionnaireCodes;
};
const getQuestionnaireItem = async (code) => {
    if (!code) {
        loglevel_1.default.error('getQuestionnaireItem - code not found');
        return (0, questionnaire_util_1.notFoundResponse)();
    }
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info(`getQuestionnaireItem - start with code - ${code}`);
    const questionnaireCodes = await getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        loglevel_1.default.info(`getQuestionnaireItem - start after get codes - ${questionnaireCodes}`);
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`;
        const questionnaireRequest = await client.patient.request(queryPath, questionnaire_util_1.fhirOptions);
        const questionnaireResource = (0, questionnaire_util_1.resourcesFrom)(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (!filteredQuestionnaire.length) {
            loglevel_1.default.error('getQuestionnaireItem - empty questionnaire');
            return (0, questionnaire_util_1.notFoundResponse)(code);
        }
        loglevel_1.default.info(`getQuestionnaireItem - successful with code ${code} - with length ${filteredQuestionnaire.length}`);
        loglevel_1.default.debug({
            serviceName: 'getQuestionnaireItem',
            result: filteredQuestionnaire[0],
        });
        return filteredQuestionnaire[0];
    }
    else {
        loglevel_1.default.info(`getQuestionnaireItem - start with observation code - ${code}`);
        const observation = await (0, observation_1.getObservation)(code);
        if (observation.status === 'notfound') {
            loglevel_1.default.error('getQuestionnaireItem - empty observations');
            return (0, questionnaire_util_1.notFoundResponse)(code);
        }
        const mappedObservationToQuestioinnaireResponse = {
            item: [
                {
                    answer: [(0, observation_util_1.getValue)(observation)],
                    linkId: observation.code.coding[0].code,
                },
            ],
            resourceType: observation.resourceType,
            authored: observation.issued,
        };
        loglevel_1.default.info(`getQuestionnaireItem - successful with code ${code} - with answer ${mappedObservationToQuestioinnaireResponse[0].answer}`);
        loglevel_1.default.debug({
            serviceName: 'getQuestionnaireItem',
            result: mappedObservationToQuestioinnaireResponse,
        });
        return mappedObservationToQuestioinnaireResponse;
    }
};
exports.getQuestionnaireItem = getQuestionnaireItem;
const getQuestionnaireItems = async (code, count, sort) => {
    if (!code) {
        loglevel_1.default.error('getQuestionnaireItems - code not found');
        return [];
    }
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info(`getQuestionnaireItems - start with code - ${code}`);
    const questionnaireCodes = await getQuestionnaireCodes(code);
    if (questionnaireCodes) {
        loglevel_1.default.info(`getQuestionnaireItems - start after get codes - ${questionnaireCodes}`);
        const sortType = sort === 'ascending' ? 'date' : '-date';
        const queryPath = `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count !== null && count !== void 0 ? count : '100'}`;
        const questionnaireRequest = await client.patient.request(queryPath, questionnaire_util_1.fhirOptions);
        const questionnaireResource = (0, questionnaire_util_1.resourcesFrom)(questionnaireRequest);
        const filteredQuestionnaire = questionnaireResource.filter((v) => v !== undefined && v.resourceType === 'QuestionnaireResponse');
        if (!filteredQuestionnaire.length) {
            loglevel_1.default.error('getQuestionnaireItems - empty questionnaire');
            return [];
        }
        loglevel_1.default.info(`getQuestionnaireItems - successful with code ${code} - with length ${filteredQuestionnaire.length}`);
        loglevel_1.default.debug({
            serviceName: 'getQuestionnaireItems',
            result: filteredQuestionnaire,
        });
        return filteredQuestionnaire;
    }
    else {
        loglevel_1.default.error('getQuestionnaireItems - empty codes');
        return [];
    }
};
exports.getQuestionnaireItems = getQuestionnaireItems;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9saWIvcXVlc3Rpb25uYWlyZS9xdWVzdGlvbm5haXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDREQUE4QjtBQUc5QixvRUFBdUM7QUFDdkMsZ0RBQWdEO0FBQ2hELHNFQUEyRDtBQUUzRCw2REFLOEI7QUFFOUIsTUFBTSxxQkFBcUIsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFtQixFQUFFO0lBQ3BFLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDVCxrQkFBRyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1FBQ3BELE9BQU8sRUFBRSxDQUFDO0tBQ1g7SUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpDLGtCQUFHLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFHLHNCQUFzQixJQUFJLGdCQUFnQixDQUFDO0lBQzdELE1BQU0sb0JBQW9CLEdBQXlCLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FDckUsU0FBUyxFQUNULGdDQUFXLENBQ1osQ0FBQztJQUVGLE1BQU0scUJBQXFCLEdBQW9CLElBQUEsa0NBQWEsRUFDMUQsb0JBQW9CLENBQ0YsQ0FBQztJQUVyQixNQUFNLHFCQUFxQixHQUFvQixxQkFBcUIsQ0FBQyxNQUFNLENBQ3pFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDSixDQUFDLEtBQUssU0FBUztRQUNmLENBQUMsQ0FBQyxZQUFZLEtBQUssZUFBZTtRQUNsQyw4Q0FBeUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUMvQyxDQUFDO0lBRUYsTUFBTSxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdB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