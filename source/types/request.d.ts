import Client from 'fhirclient/lib/Client';

export {};

declare global {
  namespace Express {
    export interface Request {
      client?: Client;
    }
  }
}
