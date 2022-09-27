"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObservationsByCategory = exports.getObservationsByValueSet = exports.getObservations = exports.getObservation = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const mode_1 = require("../../constants/mode");
const json_1 = require("../../query/json");
const loglevel_1 = __importDefault(require("../../utils/loglevel"));
const observation_util_1 = require("./observation.util");
const getObservation = async (code) => {
    if (!code) {
        loglevel_1.default.error('getObservation - code not found');
        return (0, observation_util_1.notFoundResponse)();
    }
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info(`getObservation - start with code - ${code}`);
    const queryPath = `Observation?${mode_1.EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`;
    const observationRequest = await client.patient.request(queryPath, observation_util_1.fhirOptions);
    const observationResource = (0, observation_util_1.resourcesFrom)(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        loglevel_1.default.error('getObservation - empty observation');
        return (0, observation_util_1.notFoundResponse)(code);
    }
    loglevel_1.default.info(`getObservation - successful with code ${code} - with status ${filteredObservations[0].status}`);
    loglevel_1.default.debug({ serviceName: 'getObservation', result: filteredObservations[0] });
    return filteredObservations[0];
};
exports.getObservation = getObservation;
const getObservations = async (code, mode, sort, max) => {
    var _a;
    if (!code || !mode) {
        loglevel_1.default.error('getObservations - required parameters not found - (code, mode)');
        return [];
    }
    const client = await fhirclient_1.default.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    loglevel_1.default.info(`getObservations - start with code - ${code} - ${mode} ${sort} ${max}`);
    const queryPath = `Observation?${(_a = mode_1.EccMode[mode]) !== null && _a !== void 0 ? _a : mode_1.EccMode.code}=http://loinc.org|${code}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = await client.patient.request(queryPath, observation_util_1.fhirOptions);
    const observationResource = (0, observation_util_1.resourcesFrom)(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        loglevel_1.default.error('getObservations - empty observations');
        return [];
    }
    loglevel_1.default.info(`getObservations - successful with code ${code} - with length ${filteredObservations.length}`);
    loglevel_1.default.debug({ serviceName: 'getObservations', result: filteredObservations });
    return filteredObservations;
};
exports.getObservations = getObservations;
const getObservationsByValueSet = async (valueSet, sort, max) => {
    if (!valueSet) {
        loglevel_1.default.error('getObservationsByValueSet - valueSet not found');
        return [];
    }
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info('getObservationsByValueSet - getAllCodes');
    const codes = await (0, json_1.getAllCodes)(valueSet);
    const combinedCodes = codes.join(',');
    if (!combinedCodes) {
        loglevel_1.default.error('getObservationsByValueSet - getAllCodes empty');
        return [];
    }
    const sortType = sort === 'descending' ? '-date' : 'date';
    loglevel_1.default.info(`getObservationsByValueSet - start with valueSet - ${valueSet} - ${sort} ${max}`);
    const queryPath = `Observation?${mode_1.EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`;
    const observationRequest = await client.patient.request(queryPath, observation_util_1.fhirOptions);
    const observationResource = (0, observation_util_1.resourcesFrom)(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        loglevel_1.default.error('getObservationsByValueSet - valueSet not found');
        return [];
    }
    loglevel_1.default.info(`getObservationsByValueSet - successful with valueSet ${valueSet} - with length ${filteredObservations.length}`);
    loglevel_1.default.debug({
        serviceName: 'getObservationsByValueSet',
        result: filteredObservations,
    });
    return filteredObservations;
};
exports.getObservationsByValueSet = getObservationsByValueSet;
const getObservationsByCategory = async (category, sort, max) => {
    if (!category) {
        loglevel_1.default.error('getObservationsByCategory - category not found');
        return [];
    }
    const client = await fhirclient_1.default.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    loglevel_1.default.info(`getObservationsByCategory - start with category - ${category} - ${sort} ${max}`);
    const queryPath = `Observation?category=${category}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = await client.patient.request(queryPath, observation_util_1.fhirOptions);
    const observationResource = (0, observation_util_1.resourcesFrom)(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        loglevel_1.default.error('getObservationsByCategory - empty observations');
        return [];
    }
    loglevel_1.default.info(`getObservationsByCategory - successful with category ${category} - with length ${filteredObservations.length}`);
    loglevel_1.default.debug({
        serviceName: 'getObservationsByCategory',
        result: filteredObservations,
    });
    return filteredObservations;
};
exports.getObservationsByCategory = getObservationsByCategory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zb3VyY2UvbGliL29ic2VydmF0aW9uL29ic2VydmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDREQUE4QjtBQUc5QiwrQ0FBK0M7QUFDL0MsMkNBQStDO0FBRS9DLG9FQUF1QztBQUV2Qyx5REFJNEI7QUFFckIsTUFBTSxjQUFjLEdBQUcsS0FBSyxFQUFFLElBQVksRUFBd0IsRUFBRTtJQUN6RSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1Qsa0JBQUcsQ0FBQyxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUM3QyxPQUFPLElBQUEsbUNBQWdCLEdBQTRCLENBQUM7S0FDckQ7SUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpDLGtCQUFHLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sU0FBUyxHQUFHLGVBQWUsY0FBTyxDQUFDLElBQUkscUJBQXFCLElBQUksdUJBQXVCLENBQUM7SUFDOUYsTUFBTSxrQkFBa0IsR0FBeUIsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FDM0UsU0FBUyxFQUNULDhCQUFXLENBQ1osQ0FBQztJQUVGLE1BQU0sbUJBQW1CLEdBQWtCLElBQUEsZ0NBQWEsRUFDdEQsa0JBQWtCLENBQ0YsQ0FBQztJQUVuQixNQUFNLG9CQUFvQixHQUFrQixtQkFBbUIsQ0FBQyxNQUFNLENBQ3BFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxZQUFZLEtBQUssYUFBYSxDQUMzRCxDQUFDO0lBRUYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sRUFBRTtRQUNoQyxrQkFBRyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1FB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