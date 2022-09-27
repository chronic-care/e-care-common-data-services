var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const internalGetCodeKey = (uuesystem, code) => {
    return uuesystem + '%7C' + code;
};
const getCodeKey = (system, code) => {
    return internalGetCodeKey(encodeURIComponent(system), code);
};
export const getAllCodes = (valueName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const valueSets = yield import(`../resources/${valueName}.json`);
    const mappedCodes = (_a = Object.values(valueSets)) === null || _a === void 0 ? void 0 : _a.reduce((accumulator, current) => {
        if (current && !Array.isArray(current)) {
            // eslint-disable-next-line functional/immutable-data
            accumulator.push(getCodeKey(current === null || current === void 0 ? void 0 : current.System, current === null || current === void 0 ? void 0 : current.Code));
        }
        return accumulator;
    }, []);
    return mappedCodes;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NvdXJjZS9xdWVyeS9qc29uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVBLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxTQUFpQixFQUFFLElBQVksRUFBVSxFQUFFO0lBQ3JFLE9BQU8sU0FBUyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBRUYsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFjLEVBQUUsSUFBWSxFQUFVLEVBQUU7SUFDMUQsT0FBTyxrQkFBa0IsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxXQUFXLEdBQUcsQ0FBTyxTQUFpQixFQUFxQixFQUFFOztJQUN4RSxNQUFNLFNBQVMsR0FBaUIsTUFBTSxNQUFNLENBQzFDLGdCQUFnQixTQUFTLE9BQU8sQ0FDakMsQ0FBQztJQUVGLE1BQU0sV0FBVyxHQUFhLE1BQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsMENBQUUsTUFBTSxDQUM1RCxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN2QixJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDdEMscURBQXFEO1lBQ3JELFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxNQUFNLEVBQUUsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDOUQ7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7SUFFRixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDLENBQUEsQ0FBQyJ9