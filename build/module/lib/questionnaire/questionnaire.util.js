export const activeQuestionnaireStatus = ['active', 'draft', 'retired'];
export const fhirOptions = {
    pageLimit: 0,
};
export const notFoundResponse = (code) => ({
    code,
    status: 'notfound',
    type: 'QuestionnaireResponse',
});
export const resourcesFrom = (response) => {
    const firstEntries = response[0];
    const entries = (firstEntries === null || firstEntries === void 0 ? void 0 : firstEntries.entry)
        ? firstEntries.entry
        : [];
    return entries
        .map((entry) => entry === null || entry === void 0 ? void 0 : entry.resource)
        .filter((resource) => resource.resourceType !== 'OperationOutcome');
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25uYWlyZS51dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc291cmNlL2xpYi9xdWVzdGlvbm5haXJlL3F1ZXN0aW9ubmFpcmUudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLENBQUMsTUFBTSx5QkFBeUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFeEUsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUEyQjtJQUNqRCxTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNsRCxJQUFJO0lBQ0osTUFBTSxFQUFFLFVBQVU7SUFDbEIsSUFBSSxFQUFFLHVCQUF1QjtDQUM5QixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxRQUE4QixFQUFjLEVBQUU7SUFDMUUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBMEIsQ0FBQztJQUMxRCxNQUFNLE9BQU8sR0FBNEIsQ0FBQSxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsS0FBSztRQUMxRCxDQUFDLENBQUUsWUFBWSxDQUFDLEtBQWlDO1FBQ2pELENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDUCxPQUFPLE9BQU87U0FDWCxHQUFHLENBQUMsQ0FBQyxLQUE0QixFQUFFLEVBQUUsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBZSxDQUFDO1NBQzdELE1BQU0sQ0FDTCxDQUFDLFFBQWtCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEtBQUssa0JBQWtCLENBQ3JFLENBQUM7QUFDTixDQUFDLENBQUMifQ==