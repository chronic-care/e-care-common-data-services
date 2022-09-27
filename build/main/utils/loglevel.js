"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nbGV2ZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zb3VyY2UvdXRpbHMvbG9nbGV2ZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLE1BQU0sR0FBRztJQUNiLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2hCLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUNELEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2pCLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUNELEtBQUssRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQ2pCLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztDQUNGLENBQUM7QUFFRixrQkFBZSxNQUFNLENBQUMifQ==