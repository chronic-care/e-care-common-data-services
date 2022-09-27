"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCodes = void 0;
const internalGetCodeKey = (uuesystem, code) => {
    return uuesystem + '%7C' + code;
};
const getCodeKey = (system, code) => {
    return internalGetCodeKey(encodeURIComponent(system), code);
};
exports.getAllCodes = async (valueName) => {
    var _a;
    const valueSets = await Promise.resolve().then(() => __importStar(require(`../resources/${valueName}.json`)));
    const mappedCodes = (_a = Object.values(valueSets)) === null || _a === void 0 ? void 0 : _a.reduce((accumulator, current) => {
        if (current && !Array.isArray(current)) {
            // eslint-disable-next-line functional/immutable-data
            accumulator.push(getCodeKey(current === null || current === void 0 ? void 0 : current.System, current === null || current === void 0 ? void 0 : current.Code));
        }
        return accumulator;
    }, []);
    return mappedCodes;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9xdWVyeS9qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLGtCQUFrQixHQUFHLENBQUMsU0FBaUIsRUFBRSxJQUFZLEVBQVUsRUFBRTtJQUNyRSxPQUFPLFNBQVMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQUVGLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBYyxFQUFFLElBQVksRUFBVSxFQUFFO0lBQzFELE9BQU8sa0JBQWtCLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDO0FBRVcsUUFBQSxXQUFXLEdBQUcsS0FBSyxFQUFFLFNBQWlCLEVBQXFCLEVBQUU7O0lBQ3hFLE1BQU0sU0FBUyxHQUFpQix3REFDOUIsZ0JBQWdCLFNBQVMsT0FBTyxHQUNqQyxDQUFDO0lBRUYsTUFBTSxXQUFXLFNBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsMENBQUUsTUFBTSxDQUNsRCxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN2QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdEMscURBQXFEO1lBQ3JELFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7SUFFRixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDLENBQUMifQ==