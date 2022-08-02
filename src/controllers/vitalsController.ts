import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import vitalSign from "../models/vitalSigns";

let baseServer: String = 'http://localhost:8081';
let vitalsURL: String = '/vitals';

// getting all Vitals
const getAllVitals = async (req: Request, res: Response, next: NextFunction) => {

    // get some Vitals
    let result: AxiosResponse = await axios.get(baseServer+''+vitalsURL);
    let vitalSigns: [vitalSign] = result.data;
    return res.status(200).json({
        message: vitalSigns
    });
};

// getting a single Vital
const getVital = async (req: Request, res: Response, next: NextFunction) => {
    // get the vital id from the req
    let id: string = req.params.id;
    // get the post
    let result: AxiosResponse = await axios.get(baseServer+''+vitalsURL+'/${id}');
    let vital: vitalSign = result.data;
    return res.status(200).json({
        message: vital
    });
};

export default { getAllVitals, getVital };
