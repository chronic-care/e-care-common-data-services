"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const vitalsController_1 = __importDefault(require("../controllers/vitalsController"));
const router = express_1.default.Router();
router.get('/vitals', vitalsController_1.default.getAllVitals);
router.get('/vitals/:id', vitalsController_1.default.getVital);
module.exports = router;
