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

  const valueSetsListParsed = valueSetsList ? await Promise.all(valueSetsList.default.map(async (v) => {
    try {
      const valueSets = await import(`../resources/${v.Oid}.json`)
      return ({ fileName: v.Oid, valueSets: valueSets.default })
    } catch (err) {
      console.log({ errorValue: err })
      return { fileName: v.Oid, valueSets: [] }
    }
  })) : [];

  const foundValueSets = valueSetsListParsed.filter(v => v.valueSets.some(v => v['System'] === system && v['Code'] === code));

  const valueSetCodes = foundValueSets && foundValueSets[0] ? getAllCodes(foundValueSets[0].fileName) : []

  const joinedSetCodes = (await valueSetCodes).join(',');

  return joinedSetCodes;
}

export const getFilenameFromValueSetCode = async (system: string, code: string) => {
  const valueSetsList = await import(
    `../resources/valueset_loadlist.json`
  );

  const valueSetsListParsed = valueSetsList ? await Promise.all(valueSetsList.default.map(async (v) => {
    try {
      const valueSets = await import(`../resources/${v.Oid}.json`)
      return ({ fileName: v.Oid, valueSets: valueSets.default })
    } catch (err) {
      return { fileName: v.Oid, valueSets: [] }
    }
  })) : [];

  const foundValueSets = valueSetsListParsed.filter(v => v.valueSets.some(v => v['System'] === system && v['Code'] === code));

  return foundValueSets && foundValueSets[0] ? foundValueSets[0].fileName : '';
}
