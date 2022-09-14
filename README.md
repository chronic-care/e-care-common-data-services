# E Care Common Data Services

Common data service between mcc-user and mcc-provider app

## Pre-requisites
prepare `.env.development.local` , `.env.production.local` to configure the app, default development env are as follows:
```
# PORT
PORT = 3000

# TOKEN
SECRET_KEY = secretKey

# LOG
LOG_FORMAT = dev
LOG_DIR = ../logs

# CORS
ORIGIN = *
CREDENTIALS = true
```

## Installing the app
Run

```sh
npm ci
```

## Running the app
Run

```sh
npm run dev
```

## Build and run the app for production build
Run
```sh
npm start
```

## API docs
after app is running, API endpoints are documented in `http://localhost:3000/api-docs`, you may also try out the API in the swagger docs
