import { NextFunction, Request, Response } from 'express';
import ObservationsService from '@services/observations.service';

class ObservationsController {
  public observationsService = new ObservationsService();

  public observations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subjectId = String(req.query.subjectId);
      const code = String(req.query.code);
      const mode = String(req.query.mode);
      const allObservations = await this.observationsService.getObservations(req.client, subjectId, code, mode);

      res.status(200).json({ data: allObservations, message: 'observations' });
    } catch (error) {
      next(error);
    }
  };
}

export default ObservationsController;
