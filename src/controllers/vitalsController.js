"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
let baseServer = 'http://localhost:8081';
let vitalsURL = '/vitals';
// getting all Vitals
const getAllVitals = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get some Vitals
    let result = yield axios_1.default.get(baseServer + '' + vitalsURL);
    let vitalSigns = result.data;
    return res.status(200).json({
        message: vitalSigns
    });
});
// getting a single Vital
const getVital = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the vital id from the req
    let id = req.params.id;
    // get the post
    let result = yield axios_1.default.get(baseServer + '' + vitalsURL + '/${id}');
    let vital = result.data;
    return res.status(200).json({
        message: vital
    });
});
exports.default = { getAllVitals, getVital };
