# e-care-common-data-services

Common data service for mcc-provider and mcc-care-planner

## How to work with this locally
Install dependencies
```sh
npm i
```

Build typescript
```sh
npm run build
```

Run this on this project directory to register this package on global directory
```sh
npm link
```

Run this on mcc-provider or mcc-care-planner app directory
```sh
npm link e-care-common-data-services
```

## How to work with this in the future
- Remove `build` from .gitignore file
- Host this repository in a git provider e.g github
- Release a tag, e.g `v1.0.0`
- in mcc-provider or mcc-care-planner app, run
```
npm i ssh://git@github.com:XXGITHUB_ORG_NAMEXX/e-care-common-data-services.git#v1.0.0
```

## Code structure explanation

### Root

#### tsconfig.json
This is the typescript rules and compile options -> required to run the app

#### .prettierrc
This is used to do auto code fix on save during deployment, lets say you forget semicolon, or you forget indentation, prettier will help you add those when you save the file it will run automatically

#### .eslintrc
This is used to enforce strict js/ts convention when writing code to avoid any unforeseen bugs -> required to run the app

#### .editorconfig
This is used to standardised IDE (VSCode/IntelliJ) theme and configuration when we load this project to any IDE

### source

#### constants
This is where we put our global constant variables that is reused in modules

#### lib
This is where we store our modules, inside will be having each module, e.g `observation` and it will have
- observation.ts
  This is where we put our logic
- observation.util.ts
  This is where we put helper function specific to observation
- observation.spec.ts
  This is where we put testing specific to observation

#### mapping
This is the where we put resource mapping from fhir localised to our module, e.g on `vital-mapping` when we get `ckd`, we will try to query data for
- Cognitive Status (MoCA)
- Fatigue (PROMIS T-score)
- Functional Status (PROMIS raw score)
- Pain Interference (PROMIS T-score)
- Pain Severity (Wong-Baker FACES)
- PHQ9

#### query
This is where we handle logic on how we query from local json files from /resources folder

### resources
This is where we store all of the manual resource data intended for mapping

#### types
This is where we store typing for common interface

#### utils
This is where we create a global method that is reused in all modules

#### index.ts
This is the central entrypoint when building the app
