"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesFrom = exports.notFoundResponse = exports.fhirOptions = exports.activeQuestionnaireStatus = void 0;
exports.activeQuestionnaireStatus = ['active', 'draft', 'retired'];
exports.fhirOptions = {
    pageLimit: 0,
};
const notFoundResponse = (code) => ({
    code,
    status: 'notfound',
    type: 'QuestionnaireResponse',
});
exports.notFoundResponse = notFoundResponse;
const resourcesFrom = (response) => {
    const firstEntries = response[0];
    const entries = (firstEntries === null || firstEntries === void 0 ? void 0 : firstEntries.entry)
        ? firstEntries.entry
        : [];
    return entries
        .map((entry) => entry === null || entry === void 0 ? void 0 : entry.resource)
        .filter((resource) => resource.resourceType !== 'OperationOutcome');
};
exports.resourcesFrom = resourcesFrom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc291cmNlL2xpYi9xdWVzdGlvbm5haXJlL3F1ZXN0aW9ubmFpcmUudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHYSxRQUFBLHlCQUF5QixHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztBQUUzRCxRQUFBLFdBQVcsR0FBMkI7SUFDakQsU0FBUyxFQUFFLENBQUM7Q0FDYixDQUFDO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsRCxJQUFJO0lBQ0osTUFBTSxFQUFFLFVBQVU7SUFDbEIsSUFBSSxFQUFFLHVCQUF1QjtDQUM5QixDQUFDLENBQUM7QUFKVSxRQUFBLGdCQUFnQixvQkFJMUI7QUFFSSxNQUFNLGFBQWEsR0FBRyxDQUFDLFFBQThCLEVBQWMsRUFBRTtJQUMxRSxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUEwQixDQUFDO0lBQzFELE1BQU0sT0FBTyxHQUE0QixDQUFBLFlBQVksYUFBWixZQUFZLHVCQUFaLFlBQVksQ0FBRSxLQUFLO1FBQzFELENBQUMsQ0FBRSxZQUFZLENBQUMsS0FBaUM7UUFDakQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNQLE9BQU8sT0FBTztTQUNYLEdBQUcsQ0FBQyxDQUFDLEtBQTRCLEVBQUUsRUFBRSxDQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFlLENBQUM7U0FDN0QsTUFBTSxDQUNMLENBQUMsUUFBa0IsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFlBQVksS0FBSyxrQkFBa0IsQ0FDckUsQ0FBQztBQUNOLENBQUMsQ0FBQztBQVZXLFFBQUEsYUFBYSxpQkFVeEIifQ==