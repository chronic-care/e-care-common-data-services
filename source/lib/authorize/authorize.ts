import FHIR from 'fhirclient';

import log from '../../utils/loglevel';

export const authorize = async (
  redirectUri?: string,
  clientId?: string,
  scope?: string
) => {
  log.info('Authenticating client');

  await FHIR.oauth2.authorize({
    // Meld Synthea test data sandbox
    redirectUri: redirectUri ?? '',
    clientId: clientId ?? '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
    scope: scope ?? 'patient/*.read openid launch',
  });
};

export const checkAuthorize = async () => {
  const client = await FHIR.oauth2.ready();

  log.info('Client authorized');

  return client;
};
