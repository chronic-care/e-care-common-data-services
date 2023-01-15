# documentation for questionnaire module

## Methods

### getQuestionnaireCodes
- This will call fhir `Questionnaire?code=${code}&_summary=true`
- then the codes will be mapped to the `id` and combined to string separated by `,`
- return the combined codes

### getQuestionnaireItem
- will call `getQuestionnaireCodes` to get the combined codes
- from the codes then call fhir `QuestionnaireResponse?questionnaire=${questionnaireCodes}&status=completed,amended,in-progress&_sort=-authored&_count=1`
- validate and map to resource object to get the specific questionnaire

### getQuestionnaireItems
- will call `getQuestionnaireCodes` to get the combined codes
- from the codes then call fhir `QuestionnaireResponse?questionnaire=${questionnaireCodes}&_sort=${sortType}&_count=${count ?? '100'}`
- validate and map to resource object to get the list of questionnaires
