"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vitalsRoute_1 = __importDefault(require("./routers/vitalsRoute"));
const PORT = process.env.PORT || 4000;
// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';
// App Express
const app = (0, express_1.default)();
// JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Endpoint test
app.get('/', (req, res) => {
    res.send('Hello world!');
});
app.use('/api', vitalsRoute_1.default);
app.use((req, res) => {
    res.status(404);
});
// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`);
});
