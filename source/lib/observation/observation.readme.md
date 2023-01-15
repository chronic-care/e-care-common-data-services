# documentation for observation module

## Methods

### getObservation
This will call fhir `Observation?${EccMode.code}=http://loinc.org|${code}&_sort=-date&_count=1`, handle validation and map it to resource object to get the list of specific observation

### getObservations
This will call fhir `Observation?${EccMode[mode] ?? EccMode.code}=http://loinc.org|${code}&_sort=${sortType}&_count=${max ?? 100}`, handle validation and map it to resource object to get the list of observations

### getObservationsByValueSet
- First it will try to query codes from local json based on valueSet provided
- the codes will then used to call `Observation?${EccMode.code}=${combinedCodes}&_sort=${sortType}&_count=${max}`
- validate and map to resource object to get the list of observations


### getObservationsByCategory
This will call fhir `Observation?category=${category}`, handle validation and map it to resource object to get the list of observations
