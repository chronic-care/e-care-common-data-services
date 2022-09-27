# e-care-common-data-services

Common data service for mcc-provider and mcc-care-planner

## Npm installation

```sh
npm i e-care-common-data-services
```

## How to work with this locally
Install dependencies
```sh
npm ci
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
