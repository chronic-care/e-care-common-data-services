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
import { EccMode } from '../../constants/mode';
import { getAllCodes } from '../../query/json';
import log from '../../utils/loglevel';
import { fhirOptions, notFoundResponse, resourcesFrom, } from './observation.util';
export const getObservation = (code) => __awaiter(void 0, void 0, void 0, function* () {
    if (!code) {
        log.error('getObservation - code not found');
        return notFoundResponse();
    }
    const client = yield FHIR.oauth2.ready();
    log.info(`getObservation - start with code - ${code}`);
    const queryPath = `Observation?${EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        log.error('getObservation - empty observation');
        return notFoundResponse(code);
    }
    log.info(`getObservation - successful with code ${code} - with status ${filteredObservations[0].status}`);
    log.debug({ serviceName: 'getObservation', result: filteredObservations[0] });
    return filteredObservations[0];
});
export const getObservations = (code, mode, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!code || !mode) {
        log.error('getObservations - required parameters not found - (code, mode)');
        return [];
    }
    const client = yield FHIR.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    log.info(`getObservations - start with code - ${code} - ${mode} ${sort} ${max}`);
    const queryPath = `Observation?${(_a = EccMode[mode]) !== null && _a !== void 0 ? _a : EccMode.code}=http://loinc.org|${code}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        log.error('getObservations - empty observations');
        return [];
    }
    log.info(`getObservations - successful with code ${code} - with length ${filteredObservations.length}`);
    log.debug({ serviceName: 'getObservations', result: filteredObservations });
    return filteredObservations;
});
export const getObservationsByValueSet = (valueSet, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    if (!valueSet) {
        log.error('getObservationsByValueSet - valueSet not found');
        return [];
    }
    const client = yield FHIR.oauth2.ready();
    log.info('getObservationsByValueSet - getAllCodes');
    const codes = yield getAllCodes(valueSet);
    const combinedCodes = codes.join(',');
    if (!combinedCodes) {
        log.error('getObservationsByValueSet - getAllCodes empty');
        return [];
    }
    const sortType = sort === 'descending' ? '-date' : 'date';
    log.info(`getObservationsByValueSet - start with valueSet - ${valueSet} - ${sort} ${max}`);
    const queryPath = `Observation?${EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        log.error('getObservationsByValueSet - valueSet not found');
        return [];
    }
    log.info(`getObservationsByValueSet - successful with valueSet ${valueSet} - with length ${filteredObservations.length}`);
    log.debug({
        serviceName: 'getObservationsByValueSet',
        result: filteredObservations,
    });
    return filteredObservations;
});
export const getObservationsByCategory = (category, sort, max) => __awaiter(void 0, void 0, void 0, function* () {
    if (!category) {
        log.error('getObservationsByCategory - category not found');
        return [];
    }
    const client = yield FHIR.oauth2.ready();
    const sortType = sort === 'descending' ? '-date' : 'date';
    log.info(`getObservationsByCategory - start with category - ${category} - ${sort} ${max}`);
    const queryPath = `Observation?category=${category}&_sort=${sortType}&_count=${max !== null && max !== void 0 ? max : 100}`;
    const observationRequest = yield client.patient.request(queryPath, fhirOptions);
    const observationResource = resourcesFrom(observationRequest);
    const filteredObservations = observationResource.filter((v) => v !== undefined && v.resourceType === 'Observation');
    if (!filteredObservations.length) {
        log.error('getObservationsByCategory - empty observations');
        return [];
    }
    log.info(`getObservationsByCategory - successful with category ${category} - with length ${filteredObservations.length}`);
    log.debug({
        serviceName: 'getObservationsByCategory',
        result: filteredObservations,
    });
    return filteredObservations;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zb3VyY2UvbGliL29ic2VydmF0aW9uL29ic2VydmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLE9BQU8sSUFBSSxNQUFNLFlBQVksQ0FBQztBQUc5QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRS9DLE9BQU8sR0FBRyxNQUFNLHNCQUFzQixDQUFDO0FBRXZDLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLGFBQWEsR0FDZCxNQUFNLG9CQUFvQixDQUFDO0FBRTVCLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFPLElBQVksRUFBd0IsRUFBRTtJQUN6RSxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sZ0JBQWdCLEVBQTRCLENBQUM7S0FDckQ7SUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFekMsR0FBRyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN2RCxNQUFNLFNBQVMsR0FBRyxlQUFlLE9BQU8sQ0FBQyxJQUFJLHFCQUFxQixJQUFJLHVCQUF1QixDQUFDO0lBQzlGLE1BQU0sa0JBQWtCLEdBQXlCLE1BQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQzNFLFNBQVMsRUFDVCxXQUFXLENBQ1osQ0FBQztJQUVGLE1BQU0sbUJBQW1CLEdBQWtCLGFBQWEsQ0FDdEQsa0JBQWtCLENBQ0YsQ0FBQztJQUVuQixNQUFNLG9CQUFvQixHQUFrQixtQkFBbUIsQ0FBQyxNQUFNLENBQ3BFLENBQUMsQ0FBQyxFQUFFLEVBQUUs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