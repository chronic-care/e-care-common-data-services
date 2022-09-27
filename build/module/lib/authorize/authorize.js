var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FHIR from 'fhirclient';
import log from '../../utils/loglevel';
export const authorize = (redirectUri, clientId, scope) => __awaiter(void 0, void 0, void 0, function* () {
    log.info('Authenticating client');
    yield FHIR.oauth2.authorize({
        // Meld Synthea test data sandbox
        redirectUri: redirectUri !== null && redirectUri !== void 0 ? redirectUri : '',
        clientId: clientId !== null && clientId !== void 0 ? clientId : '9ff4f5c4-f07c-464f-8d4b-90b90a76bebf',
        scope: scope !== null && scope !== void 0 ? scope : 'patient/*.read openid launch',
    });
});
export const checkAuthorize = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield FHIR.oauth2.ready();
    log.info('Client authorized');
    return client;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aG9yaXplLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc291cmNlL2xpYi9hdXRob3JpemUvYXV0aG9yaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sSUFBSSxNQUFNLFlBQVksQ0FBQztBQUU5QixPQUFPLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQztBQUV2QyxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQUcsQ0FDdkIsV0FBb0IsRUFDcEIsUUFBaUIsRUFDakIsS0FBYyxFQUNkLEVBQUU7SUFDRixHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFFbEMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUMxQixpQ0FBaUM7UUFDakMsV0FBVyxFQUFFLFdBQVcsYUFBWCxXQUFXLGNBQVgsV0FBVyxHQUFJLEVBQUU7UUFDOUIsUUFBUSxFQUFFLFFBQVEsYUFBUixRQUFRLGNBQVIsUUFBUSxHQUFJLHNDQUFzQztRQUM1RCxLQUFLLEVBQUUsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksOEJBQThCO0tBQy9DLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQSxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLEdBQVMsRUFBRTtJQUN2QyxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFekMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBRTlCLE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMsQ0FBQSxDQUFDIn0=