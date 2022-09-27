import { ValueAsset } from '../types';

const internalGetCodeKey = (uuesystem: string, code: string): string => {
  return uuesystem + '%7C' + code;
};

const getCodeKey = (system: string, code: string): string => {
  return internalGetCodeKey(encodeURIComponent(system), code);
};

export const getAllCodes = async (valueName: string): Promise<string[]> => {
  const valueSets: ValueAsset[] = await import(
    `../resources/${valueName}.json`
  );

  const mappedCodes = Object.values(valueSets)?.reduce(
    (accumulator, current) => {
      if (current && !Array.isArray(current)) {
        // eslint-disable-next-line functional/immutable-data
        accumulator.push(getCodeKey(current?.System, current?.Code));
      }

      return accumulator;
    },
    []
  );

  return mappedCodes;
};
