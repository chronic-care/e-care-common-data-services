import { Router } from 'express';
import ObservationsController from '@controllers/observations.controller';
import authMiddleware from '@middlewares/auth.middleware';
import { Routes } from '@interfaces/routes.interface';

class ObservationsRoute implements Routes {
  public path = '/observations';
  public router = Router();
  public observationsController = new ObservationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.observationsController.observations);
  }
}

export default ObservationsRoute;
