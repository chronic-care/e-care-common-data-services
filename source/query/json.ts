import { ValueAsset } from '../types';

// This is the code on how we query json files to map the codes

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

  const mappedCodes: string[] = Object.values(valueSets)?.reduce(
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

// check for getAllValueSet name from code
export const getCodesFromValueSetCode = async (system: string, code: string) => {
  const valueSetsList = await import(
    `../resources/valueset_loadlist.json`
  );


  const valueSetsListParsed = await Promise.all(valueSetsList.map(async (v) => ({ fileName: v.Oid, valueSets: await import(`${v.Oid}.json`) })));

  const foundValueSets = valueSetsListParsed.filter(v => v.valueSets.some(v => v['System'] === system && v['Code'] === code));

  const valueSetCodes = getAllCodes(foundValueSets[0].fileName)

  const joinedSetCodes = (await valueSetCodes).join(',');

  return joinedSetCodes;
}
