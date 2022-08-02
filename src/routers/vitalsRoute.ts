import express from 'express';
import controller from '../controllers/vitalsController';
const router = express.Router();

router.get('/vitals', controller.getAllVitals);
router.get('/vitals/:id', controller.getVital);


export = router;