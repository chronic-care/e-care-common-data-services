export const fhirOptions = {
    pageLimit: 0,
};
export const notFoundResponse = (code) => ({
    code,
    status: 'notfound',
    value: {
        stringValue: 'No Data Available',
        valueType: 'string',
    },
});
export const resourcesFrom = (response) => {
    const firstEntries = response[0];
    const entries = (firstEntries === null || firstEntries === void 0 ? void 0 : firstEntries.entry)
        ? firstEntries.entry
        : [];
    return entries
        .map((entry) => entry === null || entry === void 0 ? void 0 : entry.resource)
        .filter((resource) => resource.resourceType !== 'OperationOutcome');
};
export const getValue = (obs) => {
    if (obs.valueQuantity) {
        return {
            valueQuantity: obs.valueQuantity,
        };
    }
    else if (obs.valueBoolean) {
        return {
            valueBoolean: obs.valueBoolean,
        };
    }
    else if (obs.valueInteger) {
        return {
            valueInteger: obs.valueInteger,
        };
    }
    else if (obs.valueString) {
        return {
            valueString: obs.valueString,
        };
    }
    else if (obs.valueRange) {
        return {
            valueRange: obs.valueRange,
        };
    }
    else if (obs.valueCodeableConcept) {
        return {
            valueCodeableConcept: obs.valueCodeableConcept,
        };
    }
    else {
        return {
            value: 'Unknown type',
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JzZXJ2YXRpb24udXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9saWIvb2JzZXJ2YXRpb24vb2JzZXJ2YXRpb24udXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLENBQUMsTUFBTSxXQUFXLEdBQTJCO0lBQ2pELFNBQVMsRUFBRSxDQUFDO0NBQ2IsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsSUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELElBQUk7SUFDSixNQUFNLEVBQUUsVUFBVTtJQUNsQixLQUFLLEVBQUU7UUFDTCxXQUFXLEVBQUUsbUJBQW1CO1FBQ2hDLFNBQVMsRUFBRSxRQUFRO0tBQ3BCO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBOEIsRUFBYyxFQUFFO0lBQzFFLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQTBCLENBQUM7SUFDMUQsTUFBTSxPQUFPLEdBQTRCLENBQUEsWUFBWSxhQUFaLFlBQVksdUJBQVosWUFBWSxDQUFFLEtBQUs7UUFDMUQsQ0FBQyxDQUFFLFlBQVksQ0FBQyxLQUFpQztRQUNqRCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ1AsT0FBTyxPQUFPO1NBQ1gsR0FBRyxDQUFDLENBQUMsS0FBNEIsRUFBRSxFQUFFLENBQUMsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQWUsQ0FBQztTQUM3RCxNQUFNLENBQ0wsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLGtCQUFrQixDQUNyRSxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBZ0IsRUFBTyxFQUFFO0lBQ2hELElBQUksR0FBRyxDQUFDLGFBQWEsRUFBRTtRQUNyQixPQUFPO1lBQ0wsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhO1NBQ2pDLENBQUM7S0FDSDtTQUFNLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRTtRQUMzQixPQUFPO1lBQ0wsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1NBQy9CLENBQUM7S0FDSDtTQUFNLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRTtRQUMzQixPQUFPO1lBQ0wsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZO1NBQy9CLENBQUM7S0FDSDtTQUFNLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRTtRQUMxQixPQUFPO1lBQ0wsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXO1NBQzdCLENBQUM7S0FDSDtTQUFNLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRTtRQUN6QixPQUFPO1lBQ0wsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVO1NBQzNCLENBQUM7S0FDSDtTQUFNLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1FBQ25DLE9BQU87WUFDTCxvQkFBb0IsRUFBRSxHQUFHLENBQUMsb0JBQW9CO1NBQy9DLENBQUM7S0FDSDtTQUFNO1FBQ0wsT0FBTztZQUNMLEtBQUssRUFBRSxjQUFjO1NBQ3RCLENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQyJ9