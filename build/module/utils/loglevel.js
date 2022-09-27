const logger = {
    info: (message) => {
        if (typeof message === 'object') {
            console.info(message);
        }
        else {
            console.info(`EccDS: ${message}`);
        }
    },
    debug: (message) => {
        if (typeof message === 'object') {
            console.log(message);
        }
        else {
            console.log(`EccDS: ${message}`);
        }
    },
    error: (message) => {
        if (typeof message === 'object') {
            console.warn(message);
        }
        else {
            console.warn(`EccDS: ${message}`);
        }
    },
};
export default logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nbGV2ZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdXRpbHMvbG9nbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxNQUFNLEdBQUc7SUFDYixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNoQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFDRCxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNqQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFDRCxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNqQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7Q0FDRixDQUFDO0FBRUYsZUFBZSxNQUFNLENBQUMifQ==