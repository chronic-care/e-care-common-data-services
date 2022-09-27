"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorize = exports.authorize = void 0;
const fhirclient_1 = __importDefault(require("fhirclient"));
const loglevel_1 = __importDefault(require("../../utils/loglevel"));
const authorize = async (redirectUri, clientId, scope) => {
    loglevel_1.default.info('Authenticating client');
    await fhirclient_1.default.oauth2.authorize({
        // Meld Synthea test data sandbox
        redirectUri: redirectUri !== null && redirectUri !== void 0 ? redirectUri : '',
        clientId: clientId !== null && clientId !== void 0 ? clientId : '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
        scope: scope !== null && scope !== void 0 ? scope : 'patient/*.read openid launch',
    });
};
exports.authorize = authorize;
const checkAuthorize = async () => {
    const client = await fhirclient_1.default.oauth2.ready();
    loglevel_1.default.info('Client authorized');
    return client;
};
exports.checkAuthorize = checkAuthorize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc291cmNlL2xpYi9hdXRob3JpemUvYXV0aG9yaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDREQUE4QjtBQUU5QixvRUFBdUM7QUFFaEMsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUM1QixXQUFvQixFQUNwQixRQUFpQixFQUNqQixLQUFjLEVBQ2QsRUFBRTtJQUNGLGtCQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFbEMsTUFBTSxvQkFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDMUIsaUNBQWlDO1FBQ2pDLFdBQVcsRUFBRSxXQUFXLGFBQVgsV0FBVyxjQUFYLFdBQVcsR0FBSSxFQUFFO1FBQzlCLFFBQVEsRUFBRSxRQUFRLGFBQVIsUUFBUSxjQUFSLFFBQVEsR0FBSSxzQ0FBc0M7UUFDNUQsS0FBSyxFQUFFLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLDhCQUE4QjtLQUMvQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFiVyxRQUFBLFNBQVMsYUFhcEI7QUFFSyxNQUFNLGNBQWMsR0FBRyxLQUFLLElBQUksRUFBRTtJQUN2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpDLGtCQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFFOUIsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBTlcsUUFBQSxjQUFjLGtCQU16QiJ9