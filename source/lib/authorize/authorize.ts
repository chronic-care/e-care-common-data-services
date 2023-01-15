import FHIR from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

import log from '../../utils/loglevel';

export const authorize = async (props: fhirclient.AuthorizeParams) => {
  log.info('Authenticating client');

  await FHIR.oauth2.authorize(props);

  log.info('Authenticating client success');
};

export const checkAuthorize = async () => {
  const client = await FHIR.oauth2.ready();

  log.info('Client authorized');

  return client;
};
