import { NextFunction, Response } from 'express';
import fhirClient from 'fhirclient';
import { HttpException } from '@exceptions/HttpException';

const authMiddleware = async (req, res: Response, next: NextFunction) => {
  try {
    const mccFhirServer = req.header('mcc-fhir-server');

    if (mccFhirServer) {
      const mccToken = req.header('mcc-token');

      if (mccToken) {
        const client = fhirClient(req, res).client({
          serverUrl: mccFhirServer,
          tokenResponse: { access_token: mccToken },
        });
        req.client = client;
        next();
      } else {
        next(new HttpException(401, 'mcc-token is not provided'));
      }
    } else {
      next(new HttpException(401, 'mcc-fhir-server is not provided'));
    }
  } catch (error) {
    next(new HttpException(401, 'Something wrong with auth'));
  }

  //   const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
  //   if (Authorization) {
  //     const secretKey: string = SECRET_KEY;
  //     const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
  //     const userId = verificationResponse.id;
  //     const findUser = userModel.find(user => user.id === userId);
  //     if (findUser) {
  //       req.user = findUser;
  //       next();
  //     } else {
  //       next(new HttpException(401, 'Wrong authentication token'));
  //     }
  //   } else {
  //     next(new HttpException(404, 'Authentication token missing'));
  //   }
  // } catch (error) {
  //   next(new HttpException(401, 'Wrong authentication token'));
  // }
};

export default authMiddleware;
