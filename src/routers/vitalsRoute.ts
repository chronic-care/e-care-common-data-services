import express from 'express';
import controller from '../controllers/vitalsController';
const router = express.Router();

router.get('/vitals', controller.getVitalSigns);


export = router;