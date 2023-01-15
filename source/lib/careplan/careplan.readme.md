# documentation for careplan module

## Methods

### getBestCareplan
- First it will try to call `CarePlan?subject=${subject}`,
- if matchSchemeParam provided, it will try to sort based on the param
- then the list of careplans will be mapped to call `getCondition`which will then applied to the response
- validate and map to resource object to get the list of careplans

### getCareplansByStatusAndCategory
This will call fhir `CarePlan?status=${status}&category=${combinedCategory}`, handle validation and map it to resource object to get the list of careplans

### getCondition
This is a supporting method to call `${urlPaths[0]}?_id=${urlPaths[1]}` from getBestCarePlan, which then handle validation and map it to resource object to get the specific condition based on urlpath

### getCareplans
This will call fhir `CarePlan?subject=${subject}`, handle validation and map it to resource object to get the list of careplans

### getCareplan
This will call fhir `CarePlan?_id=${id}`, handle validation and map it to resource object to get the list of specific careplan
