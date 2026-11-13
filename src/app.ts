import express from "express";
import cors from 'cors'
import router from "./routes";
import errorHandler from "./middlewares/ErrorHandler";


const app = express();

app.use(express.json());
app.use(cors());

app.use(router);
app.get('/', (req, res) => res.status(200).send('Rodando irregularidade aqui!'));

app.use(errorHandler);

export default app;